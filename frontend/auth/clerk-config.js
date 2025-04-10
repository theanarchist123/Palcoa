// Make sure this is your actual publishable key from Clerk dashboard
const clerkPublishableKey = 'pk_test_cmVmaW5lZC1nb3NoYXdrLTM1LmNsZXJrLmFjY291bnRzLmRldiQ';

// Wait for Clerk to load
document.addEventListener('DOMContentLoaded', function() {
    if (window.Clerk) {
        initClerk();
    } else {
        console.error('Clerk not loaded');
    }
});

async function initClerk() {
    try {
        await window.Clerk.load({
            publishableKey: clerkPublishableKey
        });
        
        // Check if user is already signed in
        const user = window.Clerk.user;
        if (user) {
            updateNavigation(user);
        }

        // Listen for auth changes
        window.Clerk.addListener(({ user }) => {
            if (user) {
                updateNavigation(user);
            } else {
                resetNavigation();
            }
        });

    } catch (error) {
        console.error('Error initializing Clerk:', error);
    }
}

function updateNavigation(user) {
    const loginLink = document.querySelector('nav ul li a[onclick="handleSignIn(event)"]');
    if (loginLink) {
        const li = loginLink.parentElement;
        li.innerHTML = `
            <div class="user-profile-menu">
                <img src="${user.imageUrl || './img/default-avatar.png'}" alt="Profile" class="profile-image">
                <span>${user.firstName || 'User'}</span>
                <div class="dropdown-menu">
                    <a href="javascript:void(0)" onclick="handleSignOut()">Sign Out</a>
                    <a href="javascript:void(0)" onclick="handleProfile()">Profile</a>
                </div>
            </div>
        `;
    }
}

function resetNavigation() {
    const userProfileMenu = document.querySelector('.user-profile-menu');
    if (userProfileMenu) {
        const li = userProfileMenu.parentElement;
        li.innerHTML = '<a href="javascript:void(0)" onclick="handleSignIn(event)">LOGIN</a>';
    }
}

async function handleSignIn(event) {
    if (event) {
        event.preventDefault();
    }

    try {
        await window.Clerk.openSignIn({
            appearance: {
                elements: {
                    formButtonPrimary: 'clerk-button',
                    footerActionLink: 'clerk-link'
                }
            },
            // Redirect to the same page after sign in
            afterSignInUrl: window.location.href,
            // Enable sign up
            signUpUrl: window.location.href,
            // Additional fields for sign up
            additionalSignUpFields: [{
                type: 'text',
                name: 'phoneNumber',
                label: 'Phone Number',
                placeholder: 'Enter your phone number',
                required: true
            }]
        });
    } catch (error) {
        console.error('Error during sign in:', error);
    }
}

async function handleSignOut() {
    try {
        await window.Clerk.signOut();
        // Reload the page after sign out
        window.location.reload();
    } catch (error) {
        console.error('Error during sign out:', error);
    }
}

function handleProfile() {
    window.Clerk.openUserProfile();
}

// Make functions globally available
window.handleSignIn = handleSignIn;
window.handleSignOut = handleSignOut;
window.handleProfile = handleProfile;

