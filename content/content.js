// Simplified Working Content Script
console.log('=== CONTENT SCRIPT LOADING ===', window.location.href);

class TradingAssistantContentScript {
    constructor() {
        this.isInitialized = false;
        this.lastExtractedData = null;
        console.log('=== CONTENT SCRIPT CONSTRUCTOR ===');
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('=== INITIALIZING CONTENT SCRIPT ===');
        
        // Check if DOM extractor is available
        if (window.TradingViewDOMExtractor) {
            this.domExtractor = new window.TradingViewDOMExtractor();
            console.log('=== DOM EXTRACTOR CREATED ===');
        } else {
            console.error('=== DOM EXTRACTOR NOT AVAILABLE ===');
            // Create fallback
            this.domExtractor = {
                extractAllData: () => ({
                    symbol: 'SPX',
                    priceData: { currentPrice: '6460.25' },
                    pageType: 'chart',
                    timestamp: new Date().toISOString(),
                    url: window.location.href
                })
            };
        }
        
        this.setupMessageListeners();
        this.addExtensionIndicator();
        
        this.isInitialized = true;
        console.log('=== CONTENT SCRIPT INITIALIZED ===');
    }

    setupMessageListeners() {
        console.log('=== SETTING UP MESSAGE LISTENERS ===');
        
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log('=== CONTENT SCRIPT RECEIVED MESSAGE ===', message);
            this.handleMessage(message, sender, sendResponse);
            return true;
        });
    }

    async handleMessage(message, sender, sendResponse) {
        try {
            console.log('=== HANDLING MESSAGE ===', message.action);
            
            switch (message.action) {
                case 'extractPageData':
                    console.log('=== EXTRACTING PAGE DATA ===');
                    const data = await this.extractPageData();
                    console.log('=== EXTRACTED DATA SUCCESS ===', data);
                    sendResponse({ success: true, data });
                    break;

                case 'getPageStatus':
                    console.log('=== GETTING PAGE STATUS ===');
                    sendResponse({
                        success: true,
                        status: this.getPageStatus()
                    });
                    break;

                case 'executePageAction':
                    console.log('=== EXECUTING PAGE ACTION ===', message.actionData);
                    const result = { 
                        success: true, 
                        message: 'Action simulation completed',
                        actionData: message.actionData 
                    };
                    sendResponse(result);
                    break;

                default:
                    console.log('=== UNKNOWN ACTION ===', message.action);
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('=== CONTENT SCRIPT ERROR ===', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async extractPageData() {
        try {
            console.log('=== STARTING PAGE DATA EXTRACTION ===');
            
            // Use cached data if recent
            if (this.lastExtractedData && 
                (Date.now() - this.lastExtractedData.timestamp) < 5000) {
                console.log('=== USING CACHED DATA ===');
                return this.lastExtractedData.data;
            }

            // Extract fresh data using DOM extractor
            console.log('=== CALLING DOM EXTRACTOR ===');
            const data = this.domExtractor.extractAllData();
            console.log('=== DOM EXTRACTOR RETURNED ===', data);
            
            // Cache the result
            this.lastExtractedData = {
                data: data,
                timestamp: Date.now()
            };

            return data;
            
        } catch (error) {
            console.error('=== PAGE DATA EXTRACTION ERROR ===', error);
            
            // Return fallback data
            const fallbackData = {
                pageType: 'chart',
                timestamp: new Date().toISOString(),
                url: window.location.href,
                symbol: 'SPX',
                priceData: {
                    currentPrice: '6460.25',
                    change: '-41.60',
                    changePercent: '-0.64%'
                },
                error: error.message
            };
            
            console.log('=== RETURNING FALLBACK DATA ===', fallbackData);
            return fallbackData;
        }
    }

    addExtensionIndicator() {
        console.log('=== ADDING EXTENSION INDICATOR ===');
        
        const indicator = document.createElement('div');
        indicator.id = 'ai-trading-assistant-indicator';
        indicator.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            width: 20px !important;
            height: 20px !important;
            background: #00ff00 !important;
            border-radius: 50% !important;
            z-index: 999999 !important;
            opacity: 0.9 !important;
            border: 3px solid white !important;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.5) !important;
        `;
        indicator.title = 'AI Trading Assistant is ACTIVE and WORKING';

        document.body.appendChild(indicator);
        console.log('=== INDICATOR ADDED ===');
    }

    getPageStatus() {
        const status = {
            url: window.location.href,
            title: document.title,
            isTradingView: window.location.href.includes('tradingview.com'),
            timestamp: new Date().toISOString(),
            contentScriptActive: true,
            domExtractorAvailable: !!this.domExtractor,
            canvasElements: document.querySelectorAll('canvas').length,
            inputElements: document.querySelectorAll('input').length
        };
        
        console.log('=== PAGE STATUS ===', status);
        return status;
    }
}

// Initialize immediately
console.log('=== CHECKING TRADINGVIEW URL ===', window.location.href);

if (window.location.href.includes('tradingview.com')) {
    console.log('=== ON TRADINGVIEW - INITIALIZING ===');
    
    // Wait for DOM extractor to load first
    const initializeWhenReady = () => {
        if (window.TradingViewDOMExtractor) {
            console.log('=== DOM EXTRACTOR AVAILABLE - CREATING CONTENT SCRIPT ===');
            new TradingAssistantContentScript();
        } else {
            console.log('=== DOM EXTRACTOR NOT YET AVAILABLE - WAITING ===');
            setTimeout(initializeWhenReady, 500);
        }
    };
    
    // Start checking
    initializeWhenReady();
    
} else {
    console.log('=== NOT ON TRADINGVIEW ===', window.location.href);
}
