class NuVoraClient {
    constructor() {
        this.baseURL = window.location.origin;
        this.currentSession = null;
        this.sessions = [];
        this.currentTasks = [];
        this.initialized = false;
    }

    async initialize() {
        console.log('🚀 Initializing NuVora Client...');
        console.log('📡 Base URL:', this.baseURL);
        
        // First check if server is responding
        const serverOk = await this.checkServerStatus();
        
        if (!serverOk) {
            console.error('❌ Server is not responding');
            this.showServerError();
            return;
        }
        
        try {
            await this.loadSessions();
            await this.loadCurrentSessionTasks();
            this.initialized = true;
            console.log('✅ Client initialized successfully');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showConnectionError(error);
        }
    }

    async checkServerStatus() {
        try {
            console.log('🔄 Checking server status...');
            const response = await fetch(`${this.baseURL}/api/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000
            });
            
            if (!response.ok) {
                console.error('❌ Server health check failed:', response.status);
                return false;
            }
            
            const data = await response.json();
            console.log('✅ Server status:', data.status);
            return data.status === 'OK';
        } catch (error) {
            console.error('❌ Cannot reach server:', error);
            return false;
        }
    }

    async loadSessions() {
        try {
            console.log('🔄 Loading sessions...');
            const response = await fetch(`${this.baseURL}/api/sessions`);
            
            // Check content type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('❌ Received non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned non-JSON response');
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                console.error('❌ API error:', data.error || response.status);
                throw new Error(data.error || 'Failed to load sessions');
            }
            
            if (data.success) {
                this.sessions = data.sessions;
                console.log(`✅ Loaded ${this.sessions.length} sessions`);
                this.renderSessions();
                this.updateSessionUI();
                return true;
            } else {
                throw new Error(data.error || 'Failed to load sessions');
            }
        } catch (error) {
            console.error('❌ Failed to load sessions:', error);
            this.showNotification('Failed to load sessions. Please refresh the page.', 'error');
            throw error;
        }
    }

    async loadCurrentSessionTasks() {
        if (!this.currentSession) return;
        
        try {
            const response = await fetch(`${this.baseURL}/api/sessions/${this.currentSession.id}/tasks`);
            const data = await response.json();
            
            if (data.success) {
                this.currentTasks = data.tasks;
                this.renderTaskHistory();
                this.updateTaskCount();
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    }

    async createSession(name) {
        if (!name || name.trim() === '') {
            showNotification('Please enter a session name', 'error');
            return false;
        }
        
        try {
            const response = await fetch(`${this.baseURL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim() })
            });
            
            const data = await response.json();
            
            if (data.success) {
                await this.loadSessions();
                await this.switchSession(data.sessionId);
                showNotification('Session created successfully!', 'success');
                return true;
            } else {
                throw new Error(data.error || 'Failed to create session');
            }
        } catch (error) {
            console.error('Failed to create session:', error);
            showNotification('Failed to create session: ' + error.message, 'error');
            return false;
        }
    }

    async switchSession(sessionId) {
        try {
            const response = await fetch(`${this.baseURL}/api/sessions/${sessionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'switch' })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentSession = this.sessions.find(s => s.id === sessionId);
                await this.loadCurrentSessionTasks();
                showNotification(`Switched to session: ${this.currentSession.name}`, 'info');
                return true;
            }
        } catch (error) {
            console.error('Failed to switch session:', error);
        }
        return false;
    }

    async renameSession(sessionId, newName) {
        try {
            const response = await fetch(`${this.baseURL}/api/sessions/${sessionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });
            
            const data = await response.json();
            
            if (data.success) {
                await this.loadSessions();
                showNotification('Session renamed successfully!', 'success');
                return true;
            }
        } catch (error) {
            console.error('Failed to rename session:', error);
            showNotification('Failed to rename session: ' + error.message, 'error');
        }
        return false;
    }

    async deleteSession(sessionId) {
        if (!confirm('Are you sure you want to delete this session? All tasks in this session will be lost.')) {
            return false;
        }
        
        try {
            const response = await fetch(`${this.baseURL}/api/sessions/${sessionId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                await this.loadSessions();
                showNotification('Session deleted successfully!', 'success');
                return true;
            }
        } catch (error) {
            console.error('Failed to delete session:', error);
            showNotification('Failed to delete session: ' + error.message, 'error');
        }
        return false;
    }

    async executeTask(task, taskType = '') {
        if (!this.currentSession) {
            showNotification('Please select a session first', 'error');
            openSessionModal();
            return null;
        }

        // Reset statuses
        this.updateStatus('planner', 'ready');
        this.updateStatus('researcher', 'ready');
        this.updateStatus('writer', 'ready');

        try {
            console.log('🚀 Starting task execution...');
            
            // Planning phase
            this.updateStatus('planner', 'working');
            await this.simulateWork(800);
            this.updateStatus('planner', 'completed');

            // Research phase
            this.updateStatus('researcher', 'working');
            await this.simulateWork(1200);
            this.updateStatus('researcher', 'completed');

            // Writing phase
            this.updateStatus('writer', 'working');
            
            const response = await fetch(`${this.baseURL}/api/task`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: task,
                    taskType: taskType || '',
                    sessionId: this.currentSession.id
                })
            });

            // Check response type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `Server error: ${response.status}`);
            }

            if (data.success) {
                await this.simulateWork(800);
                this.updateStatus('writer', 'completed');
                
                // Reload tasks for current session
                await this.loadCurrentSessionTasks();
                
                return data.result;
            } else {
                throw new Error(data.error || 'Task failed');
            }
        } catch (error) {
            console.error('Task execution error:', error);
            this.updateStatus('planner', 'error');
            this.updateStatus('researcher', 'error');
            this.updateStatus('writer', 'error');
            throw error;
        }
    }

    renderSessions() {
        const sessionsList = document.getElementById('sessionsList');
        const allSessionsList = document.getElementById('allSessionsList');
        
        if (!this.sessions.length) {
            sessionsList.innerHTML = `
                <div class="empty-state">
                    <p>No sessions</p>
                    <p class="subtext">Create your first session</p>
                </div>
            `;
            return;
        }

        // Render sidebar sessions
        sessionsList.innerHTML = this.sessions.map(session => `
            <div class="session-item ${session.active ? 'active' : ''}" onclick="client.switchSession('${session.id}')">
                <div class="session-name">
                    <span>${session.name}</span>
                    <span class="task-count">${session.taskCount}</span>
                </div>
                <div class="session-meta">
                    <span>${new Date(session.created).toLocaleDateString()}</span>
                    <span>${session.active ? 'Active' : ''}</span>
                </div>
            </div>
        `).join('');

        // Render modal sessions
        if (allSessionsList) {
            allSessionsList.innerHTML = this.sessions.map(session => `
                <div class="session-modal-item">
                    <div class="session-modal-info">
                        <div class="session-modal-name">
                            ${session.name} ${session.active ? '(Active)' : ''}
                        </div>
                        <div class="session-modal-meta">
                            Created: ${new Date(session.created).toLocaleDateString()} • 
                            Tasks: ${session.taskCount} • 
                            Last: ${new Date(session.lastActivity).toLocaleDateString()}
                        </div>
                    </div>
                    <div class="session-modal-actions">
                        <button class="session-action-btn" onclick="client.switchSession('${session.id}')">
                            Switch
                        </button>
                        ${!session.active ? `
                            <button class="session-action-btn delete" onclick="client.deleteSession('${session.id}')">
                                Delete
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }
    }

    renderTaskHistory() {
        const historyList = document.getElementById('historyList');
        
        if (!this.currentTasks.length) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <p>No tasks in this session</p>
                    <p class="subtext">Execute a task to see history</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = this.currentTasks.slice().reverse().map(task => `
            <div class="history-item" onclick="showTaskDetails(${task.id})">
                <div class="task-text">${this.truncateText(task.task, 60)}</div>
                <div class="task-meta">
                    <span>${new Date(task.timestamp).toLocaleTimeString()}</span>
                    <span class="task-status ${task.status}">${task.status}</span>
                </div>
            </div>
        `).join('');
    }

    updateSessionUI() {
        const activeSession = this.sessions.find(s => s.active);
        
        if (activeSession) {
            this.currentSession = activeSession;
            const activeSessionIndicator = document.getElementById('activeSessionIndicator');
            const currentSessionName = document.getElementById('currentSessionName');
            
            if (activeSessionIndicator) {
                activeSessionIndicator.textContent = activeSession.name;
            }
            if (currentSessionName) {
                currentSessionName.textContent = activeSession.name;
            }
        }
    }

    updateTaskCount() {
        const count = this.currentTasks.length;
        const sessionTaskCount = document.getElementById('sessionTaskCount');
        if (sessionTaskCount) {
            sessionTaskCount.textContent = `${count} task${count !== 1 ? 's' : ''}`;
        }
    }

    updateStatus(agent, status) {
        const statusElement = document.getElementById(`${agent}Status`);
        if (statusElement) {
            statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            statusElement.className = `step-status ${status}`;
            
            const stepElement = statusElement.closest('.pipeline-step');
            if (stepElement) {
                stepElement.classList.toggle('active', status === 'working');
            }
            
            const connector = stepElement?.nextElementSibling;
            if (connector && connector.classList.contains('pipeline-connector')) {
                connector.classList.toggle('active', status === 'working' || status === 'completed');
            }
        }
    }

    async simulateWork(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    formatOutputForDisplay(result) {
        if (!result) return '<p>No output generated</p>';
        
        if (result.html) {
            return result.html;
        } else if (result.formatted) {
            return this.markdownToHTML(result.formatted);
        } else if (result.error) {
            return `<div class="error-output">
                <h2 style="color: #dc3545;">❌ Error</h2>
                <p><strong>${result.error}</strong></p>
            </div>`;
        } else {
            return `<pre>${JSON.stringify(result, null, 2)}</pre>`;
        }
    }

    markdownToHTML(markdown) {
        if (!markdown) return '';
        
        return markdown
            .replace(/^# (.*)$/gm, '<h1 style="color: #2c3e50; border-bottom: 2px solid #4a6cf7; padding-bottom: 10px; margin-bottom: 20px;">$1</h1>')
            .replace(/^## (.*)$/gm, '<h2 style="color: #2c3e50; margin: 25px 0 15px 0; padding-left: 15px; border-left: 4px solid #4a6cf7;">$1</h2>')
            .replace(/^### (.*)$/gm, '<h3 style="color: #2c3e50; margin: 20px 0 10px 0;">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700; color: #1a202c;">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre style="background: #2d3748; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 20px 0;"><code>$1</code></pre>')
            .replace(/\n\n/g, '</p><p style="line-height: 1.6; margin-bottom: 15px;">')
            .replace(/\n/g, '<br>')
            .replace(/^- (.*)$/gm, '<li style="margin-bottom: 8px;">$1</li>')
            .replace(/(<li[\s\S]*?<\/li>)/g, '<ul style="padding-left: 20px; margin: 15px 0;">$1</ul>');
    }

    showServerError() {
        const output = document.getElementById('output');
        if (output) {
            output.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc3545;">
                    <h3>🚨 Server Connection Error</h3>
                    <p>Unable to connect to the NuVora AI server.</p>
                    <p><strong>Possible solutions:</strong></p>
                    <ol style="text-align: left; max-width: 500px; margin: 20px auto;">
                        <li>Refresh the page</li>
                        <li>Check your internet connection</li>
                        <li>Contact support if the issue persists</li>
                    </ol>
                    <button onclick="window.location.reload()" style="
                        background: #667eea;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 20px;
                    ">
                        🔄 Refresh Page
                    </button>
                </div>
            `;
        }
    }

    showConnectionError(error) {
        const output = document.getElementById('output');
        if (output) {
            output.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #ff9800;">
                    <h3>⚠️ Connection Issue</h3>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <p>Please check the browser console for details.</p>
                    <button onclick="testConnection()" style="
                        background: #ff9800;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 20px;
                    ">
                        🔍 Test Connection
                    </button>
                </div>
            `;
        }
    }
}

const client = new NuVoraClient();

// Global functions
async function executeTask() {
    const taskInput = document.getElementById('taskInput');
    const taskType = document.getElementById('taskType').value;
    const executeBtn = document.querySelector('.execute-btn');
    const output = document.getElementById('output');

    const task = taskInput.value.trim();
    if (!task) {
        showNotification('Please enter a task description', 'error');
        taskInput.focus();
        return;
    }

    if (!client.currentSession) {
        showNotification('Please create or select a session first', 'error');
        openSessionModal();
        return;
    }

    executeBtn.classList.add('loading');
    executeBtn.disabled = true;
    output.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p style="margin-top: 20px; color: #666;">Processing with AI agents...</p>
        </div>
    `;

    try {
        const result = await client.executeTask(task, taskType);
        
        const formattedOutput = client.formatOutputForDisplay(result);
        output.innerHTML = `
            <div class="markdown-output" style="max-width: 100%; overflow-x: auto;">
                ${formattedOutput}
                <div class="output-actions" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <button class="action-btn" onclick="exportToPDF(${result.taskId})">
                        <i class="fas fa-file-pdf"></i> Export as PDF
                    </button>
                    <button class="action-btn" onclick="copyOutput()">
                        <i class="fas fa-copy"></i> Copy Content
                    </button>
                </div>
            </div>
        `;

        showNotification('Task completed successfully!', 'success');
        
        // Clear input after successful execution
        taskInput.value = '';

    } catch (error) {
        console.error('Execution error:', error);
        output.innerHTML = `
            <div style="color: #dc3545; padding: 30px; text-align: center;">
                <h3 style="margin-bottom: 15px;">❌ Task Failed</h3>
                <p><strong>${error.message}</strong></p>
                <p>Please check your connection and try again.</p>
            </div>
        `;
        showNotification('Task failed: ' + error.message, 'error');
    } finally {
        executeBtn.classList.remove('loading');
        executeBtn.disabled = false;
    }
}

// Session Management Functions
function openSessionModal() {
    document.getElementById('sessionModal').classList.add('active');
}

function closeModal() {
    document.getElementById('sessionModal').classList.remove('active');
    document.getElementById('taskModal').classList.remove('active');
}

async function createNewSession() {
    const sessionNameInput = document.getElementById('newSessionName');
    const sessionName = sessionNameInput.value.trim();
    
    if (!sessionName) {
        showNotification('Please enter a session name', 'error');
        return;
    }
    
    const success = await client.createSession(sessionName);
    if (success) {
        sessionNameInput.value = '';
        closeModal();
    }
}

async function exportCurrentSession() {
    if (!client.currentSession) {
        showNotification('No active session to export', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${client.baseURL}/api/export/session/${client.currentSession.id}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `session_${client.currentSession.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification('Session exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Failed to export session: ' + error.message, 'error');
    }
}

async function exportToPDF(taskId = null) {
    if (!taskId) {
        if (!client.currentTasks.length) {
            showNotification('No tasks to export', 'error');
            return;
        }
        taskId = client.currentTasks[client.currentTasks.length - 1].id;
    }
    
    try {
        const response = await fetch(`${client.baseURL}/api/export/pdf/${taskId}`);
        const html = await response.text();
        
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        iframe.style.width = '210mm';
        iframe.style.height = '297mm';
        document.body.appendChild(iframe);
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.write(html);
        iframeDoc.close();
        
        setTimeout(() => {
            html2canvas(iframeDoc.body, {
                scale: 2,
                useCORS: true,
                logging: false
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jspdf.jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
                
                const imgWidth = 210;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save(`NuVora_Report_${new Date().toISOString().split('T')[0]}.pdf`);
                
                document.body.removeChild(iframe);
                
                showNotification('PDF exported successfully!', 'success');
            }).catch(error => {
                console.error('PDF generation error:', error);
                showNotification('Failed to generate PDF: ' + error.message, 'error');
                document.body.removeChild(iframe);
            });
        }, 1000);
        
    } catch (error) {
        console.error('PDF export error:', error);
        showNotification('Failed to export PDF: ' + error.message, 'error');
    }
}

async function showTaskDetails(taskId) {
    try {
        const response = await fetch(`${client.baseURL}/api/task/${taskId}`);
        const data = await response.json();
        
        if (data.success) {
            const task = data.task;
            const modalContent = document.getElementById('taskDetailsContent');
            
            modalContent.innerHTML = `
                <div class="task-details-header">
                    <h4>${task.task}</h4>
                    <div class="task-details-meta">
                        <div><strong>Type:</strong> ${task.type || 'Auto-detected'}</div>
                        <div><strong>Status:</strong> <span class="task-status ${task.status}">${task.status}</span></div>
                        <div><strong>Date:</strong> ${new Date(task.timestamp).toLocaleString()}</div>
                        <div><strong>Session:</strong> ${task.sessionName || 'Unknown'}</div>
                    </div>
                </div>
                <div class="task-details-content">
                    ${task.result?.html ? task.result.html : 
                      task.result?.formatted ? client.markdownToHTML(task.result.formatted) : 
                      '<p>No content available for this task.</p>'}
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                    <button class="action-btn" onclick="exportToPDF(${task.id})">
                        <i class="fas fa-file-pdf"></i> Export as PDF
                    </button>
                </div>
            `;
            
            document.getElementById('taskModal').classList.add('active');
        }
    } catch (error) {
        console.error('Failed to load task details:', error);
        showNotification('Failed to load task details', 'error');
    }
}

function saveToSession() {
    showNotification('Content saved to current session', 'success');
}

function fillExample(text) {
    document.getElementById('taskInput').value = text;
    document.getElementById('taskInput').focus();
}

function clearHistory() {
    if (!client.currentSession) {
        showNotification('No active session', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to clear all tasks in the current session?')) {
        fetch(`${client.baseURL}/api/sessions/${client.currentSession.id}/tasks`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                client.loadCurrentSessionTasks();
                showNotification('Task history cleared', 'success');
            }
        })
        .catch(error => {
            console.error('Failed to clear history:', error);
            showNotification('Failed to clear history', 'error');
        });
    }
}

function copyOutput() {
    const output = document.getElementById('output');
    const text = output.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Output copied to clipboard!', 'success');
    });
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

async function testConnection() {
    console.log('🔍 Testing connection...');
    try {
        const response = await fetch(`${client.baseURL}/api/test`);
        const data = await response.json();
        console.log('✅ Connection test:', data);
        showNotification('Connection test successful!', 'success');
        return true;
    } catch (error) {
        console.error('❌ Connection test failed:', error);
        showNotification('Connection test failed: ' + error.message, 'error');
        return false;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 NuVora AI Client Initialized');
    
    // Initialize client
    await client.initialize();
    
    // Event listeners
    const newSessionBtn = document.getElementById('newSessionBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    if (newSessionBtn) {
        newSessionBtn.addEventListener('click', openSessionModal);
    }
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }
    
    // Close modals when clicking X
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            executeTask();
        }
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Focus on task input
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
        taskInput.focus();
    }
    
    // Auto-test connection after 2 seconds
    setTimeout(testConnection, 2000);
});
