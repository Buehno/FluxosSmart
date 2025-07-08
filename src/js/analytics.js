/**
 * Sistema de Analytics Avançado - Fluxos Smart
 * Tracking completo de conversão e comportamento do usuário
 */

class AdvancedAnalytics {
    constructor() {
        this.sessionData = {
            startTime: Date.now(),
            pageViews: 1,
            interactions: [],
            scrollDepth: 0,
            timeOnPage: 0,
            deviceInfo: this.getDeviceInfo(),
            trafficSource: this.getTrafficSource()
        };
        
        this.init();
    }

    init() {
        this.setupEventTracking();
        this.trackPageView();
        this.startTimeTracking();
        this.trackScrollDepth();
        this.trackFormInteractions();
        this.trackButtonClicks();
        this.trackCalculatorUsage();
    }

    setupEventTracking() {
        // Google Analytics 4 (substitua GA_MEASUREMENT_ID pelo seu ID real)
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');

        // Facebook Pixel (substitua FACEBOOK_PIXEL_ID pelo seu ID real)
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'FACEBOOK_PIXEL_ID');
        fbq('track', 'PageView');
    }

    trackPageView() {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                custom_parameters: {
                    traffic_source: this.sessionData.trafficSource.source,
                    device_type: this.sessionData.deviceInfo.type
                }
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: document.title,
                content_category: 'Landing Page'
            });
        }
    }

    trackFormInteractions() {
        // Tracking de formulários
        document.querySelectorAll('form').forEach(form => {
            // Início do preenchimento
            form.addEventListener('focusin', (e) => {
                if (e.target.type === 'email' || e.target.type === 'text' || e.target.type === 'tel') {
                    this.trackEvent('form_start', {
                        form_id: form.id || 'unknown',
                        field_name: e.target.name || e.target.id
                    });
                }
            });

            // Submissão do formulário
            form.addEventListener('submit', (e) => {
                this.trackEvent('form_submit', {
                    form_id: form.id || 'unknown',
                    form_type: this.getFormType(form)
                });

                // Facebook Pixel - Lead
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Contact Form',
                        content_category: 'Lead Generation'
                    });
                }
            });
        });
    }

    trackButtonClicks() {
        // Tracking de CTAs importantes
        document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = button.textContent.trim();
                const buttonType = this.getButtonType(buttonText);
                
                this.trackEvent('cta_click', {
                    button_text: buttonText,
                    button_type: buttonType,
                    section: this.getCurrentSection(button)
                });

                // Eventos específicos para Facebook
                if (buttonType === 'demo' || buttonType === 'trial') {
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'InitiateCheckout');
                    }
                }
            });
        });
    }

    trackCalculatorUsage() {
        // Tracking da calculadora ROI
        const processType = document.getElementById('process-type');
        const processVolume = document.getElementById('process-volume');
        const timeSpent = document.getElementById('time-spent');

        if (processType) {
            processType.addEventListener('change', () => {
                this.trackEvent('calculator_process_change', {
                    process_type: processType.value
                });
            });
        }

        if (processVolume) {
            let volumeTimeout;
            processVolume.addEventListener('input', () => {
                clearTimeout(volumeTimeout);
                volumeTimeout = setTimeout(() => {
                    this.trackEvent('calculator_volume_change', {
                        volume: processVolume.value
                    });
                }, 1000);
            });
        }

        if (timeSpent) {
            let timeTimeout;
            timeSpent.addEventListener('input', () => {
                clearTimeout(timeTimeout);
                timeTimeout = setTimeout(() => {
                    this.trackEvent('calculator_time_change', {
                        time: timeSpent.value
                    });
                }, 1000);
            });
        }
    }

    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 90, 100];
        const tracked = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.sessionData.scrollDepth = maxScroll;

                // Tracking de milestones
                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !tracked.has(milestone)) {
                        tracked.add(milestone);
                        this.trackEvent('scroll_depth', {
                            scroll_depth: milestone,
                            page_section: this.getCurrentSectionByScroll()
                        });
                    }
                });
            }
        });
    }

    startTimeTracking() {
        setInterval(() => {
            this.sessionData.timeOnPage += 1;
            
            // Tracking de tempo específicos
            if (this.sessionData.timeOnPage === 30) {
                this.trackEvent('time_on_page', { duration: '30_seconds' });
            } else if (this.sessionData.timeOnPage === 60) {
                this.trackEvent('time_on_page', { duration: '1_minute' });
            } else if (this.sessionData.timeOnPage === 180) {
                this.trackEvent('time_on_page', { duration: '3_minutes' });
            }
        }, 1000);
    }

    trackEvent(eventName, parameters = {}) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                ...parameters,
                timestamp: Date.now(),
                session_id: this.getSessionId()
            });
        }

        // Armazenar localmente para análise
        this.sessionData.interactions.push({
            event: eventName,
            parameters,
            timestamp: Date.now()
        });

        // Console para debug (remover em produção)
        console.log('Event tracked:', eventName, parameters);

        // Enviar para seu backend (implementar quando tiver)
        // this.sendToBackend(eventName, parameters);
    }

    getDeviceInfo() {
        const ua = navigator.userAgent;
        return {
            type: /Mobile|Android|iPhone|iPad/.test(ua) ? 'mobile' : 'desktop',
            browser: this.getBrowser(),
            os: this.getOS(),
            screen: {
                width: screen.width,
                height: screen.height
            }
        };
    }

    getTrafficSource() {
        const referrer = document.referrer;
        const utm = new URLSearchParams(window.location.search);
        
        if (utm.get('utm_source')) {
            return {
                source: utm.get('utm_source'),
                medium: utm.get('utm_medium'),
                campaign: utm.get('utm_campaign')
            };
        }
        
        if (referrer) {
            if (referrer.includes('google')) return { source: 'google', medium: 'organic' };
            if (referrer.includes('facebook')) return { source: 'facebook', medium: 'social' };
            if (referrer.includes('instagram')) return { source: 'instagram', medium: 'social' };
            return { source: 'referral', medium: 'referral', referrer };
        }
        
        return { source: 'direct', medium: 'none' };
    }

    // Métodos auxiliares
    getBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
    }

    getOS() {
        const ua = navigator.userAgent;
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Other';
    }

    getSessionId() {
        let sessionId = localStorage.getItem('fluxos_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('fluxos_session_id', sessionId);
        }
        return sessionId;
    }

    getCurrentSection(element) {
        const sections = ['hero', 'benefits', 'solutions', 'how-it-works', 'testimonials', 'roi-calculator', 'cta'];
        
        if (element) {
            const rect = element.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            
            for (let section of sections) {
                const sectionElement = document.querySelector(`#${section}, .${section}-section`);
                if (sectionElement) {
                    const sectionRect = sectionElement.getBoundingClientRect();
                    if (elementCenter >= sectionRect.top && elementCenter <= sectionRect.bottom) {
                        return section;
                    }
                }
            }
        }
        
        return 'unknown';
    }

    getCurrentSectionByScroll() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        const sections = [
            { id: 'hero', selector: '.hero-section' },
            { id: 'benefits', selector: '.benefits-section' },
            { id: 'solutions', selector: '.solutions-section' },
            { id: 'how-it-works', selector: '.how-it-works-section' },
            { id: 'testimonials', selector: '.testimonials-section' },
            { id: 'roi-calculator', selector: '.roi-calculator-section' },
            { id: 'cta', selector: '.cta-section' }
        ];

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

        return 'unknown';
    }

    getButtonType(text) {
        text = text.toLowerCase();
        if (text.includes('demo') || text.includes('demonstração')) return 'demo';
        if (text.includes('trial') || text.includes('grátis')) return 'trial';
        if (text.includes('contato') || text.includes('falar')) return 'contact';
        if (text.includes('calcul')) return 'calculator';
        return 'other';
    }

    getFormType(form) {
        const formId = form.id || '';
        const formClass = form.className || '';
        
        if (formId.includes('contact') || formClass.includes('contact')) return 'contact';
        if (formId.includes('demo') || formClass.includes('demo')) return 'demo';
        if (formId.includes('newsletter') || formClass.includes('newsletter')) return 'newsletter';
        return 'other';
    }
}

// Inicializar analytics
document.addEventListener('DOMContentLoaded', function() {
    new AdvancedAnalytics();
});