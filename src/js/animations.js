/**
 * Fluxos Smart - Animations JavaScript
 * Author: Fluxos Smart Team
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.benefit-card, .solution-card, .step-card, .testimonial-card, .calculator-container, .info-card, .client-logo');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    // Run on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Animate counter numbers
    const animateCounters = function() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    };
    
    // Trigger counter animation when element is in view
    const counterSection = document.querySelector('.benefits-section');
    
    if (counterSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counterSection);
    }
    
    // Add animation classes to CSS
    const style = document.createElement('style');
    style.textContent = `
        .benefit-card, .solution-card, .step-card, .testimonial-card, .calculator-container, .info-card, .client-logo {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .benefit-card.animate, .solution-card.animate, .step-card.animate, .testimonial-card.animate, .calculator-container.animate, .info-card.animate, .client-logo.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .benefit-card:nth-child(2), .solution-card:nth-child(2), .step-card:nth-child(2), .info-card:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .benefit-card:nth-child(3), .solution-card:nth-child(3), .step-card:nth-child(3), .info-card:nth-child(3) {
            transition-delay: 0.4s;
        }
        
        .solution-card:nth-child(4), .step-card:nth-child(4) {
            transition-delay: 0.6s;
        }
        
        .client-logo:nth-child(1) { transition-delay: 0.1s; }
        .client-logo:nth-child(2) { transition-delay: 0.2s; }
        .client-logo:nth-child(3) { transition-delay: 0.3s; }
        .client-logo:nth-child(4) { transition-delay: 0.4s; }
        .client-logo:nth-child(5) { transition-delay: 0.5s; }
        .client-logo:nth-child(6) { transition-delay: 0.6s; }
    `;
    
    document.head.appendChild(style);
});