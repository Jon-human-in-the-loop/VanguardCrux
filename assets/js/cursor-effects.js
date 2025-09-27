/**
 * Custom Cursor Effects System
 * Creates premium cursor interactions with trailing effects and hover states
 */
class CursorEffects {
    constructor() {
        this.cursor = null;
        this.cursorTrail = [];
        this.mouse = { x: 0, y: 0 };
        this.isTouch = 'ontouchstart' in window;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!this.isTouch && !this.prefersReducedMotion) {
            this.init();
        }
    }
    
    init() {
        this.createCursor();
        this.bindEvents();
        this.animate();
    }
    
    createCursor() {
        // Main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
        
        // Cursor inner dot
        this.cursorInner = document.createElement('div');
        this.cursorInner.className = 'custom-cursor-inner';
        this.cursor.appendChild(this.cursorInner);
        
        // Trail particles
        for (let i = 0; i < 8; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);
            this.cursorTrail.push({
                element: trail,
                x: 0,
                y: 0,
                delay: i * 2
            });
        }
        
        // Hide default cursor
        document.body.style.cursor = 'none';
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], .btn-primary, .menu-link, input, textarea, .service-card'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-hover');
            });
        });
        
        // Special effects for accent elements
        const accentElements = document.querySelectorAll('.text-accent, .btn-primary');
        accentElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-accent');
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-accent');
            });
        });
        
        // Click effect
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('cursor-click');
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('cursor-click');
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
    }
    
    animate() {
        // Update main cursor position
        this.cursor.style.left = this.mouse.x + 'px';
        this.cursor.style.top = this.mouse.y + 'px';
        
        // Update trail with smooth following effect
        this.cursorTrail.forEach((trail, index) => {
            const targetX = this.mouse.x;
            const targetY = this.mouse.y;
            
            // Smooth interpolation
            trail.x += (targetX - trail.x) / (trail.delay + 2);
            trail.y += (targetY - trail.y) / (trail.delay + 2);
            
            trail.element.style.left = trail.x + 'px';
            trail.element.style.top = trail.y + 'px';
            trail.element.style.opacity = (8 - index) / 10;
            trail.element.style.transform = `scale(${(8 - index) / 10})`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    // Method to create magnetic effect for specific elements
    addMagneticEffect(selector, strength = 0.3) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// Add cursor styles
const cursorStyles = `
.custom-cursor {
    position: fixed;
    width: 40px;
    height: 40px;
    border: 2px solid var(--accent);
    border-radius: 50%;
    background: rgba(100, 255, 218, 0.1);
    pointer-events: none;
    z-index: 10000;
    transform: translate(-50%, -50%);
    transition: all 0.15s ease;
    backdrop-filter: blur(2px);
}

.custom-cursor-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.15s ease;
}

.cursor-trail {
    position: fixed;
    width: 8px;
    height: 8px;
    background: var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    opacity: 0.6;
}

.custom-cursor.cursor-hover {
    width: 60px;
    height: 60px;
    background: rgba(100, 255, 218, 0.05);
    border-width: 1px;
}

.custom-cursor.cursor-hover .custom-cursor-inner {
    width: 4px;
    height: 4px;
}

.custom-cursor.cursor-accent {
    background: rgba(100, 255, 218, 0.2);
    box-shadow: 0 0 20px rgba(100, 255, 218, 0.4);
}

.custom-cursor.cursor-click {
    transform: translate(-50%, -50%) scale(0.8);
}

.custom-cursor.cursor-click .custom-cursor-inner {
    transform: translate(-50%, -50%) scale(1.5);
}

/* Magnetic hover effects */
.magnetic-element {
    transition: transform 0.2s ease;
}

/* Hide cursor on touch devices */
@media (hover: none) and (pointer: coarse) {
    .custom-cursor,
    .cursor-trail {
        display: none !important;
    }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    .custom-cursor,
    .cursor-trail {
        display: none !important;
    }
    
    body {
        cursor: auto !important;
    }
}
`;

// Inject cursor styles
const cursorStyleSheet = document.createElement('style');
cursorStyleSheet.textContent = cursorStyles;
document.head.appendChild(cursorStyleSheet);

// Initialize cursor effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const cursorEffects = new CursorEffects();
    
    // Add magnetic effects to specific elements
    cursorEffects.addMagneticEffect('.btn-primary', 0.2);
    cursorEffects.addMagneticEffect('.service-card', 0.1);
    cursorEffects.addMagneticEffect('.text-accent', 0.15);
});