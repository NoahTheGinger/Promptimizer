# Promptimizer ✨

![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> AI-powered prompt optimization tool that works with any OpenAI-compatible API

<p align="center">
  <img src="https://github.com/user-attachments/assets/ba6455a9-7dde-42c5-9023-53dd62047a6e" alt="Promptimizer Screenshot" width="600">
</p>

## 🚀 Overview

Promptimizer is a browser extension that helps you craft better AI prompts using AI itself. It's a floating, resizable window that works on any website and integrates with any OpenAI API-compatible service.

### Key Features

- 🧠 **AI-Powered Optimization**: Leverages AI to enhance both user and system prompts
- 🌐 **Universal Compatibility**: Works on any website
- 🔌 **API Flexibility**: Compatible with any OpenAI API-compliant service (OpenAI, NVIDIA, Groq, Mistral, etc.)
- 🎯 **Dual Prompt Types**: Optimize both user prompts and system prompts
- 📋 **One-Click Copy**: Easily copy enhanced prompts with a single click
- 🎨 **User-Friendly Interface**: Draggable, resizable window with minimalist design
- 🔐 **Secure**: Your API credentials are stored locally in your browser

## 📦 Installation

1. Install a userscript manager extension:
   - [Tampermonkey](https://www.tampermonkey.net/) (recommended)
   - [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome/Firefox/Edge)

2. Install Promptimizer by clicking on the following link:
   - [Install Promptimizer](https://github.com/noahtheginger/promptimizer/raw/main/promptimizer.user.js)

3. Confirm the installation when prompted by your userscript manager

## 🛠️ Configuration

Before using Promptimizer, you'll need to configure it with your API details:

1. Click the ✨ icon that appears in the bottom-right corner of any webpage
2. Enter the following information:
   - **API URL**: The endpoint URL (e.g., `https://api.openai.com/v1`)
   - **API Key**: Your API key
   - **Model Name**: The model you want to use (e.g., `gpt-4o`, `deepseek-r1`)
   - **Provider Name**: (Optional) For services like gpt4free

3. Click "Save Configuration"

## 🧩 How to Use

1. Navigate to any website
2. Click the ✨ icon in the bottom-right corner
3. Select the prompt type (User Prompt or System Prompt)
4. Enter your prompt in the text area
5. Click "Optimize Prompt"
6. Once optimization is complete, use the "Copy Enhanced Prompt" button to copy the result

## ✨ How It Works

Promptimizer sends your original prompt to an AI with specialized instructions for prompt engineering. The AI applies best practices derived from Anthropic's guides on effective prompting, returning an enhanced version of your prompt that is:

- More specific and detailed
- Better structured
- More likely to produce the desired results

For **User Prompts**, it improves:
- Clarity and specificity
- Parameter definition
- Multi-part request structure
- Output preferences

For **System Prompts**, it enhances:
- Role definitions
- Behavioral guidelines
- Output requirements
- Error handling procedures

## 🔄 Dragging and Resizing

- **Move**: Drag the blue header to reposition the window
- **Resize**: Use the handles on the right, bottom, or corner to resize
- **Reset**: Click the ↺ button to reset position and size

## 🔍 Example Optimizations

### User Prompt
**Before**:
```
Tell me about the future of AI
```

**After**:
```
Please provide a comprehensive analysis of the future of AI with these specific aspects:

1. Key technological developments expected in the next 5-10 years
2. Potential societal impacts across healthcare, education, and employment
3. Ethical considerations and emerging regulatory frameworks
4. Comparative analysis of optimistic vs. cautionary expert perspectives
5. Concrete examples of transformative AI applications on the horizon

Please format your response with clear headings, bullet points for key insights, and include both technical and accessible explanations where appropriate.
```

### System Prompt
**Before**:
```
You are a helpful customer service assistant
```

**After**:
```
You are a specialized customer service assistant dedicated to providing efficient, empathetic, and solution-oriented support.

Primary Responsibilities:
1. Identify customer needs quickly and accurately
2. Provide clear, step-by-step solutions to common problems
3. Maintain a consistently friendly and professional tone
4. Escalate complex issues appropriately with necessary context

Interaction Guidelines:
- Begin each interaction with a warm greeting
- Acknowledge customer concerns explicitly before offering solutions
- Use simple, jargon-free language unless technical precision is required
- Confirm customer satisfaction before concluding conversations
- Provide follow-up resources when appropriate

Knowledge Boundaries:
- Only provide information about products and services you can verify
- Clearly indicate when information may be incomplete
- Never speculate about future product releases or unannounced features

Response Structure:
1. Acknowledgment of the customer's issue
2. Concise solution or necessary questions to clarify the problem
3. Step-by-step instructions when applicable
4. Verification questions to ensure resolution
5. Closing with an offer for additional assistance

User Adaptation: Adjust your level of detail based on user technical proficiency signals in their messages.
```

## 💡 Tips for Best Results

- Be specific about what you want to optimize in your original prompt
- Provide context if your prompt is part of a larger conversation
- For system prompts, indicate the intended use case
- Review and further customize the enhanced prompts as needed

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Promptimizer:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Inspired by best practices in prompt engineering
- Built with modern browser technologies
- Special thanks to all contributors and users

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/NoahTheGinger">NoahTheGinger</a>
</p>
