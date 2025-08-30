// AI Processor Utility for Trading Assistant
// Handles OpenAI API communication and prompt engineering

class AIProcessor {
    constructor(apiKey, model = 'gpt-3.5-turbo') {
        this.apiKey = apiKey;
        this.model = model;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.maxRetries = 3;
        this.retryDelay = 1000;
    }

    /**
     * Process user command with page context
     */
    async processCommand(userCommand, pageData, options = {}) {
        const {
            maxTokens = 500,
            temperature = 0.7,
            includeActions = true
        } = options;

        try {
            const systemPrompt = this.buildSystemPrompt();
            const userPrompt = this.buildUserPrompt(userCommand, pageData, includeActions);

            const response = await this.callOpenAI({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: maxTokens,
                temperature: temperature
            });

            return this.parseResponse(response);
        } catch (error) {
            console.error('AI processing error:', error);
            throw new Error('Failed to process command: ' + error.message);
        }
    }

    /**
     * Build system prompt for the AI
     */
    buildSystemPrompt() {
        return `You are an AI assistant specialized in analyzing financial data from Yahoo Finance pages. 
You have access to stock market data, company information, financial statistics, news, and analyst recommendations.

Your role is to:
1. Analyze the provided page data and answer user questions accurately
2. Provide insights about stock performance, trends, and financial metrics  
3. Suggest relevant actions the user can take on the page
4. Explain financial concepts in clear, understandable terms
5. Be concise but informative in your responses

When suggesting actions, use these action types:
- "click": Click on specific elements (buttons, links, tabs)
- "scroll": Scroll to specific sections or elements  
- "highlight": Highlight specific data points
- "navigate": Navigate to different sections
- "extract": Extract specific data types

Always provide JSON-formatted actions in your response when relevant, following this structure:
{
  "response": "Your text response here",
  "actions": [
    {
      "type": "click|scroll|highlight|navigate|extract",
      "selector": "CSS selector or section name",
      "label": "Button text or action description",
      "description": "What this action will do"
    }
  ]
}

Focus on being helpful, accurate, and actionable. If you cannot find specific information in the provided data, clearly state this limitation.`;
    }

    /**
     * Build user prompt with command and context
     */
    buildUserPrompt(userCommand, pageData, includeActions) {
        const contextSummary = this.summarizePageData(pageData);

        return `USER COMMAND: "${userCommand}"

CURRENT PAGE CONTEXT:
${contextSummary}

Please analyze this data and respond to the user's command. ${includeActions ? 'Include relevant actions they can take on the page.' : ''}

Respond in JSON format with "response" and "actions" fields.`;
    }

    /**
     * Summarize page data for context
     */
    summarizePageData(pageData) {
        if (!pageData) return "No page data available.";

        let summary = [];

        // Basic info
        if (pageData.symbol) {
            summary.push(`Stock Symbol: ${pageData.symbol}`);
        }

        if (pageData.basicInfo?.companyName) {
            summary.push(`Company: ${pageData.basicInfo.companyName}`);
        }

        // Price data
        if (pageData.priceData?.currentPrice) {
            const price = pageData.priceData.currentPrice;
            const change = pageData.priceData.priceChange;
            const changePercent = pageData.priceData.priceChangePercent;

            summary.push(`Current Price: ${price}${change ? ` (${change}` : ''}${changePercent ? `, ${changePercent})` : ')'}`);
        }

        // Key statistics
        if (pageData.keyStatistics) {
            const stats = [];
            if (pageData.keyStatistics.marketCap) stats.push(`Market Cap: ${pageData.keyStatistics.marketCap}`);
            if (pageData.keyStatistics.peRatio) stats.push(`P/E Ratio: ${pageData.keyStatistics.peRatio}`);
            if (pageData.keyStatistics.volume) stats.push(`Volume: ${pageData.keyStatistics.volume}`);
            if (pageData.keyStatistics.dayRange) stats.push(`Day's Range: ${pageData.keyStatistics.dayRange}`);

            if (stats.length > 0) {
                summary.push(`Key Stats: ${stats.join(', ')}`);
            }
        }

        // Chart info
        if (pageData.chartInfo?.hasChart) {
            summary.push(`Chart Available: Yes`);
            if (pageData.chartInfo.timeFrames?.length > 0) {
                summary.push(`Time Frames: ${pageData.chartInfo.timeFrames.join(', ')}`);
            }
        }

        // News
        if (pageData.newsData?.length > 0) {
            summary.push(`Recent News: ${pageData.newsData.length} articles available`);
            const latestNews = pageData.newsData[0];
            if (latestNews?.title) {
                summary.push(`Latest: "${latestNews.title}"`);
            }
        }

        // Analyst data
        if (pageData.analystData?.recommendation) {
            summary.push(`Analyst Recommendation: ${pageData.analystData.recommendation}`);
        }

        if (pageData.analystData?.priceTarget) {
            summary.push(`Price Target: ${pageData.analystData.priceTarget}`);
        }

        // Available sections
        if (pageData.pageStructure?.sectionsAvailable?.length > 0) {
            summary.push(`Available Sections: ${pageData.pageStructure.sectionsAvailable.join(', ')}`);
        }

        return summary.join('\n');
    }

    /**
     * Make API call to OpenAI with retry logic
     */
    async callOpenAI(payload, retryCount = 0) {
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    ...payload
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                if (response.status === 429 && retryCount < this.maxRetries) {
                    // Rate limit - retry with exponential backoff
                    const delay = this.retryDelay * Math.pow(2, retryCount);
                    await this.wait(delay);
                    return this.callOpenAI(payload, retryCount + 1);
                }

                throw new Error(`OpenAI API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';

        } catch (error) {
            if (retryCount < this.maxRetries && this.isRetryableError(error)) {
                const delay = this.retryDelay * Math.pow(2, retryCount);
                await this.wait(delay);
                return this.callOpenAI(payload, retryCount + 1);
            }
            throw error;
        }
    }

    /**
     * Parse AI response and extract actions
     */
    parseResponse(responseText) {
        try {
            // Try to parse as JSON first
            const parsed = JSON.parse(responseText);

            return {
                response: parsed.response || responseText,
                actions: this.validateActions(parsed.actions || [])
            };
        } catch (error) {
            // If not JSON, treat as plain text and try to extract JSON
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return {
                        response: parsed.response || responseText,
                        actions: this.validateActions(parsed.actions || [])
                    };
                } catch (e) {
                    // Fallback to plain text
                }
            }

            return {
                response: responseText,
                actions: []
            };
        }
    }

    /**
     * Validate and clean actions
     */
    validateActions(actions) {
        if (!Array.isArray(actions)) return [];

        return actions.filter(action => {
            return action && 
                   typeof action === 'object' &&
                   action.type &&
                   ['click', 'scroll', 'highlight', 'navigate', 'extract', 'type', 'select'].includes(action.type);
        }).map(action => {
            // Ensure required fields
            return {
                type: action.type,
                selector: action.selector || '',
                label: action.label || action.description || 'Execute Action',
                description: action.description || action.label || '',
                options: action.options || {}
            };
        });
    }

    /**
     * Generate specific prompts for common queries
     */
    getQuickPrompt(type, pageData) {
        const prompts = {
            currentPrice: `What is the current stock price and how has it changed today? Provide context about the movement.`,

            performance: `Analyze today's stock performance. What factors might be influencing the price movement? Look at volume, change percentage, and any available news.`,

            keyStats: `Summarize the key financial statistics for this stock. Highlight the most important metrics like P/E ratio, market cap, volume, and any standout numbers.`,

            trend: `Analyze the recent price trend for this stock. What does the chart data suggest about the stock's momentum? Are there any notable patterns?`,

            news: `What are the latest news developments for this stock? Summarize the most recent and relevant news articles.`,

            recommendation: `What do analysts recommend for this stock? Provide the consensus recommendation and price targets if available.`
        };

        return prompts[type] || null;
    }

    /**
     * Check if error is retryable
     */
    isRetryableError(error) {
        const retryableErrors = [
            'ECONNRESET',
            'ENOTFOUND', 
            'ECONNREFUSED',
            'ETIMEDOUT'
        ];

        return retryableErrors.some(errorCode => 
            error.message?.includes(errorCode) || 
            error.code === errorCode
        );
    }

    /**
     * Wait utility
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Update API configuration
     */
    updateConfig(newConfig) {
        if (newConfig.apiKey) this.apiKey = newConfig.apiKey;
        if (newConfig.model) this.model = newConfig.model;
    }

    /**
     * Test API connection
     */
    async testConnection() {
        try {
            const response = await this.callOpenAI({
                messages: [
                    { role: 'user', content: 'Test connection. Respond with "OK".' }
                ],
                max_tokens: 10,
                temperature: 0
            });

            return { success: true, response: response.trim() };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIProcessor;
} else {
    window.AIProcessor = AIProcessor;
}