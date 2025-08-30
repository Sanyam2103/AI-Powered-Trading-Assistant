// Enhanced Background Service Worker with Action Generation
console.log('Enhanced Background script loading with Gemini...');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message);
    
    if (message.action === 'processCommand') {
        processCommand(message)
            .then(result => {
                console.log('Sending response:', result);
                sendResponse(result);
            })
            .catch(error => {
                console.error('Process command error:', error);
                sendResponse({ 
                    success: false, 
                    error: error.message || 'Unknown error occurred'
                });
            });
        return true;
    }
    
    sendResponse({ success: false, error: 'Unknown action' });
    return true;
});

async function processCommand(message) {
    const { command, pageData, apiKey } = message;
    
    console.log('Processing enhanced command with Gemini...');
    
    if (!apiKey) {
        throw new Error('Gemini API key is required. Get one from Google AI Studio.');
    }
    
    if (!pageData) {
        throw new Error('No page data available. Please ensure you are on a TradingView page.');
    }
    
    // Build comprehensive context
    const context = buildComprehensiveContext(pageData);
    
    try {
        console.log('Making Gemini API call with enhanced prompt...');
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        
        const enhancedPrompt = `You are an AI assistant for TradingView that can analyze data AND suggest actions.

USER COMMAND: "${command}"

TRADINGVIEW PAGE CONTEXT:
${context}

INSTRUCTIONS:
1. Analyze the TradingView data and answer the user's question
2. If the user wants to perform an action (like "change timeframe", "search for stock", "find best performer", "click on something"), suggest specific actions
3. Always respond in this JSON format:

{
  "response": "Your helpful analysis and answer here",
  "actions": [
    {
      "type": "click|type|navigate",
      "selector": "CSS selector or element identifier", 
      "value": "text to type (if type action)",
      "description": "What this action does"
    }
  ]
}

EXAMPLE ACTIONS:
- To change timeframe: {"type": "click", "selector": "[data-name='time-intervals'] button", "description": "Change to 1H timeframe"}
- To search stock: {"type": "type", "selector": "input[data-role='search']", "value": "AAPL", "description": "Search for AAPL"}
- To click best performer: {"type": "click", "selector": ".item-symbol-TSLA", "description": "Click on TSLA (best performer)"}

Respond ONLY with valid JSON.`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: enhancedPrompt
                    }]
                }]
            })
        });
        
        console.log('Gemini response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            throw new Error(`Gemini API error (${response.status}): Please check your API key`);
        }
        
        const data = await response.json();
        let aiResponse = 'No response received from Gemini';
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            aiResponse = data.candidates[0].content.parts[0].text;
        }
        
        // Parse JSON response
        let parsedResponse = { response: aiResponse, actions: [] };
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedResponse = JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.warn('Could not parse JSON response, using as plain text');
        }
        
        console.log('Parsed Gemini response:', parsedResponse);
        
        return {
            success: true,
            aiResponse: parsedResponse.response || aiResponse,
            actions: parsedResponse.actions || [],
            metadata: {
                model: 'gemini-1.5-flash-latest',
                timestamp: new Date().toISOString()
            }
        };
        
    } catch (error) {
        console.error('Gemini API call failed:', error);
        throw new Error(`Failed to process command: ${error.message}`);
    }
}

function buildComprehensiveContext(pageData) {
    let context = [];
    
    // Basic info
    if (pageData.symbol) {
        context.push(`Current Symbol: ${pageData.symbol}`);
    }
    
    // Price data
    if (pageData.priceData && Object.keys(pageData.priceData).length > 0) {
        const priceInfo = [];
        if (pageData.priceData.currentPrice) priceInfo.push(`Price: ${pageData.priceData.currentPrice}`);
        if (pageData.priceData.change) priceInfo.push(`Change: ${pageData.priceData.change}`);
        if (pageData.priceData.changePercent) priceInfo.push(`Change%: ${pageData.priceData.changePercent}`);
        if (pageData.priceData.volume) priceInfo.push(`Volume: ${pageData.priceData.volume}`);
        
        if (priceInfo.length > 0) {
            context.push(`Price Data: ${priceInfo.join(', ')}`);
        }
    }
    
    // Chart info
    if (pageData.chartInfo && pageData.chartInfo.activeTimeframe) {
        context.push(`Active Timeframe: ${pageData.chartInfo.activeTimeframe}`);
        
        if (pageData.chartInfo.availableTimeframes && pageData.chartInfo.availableTimeframes.length > 0) {
            const timeframes = pageData.chartInfo.availableTimeframes.map(tf => tf.text).join(', ');
            context.push(`Available Timeframes: ${timeframes}`);
        }
    }
    
    // Watchlist data
    if (pageData.watchlistData && pageData.watchlistData.length > 0) {
        const topPerformers = pageData.watchlistData.slice(0, 5).map(item => 
            `${item.symbol}: ${item.price || 'N/A'} (${item.changePercent || 'N/A'})`
        ).join(', ');
        context.push(`Watchlist (Top 5): ${topPerformers}`);
        
        // Identify best performer
        if (pageData.watchlistData[0] && pageData.watchlistData[0].performance > 0) {
            context.push(`Best Performer: ${pageData.watchlistData[0].symbol} (+${pageData.watchlistData[0].performance}%)`);
        }
    }
    
    // Portfolio data
    if (pageData.portfolioData && pageData.portfolioData.length > 0) {
        const portfolioSymbols = pageData.portfolioData.map(item => item.symbol).join(', ');
        context.push(`Portfolio: ${portfolioSymbols}`);
    }
    
    // Available actions
    if (pageData.availableActions && pageData.availableActions.length > 0) {
        const actionsByCategory = {};
        pageData.availableActions.forEach(action => {
            if (!actionsByCategory[action.category]) {
                actionsByCategory[action.category] = [];
            }
            actionsByCategory[action.category].push(action);
        });
        
        context.push(`Available Actions: ${Object.keys(actionsByCategory).join(', ')}`);
    }
    
    return context.join('\n');
}

console.log('Enhanced background script initialized with comprehensive Gemini integration');
