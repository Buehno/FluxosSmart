/**
 * Fluxos Smart - Main JavaScript
 * Author: Fluxos Smart Team
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function()  {
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
    
    if (processVolume && timeSpent && processType) {
        processVolume.addEventListener('input', updateCalculator);
        timeSpent.addEventListener('input', updateCalculator);
        processType.addEventListener('change', updateCalculator);
        
        // Initial calculation
        updateCalculator();
    }
    
    function updateCalculator() {
        const volume = parseInt(processVolume.value) || 0;
        const time = parseInt(timeSpent.value) || 0;
        const type = processType.value;
        
        // Atualizar displays
        volumeDisplay.textContent = volume;
        timeDisplay.textContent = time;
        
        // Cálculo mais preciso
        const hourlyRate = 45; // Custo médio por hora no Brasil
        const efficiencyFactors = {
            'atendimento': 0.75,
            'documentos': 0.85,
            'agendamento': 0.65,
            'relatorios': 0.90
        };
        
        const efficiencyFactor = efficiencyFactors[type] || 0.75;
        const monthlyHours = (volume * time / 60);
        const monthlySavings = monthlyHours * hourlyRate * efficiencyFactor;
        
        // Adicionar benefícios extras
        const extraBenefits = monthlySavings * 0.2; // 20% de benefícios indiretos
        const totalSavings = monthlySavings + extraBenefits;
        
        savingsResult.textContent = `R\$ ${totalSavings.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}/mês`;
        
        // Mostrar ROI anual
        const annualSavings = totalSavings * 12;
        const roiElement = document.getElementById('annual-roi');
        if (roiElement) {
            roiElement.textContent = `R\$ ${annualSavings.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}/ano`;
        }
    }
    
    // Video Modal
    const openVideoBtn = document.getElementById('open-video');
    const videoModal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');
    const videoIframe = document.querySelector('.video-container iframe');
    
    if (openVideoBtn && videoModal && closeModal && videoIframe) {
        openVideoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            videoModal.classList.add('active');
            // Set video source only when modal is opened (performance optimization)
            videoIframe.setAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ'); // Troque pelo seu vídeo
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
                        top: targetElement.offsetTop - 80, // Ajuste para altura do header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Lazy loading de imagens
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores antigos
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }

    // Tracking básico de eventos
    function trackEvent(eventName, data = {}) {
        // Google Analytics (se configurado)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        // Console para debug
        console.log('Event tracked:', eventName, data);
        // Enviar para seu backend (implementar depois)
        // fetch('/api/track', { method: 'POST', body: JSON.stringify({event: eventName, data}) });
    }
    
    // Melhorar formulários com validação
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const email = form.querySelector('input[type="email"]');
            const name = form.querySelector('input[name="name"]');
            
            let isValid = true;
            
            if (email && !email.value.includes('@')) {
                alert('Por favor, insira um e-mail válido');
                isValid = false;
            }
            
            if (name && name.value.length < 2) {
                alert('Por favor, insira um nome válido');
                isValid = false;
            }
            
            if (isValid) {
                // Tracking do evento
                trackEvent('form_submit', {
                    form_type: form.id || 'contact',
                    page: window.location.pathname
                });
                
                // Seu código de envio atual...
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
                
                setTimeout(() => {
                    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    form.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 2000);
            }
        });
    });
});// ADICIONE ESTAS MELHORIAS AO SEU MAIN.JS EXISTENTE

// Melhorar a calculadora ROI com mais precisão
function updateCalculator() {
    const volume = parseInt(processVolume.value);
    const time = parseInt(timeSpent.value);
    const type = processType.value;
    
    // Atualizar displays
    volumeDisplay.textContent = volume;
    timeDisplay.textContent = time;
    
    // Cálculo mais preciso baseado em dados reais do mercado brasileiro
    const hourlyRate = 45; // Custo médio por hora no Brasil (R\$)
    const efficiencyFactors = {
        'atendimento': 0.75,  // 75% de redução no tempo
        'documentos': 0.85,   // 85% de redução no tempo
        'agendamento': 0.65,  // 65% de redução no tempo
        'relatorios': 0.90    // 90% de redução no tempo
    };
    
    const efficiencyFactor = efficiencyFactors[type] || 0.75;
    const monthlyHours = (volume * time / 60);
    const monthlySavings = monthlyHours * hourlyRate * efficiencyFactor;
    
    // Adicionar benefícios extras (produtividade, qualidade, etc.)
    const extraBenefits = monthlySavings * 0.25; // 25% de benefícios indiretos
    const totalSavings = monthlySavings + extraBenefits;
    
    // Atualizar resultado mensal
    savingsResult.textContent = `R\$ ${totalSavings.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}/mês`;
    
    // Mostrar ROI anual
    const annualSavings = totalSavings * 12;
    const roiElement = document.getElementById('annual-roi');
    if (roiElement) {
        roiElement.textContent = `R\$ ${annualSavings.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}/ano`;
    }
    
    // Tracking do uso da calculadora
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculator_calculation', {
            'event_category': 'engagement',
            'process_type': type,
            'volume': volume,
            'time': time,
            'estimated_savings': totalSavings
        });
    }
}

// Melhorar validação de formulários
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação mais robusta
        const email = form.querySelector('input[type="email"]');
        const name = form.querySelector('input[name="name"], input[name="nome"]');
        const phone = form.querySelector('input[type="tel"], input[name="telefone"], input[name="phone"]');
        
        let isValid = true;
        let errors = [];
        
        // Validar email
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value || !emailRegex.test(email.value)) {
                errors.push('Por favor, insira um e-mail válido');
                isValid = false;
            }
        }
        
        // Validar nome
        if (name) {
            if (!name.value || name.value.trim().length < 2) {
                errors.push('Por favor, insira um nome válido (mínimo 2 caracteres)');
                isValid = false;
            }
        }
        
        // Validar telefone
        if (phone) {
            const phoneRegex = /^(\(?\d{2}\)?\s?)?(\d{4,5})-?(\d{4})$/;
            if (!phone.value || !phoneRegex.test(phone.value.replace(/\D/g, ''))) {
                errors.push('Por favor, insira um telefone válido');
                isValid = false;
            }
        }
        
        if (isValid) {
            // Tracking do evento
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit_success', {
                    'event_category': 'conversion',
                    'form_type': form.id || 'contact',
                    'page': window.location.pathname
                });
            }
            
            // Envio do formulário
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simular envio (substitua por integração real)
            setTimeout(() => {
                // Mostrar mensagem de sucesso
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-icon">✅</div>
                    <h3>Mensagem enviada com sucesso!</h3>
                    <p>Nossa equipe entrará em contato em breve.</p>
                `;
                
                form.style.display = 'none';
                form.parentNode.insertBefore(successMessage, form);
                
                // Tracking de conversão
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead');
                }
                
                // Reset após 5 segundos
                setTimeout(() => {
                    form.style.display = 'block';
                    successMessage.remove();
                    form.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 5000);
                
            }, 2000);
        } else {
            // Mostrar erros
            alert(errors.join('\n'));
            
            // Tracking de erro
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_validation_error', {
                    'event_category': 'form_interaction',
                    'errors': errors.join(', ')
                });
            }
        }
    });
});

// Lazy loading para imagens
const lazyImages = document.querySelectorAll('img[data-src]');
if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// Melhorar performance do scroll
let ticking = false;
function updateScrollElements() {
    // Suas animações de scroll aqui
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);