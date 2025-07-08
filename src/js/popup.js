/**
 * WhatsApp Widget Inteligente - Fluxos Smart
 * Sistema inovador com IA simulada e interações personalizadas
 */

class WhatsAppWidget {
    constructor() {
        this.isOpen = false;
        this.currentStep = 'greeting';
        this.userResponses = {};
        this.init();
    }

    init() {
        this.createWidget();
        this.setupEventListeners();
        this.startBehaviorTracking();
    }

    createWidget() {
        const widgetHTML = `
            <div id="whatsapp-widget" class="whatsapp-widget">
                <!-- Botão Principal -->
                <div class="whatsapp-button" id="whatsapp-btn">
                    <div class="whatsapp-icon">
                        <i class="fab fa-whatsapp"></i>
                    </div>
                    <div class="notification-badge" id="notification-badge">1</div>
                    <div class="pulse-animation"></div>
                </div>

                <!-- Chat Interface -->
                <div class="whatsapp-chat" id="whatsapp-chat">
                    <div class="chat-header">
                        <div class="agent-info">
                            <div class="agent-avatar">
                                <img src="../src/img/ai-agent.jpg" alt="Assistente IA">
                                <div class="online-status"></div>
                            </div>
                            <div class="agent-details">
                                <h4>Sofia - Assistente IA</h4>
                                <span class="typing-indicator" id="typing-indicator">
                                    <span></span><span></span><span></span>
                                </span>
                                <span class="online-text">Online agora</span>
                            </div>
                        </div>
                        <button class="close-chat" id="close-chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="chat-messages" id="chat-messages">
                        <!-- Mensagens serão inseridas aqui -->
                    </div>

                    <div class="chat-input-area">
                        <div class="quick-responses" id="quick-responses">
                            <!-- Respostas rápidas serão inseridas aqui -->
                        </div>
                        <div class="input-container">
                            <input type="text" id="chat-input" placeholder="Digite sua mensagem...">
                            <button id="send-message">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
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
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .whatsapp-button {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #25D366, #128C7E);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
                transition: all 0.3s ease;
                position: relative;
                animation: float 3s ease-in-out infinite;
            }

            .whatsapp-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
            }

            .whatsapp-icon {
                color: white;
                font-size: 28px;
            }

            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                animation: bounce 2s infinite;
            }

            .pulse-animation {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: rgba(37, 211, 102, 0.3);
                animation: pulse 2s infinite;
            }

            .whatsapp-chat {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                transform: scale(0.8) translateY(20px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            .whatsapp-chat.active {
                display: flex;
                transform: scale(1) translateY(0);
                opacity: 1;
            }

            .chat-header {
                background: linear-gradient(135deg, #25D366, #128C7E);
                color: white;
                padding: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .agent-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .agent-avatar {
                position: relative;
                width: 40px;
                height: 40px;
            }

            .agent-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }

            .online-status {
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 12px;
                height: 12px;
                background: #4CAF50;
                border: 2px solid white;
                border-radius: 50%;
            }

            .agent-details h4 {
                margin: 0;
                font-size: 14px;
                font-weight: 600;
            }

            .typing-indicator {
                display: none;
                font-size: 12px;
                opacity: 0.8;
            }

            .typing-indicator span {
                display: inline-block;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                margin: 0 1px;
                animation: typing 1.4s infinite;
            }

            .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
            .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

            .online-text {
                font-size: 12px;
                opacity: 0.8;
            }

            .close-chat {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.3s;
            }

            .close-chat:hover {
                background: rgba(255,255,255,0.2);
            }

            .chat-messages {
                flex: 1;
                padding: 20px 15px;
                overflow-y: auto;
                background: #f0f0f0;
                background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="chat-bg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23e0e0e0" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23chat-bg)"/></svg>');
            }

            .message {
                margin-bottom: 15px;
                animation: slideIn 0.3s ease;
            }

            .message.bot {
                display: flex;
                align-items: flex-end;
                gap: 8px;
            }

            .message.user {
                display: flex;
                justify-content: flex-end;
            }

            .message-content {
                max-width: 80%;
                padding: 10px 15px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.4;
                position: relative;
            }

            .message.bot .message-content {
                background: white;
                border-bottom-left-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            .message.user .message-content {
                background: #25D366;
                color: white;
                border-bottom-right-radius: 5px;
            }

            .message-time {
                font-size: 11px;
                opacity: 0.6;
                margin-top: 5px;
            }

            .quick-responses {
                padding: 10px 15px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                border-top: 1px solid #eee;
                background: white;
            }

            .quick-response {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 20px;
                padding: 8px 15px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.3s;
                color: #495057;
            }

            .quick-response:hover {
                background: #25D366;
                color: white;
                transform: translateY(-2px);
            }

            .input-container {
                display: flex;
                align-items: center;
                padding: 15px;
                background: white;
                border-top: 1px solid #eee;
            }

            #chat-input {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 25px;
                padding: 10px 15px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.3s;
            }

            #chat-input:focus {
                border-color: #25D366;
            }

            #send-message {
                background: #25D366;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                margin-left: 10px;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }

            #send-message:hover {
                background: #128C7E;
                transform: scale(1.1);
            }

            /* Animações */
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-5px); }
                60% { transform: translateY(-3px); }
            }

            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(1.5); opacity: 0; }
            }

            @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-10px); }
            }

            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Responsivo */
            @media (max-width: 768px) {
                .whatsapp-chat {
                    width: 300px;
                    height: 450px;
                    bottom: 70px;
                    right: -10px;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    setupEventListeners() {
        const btn = document.getElementById('whatsapp-btn');
        const chat = document.getElementById('whatsapp-chat');
        const closeBtn = document.getElementById('close-chat');
        const sendBtn = document.getElementById('send-message');
        const input = document.getElementById('chat-input');

        btn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Iniciar conversa automaticamente após 10 segundos
        setTimeout(() => this.startConversation(), 10000);
    }

    toggleChat() {
        const chat = document.getElementById('whatsapp-chat');
        const badge = document.getElementById('notification-badge');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            chat.classList.add('active');
            badge.style.display = 'none';
            this.isOpen = true;
            
            if (this.currentStep === 'greeting') {
                this.startConversation();
            }
        }
    }

    closeChat() {
        const chat = document.getElementById('whatsapp-chat');
        chat.classList.remove('active');
        this.isOpen = false;
    }

    startConversation() {
        if (!this.isOpen) {
            // Mostrar notificação se chat estiver fechado
            this.showNotification();
            return;
        }

        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            this.addMessage('bot', '👋 Olá! Sou a Sofia, assistente inteligente da Fluxos Smart!');
            
            setTimeout(() => {
                this.addMessage('bot', 'Vi que você está interessado em automatizar processos da sua empresa. Posso te ajudar a calcular quanto você pode economizar! 💰');
                this.showQuickResponses(['💡 Quero saber mais', '📊 Calcular economia', '📞 Falar com consultor']);
            }, 2000);
        }, 1500);
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chat-messages');
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        const messageHTML = `
            <div class="message ${sender}">
                ${sender === 'bot' ? '<div class="bot-avatar"><img src="../src/img/ai-agent.jpg" alt="Sofia" style="width:25px;height:25px;border-radius:50%;"></div>' : ''}
                <div class="message-content">
                    ${text}
                    <div class="message-time">${time}</div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showQuickResponses(responses) {
        const container = document.getElementById('quick-responses');
        container.innerHTML = '';
        
        responses.forEach(response => {
            const btn = document.createElement('button');
            btn.className = 'quick-response';
            btn.textContent = response;
            btn.addEventListener('click', () => this.handleQuickResponse(response));
            container.appendChild(btn);
        });
    }

    handleQuickResponse(response) {
        this.addMessage('user', response);
        document.getElementById('quick-responses').innerHTML = '';
        
        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            this.processResponse(response);
        }, 1500);
    }

    processResponse(response) {
        switch(response) {
            case '💡 Quero saber mais':
                this.addMessage('bot', 'Perfeito! A Fluxos Smart oferece agentes de IA especializados em:');
                setTimeout(() => {
                    this.addMessage('bot', '🤖 Atendimento ao Cliente 24/7\n📄 Processamento de Documentos\n📅 Agendamento Inteligente\n📊 Relatórios Automáticos');
                    this.showQuickResponses(['📊 Ver calculadora ROI', '🎯 Agendar demonstração', '💬 Falar no WhatsApp']);
                }, 1000);
                break;
                
            case '📊 Calcular economia':
                this.addMessage('bot', 'Ótima escolha! Vou te direcionar para nossa calculadora interativa onde você pode ver exatamente quanto sua empresa pode economizar! 🎯');
                setTimeout(() => {
                    document.querySelector('.roi-calculator-section').scrollIntoView({ behavior: 'smooth' });
                    this.addMessage('bot', 'Role a página para cima e use nossa calculadora! Depois volte aqui para agendar uma demonstração personalizada 😊');
                    this.showQuickResponses(['✅ Já calculei, quero demonstração', '💬 Continuar no WhatsApp']);
                }, 2000);
                break;
                
            case '📞 Falar com consultor':
            case '🎯 Agendar demonstração':
            case '✅ Já calculei, quero demonstração':
                this.addMessage('bot', 'Excelente! Vou te conectar com um de nossos especialistas agora mesmo! 🚀');
                setTimeout(() => {
                    this.redirectToWhatsApp('Olá! Vim do site da Fluxos Smart e gostaria de agendar uma demonstração dos agentes de IA para minha empresa.');
                }, 1500);
                break;
                
            case '💬 Falar no WhatsApp':
            case '💬 Continuar no WhatsApp':
                this.redirectToWhatsApp('Olá! Estava conversando com a Sofia no site e gostaria de saber mais sobre as soluções da Fluxos Smart.');
                break;
        }
    }

    redirectToWhatsApp(message) {
        const phoneNumber = '5511999999999'; // Substitua pelo número real
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Tracking do evento
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_redirect', {
                'event_category': 'engagement',
                'event_label': 'chat_widget'
            });
        }
        
        window.open(whatsappURL, '_blank');
    }

    showTyping() {
        document.getElementById('typing-indicator').style.display = 'block';
        document.querySelector('.online-text').style.display = 'none';
    }

    hideTyping() {
        document.getElementById('typing-indicator').style.display = 'none';
        document.querySelector('.online-text').style.display = 'block';
    }

    showNotification() {
        const badge = document.getElementById('notification-badge');
        badge.style.display = 'flex';
        badge.textContent = '1';
        
        // Adicionar efeito de shake no botão
        const btn = document.getElementById('whatsapp-btn');
        btn.style.animation = 'none';
        setTimeout(() => {
            btn.style.animation = 'float 3s ease-in-out infinite, shake 0.5s ease-in-out';
        }, 100);
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage('user', message);
            input.value = '';
            
            this.showTyping();
            setTimeout(() => {
                this.hideTyping();
                this.addMessage('bot', 'Obrigada pela sua mensagem! Para um atendimento mais rápido e personalizado, vou te conectar diretamente com nossa equipe no WhatsApp! 😊');
                setTimeout(() => {
                    this.redirectToWhatsApp(`Olá! Estava conversando no site e disse: "${message}". Gostaria de saber mais sobre as soluções da Fluxos Smart.`);
                }, 2000);
            }, 1500);
        }
    }

    startBehaviorTracking() {
        // Tracking de comportamento do usuário
        let timeOnPage = 0;
        let scrollDepth = 0;
        
        setInterval(() => {
            timeOnPage += 1;
            
            // Mostrar widget após 30 segundos
            if (timeOnPage === 30 && !this.isOpen) {
                this.showNotification();
            }
            
            // Mostrar novamente após 2 minutos se não interagiu
            if (timeOnPage === 120 && !this.isOpen) {
                this.showNotification();
            }
        }, 1000);
        
        // Tracking de scroll
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > scrollDepth) {
                scrollDepth = scrollPercent;
                
                // Mostrar widget quando usuário rolar 70% da página
                if (scrollDepth > 70 && !this.isOpen) {
                    this.showNotification();
                }
            }
        });
    }
}

// Inicializar o widget
new WhatsAppWidget();