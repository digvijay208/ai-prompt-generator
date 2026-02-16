const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
}

async function checkAdmin() {
    try {
        const res = await fetch('/api/admin/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            alert('Access denied. Admin only.');
            window.location.href = 'index.html';
        }
    } catch (error) {
        alert('Error verifying admin access');
        window.location.href = 'index.html';
    }
}

async function loadStats() {
    try {
        const res = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        document.getElementById('totalUsers').textContent = data.totalUsers;
        document.getElementById('totalPrompts').textContent = data.totalPrompts;
        document.getElementById('activeToday').textContent = data.activeToday;
        document.getElementById('promptsToday').textContent = data.promptsToday;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadUsers() {
    try {
        const res = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const users = await res.json();
        
        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.email}</td>
                <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                <td>${u.promptCount}</td>
                <td>${u.lastActivity ? new Date(u.lastActivity).toLocaleString() : 'Never'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadActivity() {
    try {
        const res = await fetch('/api/admin/activity', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const activities = await res.json();
        
        const list = document.getElementById('activityList');
        if (activities.length === 0) {
            list.innerHTML = '<p style="color: #999;">No activity yet</p>';
            return;
        }
        
        list.innerHTML = activities.map(a => `
            <div class="activity-item">
                <div class="activity-time">${new Date(a.timestamp).toLocaleString()}</div>
                <div class="activity-text"><strong>${a.userEmail}</strong> generated a prompt</div>
                <div class="prompt-preview">${a.preview}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading activity:', error);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

checkAdmin();
loadStats();
loadUsers();
loadActivity();
setInterval(() => {
    loadStats();
    loadActivity();
}, 30000);
