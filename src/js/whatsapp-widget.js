/**
 * WhatsApp Widget Inovador - Fluxos Smart
 * Widget inteligente com IA simulada
 */

class WhatsAppWidget {
    constructor() {
        this.isOpen = false;
        this.phoneNumber = '5511999999999'; // SUBSTITUA pelo seu número real
        this.init();
    }

    init() {
        this.createWidget();
        this.setupEvents();
        this.startSmartBehavior();
    }

    createWidget() {
        const widgetHTML = `
            <div id="whatsapp-widget" class="whatsapp-widget">
                <div class="whatsapp-button" id="whatsapp-btn">
                    <i class="fab fa-whatsapp"></i>
                    <div class="notification-pulse"></div>
                    <div class="message-preview" id="message-preview">
                        <div class="preview-text">👋 Olá! Posso te ajudar?</div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        this.addStyles();
    }

    addStyles() {
        const styles = `
            <style>
            .whatsapp-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .whatsapp-button {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                position: relative;
                animation: float 6s ease-in-out infinite;
            }

            .whatsapp-button:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 30px rgba(37, 211, 102, 0.6);
            }

            .whatsapp-button i {
                color: white;
                font-size: 28px;
                transition: transform 0.3s ease;
            }

            .whatsapp-button:hover i {
                transform: scale(1.1);
            }

            .notification-pulse {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: rgba(37, 211, 102, 0.4);
                animation: pulse 2s infinite;
                opacity: 0;
            }

            .whatsapp-button.has-notification .notification-pulse {
                opacity: 1;
            }

            .message-preview {
                position: absolute;
                right: 70px;
                top: 50%;
                transform: translateY(-50%);
                background: white;
                padding: 12px 16px;
                border-radius: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                max-width: 200px;
            }

            .message-preview::after {
                content: '';
                position: absolute;
                right: -8px;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-left: 8px solid white;
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
            }

            .message-preview.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(-50%) translateX(-10px);
            }

            .preview-text {
                font-size: 14px;
                color: #333;
                font-weight: 500;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
            }

            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.1); opacity: 0.4; }
                100% { transform: scale(1.3); opacity: 0; }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            .whatsapp-button.shake {
                animation: float 6s ease-in-out infinite, shake 0.5s ease-in-out 3;
            }

            /* Responsivo */
            @media (max-width: 768px) {
                .whatsapp-widget {
                    bottom: 15px;
                    right: 15px;
                }
                
                .whatsapp-button {
                    width: 55px;
                    height: 55px;
                }
                
                .whatsapp-button i {
                    font-size: 24px;
                }
                
                .message-preview {
                    right: 65px;
                    max-width: 150px;
                    font-size: 13px;
                }
            }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    setupEvents() {
        const button = document.getElementById('whatsapp-btn');
        
        button.addEventListener('click', () => {
            this.openWhatsApp();
        });
    }

    openWhatsApp() {
        // Mensagens personalizadas baseadas na seção atual
        const currentSection = this.getCurrentSection();
        const messages = {
            hero: 'Olá! Vi que você está interessado em automatizar processos com IA. Posso te ajudar a calcular quanto sua empresa pode economizar!',
            benefits: 'Olá! Notei seu interesse nos benefícios da automação. Que tal uma demonstração personalizada para sua empresa?',
            solutions: 'Olá! Vi que você está vendo nossas soluções de IA. Posso te ajudar a escolher a melhor para seu negócio!',
            calculator: 'Olá! Vi que você estava usando nossa calculadora. Posso te ajudar com um cálculo mais detalhado e personalizado!',
            testimonials: 'Olá! Vi que você estava lendo nossos casos de sucesso. Que tal conversarmos sobre como podemos ajudar sua empresa também?',
            default: 'Olá! Vim do site da Fluxos Smart e gostaria de saber mais sobre as soluções de automação com IA.'
        };

        const message = messages[currentSection] || messages.default;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;

        // Tracking do evento
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'engagement',
                'event_label': currentSection
            });
        }

        window.open(whatsappURL, '_blank');
    }

    getCurrentSection() {
        const sections = [
            { id: 'hero', selector: '.hero-section' },
            { id: 'benefits', selector: '.benefits-section' },
            { id: 'solutions', selector: '.solutions-section' },
            { id: 'calculator', selector: '.roi-calculator-section' },
            { id: 'testimonials ', selector: '.testimonials-section' }
        ];                   
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (let section of sections) {
            const element = document.querySelector(section.selector);
            if (element) {
                const rect = element.getBoundingClientRect();
                const elementTop = window.scrollY + rect.top;
                const elementBottom = elementTop + rect.height;

                if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                    return section.id;
                }
            }
        }

        return 'default';
    }

    startSmartBehavior() {
        let timeOnPage = 0;
        let hasShownNotification = false;

        // Mostrar preview após 15 segundos
        setTimeout(() => {
            if (!hasShownNotification) {
                this.showMessagePreview();
                hasShownNotification = true;
            }
        }, 15000);

        // Comportamento baseado em scroll
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Se usuário rolou mais de 50% da página
            const scrollPercent = (currentScrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > 50 && !hasShownNotification) {
                this.showMessagePreview();
                hasShownNotification = true;
            }

            lastScrollY = currentScrollY;
        });

        // Comportamento quando usuário vai sair da página
        document.addEventListener('mouseleave', () => {
            if (!hasShownNotification) {
                this.showUrgentNotification();
                hasShownNotification = true;
            }
        });
    }

    showMessagePreview() {
        const preview = document.getElementById('message-preview');
        const button = document.getElementById('whatsapp-btn');
        
        button.classList.add('has-notification');
        preview.classList.add('show');

        // Esconder após 5 segundos
        setTimeout(() => {
            preview.classList.remove('show');
            button.classList.remove('has-notification');
        }, 5000);
    }

    showUrgentNotification() {
        const preview = document.getElementById('message-preview');
        const button = document.getElementById('whatsapp-btn');
        
        preview.querySelector('.preview-text').textContent = '🔥 Não perca! Fale conosco agora!';
        
        button.classList.add('has-notification', 'shake');
        preview.classList.add('show');

        setTimeout(() => {
            button.classList.remove('shake');
        }, 1500);
    }
}

// Inicializar o widget quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    new WhatsAppWidget();
});