class PersonalAssistantChat {
    constructor() {
        this.apiBaseUrl = window.location.origin;
        this.isTyping = false;
        this.messageHistory = [];
        
        this.initializeElements();
        this.bindEvents();
        this.checkHealth();
        this.loadSettings();
        
        // Auto-resize textarea
        this.setupAutoResize();
    }
    
    initializeElements() {
        // Main elements
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.status = document.getElementById('status');
        this.charCount = document.getElementById('charCount');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Header buttons
        this.clearBtn = document.getElementById('clearBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        
        // Modal elements
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        
        // Quick action buttons
        this.quickBtns = document.querySelectorAll('.quick-btn');
    }
    
    bindEvents() {
        // Send message events
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Input events
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.toggleSendButton();
        });
        
        // Header button events
        this.clearBtn.addEventListener('click', () => this.clearChat());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettings.addEventListener('click', () => this.closeSettingsModal());
        
        // Quick action events
        this.quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.messageInput.value = message;
                this.updateCharCount();
                this.toggleSendButton();
                this.sendMessage();
            });
        });
        
        // Modal close on overlay click
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettingsModal();
            }
        });
        
        // Settings change events
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });
        
        document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
            this.changeFontSize(e.target.value);
        });
        
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.toggleSound(e.target.checked);
        });
    }
    
    setupAutoResize() {
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        });
    }
    
    async checkHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const data = await response.json();
            
            if (data.status === 'healthy') {
                this.updateStatus('Online', 'online');
                this.hideLoading();
                // Welcome message is already shown in HTML, no need to load via API
            } else {
                this.updateStatus('Connection Issue', 'offline');
            }
        } catch (error) {
            console.error('Health check failed:', error);
            this.updateStatus('Offline', 'offline');
            this.hideLoading();
        }
    }
    
    updateStatus(text, className) {
        this.status.textContent = text;
        this.status.className = `status ${className}`;
    }
    
    hideLoading() {
        setTimeout(() => {
            this.loadingOverlay.style.display = 'none';
        }, 1000);
    }
    
    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = `${count}/1000`;
        
        if (count > 800) {
            this.charCount.style.color = '#EF4444';
        } else if (count > 600) {
            this.charCount.style.color = '#F59E0B';
        } else {
            this.charCount.style.color = 'var(--text-muted)';
        }
    }
    
    toggleSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.isTyping;
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.updateCharCount();
        this.toggleSendButton();
        
        // Show typing indicator
        this.showTyping();
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Hide typing indicator
            this.hideTyping();
            
            // Add assistant response
            this.addMessage(data.response, 'assistant');
            
            // Store in history
            this.messageHistory.push({
                user: message,
                assistant: data.response,
                timestamp: new Date().toISOString()
            });
            
            // Play notification sound
            this.playNotificationSound();
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTyping();
            this.addMessage('Sorry, an error occurred. Please try again.', 'assistant', true);
        }
    }
    
    addMessage(text, sender, isError = false) {
        // Hide welcome message if it exists
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
        
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group';
        
        const messageBubble = document.createElement('div');
        messageBubble.className = `message-bubble ${sender}-message`;
        
        if (isError) {
            messageBubble.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
        }
        
        // Format message text (simple markdown support)
        const formattedText = this.formatMessage(text);
        messageBubble.innerHTML = formattedText;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.formatTime(new Date());
        
        messageGroup.appendChild(messageBubble);
        messageGroup.appendChild(messageTime);
        
        this.chatMessages.appendChild(messageGroup);
        this.scrollToBottom();
    }
    
    formatMessage(text) {
        // Simple markdown formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    showTyping() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'flex';
        this.toggleSendButton();
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
        this.toggleSendButton();
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    clearChat() {
        if (confirm('Are you sure you want to clear all chat history?')) {
            // Clear messages except welcome
            const messages = this.chatMessages.querySelectorAll('.message-group');
            messages.forEach(msg => msg.remove());
            
            // Show welcome message again
            const welcomeMessage = document.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.style.display = 'block';
            }
            
            // Clear history
            this.messageHistory = [];
            
            this.showNotification('Chat history cleared');
        }
    }
    
    openSettings() {
        this.settingsModal.style.display = 'flex';
    }
    
    closeSettingsModal() {
        this.settingsModal.style.display = 'none';
    }
    
    changeTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('chat-theme', theme);
        this.showNotification(`Theme changed to ${theme === 'dark' ? 'dark' : 'light'} mode`);
    }
    
    changeFontSize(size) {
        document.body.setAttribute('data-font-size', size);
        localStorage.setItem('chat-font-size', size);
        this.showNotification(`Font size changed to ${size}`);
    }
    
    toggleSound(enabled) {
        localStorage.setItem('chat-sound', enabled);
        this.showNotification(`Sound notifications ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    loadSettings() {
        // Load theme
        const savedTheme = localStorage.getItem('chat-theme') || 'dark';
        document.getElementById('themeSelect').value = savedTheme;
        document.body.setAttribute('data-theme', savedTheme);
        
        // Load font size
        const savedFontSize = localStorage.getItem('chat-font-size') || 'medium';
        document.getElementById('fontSizeSelect').value = savedFontSize;
        document.body.setAttribute('data-font-size', savedFontSize);
        
        // Load sound setting
        const soundEnabled = localStorage.getItem('chat-sound') !== 'false';
        document.getElementById('soundToggle').checked = soundEnabled;
    }
    
    playNotificationSound() {
        const soundEnabled = localStorage.getItem('chat-sound') !== 'false';
        if (soundEnabled) {
            // Create a simple notification sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    }
    
    showNotification(message) {
        // Create a simple toast notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-accent);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to clear chat
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.clearChat();
        }
        
        // Ctrl/Cmd + , to open settings
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            e.preventDefault();
            this.openSettings();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            this.closeSettingsModal();
        }
    }
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    [data-theme="light"] {
        --primary-bg: #F8FAFC;
        --secondary-bg: #FFFFFF;
        --tertiary-bg: #F1F5F9;
        --text-primary: #1E293B;
        --text-secondary: #475569;
        --text-muted: #64748B;
        --glass-bg: rgba(255, 255, 255, 0.8);
        --glass-border: rgba(0, 0, 0, 0.1);
    }
    
    [data-font-size="small"] {
        font-size: 14px;
    }
    
    [data-font-size="large"] {
        font-size: 18px;
    }
`;
document.head.appendChild(style);

// Initialize the chat application
document.addEventListener('DOMContentLoaded', () => {
    const chat = new PersonalAssistantChat();
    
    // Add keyboard shortcut listener
    document.addEventListener('keydown', (e) => {
        chat.handleKeyboardShortcuts(e);
    });
    
    // Add visibility change listener to handle tab focus
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            chat.checkHealth();
        }
    });
    
    // Add online/offline listeners
    window.addEventListener('online', () => {
        chat.updateStatus('Online', 'online');
        chat.checkHealth();
    });
    
    window.addEventListener('offline', () => {
        chat.updateStatus('Offline', 'offline');
    });
});
