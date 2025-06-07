/**
 * Fluxos Smart - Form Handler JavaScript
 * Author: Fluxos Smart Team
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Form tabs functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const formContainers = document.querySelectorAll('.form-container');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and forms
                tabButtons.forEach(btn => btn.classList.remove('active'));
                formContainers.forEach(form => form.classList.remove('active'));
                
                // Add active class to current button and form
                this.classList.add('active');
                document.getElementById(`${tabId}-form`).classList.add('active');
            });
        });
    }
    
    // Form submission handling
    const forms = document.querySelectorAll('.contact-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Show success message
                const formContainer = this.closest('.form-container');
                const formContent = this.innerHTML;
                
                this.innerHTML = `
                    <div class="success-message">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Mensagem enviada com sucesso!</h3>
                        <p>Agradecemos seu contato. Nossa equipe retornará em breve.</p>
                        <button class="btn btn-primary reset-form">Enviar nova mensagem</button>
                    </div>
                `;
                
                // Add reset functionality
                const resetButton = this.querySelector('.reset-form');
                if (resetButton) {
                    resetButton.addEventListener('click', function() {
                        form.innerHTML = formContent;
                        form.reset();
                    });
                }
                
                // Log form data to console (in a real implementation, this would be sent to a server)
                console.log('Form submitted:', formObject);
                
            }, 1500);
        });
    });
    
    // Add styles for success message
    const style = document.createElement('style');
    style.textContent = `
        .success-message {
            text-align: center;
            padding: var(--spacing-xl) 0;
        }
        
        .success-icon {
            font-size: 4rem;
            color: var(--secondary);
            margin-bottom: var(--spacing-lg);
        }
        
        .success-message h3 {
            color: var(--secondary-dark);
            margin-bottom: var(--spacing-md);
        }
        
        .success-message p {
            margin-bottom: var(--spacing-lg);
        }
    `;
    
    document.head.appendChild(style);
});