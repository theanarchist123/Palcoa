// Main script file for Bayleaf Salon website

// Document ready function to ensure DOM is loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Activate menu toggle for mobile navigation
    const menuToggle = document.querySelector('.menuToggle');
    const header = document.querySelector('header');
    const section = document.querySelector('section');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            header.classList.toggle('active');
            if (section) {
                section.classList.toggle('active');
            }
        });
    }
    
    // Image slider functionality for services page
    let currentSlide = 0;
    const slides = document.querySelectorAll('.imgslider .slide');
    
    // Initialize slider if slides exist
    if (slides && slides.length > 0) {
        // Hide all slides except the first one
        for (let i = 1; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }
        
        // Auto slide change
        setInterval(function() {
            goNext();
        }, 5000);
    }
    
    // Functions for slider navigation
    window.goPrev = function() {
        if (slides && slides.length > 0) {
            slides[currentSlide].style.display = 'none';
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            slides[currentSlide].style.display = 'block';
        }
    };
    
    window.goNext = function() {
        if (slides && slides.length > 0) {
            slides[currentSlide].style.display = 'none';
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].style.display = 'block';
        }
    };
    
    // Set random notification count for the notification badge on index page
    const notificationCount = document.getElementById('notification-count');
    if (notificationCount) {
        // Generate a random number between 1 and 5 for notifications
        notificationCount.textContent = Math.floor(Math.random() * 5) + 1;
    }

    // Start the image iteration for the fourIMG section
    iterateImages();
});

// Add profile loading and error handling functionality
async function loadUserProfile() {
    const loadingIndicator = document.getElementById('profileLoadingIndicator');
    const profileError = document.getElementById('profileError');
    const profileContent = document.getElementById('profileContent');

    try {
        loadingIndicator.style.display = 'block';
        profileError.style.display = 'none';
        profileContent.style.opacity = '0.5';

        const response = await fetch('/api/user/profile', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to load profile');
        }

        const userData = await response.json();
        updateProfileUI(userData);
        
    } catch (error) {
        profileError.style.display = 'block';
        console.error('Error loading profile:', error);
    } finally {
        loadingIndicator.style.display = 'none';
        profileContent.style.opacity = '1';
    }
}

function updateProfileUI(userData) {
    // Update form fields with user data
    const fields = ['name', 'email', 'phone'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element && userData[field]) {
            element.value = userData[field];
        }
    });
}

// Initialize profile if on profile page
if (window.location.pathname.includes('profile.html')) {
    loadUserProfile();
}

function iterateImages() {
    const imageContainer = document.querySelector('.fourIMG');
    if (!imageContainer) return;

    const images = imageContainer.querySelectorAll('img');
    const imageUrls = [
        './img/hulk.jpg',
        './img/home-model2.jpg',
        './img/home-model3.jpg',
        './img/home-model4.jpg',
        // Add more image URLs from your img directory if needed
    ];
    
    let currentIndex = imageUrls.length;
    
    setInterval(() => {
        images.forEach((img, index) => {
            currentIndex = (currentIndex + 1) % imageUrls.length;
            const nextUrl = imageUrls[(index + currentIndex) % imageUrls.length];
            
            // Create a fade effect
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = nextUrl;
                img.style.opacity = '1';
            }, 500);
        });
    }, 3000); // Change images every 3 seconds
}

// Add CSS for smooth transitions
const style = document.createElement('style');
style.textContent = `
    .fourIMG img {
        transition: opacity 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);