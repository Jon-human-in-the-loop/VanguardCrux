/**
 * Vanguard Crux Team 360° Interactive Video System
 * Revolutionary 360° rotating team videos with transparent backgrounds
 */
class HelixTeam360 {
    constructor() {
        this.members = document.querySelectorAll('.team-member-360');
        this.autoRotateInterval = null;
        this.rotationSpeed = 1.5; // Increased from 0.5 to 1.5 for faster rotation
        this.MANUAL_ROTATION_AMOUNT = 0.5; // Seconds to skip on manual rotation
        this.initializeTeamVideos();
    }

    initializeTeamVideos() {
        this.members.forEach(member => {
            const video = member.querySelector('.team-360-video');
            const autoRotateBtn = member.querySelector('.auto-rotate-btn');
            const rotateButtons = member.querySelectorAll('.rotate-btn');
            const container = member.querySelector('.video-360-container');
            
            // Add loading class to container
            container.classList.add('loading');
            
            // Lazy load videos when they come into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Check if video hasn't been loaded yet
                        if (video.readyState === 0) {
                            video.load(); // Start loading only when visible
                        }
                        
                        // Only setup video playback once
                        if (!video.dataset.playbackSetup) {
                            this.setupVideoPlayback(video);
                            video.dataset.playbackSetup = 'true';
                        }
                        
                        // Remove loading class when video is loaded
                        video.addEventListener('loadeddata', () => {
                            container.classList.remove('loading');
                        }, { once: true });
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(member);
            
            // Setup rotation controls
            this.setupRotationControls(member, video, autoRotateBtn, rotateButtons);
            
            // Setup hover effects
            this.setupHoverEffects(member, video);
        });
    }

    setupVideoPlayback(video) {
        // Ensure video plays automatically when loaded
        video.addEventListener('loadeddata', () => {
            video.playbackRate = 1.5; // Speed up playback to 1.5x for faster rotation
            video.play().catch(e => console.log('Video autoplay blocked:', e));
        });
        
        // Loop seamlessly
        video.addEventListener('ended', () => {
            video.currentTime = 0;
            video.play();
        });

        // Handle cases where video might not have proper sources
        video.addEventListener('error', () => {
            console.log('Video error - using fallback placeholder');
            this.createVideoPlaceholder(video);
        });
    }

    createVideoPlaceholder(video) {
        // Create a canvas-based rotating placeholder when video is not available
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const container = video.parentElement;
        
        canvas.width = 400;
        canvas.height = 400;
        canvas.className = video.className;
        canvas.style.borderRadius = '1.5rem';
        
        // Hide the video and show canvas
        video.style.display = 'none';
        container.insertBefore(canvas, video);
        
        // Animated rotating placeholder
        let rotation = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Background gradient
            const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
            gradient.addColorStop(0, 'rgba(100, 255, 218, 0.2)');
            gradient.addColorStop(1, 'rgba(10, 25, 47, 0.9)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Rotating elements to simulate 360° effect
            ctx.save();
            ctx.translate(200, 200);
            ctx.rotate(rotation);
            
            // Draw rotating elements
            for (let i = 0; i < 8; i++) {
                ctx.save();
                ctx.rotate((i * Math.PI * 2) / 8);
                ctx.fillStyle = `rgba(100, 255, 218, ${0.3 + Math.sin(rotation + i) * 0.2})`;
                ctx.fillRect(-5, -100, 10, 50);
                ctx.restore();
            }
            
            ctx.restore();
            
            // Center avatar placeholder
            ctx.beginPath();
            ctx.arc(200, 200, 60, 0, Math.PI * 2);
            ctx.fillStyle = '#64FFDA';
            ctx.fill();
            
            // Initials
            ctx.fillStyle = '#0A192F';
            ctx.font = 'bold 24px "Space Grotesk", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const memberName = container.closest('.team-member-360').dataset.member;
            const initials = memberName === 'jon' ? 'JF' : 'JA';
            ctx.fillText(initials, 200, 200);
            
            rotation += 0.01;
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    setupRotationControls(member, video, autoBtn, rotateButtons) {
        let isAutoRotating = true;
        
        // Auto-rotation (default)
        this.startAutoRotation(video);
        
        // Manual rotation controls
        rotateButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.stopAutoRotation();
                const direction = btn.dataset.direction;
                this.manualRotate(video, direction);
                isAutoRotating = false;
                autoBtn.textContent = 'Auto';
                
                // Add visual feedback
                btn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
            });
        });
        
        // Toggle auto-rotation
        autoBtn.addEventListener('click', () => {
            if (isAutoRotating) {
                this.stopAutoRotation();
                autoBtn.textContent = 'Play';
                isAutoRotating = false;
            } else {
                this.startAutoRotation(video);
                autoBtn.textContent = 'Auto';
                isAutoRotating = true;
            }
            
            // Add visual feedback
            autoBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                autoBtn.style.transform = 'scale(1)';
            }, 150);
        });
    }

    startAutoRotation(video) {
        // For video elements
        if (video.tagName === 'VIDEO') {
            video.play().catch(e => console.log('Video play failed:', e));
            video.playbackRate = this.rotationSpeed;
        }
        // For canvas placeholders, rotation is handled in the animation loop
    }

    stopAutoRotation() {
        this.members.forEach(member => {
            const video = member.querySelector('.team-360-video');
            if (video && video.tagName === 'VIDEO') {
                video.pause();
            }
        });
    }

    manualRotate(video, direction) {
        if (video.tagName === 'VIDEO') {
            if (direction === 'right') {
                video.currentTime += this.MANUAL_ROTATION_AMOUNT;
                if (video.currentTime >= video.duration) {
                    video.currentTime = 0;
                }
            } else {
                video.currentTime -= this.MANUAL_ROTATION_AMOUNT;
                if (video.currentTime < 0) {
                    video.currentTime = Math.max(0, video.duration - this.MANUAL_ROTATION_AMOUNT);
                }
            }
        }
    }

    setupHoverEffects(member, video) {
        member.addEventListener('mouseenter', () => {
            member.classList.add('hovered');
            // Slow down rotation on hover for better viewing
            if (video.tagName === 'VIDEO' && !video.paused) {
                video.playbackRate = 0.2;
            }
        });

        member.addEventListener('mouseleave', () => {
            member.classList.remove('hovered');
            // Resume normal speed
            if (video.tagName === 'VIDEO' && !video.paused) {
                video.playbackRate = this.rotationSpeed;
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure other scripts are loaded
    setTimeout(() => {
        if (document.querySelector('.team-member-360')) {
            new HelixTeam360();
        }
    }, 100);
});