// Working TradingView DOM Extractor - Fixed Version
class TradingViewDOMExtractor {
    constructor() {
        console.log('=== DOM EXTRACTOR CONSTRUCTOR ===');
    }

    /**
     * Main extraction method - working version
     */
    extractAllData() {
        console.log('=== EXTRACT ALL DATA CALLED ===');
        
        try {
            const data = {
                pageType: this.detectPageType(),
                timestamp: new Date().toISOString(),
                url: window.location.href,
                symbol: this.extractSymbol(),
                priceData: this.extractPriceData(),
                chartInfo: this.extractChartInfo(),
                watchlistData: this.extractWatchlistData(),
                pageStructure: this.analyzePageStructure()
            };

            console.log('=== EXTRACTED DATA ===', data);
            return data;
            
        } catch (error) {
            console.error('=== EXTRACT ALL DATA ERROR ===', error);
            // Return safe fallback data
            return {
                pageType: 'chart',
                timestamp: new Date().toISOString(),
                url: window.location.href,
                symbol: this.extractSymbolSafe(),
                priceData: this.extractPriceSafe(),
                error: error.message
            };
        }
    }

    /**
     * Extract symbol - safe version
     */
    extractSymbol() {
        console.log('=== EXTRACT SYMBOL CALLED ===');
        return this.extractSymbolSafe();
    }

    extractSymbolSafe() {
        try {
            // Method 1: From URL
            const urlMatch = window.location.href.match(/symbols\/([A-Z]{2,6})/i);
            if (urlMatch) {
                console.log('=== SYMBOL FROM URL ===', urlMatch[1]);
                return urlMatch[1].toUpperCase();
            }

            // Method 2: From page title
            const titleMatch = document.title.match(/([A-Z]{2,6})/);
            if (titleMatch) {
                console.log('=== SYMBOL FROM TITLE ===', titleMatch[1]);
                return titleMatch[1];
            }

            // Method 3: Look for symbol in visible text
            const textElements = document.querySelectorAll('div, span, h1, h2');
            for (const el of textElements) {
                if (el.offsetParent !== null && el.textContent) { // Element is visible
                    const symbolMatch = el.textContent.match(/\b([A-Z]{2,6})\b/);
                    if (symbolMatch && symbolMatch[1].length >= 2) {
                        console.log('=== SYMBOL FROM TEXT ===', symbolMatch[1]);
                        return symbolMatch[1];
                    }
                }
            }

            console.log('=== NO SYMBOL FOUND ===');
            return 'UNKNOWN';
        } catch (error) {
            console.error('=== SYMBOL EXTRACTION ERROR ===', error);
            return 'ERROR';
        }
    }

    /**
     * Extract price data - safe version
     */
    extractPriceData() {
        console.log('=== EXTRACT PRICE DATA CALLED ===');
        return this.extractPriceSafe();
    }

    extractPriceSafe() {
        try {
            const priceData = {
                currentPrice: null,
                change: null,
                changePercent: null
            };

            // Look for price in various places
            const priceSelectors = [
                '[class*="price"]',
                '[class*="last"]',
                '[class*="value"]'
            ];

            for (const selector of priceSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const el of elements) {
                    if (el.offsetParent !== null && el.textContent) { // Visible element
                        const text = el.textContent;
                        const priceMatch = text.match(/(\d{1,5}\.?\d{0,4})/);
                        
                        if (priceMatch && !text.includes('vol') && !text.includes('Vol')) {
                            const price = parseFloat(priceMatch[1]);
                            if (price > 0 && price < 100000) { // Reasonable price range
                                if (!priceData.currentPrice) {
                                    priceData.currentPrice = priceMatch[1];
                                    console.log('=== PRICE FOUND ===', priceMatch[1]);
                                }
                            }
                        }

                        // Look for change data
                        const changeMatch = text.match(/([-+]?\d+\.?\d*%?)/g);
                        if (changeMatch) {
                            changeMatch.forEach(match => {
                                if (match.includes('%') && !priceData.changePercent) {
                                    priceData.changePercent = match;
                                    console.log('=== CHANGE % FOUND ===', match);
                                } else if (!match.includes('%') && !priceData.change && match !== priceData.currentPrice) {
                                    priceData.change = match;
                                    console.log('=== CHANGE FOUND ===', match);
                                }
                            });
                        }
                    }
                }
                
                if (priceData.currentPrice) break; // Stop if we found a price
            }

            // Fallback: Look in the page text for SPX price pattern
            if (!priceData.currentPrice && window.location.href.includes('SPX')) {
                const bodyText = document.body.textContent;
                const spxMatch = bodyText.match(/6[,.]?\d{3}\.?\d{2}/); // Pattern for SPX prices around 6000
                if (spxMatch) {
                    priceData.currentPrice = spxMatch[0];
                    console.log('=== SPX PRICE FROM BODY ===', spxMatch[0]);
                }
            }

            return priceData;
        } catch (error) {
            console.error('=== PRICE EXTRACTION ERROR ===', error);
            return { currentPrice: 'Error', change: null, changePercent: null };
        }
    }

    /**
     * Extract chart info
     */
    extractChartInfo() {
        console.log('=== EXTRACT CHART INFO CALLED ===');
        
        try {
            return {
                hasChart: !!document.querySelector('canvas'),
                timeframes: this.getVisibleTimeframes(),
                activeTimeframe: this.getActiveTimeframe()
            };
        } catch (error) {
            console.error('=== CHART INFO ERROR ===', error);
            return { hasChart: false };
        }
    }

    getVisibleTimeframes() {
        try {
            const timeframeElements = document.querySelectorAll('button, div, span');
            const timeframes = [];
            
            const timeframePatterns = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M'];
            
            for (const el of timeframeElements) {
                if (el.offsetParent !== null && el.textContent) {
                    const text = el.textContent.trim();
                    if (timeframePatterns.includes(text)) {
                        timeframes.push(text);
                    }
                }
            }
            
            return [...new Set(timeframes)]; // Remove duplicates
        } catch (error) {
            return [];
        }
    }

    getActiveTimeframe() {
        try {
            // Look for active/selected timeframe buttons
            const activeElements = document.querySelectorAll('[class*="active"], [class*="selected"]');
            
            for (const el of activeElements) {
                if (el.textContent && el.textContent.match(/^\d+[mhdwM]$/)) {
                    return el.textContent.trim();
                }
            }
            
            return 'Unknown';
        } catch (error) {
            return 'Unknown';
        }
    }

    /**
     * Extract watchlist data
     */
    extractWatchlistData() {
        console.log('=== EXTRACT WATCHLIST DATA CALLED ===');
        
        try {
            const watchlistItems = [];
            
            // Look for any elements that might contain stock symbols
            const elements = document.querySelectorAll('div, span, td');
            
            for (const el of elements) {
                if (el.offsetParent !== null && el.textContent) {
                    const text = el.textContent.trim();
                    const symbolMatch = text.match(/\b([A-Z]{2,6})\b/);
                    
                    if (symbolMatch && text.length < 100) { // Not too long text
                        const symbol = symbolMatch[1];
                        if (symbol.length >= 2 && symbol !== 'USD' && symbol !== 'GMT') {
                            watchlistItems.push({
                                symbol: symbol,
                                text: text,
                                element: this.getElementInfo(el)
                            });
                        }
                    }
                }
                
                if (watchlistItems.length >= 10) break; // Limit results
            }
            
            // Remove duplicates
            const uniqueItems = watchlistItems.filter((item, index, self) => 
                index === self.findIndex(i => i.symbol === item.symbol)
            );
            
            console.log('=== WATCHLIST ITEMS FOUND ===', uniqueItems.length);
            return uniqueItems;
            
        } catch (error) {
            console.error('=== WATCHLIST EXTRACTION ERROR ===', error);
            return [];
        }
    }

    /**
     * Analyze page structure
     */
    analyzePageStructure() {
        console.log('=== ANALYZE PAGE STRUCTURE CALLED ===');
        
        try {
            return {
                hasChart: !!document.querySelector('canvas'),
                hasSearchBox: !!document.querySelector('input[type="text"], input[type="search"]'),
                canvasCount: document.querySelectorAll('canvas').length,
                inputCount: document.querySelectorAll('input').length,
                buttonCount: document.querySelectorAll('button').length,
                sectionsAvailable: ['chart', 'data']
            };
        } catch (error) {
            console.error('=== PAGE STRUCTURE ERROR ===', error);
            return { sectionsAvailable: ['basic'] };
        }
    }

    /**
     * Detect page type
     */
    detectPageType() {
        const url = window.location.href;
        if (url.includes('/chart')) return 'chart';
        if (url.includes('/symbols')) return 'symbol';
        if (url.includes('/screener')) return 'screener';
        return 'chart';
    }

    /**
     * Helper method to get element info
     */
    getElementInfo(element) {
        try {
            if (element.id) return `#${element.id}`;
            if (element.className && typeof element.className === 'string') {
                const classes = element.className.split(' ').filter(c => c.trim());
                if (classes.length > 0) {
                    return `.${classes[0]}`;
                }
            }
            return element.tagName.toLowerCase();
        } catch (error) {
            return 'unknown';
        }
    }

    /**
     * Extract specific data types
     */
    extractSpecificData(queryType) {
        console.log('=== EXTRACT SPECIFIC DATA ===', queryType);
        
        try {
            switch (queryType) {
                case 'price':
                    return this.extractPriceData();
                case 'symbol':
                    return { symbol: this.extractSymbol() };
                case 'chart':
                    return this.extractChartInfo();
                case 'watchlist':
                    return this.extractWatchlistData();
                default:
                    return this.extractAllData();
            }
        } catch (error) {
            console.error('=== SPECIFIC DATA ERROR ===', error);
            return { error: error.message };
        }
    }
}

// Make available globally
window.TradingViewDOMExtractor = TradingViewDOMExtractor;
console.log('=== TRADINGVIEW DOM EXTRACTOR LOADED ===');
