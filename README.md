# AI-Powered TradingView Assistant

An AI-powered Chrome extension that enhances TradingView by providing:

- Context-aware page reading of TradingView charts and dashboards  
- Natural language prompting to analyze data and perform actions  
- Action execution: clicking buttons, searching symbols, changing timeframes, and more  
- Powered by Google Gemini via the Generative Language API  

## Features

1. **Context-Aware Data Extraction**  
   -  Stock symbol, current price, change, and percent change  
   -  Available and active chart timeframes (1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1M)  
   -  Search box detection and current value  
   -  Watchlist snapshot (top items)  
   -  Market status indicator and performance metrics  

2. **Natural Language Prompting**  
   -  AI analysis powered by Gemini – model `gemini-1.5-flash-latest`  
   -  Prompts for data queries (e.g., “What is the current price?”)  
   -  Prompts for interactive actions (e.g., “Change timeframe to 1 hour”, “Search for AAPL”)  
   -  Returns JSON response with `response` text and `actions` array  

3. **Action Execution on TradingView**  
   -  Click timeframe buttons to switch chart intervals  
   -  Type and submit searches for new symbols  
   -  Highlight and click specific chart or interface elements  
   -  Perform multiple actions in sequence (e.g., switch timeframe, then search)  

4. **Visual Feedback**  
   -  Animated indicator on page load  
   -  Highlight overlays on clicked elements  
   -  Action results listed in the extension popup  

## Installation

1. Clone or download this repository.  
2. Open Chrome and navigate to `chrome://extensions/`.  
3. Enable **Developer mode**.  
4. Click **Load unpacked** and select the extension folder.  
5. Obtain a Gemini API key:
   - Go to https://aistudio.google.com/app/apikey  
   - Create and copy your API key (starts with `AIza…`)  
6. Click the extension icon, paste your API key, and click **Save**.

## Usage

- Open any TradingView page (e.g., https://www.tradingview.com/chart/).  
- Click the extension icon, enter a prompt like:  
  - “What is the current stock price?”  
  - “Change timeframe to 1 hour.”  
  - “Search for TSLA.”  
  - “Show today’s performance.”  
- The extension will display an AI-generated response and perform the specified actions on the page.  

## Example Prompts

| Prompt                                              | Actions Performed                                              |
|-----------------------------------------------------|----------------------------------------------------------------|
| “What is the current price?”                       | Extracts and displays current price and change                 |
| “Change timeframe to 1‐day”                        | Clicks the 1D timeframe button on the chart                   |
| “Search for Apple Inc.”                            | Types “AAPL” in TradingView search box and submits             |
| “Find my best performing watchlist stock and click” | Identifies top‐performing symbol, highlights, and clicks it    |

## Developer Notes

- **Content script**: `content/content.js` handles DOM reading and action execution.  
- **Background script**: `background/background.js` sends prompts to Gemini and parses responses.  
- **Popup UI**: `popup/popup.html` and `popup/popup.js` handle user input, display results, and buttons to replay actions.  
- **Libraries**: No external dependencies; uses Chrome extension APIs and native fetch.

***

Enjoy seamless AI-driven trading insights and interactions directly within TradingView!