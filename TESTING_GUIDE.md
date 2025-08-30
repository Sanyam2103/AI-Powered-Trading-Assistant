# Testing Guide for AI-Powered Trading Assistant

This guide provides step-by-step instructions to test the Chrome extension on your system.

## Pre-Testing Setup

### 1. Prerequisites Check
- [ ] Chrome browser (version 88+) installed
- [ ] OpenAI API account with available credits
- [ ] Internet connection
- [ ] Developer mode enabled in Chrome

### 2. API Key Preparation
1. Visit https://platform.openai.com/account/api-keys
2. Create new API key (starts with `sk-`)
3. Copy and save the key securely
4. Ensure your OpenAI account has available credits

### 3. Test Environment Setup
- Use a clean Chrome profile for testing (optional but recommended)
- Disable other extensions that might interfere
- Ensure popup blockers are disabled for Yahoo Finance

## Installation Testing

### Step 1: Load the Extension

1. **Open Chrome Extensions**
   ```
   Navigate to: chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle "Developer mode" in top-right corner
   - Should see additional options appear

3. **Load Extension**
   - Click "Load unpacked"
   - Navigate to the extension folder
   - Select the folder containing manifest.json
   - Click "Select"

4. **Verify Installation**
   - [ ] Extension appears in extensions list
   - [ ] Extension has enabled toggle (should be ON)
   - [ ] Extension icon visible in Chrome toolbar
   - [ ] No error messages displayed

### Step 2: Pin Extension (Recommended)

1. Click puzzle piece icon in Chrome toolbar
2. Find "AI Trading Assistant" 
3. Click pin icon to add to toolbar
4. Verify icon is now visible in main toolbar

## Configuration Testing

### Step 1: Initial Setup

1. **Open Extension Popup**
   - Click the extension icon in toolbar
   - Popup should open with clean interface

2. **Check Initial State**
   - [ ] Status shows "Disconnected" (red dot)
   - [ ] API key field is empty
   - [ ] Execute button is disabled
   - [ ] All sections are visible and styled correctly

### Step 2: API Key Configuration

1. **Enter Invalid API Key**
   - Enter "test-key" 
   - Click "Save"
   - Should show error: "Invalid API key format"

2. **Enter Valid API Key**
   - Enter your actual OpenAI API key
   - Click "Save"
   - Should show "API key saved successfully!"
   - Status should change to "Connected" (green dot)

3. **Test Key Persistence**
   - Close popup
   - Reopen popup
   - API key field should show masked value (••••••••••••••••)
   - Status should remain "Connected"

## Page Interaction Testing

### Test Site 1: Apple Stock (AAPL)

1. **Navigate to Test Page**
   ```
   https://finance.yahoo.com/quote/AAPL
   ```

2. **Verify Page Recognition**
   - Look for brief green indicator in top-right
   - Open extension popup
   - Execute button should now be enabled

3. **Basic Command Testing**

   **Test 1: Current Price Command**
   - Enter: "What is the current stock price?"
   - Click "Execute"
   - Should show loading spinner
   - Should return current AAPL price and analysis
   - Response should be formatted with colors

   **Test 2: Quick Command Button**
   - Click "Current Price" quick command button
   - Should auto-fill command input
   - Click "Execute"
   - Should get similar response to manual entry

   **Test 3: Performance Analysis**
   - Enter: "How is Apple performing today?"
   - Should get analysis of price movement, volume, etc.
   - May include percentage changes and context

   **Test 4: Key Statistics**
   - Enter: "What are the key financial metrics?"
   - Should extract and explain market cap, P/E ratio, volume, etc.

### Test Site 2: Tesla Stock (TSLA)

1. **Navigate and Test**
   ```
   https://finance.yahoo.com/quote/TSLA
   ```

2. **Different Command Types**

   **News Analysis Test**
   - Enter: "What news is affecting Tesla today?"
   - Should extract recent news if available

   **Comparison Test**
   - Enter: "How does Tesla's valuation compare to other automakers?"
   - Should provide analytical comparison

   **Trend Analysis Test**
   - Enter: "What does the price trend suggest?"
   - Should analyze chart patterns and momentum

### Test Site 3: Any Other Stock

Pick another stock (e.g., Microsoft - MSFT, Google - GOOGL) and test:

1. **Complex Queries**
   - "Should I invest in this stock right now?"
   - "What are the biggest risks for this company?"
   - "Explain this company's business model"

2. **Action Commands**
   - "Show me the analyst recommendations"
   - "Navigate to the financial statements"
   - "Highlight the dividend yield"

## Error Handling Testing

### Test Invalid Scenarios

1. **No API Key**
   - Remove API key from settings
   - Try to execute command
   - Should show appropriate error message

2. **Invalid Page**
   - Navigate to non-Yahoo Finance page (e.g., google.com)
   - Try to open extension
   - Should show error about navigating to Yahoo Finance

3. **Network Issues**
   - Disable internet connection
   - Try to execute command
   - Should show network error

4. **Rate Limiting**
   - Execute many commands rapidly
   - Should handle rate limits gracefully with retry logic

## Advanced Feature Testing

### Settings Testing

1. **Model Selection**
   - Open Advanced Settings
   - Change model to GPT-4
   - Test command - should use new model
   - Verify in response metadata if available

2. **Token Limit**
   - Adjust max tokens slider
   - Test with very low setting (100 tokens)
   - Response should be shorter
   - Test with high setting (1000 tokens)
   - Response should be more detailed

### Action Execution Testing

When AI suggests actions (if implemented):

1. **Click Actions**
   - Look for action buttons in response
   - Click suggested actions
   - Verify they execute correctly on page

2. **Navigation Actions**
   - Commands like "show me the financials"
   - Should navigate or scroll to relevant sections

## Performance Testing

### Response Time Testing

1. **Measure Response Times**
   - Simple queries should respond in 3-10 seconds
   - Complex queries may take 10-30 seconds
   - Loading indicator should be visible during processing

2. **Caching Testing**
   - Ask same question twice quickly
   - Second response might be faster due to caching

3. **Multiple Tab Testing**
   - Open multiple Yahoo Finance tabs
   - Test extension in each tab
   - Should work independently in each tab

## Browser Compatibility Testing

### Chrome Versions
- Test on latest Chrome version
- Test on Chrome 88+ (minimum supported)

### Different Screen Sizes
- Test popup on different screen resolutions
- Test on laptop vs desktop displays
- Popup should remain functional and readable

## Data Accuracy Testing

### Verify AI Responses

1. **Price Accuracy**
   - Compare AI-reported prices with page display
   - Should match within reasonable real-time variance

2. **Statistical Data**
   - Cross-check reported P/E ratios, market caps, etc.
   - AI should extract accurate data from page

3. **News Relevance**
   - Verify mentioned news is actually displayed on page
   - Check that news summaries are accurate

## Troubleshooting Common Issues

### Issue: Extension Icon Not Visible
- **Solution**: Go to chrome://extensions/, ensure extension is enabled, pin to toolbar

### Issue: "No page data" Error
- **Solutions**: 
  - Refresh Yahoo Finance page
  - Wait 2-3 seconds after page loads
  - Check that URL contains "finance.yahoo.com"

### Issue: API Errors
- **Solutions**:
  - Verify API key is correct
  - Check OpenAI account has credits
  - Try again after rate limit cooldown

### Issue: Slow Responses
- **Solutions**:
  - Check internet connection
  - Try simpler queries
  - Switch to GPT-3.5 for faster responses

## Testing Checklist

### Installation ✓
- [ ] Extension loads without errors
- [ ] Icon appears in toolbar
- [ ] Popup opens correctly

### Configuration ✓
- [ ] API key validation works
- [ ] Settings persist after restart
- [ ] Connection status updates correctly

### Basic Functionality ✓
- [ ] Page recognition on Yahoo Finance
- [ ] Command input and execution
- [ ] Response display and formatting
- [ ] Quick command buttons work

### Advanced Features ✓
- [ ] Model selection works
- [ ] Token limit adjustment works
- [ ] Error handling is appropriate
- [ ] Performance is acceptable

### Cross-Page Testing ✓
- [ ] Works on different stock pages
- [ ] Handles various page layouts
- [ ] Data extraction is accurate

## Reporting Issues

If you encounter issues during testing:

1. **Collect Information**
   - Chrome version
   - Extension version
   - Error messages (screenshot)
   - Steps to reproduce
   - Expected vs actual behavior

2. **Check Console Logs**
   - Open Developer Tools (F12)
   - Look for errors in Console tab
   - Copy relevant error messages

3. **Extension Logs**
   - Go to chrome://extensions/
   - Click "Inspect views: background page"
   - Check for background script errors

## Success Criteria

The extension passes testing if:

- ✅ Installs without errors
- ✅ Recognizes Yahoo Finance pages
- ✅ Processes at least 3 different types of commands
- ✅ Returns relevant, accurate responses
- ✅ Handles errors gracefully
- ✅ Settings persist correctly
- ✅ Performance is acceptable (responses < 30 seconds)

## Next Steps After Testing

1. **Document any issues found**
2. **Test with different stocks and market conditions**
3. **Try edge cases and unusual queries**
4. **Share feedback for improvements**

Good luck with your testing! 🚀
