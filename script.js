// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }
    
    bindEvents() {
        this.themeToggle?.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }
    
    updateThemeIcon() {
        const icon = this.themeToggle?.querySelector('i');
        if (icon) {
            icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Loading Screen Animation
class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingProgress = document.querySelector('.loading-progress');
        this.loadingPercentage = document.querySelector('.loading-percentage');
        this.mainContent = document.getElementById('main-content');
        this.progress = 0;
        
        this.init();
    }
    
    init() {
        this.animateProgress();
    }
    
    animateProgress() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hideLoading(), 500);
            }
            
            this.loadingProgress.style.width = `${this.progress}%`;
            this.loadingPercentage.textContent = `${Math.floor(this.progress)}%`;
        }, 200);
    }
    
    hideLoading() {
        this.loadingScreen.classList.add('hidden');
        this.mainContent.classList.add('visible');
        
        // Initialize other components after loading
        setTimeout(() => {
            this.initializeComponents();
        }, 500);
    }
    
    initializeComponents() {
        // Initialize all other components
        new ParticleSystem();
        new Navigation();
        new TypeWriter();
        new ScrollAnimations();
        new CounterAnimation();
        new SmoothScroll();
        new ContactForm();
        new BackToTopButton();
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.currentTheme = 'light';
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.updateTheme();
    }
    
    updateTheme() {
        this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.particles = [];
            this.createParticles();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Listen for theme changes
        const observer = new MutationObserver(() => {
            this.updateTheme();
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += (dx / distance) * force * 0.01;
                particle.vy += (dy / distance) * force * 0.01;
            }
            
            // Boundary check with bounce
            if (particle.x < 0) {
                particle.x = 0;
                particle.vx *= -1;
            }
            if (particle.x > this.canvas.width) {
                particle.x = this.canvas.width;
                particle.vx *= -1;
            }
            if (particle.y < 0) {
                particle.y = 0;
                particle.vy *= -1;
            }
            if (particle.y > this.canvas.height) {
                particle.y = this.canvas.height;
                particle.vy *= -1;
            }
            
            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Draw particle with theme-aware colors
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            if (this.currentTheme === 'light') {
                this.ctx.fillStyle = `rgba(0, 102, 204, ${particle.opacity * 0.6})`;
            } else {
                this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            }
            this.ctx.fill();
            
            // Draw connections
            for (let j = index + 1; j < this.particles.length; j++) {
                const otherParticle = this.particles[j];
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    
                    if (this.currentTheme === 'light') {
                        this.ctx.strokeStyle = `rgba(0, 102, 204, ${0.05 * (1 - distance / 100)})`;
                    } else {
                        this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`;
                    }
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.sections = document.querySelectorAll('.section, .hero');
        this.header = document.querySelector('.header');
        
        this.bindEvents();
        this.updateActiveLink();
    }
    
    bindEvents() {
        // Hamburger menu toggle
        this.hamburger?.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu
                this.navMenu?.classList.remove('active');
                this.hamburger?.classList.remove('active');
            });
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveLink();
            this.updateHeaderBackground();
        });
    }
    
    updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    updateHeaderBackground() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (window.scrollY > 50) {
            if (currentTheme === 'light') {
                this.header.style.background = 'rgba(248, 250, 252, 0.98)';
            } else {
                this.header.style.background = 'rgba(10, 10, 15, 0.98)';
            }
        } else {
            if (currentTheme === 'light') {
                this.header.style.background = 'rgba(248, 250, 252, 0.95)';
            } else {
                this.header.style.background = 'rgba(10, 10, 15, 0.95)';
            }
        }
    }
}

// Back to Top Button
class BackToTopButton {
    constructor() {
        this.button = document.getElementById('back-to-top');
        if (!this.button) return;
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when clicked
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Typewriter Effect
class TypeWriter {
    constructor() {
        this.element = document.querySelector('.typewriter');
        if (!this.element) return;
        
        this.text = this.element.dataset.text;
        this.speed = 50;
        this.index = 0;
        
        this.element.textContent = '';
        setTimeout(() => this.type(), 1000);
    }
    
    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.init();
    }
    
    init() {
        // Add animation classes to elements
        this.addAnimationClasses();
        
        // Observe all animated elements
        const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        elements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    addAnimationClasses() {
        // About section
        document.querySelector('.about-text')?.classList.add('fade-in');
        document.querySelector('.profile-card')?.classList.add('fade-in');
        
        // Skills section
        document.querySelectorAll('.skill-item-clean').forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${index * 0.05}s`;
        });
        
        // Experience timeline
        document.querySelectorAll('.timeline-item').forEach((element, index) => {
            if (index % 2 === 0) {
                element.classList.add('slide-in-left');
            } else {
                element.classList.add('slide-in-right');
            }
        });
        
        // Project cards
        document.querySelectorAll('.project-card-new').forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${index * 0.1}s`;
        });
        
        // Certificate cards
        document.querySelectorAll('.certificate-card').forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${index * 0.1}s`;
        });
        
        // Profile links
        document.querySelectorAll('.profile-link-clean').forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${index * 0.1}s`;
        });
        
        // Contact section
        document.querySelector('.contact-info')?.classList.add('slide-in-left');
        document.querySelector('.contact-form-section')?.classList.add('slide-in-right');
    }
}

// Counter Animation
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    this.animateCounter(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        this.init();
    }
    
    init() {
        this.counters.forEach(counter => {
            this.observer.observe(counter);
        });
    }
    
    animateCounter(counter) {
        const target = parseFloat(counter.dataset.count);
        const duration = 2000;
        const start = performance.now();
        const startValue = 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = startValue + (target - startValue) * this.easeOutCubic(progress);
            
            if (target % 1 === 0) {
                counter.textContent = Math.floor(current);
            } else {
                counter.textContent = current.toFixed(1);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = target % 1 === 0 ? target : target.toFixed(1);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// Smooth Scroll for anchor links
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.bindEvents();
    }
    
    bindEvents() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Contact Form
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        if (!this.form) return;
        
        this.bindEvents();
        this.setupFloatingLabels();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    setupFloatingLabels() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Check if input has value on load
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            }
            
            // Add event listeners
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
            
            input.addEventListener('focus', () => {
                input.classList.add('has-value');
            });
            
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    input.classList.remove('has-value');
                }
            });
        });
    }
    
    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #00d4ff)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                this.form.reset();
                
                // Reset floating labels
                const inputs = this.form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.classList.remove('has-value');
                });
            }, 2000);
        }, 1500);
        
        console.log('Form submitted with data:', data);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager first
    new ThemeManager();
    
    // Start with loading screen
    new LoadingScreen();
    
    // Handle page visibility change for performance
    document.addEventListener('visibilitychange', () => {
        const canvas = document.getElementById('particles-canvas');
        if (document.hidden) {
            // Pause animations when page is hidden
            if (canvas) canvas.style.display = 'none';
        } else {
            // Resume animations when page becomes visible
            if (canvas) canvas.style.display = 'block';
        }
    });
    
    // Performance optimization: Reduce animations on mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // Disable particle system on mobile for better performance
        const canvas = document.getElementById('particles-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
});

// Handle window resize with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const isMobile = window.innerWidth <= 768;
        const canvas = document.getElementById('particles-canvas');
        
        if (canvas) {
            if (isMobile && canvas.style.display !== 'none') {
                canvas.style.display = 'none';
            } else if (!isMobile && canvas.style.display === 'none') {
                canvas.style.display = 'block';
            }
        }
    }, 250);
});

// Add utility for smooth animations
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
};

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        LoadingScreen,
        ParticleSystem,
        Navigation,
        BackToTopButton,
        TypeWriter,
        ScrollAnimations,
        CounterAnimation,
        SmoothScroll,
        ContactForm,
        utils
    };
}