function switchForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (formType === 'signup') {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    } else {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

// Using XOR encryption
function encryptPassword(password) {
    const key = 'secretkey';
    let encrypted = '';
    for (let i = 0; i < password.length; i++) {
        encrypted += String.fromCharCode(password.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(encrypted); // Convert to base64
}

function decryptPassword(encryptedPassword) {
    const key = 'secretkey';
    const decrypted = atob(encryptedPassword); // Convert from base64
    let original = '';
    for (let i = 0; i < decrypted.length; i++) {
        original += String.fromCharCode(decrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return original;
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
    handleAuth(username, password, 'login');
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
    const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;
    
    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    if (password.length < 8 || password.length > 20) {
        alert("Password must be between 8 and 20 characters long!");
        return;
    }
    
    handleAuth(username, password, 'signup');
});

function handleAuth(username, password, action) {
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (action === 'login') {
        if (users[username] && decryptPassword(users[username]) === password) {
            alert('Login successful!');
            localStorage.setItem('currentUser', username);
            window.location.href = 'game.html'; // Redirect to game page
        } else {
            alert('Incorrect username or password!');
        }
    } else {
        if (users[username]) {
            alert('Username already exists!');
        } else {
            users[username] = encryptPassword(password);
            localStorage.setItem('users', JSON.stringify(users));
            alert('Signup successful! You can now login.');
            switchForm('login');
        }
    }
}