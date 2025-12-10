// ========================================
// DOM Elements
// ========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

// ========================================
// Mobile Navigation Toggle
// ========================================
function toggleNav() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

navToggle.addEventListener('click', toggleNav);

// Close mobile menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleNav();
        }
    });
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleNav();
    }
});

// ========================================
// Navbar Scroll Effect
// ========================================
let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class for styling
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}

window.addEventListener('scroll', handleScroll);

// ========================================
// Smooth Scroll for Navigation Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Contact Form Validation
// ========================================
const validators = {
    name: (value) => {
        if (!value.trim()) {
            return 'Name is required';
        }
        if (value.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        return '';
    },
    
    email: (value) => {
        if (!value.trim()) {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        return '';
    },
    
    message: (value) => {
        if (!value.trim()) {
            return 'Message is required';
        }
        if (value.trim().length < 10) {
            return 'Message must be at least 10 characters';
        }
        return '';
    }
};

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (message) {
        field.classList.add('error');
        errorElement.textContent = message;
    } else {
        field.classList.remove('error');
        errorElement.textContent = '';
    }
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const validator = validators[fieldId];
    
    if (validator) {
        const errorMessage = validator(field.value);
        showError(fieldId, errorMessage);
        return !errorMessage;
    }
    return true;
}

// Real-time validation on blur
['name', 'email', 'message'].forEach(fieldId => {
    const field = document.getElementById(fieldId);
    
    field.addEventListener('blur', () => {
        validateField(fieldId);
    });
    
    // Clear error when typing
    field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
            validateField(fieldId);
        }
    });
});

// Form submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateField('name');
    const isEmailValid = validateField('email');
    const isMessageValid = validateField('message');
    
    if (isNameValid && isEmailValid && isMessageValid) {
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = 'none';
            formSuccess.classList.add('show');
            
            // Reset form
            contactForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Hide success message after 5 seconds and show form again
            setTimeout(() => {
                formSuccess.classList.remove('show');
                contactForm.style.display = 'block';
            }, 5000);
        }, 1500);
    }
});

// ========================================
// Active Navigation Link Highlight
// ========================================
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + navbar.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    handleScroll();
    highlightActiveSection();
});





