// Check for logout parameter
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('logout')) {
    localStorage.removeItem('token');
    window.history.replaceState({}, document.title, window.location.pathname);
}

// Check if user is already logged in
const token = localStorage.getItem('token');
if (token) {
    window.location.href = 'index.html';
}

let isLogin = true;

function setupToggle() {
    const toggleLink = document.getElementById('toggleLink');
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isLogin = !isLogin;
        
        const authTitle = document.getElementById('authTitle');
        const authBtn = document.getElementById('authBtn');
        
        if (isLogin) {
            authTitle.textContent = 'Welcome Back';
            authBtn.textContent = 'Sign In';
            document.querySelector('.toggle-auth p').innerHTML = `Don't have an account? <a href="#" id="toggleLink">Create one</a>`;
        } else {
            authTitle.textContent = 'Create Account';
            authBtn.textContent = 'Sign Up';
            document.querySelector('.toggle-auth p').innerHTML = `Already have an account? <a href="#" id="toggleLink">Sign in</a>`;
        }
        
        setupToggle();
    });
}

setupToggle();

const authForm = document.getElementById('authForm');

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const authBtn = document.getElementById('authBtn');
    const originalText = authBtn.textContent;
    
    // Show loading state
    authBtn.textContent = 'Please wait...';
    authBtn.disabled = true;
    document.querySelector('.auth-container').classList.add('loading');
    
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authBtn.textContent = 'Success! Redirecting...';
            localStorage.setItem('token', data.token);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        authBtn.textContent = originalText;
        authBtn.disabled = false;
        document.querySelector('.auth-container').classList.remove('loading');
        alert(error.message || 'Connection error - make sure server is running');
    }
});