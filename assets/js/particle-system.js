/**
 * Interactive Particle System with Neural Network Effects
 * Creates an immersive canvas-based particle system with magnetic mouse interaction
 */
class ParticleSystem {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, isMoving: false };
        this.mouseTimeout = null;
        this.lastFrameTime = null;
        this.frameRate = 60;
        
        // Configuration
        this.config = {
            particleCount: 80,
            connectionDistance: 120,
            mouseRadius: 150,
            particleSpeed: 0.5,
            particleSize: 2,
            connectionOpacity: 0.2,
            particleOpacity: 0.6,
            accentColor: '#64FFDA',
            backgroundColor: '#0A192F',
            ...options
        };
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                originalVx: (Math.random() - 0.5) * this.config.particleSpeed,
                originalVy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * this.config.particleSize + 1,
                opacity: Math.random() * this.config.particleOpacity + 0.3
            });
        }
    }
    
    bindEvents() {
        // Mouse tracking
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.isMoving = true;
            
            clearTimeout(this.mouseTimeout);
            this.mouseTimeout = setTimeout(() => {
                this.mouse.isMoving = false;
            }, 100);
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.isMoving = false;
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Calculate distance to mouse
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Mouse magnetic effect
            if (distance < this.config.mouseRadius && this.mouse.isMoving) {
                const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                const angle = Math.atan2(dy, dx);
                particle.vx += Math.cos(angle) * force * 0.02;
                particle.vy += Math.sin(angle) * force * 0.02;
            } else {
                // Return to original velocity
                particle.vx += (particle.originalVx - particle.vx) * 0.02;
                particle.vy += (particle.originalVy - particle.vy) * 0.02;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary handling with smooth wrap-around
            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;
            
            // Velocity damping to prevent excessive speed
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }
    
    drawConnections() {
        this.ctx.strokeStyle = this.config.accentColor;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
                    this.ctx.globalAlpha = opacity;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            // Enhanced particle with glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, this.config.accentColor);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core particle
            this.ctx.fillStyle = this.config.accentColor;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        // Performance monitoring
        const now = performance.now();
        if (this.lastFrameTime) {
            const deltaTime = now - this.lastFrameTime;
            this.frameRate = 1000 / deltaTime;
            
            // Adaptive quality based on performance
            if (this.frameRate < 30 && this.particles.length > 40) {
                this.particles = this.particles.slice(0, Math.floor(this.particles.length * 0.9));
            }
        }
        this.lastFrameTime = now;
        
        // Clear canvas with subtle trail effect for smoother animations
        this.ctx.fillStyle = this.config.backgroundColor + '05';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    // Method to adjust particle system based on reduced motion preference
    setReducedMotion(reduced) {
        if (reduced) {
            this.config.particleSpeed *= 0.3;
            this.config.particleCount = Math.floor(this.config.particleCount * 0.5);
            this.createParticles();
        }
    }
}

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const heroCanvas = document.getElementById('hero-particles');
    if (heroCanvas) {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        const particleSystem = new ParticleSystem('hero-particles', {
            particleCount: prefersReducedMotion ? 40 : 80,
            particleSpeed: prefersReducedMotion ? 0.2 : 0.5
        });
        
        // Listen for changes in motion preference
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            particleSystem.setReducedMotion(e.matches);
        });
    }
});