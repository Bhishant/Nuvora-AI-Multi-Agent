const express = require('express');
const cors = require('cors');
const path = require('path');
const Orchestrator = require('./orchestrator');
const { checkAPIStatus } = require('./llmAdapter');

const app = express();
const port = process.env.PORT || 3333;

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Serve static files only in non-Vercel environment
if (!process.env.VERCEL) {
    app.use(express.static('public'));
}

const orchestrator = new Orchestrator();

// Helper function to get client IP
const getClientIp = (req) => {
    return req.ip || req.connection.remoteAddress;
};

// Middleware for logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${getClientIp(req)}`);
    next();
});

// ==================== API ENDPOINTS ====================

// API Debug Info
app.get('/api/debug', (req, res) => {
    const apiStatus = checkAPIStatus();
    const sessions = orchestrator.getSessions();
    
    res.json({
        status: 'Server is running',
        timestamp: new Date(),
        port: port,
        environment: process.env.VERCEL ? 'Vercel' : 'Local',
        sessions: sessions.length,
        activeSession: sessions.find(s => s.active)?.name || 'None',
        agents: ['planner', 'researcher', 'writer'],
        groq: apiStatus,
        endpoints: [
            'GET  /api/debug',
            'GET  /api/sessions',
            'POST /api/sessions',
            'GET  /api/sessions/:id/tasks',
            'POST /api/task',
            'GET  /api/task/:id',
            'GET  /api/export/session/:id',
            'GET  /api/export/pdf/:taskId',
            'GET  /api/health'
        ]
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working correctly!',
        timestamp: new Date(),
        environment: process.env.VERCEL ? 'Vercel Production' : 'Local Development'
    });
});

// Session Management
app.get('/api/sessions', (req, res) => {
    try {
        const sessions = orchestrator.getSessions();
        res.json({
            success: true,
            sessions: sessions,
            count: sessions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/sessions', (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Session name is required'
            });
        }
        
        const sessionId = orchestrator.createSession(name.trim());
        
        res.json({
            success: true,
            sessionId: sessionId,
            message: 'Session created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.put('/api/sessions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, action } = req.body;
        
        if (action === 'switch') {
            const success = orchestrator.switchSession(id);
            if (success) {
                res.json({
                    success: true,
                    message: 'Session switched successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }
        } else if (name) {
            const success = orchestrator.renameSession(id, name);
            if (success) {
                res.json({
                    success: true,
                    message: 'Session renamed successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }
        } else {
            res.status(400).json({
                success: false,
                error: 'Invalid request'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.delete('/api/sessions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const success = orchestrator.deleteSession(id);
        
        if (success) {
            res.json({
                success: true,
                message: 'Session deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Session not found or cannot delete'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Task Management
app.post('/api/task', async (req, res) => {
    try {
        console.log('📨 Received task request:', req.body);
        
        const { task, taskType, sessionId } = req.body;
        
        if (!task || task.trim() === '') {
            return res.status(400).json({ 
                success: false,
                error: 'Task description is required' 
            });
        }

        console.log(`🚀 Processing: "${task}" (Type: ${taskType || 'auto'})`);
        const result = await orchestrator.executeTask(task.trim(), taskType, sessionId);
        
        console.log(`✅ Task completed: ${result.formatted?.length || 0} chars`);
        
        res.json({
            success: true,
            taskId: result.taskId,
            sessionId: result.sessionId,
            timestamp: new Date(),
            result: result
        });
        
    } catch (error) {
        console.error('❌ API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error',
            timestamp: new Date()
        });
    }
});

app.get('/api/sessions/:id/tasks', (req, res) => {
    try {
        const { id } = req.params;
        const tasks = orchestrator.getSessionTasks(id);
        
        res.json({
            success: true,
            sessionId: id,
            tasks: tasks,
            count: tasks.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/task/:id', (req, res) => {
    try {
        const { id } = req.params;
        const taskId = parseInt(id);
        const task = orchestrator.getTaskById(taskId);
        
        if (task) {
            res.json({
                success: true,
                task: task
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.delete('/api/sessions/:id/tasks', (req, res) => {
    try {
        const { id } = req.params;
        const success = orchestrator.clearSessionTasks(id);
        
        if (success) {
            res.json({
                success: true,
                message: 'All tasks cleared from session'
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Export Endpoints
app.get('/api/export/session/:id', (req, res) => {
    try {
        const { id } = req.params;
        const sessionData = orchestrator.exportSession(id);
        
        if (sessionData) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="session_${id}.json"`);
            
            res.json({
                success: true,
                ...sessionData,
                exportedAt: new Date()
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/export/pdf/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = orchestrator.getTaskById(parseInt(taskId));
        
        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>NuVora AI - ${task.task.substring(0, 50)}...</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 10px;
                    margin-bottom: 30px;
                }
                .header h1 {
                    margin: 0 0 10px 0;
                    font-size: 24px;
                }
                .header .meta {
                    font-size: 14px;
                    opacity: 0.9;
                }
                .content {
                    padding: 20px;
                }
                h1 { color: #2c3e50; border-bottom: 2px solid #4a6cf7; padding-bottom: 10px; }
                h2 { color: #2c3e50; border-left: 4px solid #4a6cf7; padding-left: 15px; }
                h3 { color: #2c3e50; }
                pre {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                    border-left: 3px solid #4a6cf7;
                }
                code {
                    background: #f4f4f4;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>NuVora AI Analysis Report</h1>
                <div class="meta">
                    <strong>Task:</strong> ${task.task}<br>
                    <strong>Type:</strong> ${task.type || 'Auto-detected'}<br>
                    <strong>Date:</strong> ${new Date(task.timestamp).toLocaleString()}<br>
                    <strong>Status:</strong> ${task.status}
                </div>
            </div>
            <div class="content">
                ${task.result?.html || task.result?.formatted || '<p>No content available</p>'}
            </div>
            <div class="footer">
                Generated by NuVora AI • ${new Date().toLocaleString()} • www.nuvora.ai
            </div>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(html);
        
    } catch (error) {
        console.error('PDF export error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    const apiStatus = checkAPIStatus();
    res.json({ 
        status: 'OK',
        timestamp: new Date(),
        sessions: orchestrator.getSessions().length,
        groq: {
            status: apiStatus.apiKey === 'Set' ? 'Connected' : 'Not Connected',
            model: apiStatus.model
        }
    });
});

// ==================== FRONTEND ROUTING ====================

// Serve index.html for all non-API routes
app.get('*', (req, res) => {
    // Don't handle API routes here
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            error: 'API endpoint not found',
            path: req.path
        });
    }
    
    // In Vercel, serve from public directory
    if (process.env.VERCEL) {
        return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
    
    // Local development
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        path: req.originalUrl
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// ==================== START SERVER ====================

// Check if running in Vercel
if (process.env.VERCEL) {
    // Export for Vercel serverless function
    module.exports = app;
} else {
    // Local development
    app.listen(port, () => {
        console.log(`\n🚀 NuVora AI Multi-Agent Server`);
        console.log(`📍 Running on port ${port}`);
        console.log(`📊 Dashboard: http://localhost:${port}`);
        console.log(`📁 Session Management Enabled`);
        console.log(`🤖 PDF Export Ready`);
        console.log(`\n📋 Available endpoints:`);
        console.log(`   http://localhost:${port}/api/debug`);
        console.log(`   http://localhost:${port}/api/health`);
        console.log(`   http://localhost:${port}/api/test`);
    });
}
