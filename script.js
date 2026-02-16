document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Show logout button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
    
    // DOM Elements
    const promptForm = document.getElementById('promptForm');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const generatedPrompt = document.getElementById('generatedPrompt');
    const currentYearSpan = document.getElementById('currentYear');
    
    // Sidebar functionality
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const hideSidebarBtn = document.getElementById('hideSidebarBtn');
    const mainContent = document.querySelector('.main-content');
    const newChatBtn = document.getElementById('newChatBtn');
    const historyList = document.getElementById('historyList');
    
    sidebarToggle.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('open');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
            sidebarToggle.classList.remove('visible');
        }
    });
    
    hideSidebarBtn.addEventListener('click', () => {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
        sidebarToggle.classList.add('visible');
    });
    
    newChatBtn.addEventListener('click', () => {
        clearForm();
        generatedPrompt.textContent = 'Your custom prompt will appear here...';
        copyBtn.disabled = true;
    });
    
    // Load prompt history
    loadPromptHistory();
    
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
    async function generatePrompt() {
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="spinner"></span> Generating & Refining...';
        
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
        
        try {
            // Generate the initial prompt
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
            
            // Refine with AI
            const token = localStorage.getItem('token');
            const response = await fetch('/api/refine-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userPrompt: prompt })
            });
            
            if (response.ok) {
                const data = await response.json();
                prompt = data.refinedPrompt;
            }
            
            // Display the refined prompt
            generatedPrompt.textContent = prompt;
            copyBtn.disabled = false;
            
            // Save to history
            saveToHistory(prompt, { purpose, subject, details });
            
            // Scroll to result on mobile
            if (window.innerWidth < 768) {
                document.querySelector('.result-panel').scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error generating prompt:', error);
            showError('Error generating prompt. Please try again.');
        } finally {
            // Reset generate button
            resetGenerateButton();
        }
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
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target) && 
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
    
    // Prompt history functions
    async function saveToHistory(prompt, metadata) {
        const token = localStorage.getItem('token');
        const preview = generatePreview(metadata);
        
        try {
            await fetch('/api/save-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prompt, metadata, preview })
            });
            
            loadPromptHistory();
        } catch (error) {
            console.error('Error saving prompt:', error);
        }
    }
    
    function generatePreview(metadata) {
        const { purpose, subject, details } = metadata;
        if (subject) {
            return `${purpose}: ${subject}`.substring(0, 50) + (subject.length > 40 ? '...' : '');
        }
        return `${purpose}: ${details}`.substring(0, 50) + (details.length > 40 ? '...' : '');
    }
    
    async function loadPromptHistory() {
        const token = localStorage.getItem('token');
        historyList.innerHTML = '<div style="color: #666; font-size: 14px; padding: 10px;">Loading...</div>';
        
        try {
            const response = await fetch('/api/prompt-history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const history = await response.json();
            historyList.innerHTML = '';
            
            if (history.length === 0) {
                historyList.innerHTML = '<div style="color: #666; font-size: 14px; padding: 10px;">No prompts yet</div>';
                return;
            }
            
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item-wrapper';
                
                const historyBtn = document.createElement('button');
                historyBtn.className = 'history-item';
                historyBtn.textContent = item.preview;
                historyBtn.title = item.prompt;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '&times;';
                deleteBtn.title = 'Delete';
                
                historyBtn.addEventListener('click', () => {
                    generatedPrompt.textContent = item.prompt;
                    copyBtn.disabled = false;
                    
                    document.querySelectorAll('.history-item').forEach(btn => btn.classList.remove('active'));
                    historyBtn.classList.add('active');
                    
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('open');
                    }
                });
                
                deleteBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('Delete this prompt?')) {
                        await deletePrompt(item._id);
                    }
                });
                
                historyItem.appendChild(historyBtn);
                historyItem.appendChild(deleteBtn);
                historyList.appendChild(historyItem);
            });
        } catch (error) {
            console.error('Error loading history:', error);
            historyList.innerHTML = '<div style="color: #666; font-size: 14px; padding: 10px;">Error loading history</div>';
        }
    }
    
    async function deletePrompt(promptId) {
        const token = localStorage.getItem('token');
        try {
            await fetch(`/api/prompt-history/${promptId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            loadPromptHistory();
        } catch (error) {
            console.error('Error deleting prompt:', error);
        }
    }
    
    function clearForm() {
        document.getElementById('purpose').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('details').value = '';
        document.getElementById('tone').value = 'professional';
        document.getElementById('format').value = 'paragraph';
        document.getElementById('examples').checked = true;
        document.getElementById('stepbystep').checked = false;
        document.getElementById('sources').checked = false;
        
        // Remove active state from history items
        document.querySelectorAll('.history-item').forEach(btn => btn.classList.remove('active'));
    }
    
    // Initialize the app
    init();
});