// MediPulse - Gemini API Response Optimizations

// --- Enhanced API Configuration ---
function sendToOptimizedGeminiAPI(message) {
    const headers = {
        "Content-Type": "application/json"
    };
    
    // Get user's preferred response length
    const preferConcise = localStorage.getItem("medipulse_concise_responses") === "true";
    
    // Construct a more specific prompt with formatting instructions
    const promptText = `You are MediPulse, an advanced AI healthcare assistant. 
${preferConcise ? 'Provide a BRIEF and CONCISE response' : 'Respond'} to the following health-related query with accurate, helpful information.

IMPORTANT FORMATTING INSTRUCTIONS:
1. Use minimal formatting - avoid excessive asterisks (**)
2. Keep paragraphs short and focused
3. Use simple HTML tags for emphasis instead of asterisks
4. ${preferConcise ? 'Limit your response to 3-4 sentences maximum' : 'Be thorough but clear'}

Query: ${message}

Remember to include a brief medical disclaimer at the end of your response.`;
    
    const data = {
        contents: [{
            parts: [{
                text: promptText
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: preferConcise ? 256 : 1024,
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    };

    fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        hideTypingIndicator();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            let responseText = data.candidates[0].content.parts[0].text;
            
            // Post-process the response to clean up formatting
            responseText = cleanupResponseFormatting(responseText);
            
            // Add the response to chat with expand/collapse option if not concise mode
            addEnhancedMessageToChat("MediPulse", responseText, "lifeline-message", !preferConcise);
            
            // Play sound notification
            playSound("message");
            
            // Speak the response if text-to-speech is enabled
            if (localStorage.getItem("medipulse_tts_enabled") === "true") {
                speakText(responseText);
            }
        } else {
            throw new Error("Unexpected API response format");
        }
    })
    .catch(error => {
        hideTypingIndicator();
        addMessageToChat("MediPulse", `Sorry, there was an error: ${error.message}. Please try again or contact support if the issue persists.`, "lifeline-message");
        console.error("API Error:", error);
    });
}

// --- Response Formatting Cleanup ---
function cleanupResponseFormatting(text) {
    // Replace excessive asterisks with HTML formatting
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Remove any remaining asterisks used as bullet points and replace with proper HTML
    text = text.replace(/^\s*\*\s+/gm, '• ');
    
    // Clean up multiple consecutive line breaks
    text = text.replace(/\n{3,}/g, '\n\n');
    
    return text;
}

// --- Enhanced Message Display with Toggle ---
function addEnhancedMessageToChat(sender, message, className, allowToggle = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${className}`;
    
    const senderSpan = document.createElement("strong");
    senderSpan.textContent = sender + ": ";
    
    const messageSpan = document.createElement("span");
    messageSpan.className = "message-content";
    
    // If toggle is allowed, create a summarized version
    if (allowToggle) {
        // Create a summarized version (first paragraph or ~100 chars)
        const fullMessage = message;
        let summaryMessage = message;
        
        // Get first paragraph or first 100 chars + ellipsis
        const firstParagraphMatch = message.match(/^(.*?)(\n|$)/);
        if (firstParagraphMatch && firstParagraphMatch[1]) {
            summaryMessage = firstParagraphMatch[1];
            if (summaryMessage.length > 100) {
                summaryMessage = summaryMessage.substring(0, 100) + "...";
            }
        } else if (message.length > 100) {
            summaryMessage = message.substring(0, 100) + "...";
        }
        
        // Add toggle button
        const toggleButton = document.createElement("button");
        toggleButton.className = "toggle-message";
        toggleButton.textContent = "Show More";
        toggleButton.setAttribute("aria-expanded", "false");
        
        // Set initial content to summary
        messageSpan.innerHTML = summaryMessage;
        messageSpan.setAttribute("data-full", fullMessage);
        messageSpan.setAttribute("data-summary", summaryMessage);
        
        // Add toggle functionality
        toggleButton.addEventListener("click", function() {
            const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
            if (isExpanded) {
                messageSpan.innerHTML = messageSpan.getAttribute("data-summary");
                toggleButton.textContent = "Show More";
                toggleButton.setAttribute("aria-expanded", "false");
            } else {
                messageSpan.innerHTML = messageSpan.getAttribute("data-full");
                toggleButton.textContent = "Show Less";
                toggleButton.setAttribute("aria-expanded", "true");
            }
            playSound("click");
        });
        
        messageDiv.appendChild(senderSpan);
        messageDiv.appendChild(messageSpan);
        messageDiv.appendChild(toggleButton);
    } else {
        // No toggle needed, just show the full message
        messageSpan.innerHTML = message;
        messageDiv.appendChild(senderSpan);
        messageDiv.appendChild(messageSpan);
    }
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Save to chat history
    chatHistory.push({ 
        sender, 
        message, 
        className,
        hasToggle: allowToggle
    });
    saveChatHistory();
}

// --- Settings for Response Length Preference ---
function addResponseLengthToggle() {
    // Add to settings modal
    const settingsContent = document.querySelector("#settings-modal .modal-content");
    
    const responseToggleDiv = document.createElement("div");
    responseToggleDiv.className = "settings-group";
    responseToggleDiv.innerHTML = `
        <h3>Response Length</h3>
        <div class="toggle-container">
            <label class="toggle">
                <input type="checkbox" id="concise-responses-toggle">
                <span class="toggle-slider"></span>
            </label>
            <span>Prefer concise responses</span>
        </div>
        <p class="setting-description">When enabled, MediPulse will provide shorter, more direct responses.</p>
    `;
    
    // Insert before the last button
    const lastButton = settingsContent.querySelector(".form-submit");
    settingsContent.insertBefore(responseToggleDiv, lastButton);
    
    // Initialize toggle state
    const conciseToggle = document.getElementById("concise-responses-toggle");
    conciseToggle.checked = localStorage.getItem("medipulse_concise_responses") === "true";
    
    // Add event listener
    conciseToggle.addEventListener("change", (e) => {
        localStorage.setItem("medipulse_concise_responses", e.target.checked);
        playSound("click");
    });
}

// --- Initialize Response Optimizations ---
function initializeResponseOptimizations() {
    // Set default preference if not already set
    if (localStorage.getItem("medipulse_concise_responses") === null) {
        localStorage.setItem("medipulse_concise_responses", "false");
    }
    
    // Add settings toggle
    addResponseLengthToggle();
    
    // Replace the original sendToGeminiAPI function
    window.sendToGeminiAPI = sendToOptimizedGeminiAPI;
    
    console.log("Gemini API response optimizations initialized");
}

// Call initialization when the script is loaded
document.addEventListener("DOMContentLoaded", () => {
    initializeResponseOptimizations();
});
