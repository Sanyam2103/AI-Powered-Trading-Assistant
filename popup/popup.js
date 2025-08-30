// AI Trading Assistant - Popup JavaScript (Fixed)
class TradingAssistantPopup {
    constructor() {
        this.apiKey = null;
        this.currentModel = 'gpt-3.5-turbo';
        this.maxTokens = 500;
        
        this.initializeElements();
        this.bindEventListeners();
        this.loadSavedData();
    }

    initializeElements() {
        // Main elements
        this.apiKeyInput = document.getElementById('apiKey');
        this.saveApiKeyBtn = document.getElementById('saveApiKey');
        this.userCommandInput = document.getElementById('userCommand');
        this.executeCommandBtn = document.getElementById('executeCommand');
        this.responseArea = document.getElementById('responseArea');
        this.responseContent = document.getElementById('responseContent');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        
        // Status elements
        this.connectionStatus = document.getElementById('connectionStatus');
        this.statusText = document.getElementById('statusText');
        
        // Settings elements
        this.modelSelect = document.getElementById('model');
        this.maxTokensSlider = document.getElementById('maxTokens');
        this.tokensValue = document.getElementById('tokensValue');
        
        // Quick command buttons
        this.quickCommandButtons = document.querySelectorAll('.quick-btn');
    }

    bindEventListeners() {
        // API Key management
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        this.apiKeyInput.addEventListener('input', () => this.validateApiKey());
        
        // Command execution
        this.executeCommandBtn.addEventListener('click', () => this.executeCommand());
        this.userCommandInput.addEventListener('input', () => this.validateCommand());
        
        // Quick commands
        this.quickCommandButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const command = btn.dataset.command;
                this.userCommandInput.value = command;
                this.validateCommand();
            });
        });
        
        // Settings
        if (this.modelSelect) {
            this.modelSelect.addEventListener('change', () => this.updateSettings());
        }
        if (this.maxTokensSlider) {
            this.maxTokensSlider.addEventListener('input', () => {
                this.tokensValue.textContent = this.maxTokensSlider.value;
                this.updateSettings();
            });
        }
    }

    displayResponse(aiResponse, actions = []) {
    this.responseContent.innerHTML = this.formatResponse(aiResponse);
    this.responseArea.classList.remove('hidden');

    if (actions && actions.length > 0) {
        this.displayActions(actions);
    }
}

displayActions(actions) {
    this.actionButtons.innerHTML = '';
    
    actions.forEach((action, index) => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.textContent = action.description || `Action ${index + 1}`;
        btn.addEventListener('click', () => this.executeAction(action));
        this.actionButtons.appendChild(btn);
    });

    this.actionArea.classList.remove('hidden');
}

async executeAction(action) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        const result = await chrome.tabs.sendMessage(tab.id, {
            action: 'executePageAction',
            actionData: action
        });

        if (result.success) {
            this.showSuccess(`Action executed: ${action.description || 'Action completed'}`);
        } else {
            this.showError(result.error || 'Failed to execute action');
        }
    } catch (error) {
        console.error('Action execution error:', error);
        this.showError('Failed to execute action');
    }
}


    async loadSavedData() {
        try {
            const result = await chrome.storage.sync.get([
                'openaiApiKey', 
                'selectedModel', 
                'maxTokens'
            ]);
            
            if (result.openaiApiKey) {
                this.apiKey = result.openaiApiKey;
                this.apiKeyInput.value = '••••••••••••••••'; // Masked display
                this.updateConnectionStatus(true);
                this.validateCommand();
            }
            
            if (result.selectedModel && this.modelSelect) {
                this.currentModel = result.selectedModel;
                this.modelSelect.value = result.selectedModel;
            }
            
            if (result.maxTokens && this.maxTokensSlider) {
                this.maxTokens = result.maxTokens;
                this.maxTokensSlider.value = result.maxTokens;
                this.tokensValue.textContent = result.maxTokens;
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    async saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        
        if (!apiKey || apiKey === '••••••••••••••••') {
            this.showError('Please enter a valid API key');
            return;
        }

        if (!this.isValidApiKeyFormat(apiKey)) {
            this.showError('Invalid API key format. Should start with "sk-"');
            return;
        }

        try {
            await chrome.storage.sync.set({ openaiApiKey: apiKey });
            this.apiKey = apiKey;
            this.apiKeyInput.value = '••••••••••••••••';
            this.updateConnectionStatus(true);
            this.validateCommand();
            this.showSuccess('API key saved successfully!');
        } catch (error) {
            console.error('Error saving API key:', error);
            this.showError('Failed to save API key');
        }
    }

    isValidApiKeyFormat(key) {
        return key.startsWith('AIza') && key.length > 30;
    }

    validateApiKey() {
        const hasApiKey = this.apiKey || (this.apiKeyInput.value && this.apiKeyInput.value !== '••••••••••••••••');
        this.updateConnectionStatus(hasApiKey);
    }

    validateCommand() {
        const hasCommand = this.userCommandInput.value.trim().length > 0;
        const hasApiKey = this.apiKey !== null;
        this.executeCommandBtn.disabled = !hasCommand || !hasApiKey;
    }

    updateConnectionStatus(connected) {
        const statusDot = this.connectionStatus.querySelector('.status-dot');
        
        if (connected) {
            statusDot.classList.add('connected');
            this.statusText.textContent = 'Connected';
        } else {
            statusDot.classList.remove('connected');
            this.statusText.textContent = 'Disconnected';
        }
    }

    async updateSettings() {
        if (this.modelSelect) {
            this.currentModel = this.modelSelect.value;
        }
        if (this.maxTokensSlider) {
            this.maxTokens = parseInt(this.maxTokensSlider.value);
        }
        
        try {
            await chrome.storage.sync.set({
                selectedModel: this.currentModel,
                maxTokens: this.maxTokens
            });
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    async executeCommand() {
        const command = this.userCommandInput.value.trim();
        if (!command || !this.apiKey) return;

        console.log('Executing command:', command);
        this.showLoading(true);
        this.hideResponse();

        try {
            // Get current tab to extract context
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('tradingview.com')) {
            throw new Error('Please navigate to TradingView to use this extension');
            }


            console.log('Current tab:', tab.url);

            // Send message to content script to extract DOM data
            let pageData;
            try {
                pageData = await chrome.tabs.sendMessage(tab.id, {
                    action: 'extractPageData'
                });
                console.log('Page data received:', pageData);
            } catch (error) {
                console.error('Content script error:', error);
                throw new Error('Unable to extract page data. Please refresh the page and try again.');
            }

            if (!pageData || !pageData.success) {
                throw new Error('Unable to extract page data. Make sure you\'re on a TradingView page.');

            }

            // Send to background script for AI processing
            console.log('Sending to background script...');
            const response = await chrome.runtime.sendMessage({
                action: 'processCommand',
                command: command,
                pageData: pageData.data,
                apiKey: this.apiKey,
                model: this.currentModel,
                maxTokens: this.maxTokens
            });

            console.log('Background response:', response);

            if (!response) {
                throw new Error('No response from background script');
            }

            if (response.error) {
                throw new Error(response.error);
            }

            this.displayResponse(response.aiResponse, response.actions || []);

        } catch (error) {
            console.error('Command execution error:', error);
            this.showError(error.message || 'Failed to execute command');
        } finally {
            this.showLoading(false);
        }
    }

    displayResponse(aiResponse) {
        this.responseContent.innerHTML = this.formatResponse(aiResponse);
        this.responseArea.classList.remove('hidden');
    }

    formatResponse(response) {
        // Basic formatting
        let formatted = response
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');

        // Format numbers (prices, percentages)
        formatted = formatted.replace(/(\$[\d,]+\.?\d*)/g, '<span style="color: #00b894; font-weight: bold;">$1</span>');
        formatted = formatted.replace(/(\+?-?\d+\.\d+%)/g, '<span style="color: #e17055; font-weight: bold;">$1</span>');

        return formatted;
    }

    showLoading(show) {
        if (show) {
            this.loadingIndicator.classList.remove('hidden');
        } else {
            this.loadingIndicator.classList.add('hidden');
        }
    }

    hideResponse() {
        this.responseArea.classList.add('hidden');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Simple alert for now - can be enhanced later
        if (type === 'error') {
            console.error(message);
        } else {
            console.log(message);
        }
        
        // You can implement a proper notification system here
        alert(message);
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup DOM loaded, initializing...');
    new TradingAssistantPopup();
});
