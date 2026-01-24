const Planner = require('./planner');
const Researcher = require('./researcher');
const Writer = require('./writer');
const TaskClassifier = require('./task-classifier');

class Orchestrator {
    constructor() {
        this.planner = new Planner();
        this.researcher = new Researcher();
        this.writer = new Writer();
        this.taskClassifier = new TaskClassifier();
        
        // Store sessions: { sessionId: { tasks: [], created: Date, name: string } }
        this.sessions = new Map();
        
        // Default session
        this.createSession('Default Session');
    }

    createSession(sessionName = 'New Session') {
        const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        this.sessions.set(sessionId, {
            id: sessionId,
            name: sessionName,
            tasks: [],
            created: new Date(),
            active: true
        });
        
        console.log(`📁 Created new session: ${sessionName} (${sessionId})`);
        return sessionId;
    }

    switchSession(sessionId) {
        if (this.sessions.has(sessionId)) {
            // Deactivate all sessions
            this.sessions.forEach(session => session.active = false);
            
            // Activate selected session
            this.sessions.get(sessionId).active = true;
            console.log(`🔄 Switched to session: ${this.sessions.get(sessionId).name}`);
            return true;
        }
        return false;
    }

    deleteSession(sessionId) {
        if (this.sessions.size <= 1) {
            throw new Error('Cannot delete the last session');
        }
        
        if (this.sessions.has(sessionId)) {
            const sessionName = this.sessions.get(sessionId).name;
            this.sessions.delete(sessionId);
            console.log(`🗑️ Deleted session: ${sessionName}`);
            
            // Activate another session
            const firstSession = Array.from(this.sessions.values())[0];
            this.switchSession(firstSession.id);
            return true;
        }
        return false;
    }

    renameSession(sessionId, newName) {
        if (this.sessions.has(sessionId)) {
            this.sessions.get(sessionId).name = newName;
            console.log(`✏️ Renamed session to: ${newName}`);
            return true;
        }
        return false;
    }

    getActiveSession() {
        for (const [sessionId, session] of this.sessions) {
            if (session.active) {
                return session;
            }
        }
        // Return first session if none active
        return Array.from(this.sessions.values())[0];
    }

    async executeTask(taskDescription, taskType = null, sessionId = null) {
        console.log('\n' + '='.repeat(60));
        console.log('🎯 STARTING TASK:', taskDescription);
        console.log('='.repeat(60));
        
        const activeSession = sessionId ? this.sessions.get(sessionId) : this.getActiveSession();
        
        if (!activeSession) {
            throw new Error('No active session found');
        }

        let taskRecord = {
            id: Date.now(),
            task: taskDescription,
            type: taskType,
            timestamp: new Date(),
            status: 'processing',
            sessionId: activeSession.id
        };

        activeSession.tasks.push(taskRecord);

        try {
            // Classify task
            let classifiedType = taskType || this.taskClassifier.classifyTask(taskDescription);
            console.log(`📝 Task type: ${classifiedType}`);
            
            // Plan
            let plan = this.planner.createPlan(taskDescription, classifiedType);
            console.log('📋 Plan created');
            
            // Research
            console.log('🔍 Starting AI research...');
            let researchResult = await this.researcher.conductResearch(taskDescription, classifiedType, plan);
            console.log(`✅ Research complete: ${researchResult.aiContent?.length || 0} chars`);
            
            // Write
            console.log('✍️ Generating final output...');
            let finalOutput = await this.writer.generateOutput(researchResult, classifiedType, plan);
            console.log(`✅ Output generated: ${finalOutput.formatted?.length || 0} chars`);
            
            // Update record
            taskRecord.status = 'completed';
            taskRecord.result = finalOutput;
            taskRecord.completedAt = new Date();
            
            // Update session last activity
            activeSession.lastActivity = new Date();
            
            console.log('='.repeat(60));
            console.log('✅ TASK COMPLETED SUCCESSFULLY');
            console.log('='.repeat(60) + '\n');
            
            return {
                ...finalOutput,
                sessionId: activeSession.id,
                taskId: taskRecord.id
            };
            
        } catch (error) {
            console.error('❌ Task failed:', error);
            taskRecord.status = 'failed';
            taskRecord.error = error.message;
            
            // Update session last activity even on error
            activeSession.lastActivity = new Date();
            
            const errorOutput = {
                raw: { error: error.message },
                formatted: `# 🚨 Task Failed\n\n**Error:** ${error.message}\n\nPlease check the server logs.`,
                html: `<div style="color: #dc3545; padding: 20px; border-left: 4px solid #dc3545; background: #f8f9fa;">
                        <h2>🚨 Task Failed</h2>
                        <p><strong>Error:</strong> ${error.message}</p>
                        <p>Please check the server logs.</p>
                      </div>`,
                markdown: `# 🚨 Task Failed\n\n**Error:** ${error.message}\n\nPlease check the server logs.`,
                timestamp: new Date(),
                sessionId: activeSession.id,
                taskId: taskRecord.id
            };
            
            return errorOutput;
        }
    }

    getSessions() {
        return Array.from(this.sessions.values()).map(session => ({
            id: session.id,
            name: session.name,
            created: session.created,
            lastActivity: session.lastActivity || session.created,
            taskCount: session.tasks.length,
            active: session.active || false
        }));
    }

    getSessionTasks(sessionId) {
        if (this.sessions.has(sessionId)) {
            return this.sessions.get(sessionId).tasks.map(task => ({
                id: task.id,
                task: task.task,
                type: task.type,
                timestamp: task.timestamp,
                status: task.status,
                sessionId: task.sessionId
            }));
        }
        return [];
    }

    getTaskById(taskId) {
        for (const [sessionId, session] of this.sessions) {
            const task = session.tasks.find(t => t.id === taskId);
            if (task) {
                return { ...task, sessionName: session.name };
            }
        }
        return null;
    }

    clearSessionTasks(sessionId) {
        if (this.sessions.has(sessionId)) {
            this.sessions.get(sessionId).tasks = [];
            console.log(`🧹 Cleared all tasks from session: ${this.sessions.get(sessionId).name}`);
            return true;
        }
        return false;
    }

    exportSession(sessionId) {
        if (this.sessions.has(sessionId)) {
            const session = this.sessions.get(sessionId);
            return {
                session: {
                    id: session.id,
                    name: session.name,
                    created: session.created,
                    lastActivity: session.lastActivity
                },
                tasks: session.tasks.map(task => ({
                    id: task.id,
                    task: task.task,
                    type: task.type,
                    timestamp: task.timestamp,
                    status: task.status,
                    result: task.result
                }))
            };
        }
        return null;
    }
}

module.exports = Orchestrator;
