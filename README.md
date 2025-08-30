# AI-Powered Trading Assistant Chrome Extension

A Chrome extension that enhances the user experience on Yahoo Finance by providing an AI-powered assistant that can analyze trading data and execute actions based on natural language commands.

## 🚀 Features

- **Natural Language Commands**: Issue commands in plain English like "What's the current price of AAPL?" or "Show me today's performance"
- **Context-Aware Analysis**: Automatically extracts and analyzes data from Yahoo Finance pages
- **Action Execution**: Click buttons, navigate sections, highlight data, and more based on AI recommendations
- **Real-Time Data**: Works with live Yahoo Finance data including stock prices, news, and statistics
- **Multiple AI Models**: Support for GPT-3.5 Turbo, GPT-4, and GPT-4 Turbo
- **Smart Caching**: Optimized performance with intelligent data caching
- **Visual Feedback**: Highlights elements and provides smooth animations for better UX

## 📋 Requirements

- Chrome browser (version 88+)
- OpenAI API key ([Get one here](https://platform.openai.com/account/api-keys))
- Active internet connection

## 🛠 Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download the Extension**
   ```bash
   git clone <repository-url>
   cd ai-trading-assistant
   ```

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/` in Chrome
   - Enable "Developer mode" (toggle in top right)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `ai-trading-assistant` folder
   - The extension should appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "AI Trading Assistant" and pin it

### Method 2: Install from Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store after review.

## ⚙️ Setup

1. **Get OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/account/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Configure Extension**
   - Click the extension icon in Chrome toolbar
   - Enter your OpenAI API key in the input field
   - Click "Save" - you should see "Connected" status

3. **Navigate to Yahoo Finance**
   - Go to any Yahoo Finance stock page (e.g., https://finance.yahoo.com/quote/AAPL)
   - The extension will show a green indicator when active

## 🎯 Usage

### Basic Commands

Click the extension icon and try these example commands:

- **"What is the current stock price?"** - Get current price and daily change
- **"Show me today's performance"** - Analysis of price movement and volume
- **"What are the key statistics?"** - Summary of important financial metrics
- **"Analyze the recent price trend"** - Trend analysis based on chart data

### Advanced Commands

- **"Find news about this stock"** - Extract and summarize recent news
- **"What do analysts recommend?"** - Get analyst ratings and price targets
- **"Compare this to market average"** - Context about relative performance
- **"Highlight the P/E ratio"** - Visual highlighting of specific data points
- **"Navigate to financial statements"** - Smart navigation between sections

### Quick Commands

The extension provides quick command buttons for common tasks:
- Current Price
- Today's Performance  
- Key Stats
- Price Trend

## 📖 Example Usage Scenarios

### Scenario 1: Quick Price Check
1. Navigate to `https://finance.yahoo.com/quote/TSLA`
2. Click extension icon
3. Click "Current Price" or type "What's the current price?"
4. Get instant AI analysis of price and movement

### Scenario 2: Research Analysis
1. Go to any stock quote page
2. Ask "What are the key fundamentals I should know about this stock?"
3. Get comprehensive analysis of key metrics
4. Use suggested actions to explore specific sections

### Scenario 3: News Analysis
1. On a stock page, ask "What's driving today's price movement?"
2. AI will analyze recent news and price data
3. Get insights about potential catalysts

## 🔧 Configuration Options

Access advanced settings by expanding the "Advanced Settings" section:

- **AI Model**: Choose between GPT-3.5 Turbo, GPT-4, or GPT-4 Turbo
- **Response Length**: Adjust max tokens (100-1000)
- **API Key Management**: Secure storage of your OpenAI credentials

## 🌐 Supported Websites

Currently supports:
- **Yahoo Finance** (`https://finance.yahoo.com/*`)
  - Stock quote pages
  - Chart pages
  - Financial statements
  - Profile pages
  - News sections

Additional sites may be added in future versions.

## 🔒 Security & Privacy

- **API Key Storage**: Keys are stored securely in Chrome's encrypted storage
- **Data Processing**: Stock data is sent to OpenAI for analysis but not stored
- **No Personal Data**: Extension only processes publicly available financial data
- **Local Processing**: Page analysis happens locally before sending to AI

## 🐛 Troubleshooting

### Extension Not Working

1. **Check Yahoo Finance Page**
   - Ensure you're on a Yahoo Finance stock page
   - Look for green indicator showing extension is active

2. **Verify API Key**
   - Click extension icon
   - Check connection status shows "Connected"
   - Re-enter API key if needed

3. **Clear Cache**
   - Right-click extension icon → Options
   - Clear cached data

### Common Issues

**"No API key configured"**
- Enter your OpenAI API key in extension settings

**"Rate limit exceeded"**
- Wait a moment and try again
- Consider upgrading OpenAI plan for higher limits

**"Element not found" errors**
- Yahoo Finance may have updated their layout
- Try refreshing the page and retry command

**Extension icon not visible**
- Go to `chrome://extensions/`
- Ensure extension is enabled
- Pin the extension to toolbar

## 📊 Testing Commands

To test the extension functionality, try these commands on different stocks:

### On AAPL page:
```
"What's Apple's current valuation?"
"How is AAPL performing vs the market?"
"Show me Apple's key financial metrics"
```

### On TSLA page:
```
"What's driving Tesla's price today?"
"Compare Tesla's P/E ratio to industry average"
"What are analysts saying about TSLA?"
```

### On any stock page:
```
"Should I buy this stock?"
"What are the risks I should know about?"
"Explain this company's business model"
```

## 🔄 Updates

The extension checks for updates automatically. When updates are available:
1. Chrome will download them automatically
2. Restart Chrome to apply updates
3. Check changelog for new features

## 📝 Development

### File Structure
```
ai-trading-assistant/
├── manifest.json          # Extension configuration
├── popup/                 # Extension popup interface
│   ├── popup.html         # Main UI
│   ├── popup.js           # UI logic
│   └── popup.css          # Styling
├── content/               # Content scripts
│   └── content.js         # Page interaction logic
├── background/            # Background service worker
│   └── background.js      # Background processing
├── utils/                 # Utility modules
│   ├── domExtractor.js    # Yahoo Finance DOM parsing
│   └── aiProcessor.js     # OpenAI API handling
└── icons/                 # Extension icons
```

### Local Development
1. Make changes to source files
2. Go to `chrome://extensions/`
3. Click refresh icon on the extension
4. Test changes on Yahoo Finance pages

## 🆘 Support

If you encounter issues:

1. **Check Console Logs**
   - Open Developer Tools (F12)
   - Look for error messages in Console tab

2. **Check Extension Logs**
   - Go to `chrome://extensions/`
   - Click "Details" on the extension
   - Click "Inspect views: background page"

3. **Common Solutions**
   - Refresh the Yahoo Finance page
   - Restart Chrome browser
   - Re-enter API key
   - Clear extension data

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## ⚠️ Disclaimer

This extension is for informational purposes only. It does not provide financial advice. Always do your own research and consult with financial professionals before making investment decisions.

The extension processes publicly available data from Yahoo Finance and does not have access to your personal financial information or trading accounts.

---

**Made with ❤️ for traders and investors**
