// ==UserScript==
// @name         Promptimizer
// @namespace    https://github.com/NoahTheGinger/Promptimizer/
// @version      1.1
// @description  AI-powered prompt optimization tool that works with OpenAI-compatible APIs
// @author       NoahTheGinger
// @match        *://*/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Styles for the UI
    GM_addStyle(`
        #promptimizer-container {
            position: fixed;
            /* Changed default position to top:20px; left:20px for more natural left/top resizing */
            top: 20px;
            left: 20px;
            width: 400px;
            height: auto; /* Let the container's height auto-adjust at the start */
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 2147483647;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: none;
            color: #000000;
            transition: width 0.2s ease, height 0.2s ease, top 0.2s ease, left 0.2s ease;
            overflow: hidden;
            min-height: 300px;
            min-width: 300px;
        }

        #promptimizer-header {
            padding: 12px;
            background: #2196F3;
            border-radius: 8px 8px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #ffffff;
        }

        #promptimizer-header-controls {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .header-button {
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            font-size: 16px;
            padding: 0;
            display: flex;
            align-items: center;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        .header-button:hover {
            opacity: 1;
        }

        #promptimizer-title {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
        }

        #promptimizer-toggle {
            position: fixed;
            /* Also changed toggle to top-left for convenience; adapt as desired */
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: #2196F3;
            border-radius: 25px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 2147483647;
            border: 2px solid rgba(255,255,255,0.2);
        }

        /* Make the container content area fill the space under the header for better resizing */
        #promptimizer-content {
            /* We’ll rely on flexible layout to keep the text area resizing well. */
            display: flex;
            flex-direction: column;
            background: #ffffff;
            overflow: hidden;
            /* Subtract height of header (48px is approximate; adjust if your header is bigger/smaller) */
            max-height: calc(100% - 48px);
        }

        /* Use a vertical scroll inside the content if it extends beyond container height: */
        .scrollable-flex {
            overflow-y: auto;
            flex: 1; /* Flexible region that takes leftover space */
            padding: 16px; /* Keep the content from brushing edges */
        }

        .promptimizer-input {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            background: #ffffff;
            color: #000000;
        }

        /* Textarea specific styles */
        textarea.promptimizer-input {
            resize: none; /* We'll handle resizing through container or auto-resizing logic */
            min-height: 100px;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            overflow-y: auto;
        }

        textarea.promptimizer-input:focus {
            border-color: #2196F3;
            box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
            outline: none;
        }

        /* Custom resize handles for the container—moved to top & left instead of bottom & right */
        .resize-handle {
            position: absolute;
            background: transparent;
            z-index: 10;
        }
        .resize-handle-left {
            cursor: ew-resize;
            width: 8px;
            height: 100%;
            left: 0;
            top: 0;
        }
        .resize-handle-top {
            cursor: ns-resize;
            height: 8px;
            width: 100%;
            top: 0;
            left: 0;
        }
        .resize-handle-corner {
            cursor: nwse-resize;
            width: 14px;
            height: 14px;
            left: 0;
            top: 0;
        }

        /* Container resize visual feedback */
        #promptimizer-container.resizing {
            transition: none;
            box-shadow: 0 2px 15px rgba(33, 150, 243, 0.4);
        }

        /* Example highlight for whichever handle is being dragged. Adjust as you like. */
        #promptimizer-container.resizing-left {
            border-left: 2px solid #2196F3;
        }
        #promptimizer-container.resizing-top {
            border-top: 2px solid #2196F3;
        }
        #promptimizer-container.resizing-corner {
            border-left: 2px solid #2196F3;
            border-top: 2px solid #2196F3;
        }

        .prompt-type-select {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #ffffff;
            color: #000000;
            font-size: 14px;
            cursor: pointer;
        }

        .prompt-type-select:focus {
            border-color: #2196F3;
            outline: none;
        }

        .input-group {
            margin-bottom: 16px;
        }

        .input-label {
            display: block;
            margin-bottom: 6px;
            color: #000000;
            font-size: 14px;
            font-weight: 500;
        }

        .promptimizer-button {
            background: #2196F3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 10px;
            width: 100%;
        }

        .promptimizer-button:hover {
            background: #1976D2;
        }

        #promptimizer-response-container {
            position: relative;
            margin-top: 16px;
        }

        #promptimizer-response {
            margin-top: 0;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 4px;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
            color: #000000;
            border: 1px solid #e9ecef;
        }

        #copy-button {
            position: absolute;
            top: 8px;
            right: 8px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 1;
        }

        #copy-button:hover {
            background: #1976D2;
        }

        #copy-button.visible {
            opacity: 1;
        }

        #copy-button.copied {
            background: #4CAF50;
        }

        .promptimizer-error {
            color: #dc3545;
            margin-top: 8px;
            font-size: 14px;
            background: #fff;
            padding: 8px;
            border-radius: 4px;
        }

        .config-section {
            margin-bottom: 15px;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }

        .config-section.collapsed {
            max-height: 40px;
        }

        .config-section.expanded {
            max-height: 300px;
        }

        .config-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 8px 0;
        }

        .config-header h3 {
            margin: 0;
            font-size: 16px;
            color: #333;
        }

        .config-toggle {
            font-size: 18px;
            color: #666;
            transition: transform 0.3s;
        }

        .config-toggle.collapsed {
            transform: rotate(-90deg);
        }

        .config-content {
            transition: opacity 0.3s;
        }

        .config-content.collapsed {
            opacity: 0;
            height: 0;
            overflow: hidden;
        }

        .config-content.expanded {
            opacity: 1;
            height: auto;
        }
    `);

    // Default dimensions and position
    const defaultDimensions = {
        width: '400px',
        height: 'auto',
        top: '20px',
        left: '20px'
    };

    // Create UI elements
    function createUI() {
        // Toggle button
        const toggle = document.createElement('div');
        toggle.id = 'promptimizer-toggle';
        toggle.innerHTML = '✨';
        toggle.title = 'Toggle Promptimizer';
        document.body.appendChild(toggle);

        // Main container
        const container = document.createElement('div');
        container.id = 'promptimizer-container';
        container.innerHTML = `
            <div id="promptimizer-header">
                <h2 id="promptimizer-title">Promptimizer</h2>
                <div id="promptimizer-header-controls">
                    <button class="header-button" id="promptimizer-reset" title="Reset UI Position and Size">↺</button>
                    <button class="header-button" id="promptimizer-minimize" title="Minimize">−</button>
                </div>
            </div>
            <!-- Note the new scrollable-flex class to hold inputs, etc. -->
            <div id="promptimizer-content">
              <div class="scrollable-flex">
                <div class="config-section expanded" id="config-section">
                    <div class="config-header" id="config-header">
                        <h3>API Configuration</h3>
                        <span class="config-toggle">▼</span>
                    </div>
                    <div class="config-content expanded">
                        <input type="text" id="api-url" class="promptimizer-input" placeholder="API URL (e.g., https://api.openai.com/v1)" />
                        <input type="password" id="api-key" class="promptimizer-input" placeholder="API Key" />
                        <input type="text" id="model-name" class="promptimizer-input" placeholder="Model name" />
                        <input type="text" id="provider-name" class="promptimizer-input" placeholder="Provider name (optional, for gpt4free)" />
                        <button id="save-config" class="promptimizer-button">Save Configuration</button>
                    </div>
                </div>
                <div class="input-group">
                    <label class="input-label" for="prompt-type">Prompt Type:</label>
                    <select id="prompt-type" class="prompt-type-select">
                        <option value="user">User Prompt</option>
                        <option value="system">System Prompt</option>
                    </select>
                </div>
                <div class="input-group">
                    <label class="input-label" for="prompt-input">Enter Your Prompt:</label>
                    <textarea id="prompt-input" class="promptimizer-input" rows="4" placeholder="Enter your prompt here..."></textarea>
                </div>
                <button id="optimize-button" class="promptimizer-button">Optimize Prompt</button>
                <div id="promptimizer-response-container">
                    <button id="copy-button" style="display: none;">Copy Enhanced Prompt</button>
                    <div id="promptimizer-response"></div>
                </div>
              </div>
            </div>
            <!-- Resizing handles moved to top & left -->
            <div class="resize-handle resize-handle-left"></div>
            <div class="resize-handle resize-handle-top"></div>
            <div class="resize-handle resize-handle-corner"></div>
        `;
        document.body.appendChild(container);

        // Make the container draggable
        makeDraggable(container);

        // Add container resizing
        makeResizable(container);

        // Load saved configuration
        loadConfiguration();

        // Event listeners
        toggle.addEventListener('click', () => {
            // Toggle the entire UI
            container.style.display = (container.style.display === 'none' ? 'block' : 'none');
        });

        document.getElementById('promptimizer-minimize').addEventListener('click', () => {
            container.style.display = 'none';
        });

        // Config section toggle
        const configHeader = document.getElementById('config-header');
        const configSection = document.getElementById('config-section');
        const configToggle = configHeader.querySelector('.config-toggle');
        const configContent = configSection.querySelector('.config-content');

        configHeader.addEventListener('click', () => {
            const isExpanded = configSection.classList.contains('expanded');

            if (isExpanded) {
                configSection.classList.remove('expanded');
                configSection.classList.add('collapsed');
                configContent.classList.remove('expanded');
                configContent.classList.add('collapsed');
                configToggle.classList.add('collapsed');
            } else {
                configSection.classList.remove('collapsed');
                configSection.classList.add('expanded');
                configContent.classList.remove('collapsed');
                configContent.classList.add('expanded');
                configToggle.classList.remove('collapsed');
            }
        });

        document.getElementById('save-config').addEventListener('click', saveConfiguration);
        document.getElementById('optimize-button').addEventListener('click', optimizePrompt);
        document.getElementById('copy-button').addEventListener('click', copyEnhancedPrompt);

        // Initialize auto-height for textarea
        const textarea = document.getElementById('prompt-input');
        if (textarea) {
            autoResizeTextarea(textarea);
            textarea.addEventListener('input', function() {
                autoResizeTextarea(this);
            });
        }
    }

    // Make an element draggable
    function makeDraggable(element) {
        const header = element.querySelector('#promptimizer-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Function to reset position and size
        function resetPosition() {
            element.style.transform = 'translate(0, 0)';
            element.style.top = defaultDimensions.top;
            element.style.left = defaultDimensions.left;
            element.style.width = defaultDimensions.width;
            element.style.height = defaultDimensions.height;
            xOffset = 0;
            yOffset = 0;

            // Reset any set textarea dimensions
            const textarea = document.getElementById('prompt-input');
            if (textarea) {
                textarea.style.height = '';
                autoResizeTextarea(textarea);
            }
        }

        // Add reset button event listener
        document.getElementById('promptimizer-reset').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag start
            resetPosition();
        });

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            // If the click was on a button in the header, don't drag
            if (e.target.closest('.header-button')) {
                return;
            }
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || e.target.closest('#promptimizer-header')) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                element.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;

            // After dropping, compute final top/left to keep container in a new position:
            const rect = element.getBoundingClientRect();
            // The transform we used is purely visual, so we remove it and set real top/left
            element.style.transform = '';
            // Snap to new absolute left/top to remain at the same visible location
            element.style.left = rect.left + 'px';
            element.style.top = rect.top + 'px';
            // Reset the offsets since transform is removed
            xOffset = 0;
            yOffset = 0;
        }

        // Initialize at default position
        resetPosition();
    }

    // Make container resizable (top, left, corner)
    function makeResizable(container) {
        const leftHandle = container.querySelector('.resize-handle-left');
        const topHandle = container.querySelector('.resize-handle-top');
        const cornerHandle = container.querySelector('.resize-handle-corner');

        let isResizing = false;
        let currentResizeType = '';
        let startX, startY, startWidth, startHeight, startTop, startLeft;

        function startResize(e, type) {
            e.preventDefault();
            e.stopPropagation();

            isResizing = true;
            currentResizeType = type;

            // Current bounding info
            const rect = container.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            startTop = rect.top;
            startLeft = rect.left;
            startX = e.clientX;
            startY = e.clientY;

            // Add visual feedback classes
            container.classList.add('resizing');
            container.classList.add(`resizing-${type}`);

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        }

        function resize(e) {
            if (!isResizing) return;

            // We’ll compute new top/left/width/height based on which handle
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newTop = startTop;
            let newLeft = startLeft;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            switch (currentResizeType) {
                case 'left':
                    newWidth = startWidth - dx;
                    newLeft = startLeft + dx;
                    break;
                case 'top':
                    newHeight = startHeight - dy;
                    newTop = startTop + dy;
                    break;
                case 'corner':
                    newWidth = startWidth - dx;
                    newHeight = startHeight - dy;
                    newLeft = startLeft + dx;
                    newTop = startTop + dy;
                    break;
            }

            // Enforce minimum dimensions
            if (newWidth < 300) {
                // If it’s going below min, readjust left so we don’t jump
                const diff = 300 - newWidth;
                newWidth = 300;
                newLeft -= (currentResizeType === 'left' || currentResizeType === 'corner') ? diff : 0;
            }
            if (newHeight < 300) {
                const diff = 300 - newHeight;
                newHeight = 300;
                newTop -= (currentResizeType === 'top' || currentResizeType === 'corner') ? diff : 0;
            }

            // Keep the container within viewport bounds if desired:
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // If the top is going above the screen, clamp it
            if (newTop < 0) {
                const overshoot = 0 - newTop;
                newTop = 0;
                // Increase height accordingly if we’re pulling from the top
                if (currentResizeType === 'top' || currentResizeType === 'corner') {
                    newHeight -= overshoot;
                }
            }
            // Similarly clamp left
            if (newLeft < 0) {
                const overshoot = 0 - newLeft;
                newLeft = 0;
                if (currentResizeType === 'left' || currentResizeType === 'corner') {
                    newWidth -= overshoot;
                }
            }
            // If the container extends beyond the right edge, clamp it
            if (newLeft + newWidth > viewportWidth) {
                newWidth = viewportWidth - newLeft;
            }
            // If the container extends beyond bottom edge, clamp it
            if (newTop + newHeight > viewportHeight) {
                newHeight = viewportHeight - newTop;
            }

            // Apply new geometry
            container.style.width = newWidth + 'px';
            container.style.height = newHeight + 'px';
            container.style.top = newTop + 'px';
            container.style.left = newLeft + 'px';
        }

        function stopResize() {
            isResizing = false;

            container.classList.remove('resizing');
            container.classList.remove(`resizing-${currentResizeType}`);

            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);

            // Re-enable transitions
            container.style.transition = 'width 0.2s ease, height 0.2s ease, top 0.2s ease, left 0.2s ease';
        }

        leftHandle.addEventListener('mousedown', (e) => startResize(e, 'left'));
        topHandle.addEventListener('mousedown', (e) => startResize(e, 'top'));
        cornerHandle.addEventListener('mousedown', (e) => startResize(e, 'corner'));
    }

    // Helper function to auto-resize textarea based on content
    function autoResizeTextarea(textarea) {
        // Save scroll position
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Reset height temporarily to get accurate scrollHeight
        textarea.style.height = 'auto';
        // Set new height based on content (with minimum)
        const newHeight = Math.max(textarea.scrollHeight, 100) + 'px';
        // Apply the new height with transition
        textarea.style.transition = 'height 0.15s ease-out';
        textarea.style.height = newHeight;
        // Restore scroll position to prevent page jump
        window.scrollTo(0, scrollTop);
    }

    // Save API configuration
    function saveConfiguration() {
        const apiUrl = document.getElementById('api-url').value;
        const apiKey = document.getElementById('api-key').value;
        const modelName = document.getElementById('model-name').value;
        const providerName = document.getElementById('provider-name').value;

        GM_setValue('apiUrl', apiUrl);
        GM_setValue('apiKey', apiKey);
        GM_setValue('modelName', modelName);
        GM_setValue('providerName', providerName);

        showResponse('Configuration saved!');
    }

    // Load saved configuration
    function loadConfiguration() {
        const apiUrl = GM_getValue('apiUrl', '');
        const apiKey = GM_getValue('apiKey', '');
        const modelName = GM_getValue('modelName', '');
        const providerName = GM_getValue('providerName', '');

        document.getElementById('api-url').value = apiUrl;
        document.getElementById('api-key').value = apiKey;
        document.getElementById('model-name').value = modelName;
        document.getElementById('provider-name').value = providerName;
    }

    // Show response or error message
    function showResponse(message, isError = false) {
        const responseDiv = document.getElementById('promptimizer-response');
        const copyButton = document.getElementById('copy-button');
        responseDiv.textContent = message;
        responseDiv.className = isError ? 'promptimizer-error' : '';

        // Show/hide copy button based on whether there's a successful response
        if (!isError && message !== 'Optimizing prompt...') {
            copyButton.style.display = 'block';
            setTimeout(() => copyButton.classList.add('visible'), 10);
        } else {
            copyButton.style.display = 'none';
            copyButton.classList.remove('visible');
        }
    }

    // Extract enhanced prompt from response
    function extractEnhancedPrompt(text) {
        const match = text.match(/<enhanced_prompt>([\s\S]*?)<\/enhanced_prompt>/);
        return match ? match[1].trim() : text;
    }

    // Copy enhanced prompt to clipboard
    function copyEnhancedPrompt() {
        const responseDiv = document.getElementById('promptimizer-response');
        const copyButton = document.getElementById('copy-button');
        const textToCopy = extractEnhancedPrompt(responseDiv.textContent);

        navigator.clipboard.writeText(textToCopy).then(() => {
            copyButton.textContent = 'Copied!';
            copyButton.classList.add('copied');
            setTimeout(() => {
                copyButton.textContent = 'Copy Enhanced Prompt';
                copyButton.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Optimize prompt using the API
    async function optimizePrompt() {
        const apiUrl = GM_getValue('apiUrl', '');
        const apiKey = GM_getValue('apiKey', '');
        const modelName = GM_getValue('modelName', '');
        const providerName = GM_getValue('providerName', '');
        const promptType = document.getElementById('prompt-type').value;
        const promptInput = document.getElementById('prompt-input').value;

        if (!apiUrl || !apiKey || !modelName) {
            showResponse('Please configure API settings first!', true);
            return;
        }

        if (!promptInput.trim()) {
            showResponse('Please enter a prompt to optimize!', true);
            return;
        }

        showResponse('Optimizing prompt...');

        const systemPrompt = `You are a specialized prompt optimization AI focused on enhancing both user prompts and system prompts for AI interactions.

<instructions>
1. You will receive prompts marked with either <user_prompt> or <system_prompt> tags
2. ALWAYS maintain the same type of prompt in your enhancement
3. NEVER engage in conversation or provide explanations
4. ONLY return the enhanced prompt within <enhanced_prompt> tags
5. Apply appropriate prompt engineering techniques based on the prompt type:

   For User Prompts:
   - Maintain conversational context and flow
   - Clarify user intent and expectations
   - Add specific parameters for the response
   - Include relevant context from prior conversation
   - Structure multi-part requests clearly

   For System Prompts:
   - Define clear roles and responsibilities
   - Establish behavioral boundaries
   - Include success criteria and constraints
   - Structure hierarchical instructions
   - Define interaction patterns
   - Specify output formats and preferences
   - Include error handling instructions
</instructions>

<examples>
<example>
<input_type>user_prompt</input_type>
<input>Thanks for your help! Can you search the web for more information about this topic?</input>
<enhanced_prompt>Please conduct a comprehensive web search on our current topic with the following parameters:
1. Focus on authoritative sources from the last 2 years
2. Include academic and expert perspectives
3. Compare and contrast different viewpoints
4. Identify emerging trends and developments
5. Extract key insights and practical applications

Format the response with:
- Main findings in bullet points
- Source citations for each major claim
- Relevance assessment for each source
- Synthesis of conflicting information
- Suggestions for further research</enhanced_prompt>
</example>

<example>
<input_type>system_prompt</input_type>
<input>You are a web search AI assistant. Your role is to help users find information.</input>
<enhanced_prompt>You are a specialized web search AI assistant designed to provide comprehensive, accurate, and well-structured information retrieval services.

Core Responsibilities:
1. Execute precise web searches based on user queries
2. Evaluate source credibility and relevance
3. Synthesize information from multiple sources
4. Present findings in clear, structured formats

Behavioral Guidelines:
- Maintain objectivity in information presentation
- Clearly distinguish between facts and interpretations
- Acknowledge information gaps or uncertainties
- Proactively suggest related topics for exploration

Output Requirements:
1. Structure all responses with:
   - Executive summary
   - Detailed findings
   - Source citations
   - Confidence levels
2. Use formatting for clarity:
   - Bullet points for key facts
   - Tables for comparisons
   - Markdown for emphasis
   - Hierarchical headings

Error Handling:
- Acknowledge when information is outdated
- Flag potential misinformation
- Suggest alternative search strategies
- Provide confidence levels for findings</enhanced_prompt>
</example>
</examples>

<success_criteria>
For User Prompts:
- Enhanced clarity and specificity
- Maintained conversation context
- Clear parameters for response
- Structured multi-part requests
- Defined output preferences

For System Prompts:
- Clear role definition
- Comprehensive behavioral guidelines
- Specific output requirements
- Error handling procedures
- Interaction patterns defined
</success_criteria>`;

        // Wrap the input with appropriate type tags
        const taggedInput = `<${promptType}_prompt>${promptInput}</${promptType}_prompt>`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: `${apiUrl}/chat/completions`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: modelName,
                ...(providerName && { provider: providerName }),
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: taggedInput
                    }
                ],
                temperature: 0.7,
                max_tokens: 16384
            }),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.error) {
                        showResponse(`Error: ${result.error.message}`, true);
                    } else if (result.choices && result.choices[0]) {
                        showResponse(result.choices[0].message.content);
                    } else {
                        showResponse('Unexpected API response format', true);
                    }
                } catch (error) {
                    showResponse(`Error processing response: ${error.message}`, true);
                }
            },
            onerror: function(error) {
                showResponse(`Network error: ${error.statusText}`, true);
            }
        });
    }

    // Initialize the UI
    createUI();
})();
