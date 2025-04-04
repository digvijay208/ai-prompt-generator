document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const promptForm = document.getElementById('promptForm');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const generatedPrompt = document.getElementById('generatedPrompt');
    const currentYearSpan = document.getElementById('currentYear');
    
    // Set current year in footer
    currentYearSpan.textContent = new Date().getFullYear();
    
    // Disable copy button initially
    copyBtn.disabled = true;
    
    // Event listeners
    promptForm.addEventListener('submit', handleFormSubmit);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Add input event listeners for real-time validation
    document.getElementById('purpose').addEventListener('change', validateForm);
    document.getElementById('subject').addEventListener('input', validateForm);
    document.getElementById('details').addEventListener('input', validateForm);
    
    // Generate prompt when form is submitted
    function handleFormSubmit(e) {
        e.preventDefault();
        generatePrompt();
    }
    
    // Validate form inputs
    function validateForm() {
        const purpose = document.getElementById('purpose').value;
        const subject = document.getElementById('subject').value.trim();
        const details = document.getElementById('details').value.trim();
        
        // Enable button only if we have a purpose and either subject or details
        const isValid = purpose && (subject || details);
        generateBtn.disabled = !isValid;
        
        return isValid;
    }
    
    // Generate AI prompt based on form inputs
    function generatePrompt() {
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="spinner"></span> Generating...';
        
        // Get form values
        const purpose = document.getElementById('purpose').value;
        const subject = document.getElementById('subject').value.trim();
        const details = document.getElementById('details').value.trim();
        const tone = document.getElementById('tone').value;
        const examples = document.getElementById('examples').checked;
        const stepByStep = document.getElementById('stepbystep').checked;
        const sources = document.getElementById('sources').checked;
        const format = document.getElementById('format').value;
        
        // Validate required fields
        if (!purpose) {
            showError("Please select what you want the AI to do");
            resetGenerateButton();
            return;
        }
        
        if (!subject && !details) {
            showError("Please provide at least a subject or some details");
            resetGenerateButton();
            return;
        }
        
        // Add slight delay to simulate processing
        setTimeout(() => {
            // Generate the prompt
            let prompt = buildPrompt({
                purpose,
                subject,
                details,
                tone,
                examples,
                stepByStep,
                sources,
                format
            });
            
            // Display the generated prompt
            generatedPrompt.textContent = prompt;
            copyBtn.disabled = false;
            
            // Scroll to result on mobile
            if (window.innerWidth < 768) {
                document.querySelector('.result-panel').scrollIntoView({ behavior: 'smooth' });
            }
            
            // Reset generate button
            resetGenerateButton();
        }, 500);
    }
    
    // Build prompt string from parameters
    function buildPrompt(params) {
        const { purpose, subject, details, tone, examples, stepByStep, sources, format } = params;
        
        const purposePhrases = {
            answer: `answer a question about ${subject || 'this topic'}`,
            generate: `generate content about ${subject || 'this topic'}`,
            analyze: `analyze data or information about ${subject || 'this topic'}`,
            summarize: `summarize information about ${subject || 'this topic'}`,
            translate: `translate content about ${subject || 'this topic'}`,
            code: `write code related to ${subject || 'this topic'}`,
            creative: `create creative writing about ${subject || 'this topic'}`,
            other: `help me with ${subject || 'this request'}`
        };
        
        const formatInstructions = {
            paragraph: "well-structured paragraphs",
            bullet: "bullet points",
            table: "a table when possible",
            markdown: "markdown with appropriate headings and formatting",
            json: "JSON if applicable"
        };
        
        let promptParts = [
            `I want you to ${purposePhrases[purpose]}.`,
            details && `Here are the specific details: ${details}.`,
            `Please respond in a ${tone} tone.`,
            examples && "Include relevant examples where appropriate.",
            stepByStep && "Provide a step-by-step explanation or process.",
            sources && "Cite credible sources to support your response.",
            `Format your response in ${formatInstructions[format]}.`,
            "Ensure your response is comprehensive, accurate, and tailored to my request."
        ];
        
        // Filter out empty parts and join with spaces
        return promptParts.filter(Boolean).join(' ');
    }
    
    // Copy generated prompt to clipboard
    async function copyToClipboard() {
        const promptText = generatedPrompt.textContent;
        
        try {
            // Try using the Clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(promptText);
                showCopySuccess();
            } else {
                // Fallback for mobile or non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = promptText;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (successful) {
                    showCopySuccess();
                } else {
                    showError("Failed to copy text. Please try again or select and copy manually.");
                }
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showError("Failed to copy text. Please try again or select and copy manually.");
        }
    }
    
    // Show copy success message
    function showCopySuccess() {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        copyBtn.classList.add("copied");
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove("copied");
        }, 2000);
    }
    
    // Show error message in the prompt display area
    function showError(message) {
        generatedPrompt.textContent = message;
        generatedPrompt.classList.add("error-message");
        
        setTimeout(() => {
            generatedPrompt.classList.remove("error-message");
        }, 3000);
    }
    
    // Reset generate button to its initial state
    function resetGenerateButton() {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Prompt';
        validateForm();
    }
    
    // Initialize app
    function init() {
        // Add form validation on page load
        validateForm();
        
        // Add example tooltips for each purpose
        setupPurposeGuidance();
    }
    
    // Add purpose guidance tooltips
    function setupPurposeGuidance() {
        const purposeSelect = document.getElementById('purpose');
        const purposeHint = document.createElement('div');
        purposeHint.className = 'form-hint';
        purposeHint.id = 'purposeHint';
        purposeSelect.parentNode.appendChild(purposeHint);
        
        purposeSelect.addEventListener('change', function() {
            const purposeHints = {
                "answer": "Best for factual questions that have specific answers",
                "generate": "Ideal for creating content like articles, essays, or descriptions",
                "analyze": "Good for examining data, trends, or complex topics",
                "summarize": "Perfect for condensing longer text into key points",
                "translate": "Use when you need content converted to another language",
                "code": "For programming tasks, debugging, or code explanation",
                "creative": "Best for stories, poems, or creative content generation",
                "other": "For any requests that don't fit the other categories"
            };
            
            if (this.value && purposeHints[this.value]) {
                purposeHint.textContent = purposeHints[this.value];
                purposeHint.style.display = 'block';
            } else {
                purposeHint.style.display = 'none';
            }
        });
    }
    
    // Handle offline status
    window.addEventListener('online', function() {
        document.body.classList.remove('offline');
    });
    
    window.addEventListener('offline', function() {
        document.body.classList.add('offline');
        showError("You're offline. Some features may not work properly.");
    });
    
    // Initialize the app
    init();
});