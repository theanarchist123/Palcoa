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
}); 