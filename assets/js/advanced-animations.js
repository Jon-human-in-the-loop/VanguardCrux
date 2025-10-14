/**
 * Advanced Native JavaScript Animation System
 * Premium animations without external dependencies
 */
class AdvancedAnimations {
    constructor() {
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }
    
    init() {
        this.initScrollTrigger();
        this.initHeroAnimations();
        this.initServiceCardAnimations();
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    initScrollTrigger() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            if (index === 0) return; // Skip hero section
            
            section.style.opacity = '0';
            section.style.transform = 'translateY(60px)';
            section.style.transition = this.prefersReducedMotion ? 
                'opacity 0.3s ease, transform 0.3s ease' : 
                'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        this.handleScroll();
    }
    
    handleScroll() {
        const sections = document.querySelectorAll('section');
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            if (scrollTop + windowHeight > sectionTop + 100) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    initHeroAnimations() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSlogan = document.querySelector('.hero-slogan');
        const heroTagline = document.querySelector('.hero-tagline');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroCTA = document.querySelector('.hero-cta');
        
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(100px)';
            heroTitle.style.transition = 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 500);
        }
        
        if (heroSlogan) {
            heroSlogan.style.opacity = '0';
            heroSlogan.style.transform = 'translateY(60px)';
            heroSlogan.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                heroSlogan.style.opacity = '1';
                heroSlogan.style.transform = 'translateY(0)';
            }, 700);
        }
        
        if (heroTagline) {
            heroTagline.style.opacity = '0';
            heroTagline.style.transform = 'translateY(50px)';
            heroTagline.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                heroTagline.style.opacity = '1';
                heroTagline.style.transform = 'translateY(0)';
            }, 850);
        }
        
        if (heroSubtitle) {
            heroSubtitle.style.opacity = '0';
            heroSubtitle.style.transform = 'translateY(50px)';
            heroSubtitle.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                heroSubtitle.style.opacity = '1';
                heroSubtitle.style.transform = 'translateY(0)';
            }, 1000);
        }
        
        if (heroCTA) {
            heroCTA.style.opacity = '0';
            heroCTA.style.transform = 'translateY(30px) scale(0.9)';
            heroCTA.style.transition = 'opacity 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                heroCTA.style.opacity = '1';
                heroCTA.style.transform = 'translateY(0) scale(1)';
            }, 1200);
        }
    }
    
    initServiceCardAnimations() {
        const cards = document.querySelectorAll('.service-card, [data-service-card]');
        
        cards.forEach(card => {
            const icon = card.querySelector('svg, .service-icon');
            
            card.addEventListener('mouseenter', () => {
                if (!this.prefersReducedMotion) {
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                    card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    if (icon) {
                        icon.style.transform = 'rotate(360deg) scale(1.1)';
                        icon.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    }
                }
                
                card.style.boxShadow = '0 20px 40px rgba(100, 255, 218, 0.2)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
                
                if (icon) {
                    icon.style.transform = 'rotate(0deg) scale(1)';
                }
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedAnimations();
});