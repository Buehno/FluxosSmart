/**
 * Fluxos Smart - Main JavaScript
 * Author: Fluxos Smart Team
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Testimonial slider
    const testimonials = document.querySelectorAll('.testimonial-card');
    const testimonialControls = document.querySelectorAll('.testimonial-control');
    let currentTestimonial = 0;
    
    if (testimonialControls.length > 0) {
        testimonialControls.forEach(control => {
            control.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                showTestimonial(index);
            });
        });
        
        // Auto-rotate testimonials
        setInterval(function() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        testimonialControls.forEach(control => control.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        testimonialControls[index].classList.add('active');
        currentTestimonial = index;
    }
    
    // ROI Calculator
    const processVolume = document.getElementById('process-volume');
    const timeSpent = document.getElementById('time-spent');
    const volumeDisplay = document.getElementById('volume-display');
    const timeDisplay = document.getElementById('time-display');
    const savingsResult = document.getElementById('savings-result');
    const processType = document.getElementById('process-type');
    
    if (processVolume && timeSpent) {
        processVolume.addEventListener('input', updateCalculator);
        timeSpent.addEventListener('input', updateCalculator);
        processType.addEventListener('change', updateCalculator);
        
        // Initial calculation
        updateCalculator();
    }
    
    function updateCalculator() {
        const volume = parseInt(processVolume.value);
        const time = parseInt(timeSpent.value);
        const type = processType.value;
        
        // Update displays
        volumeDisplay.textContent = volume;
        timeDisplay.textContent = time;
        
        // Calculate savings (simplified formula)
        // Assuming average hourly cost of R$50 for an employee
        const hourlyRate = 50;
        const efficiencyFactor = getEfficiencyFactor(type);
        const monthlyHours = (volume * time / 60);
        const monthlySavings = monthlyHours * hourlyRate * efficiencyFactor;
        
        // Update result
        savingsResult.textContent = `R$ ${monthlySavings.toLocaleString('pt-BR', {maximumFractionDigits: 2})}/mês`;
    }
    
    function getEfficiencyFactor(processType) {
        // Different processes have different efficiency gains
        const factors = {
            'atendimento': 0.7,  // 70% reduction in time
            'documentos': 0.85,  // 85% reduction in time
            'agendamento': 0.6,  // 60% reduction in time
            'relatorios': 0.9    // 90% reduction in time
        };
        
        return factors[processType] || 0.75; // Default to 75% if not found
    }
    
    // Video Modal
    const openVideoBtn = document.getElementById('open-video');
    const videoModal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');
    const videoIframe = document.querySelector('.video-container iframe');
    
    if (openVideoBtn && videoModal) {
        openVideoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            videoModal.classList.add('active');
            // Set video source only when modal is opened (performance optimization)
            videoIframe.setAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ'); // Replace with your actual video
            document.body.style.overflow = 'hidden';
        });
        
        closeModal.addEventListener('click', function() {
            videoModal.classList.remove('active');
            // Remove video source when modal is closed
            videoIframe.setAttribute('src', '');
            document.body.style.overflow = '';
        });
        
        // Close modal when clicking outside content
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeModal.click();
            }
        });
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.parentElement;
                faqItem.classList.toggle('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    // Scroll to element
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for header height
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});