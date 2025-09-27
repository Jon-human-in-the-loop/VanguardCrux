/**
 * Background Music System
 * Immersive ambient music with user controls and audio visualization
 */

class BackgroundMusicSystem {
    constructor() {
        this.audioContext = null;
        this.audioBuffer = null;
        this.source = null;
        this.gainNode = null;
        this.analyser = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.volume = 0.3; // Default volume (30%)
        this.startTime = 0;
        this.pauseTime = 0;
        
        // Audio visualization
        this.visualizerBars = [];
        this.animationFrame = null;
        
        // Create ambient audio data (synthetic ambient tones)
        this.createAmbientAudio();
        this.initializeUI();
        this.setupEventListeners();
    }
    
    async createAmbientAudio() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Try to load user's MP3 file first
            const mp3Paths = [
                'assets/audio/background.mp3',
                'assets/music/background.mp3',
                'assets/background.mp3'
            ];
            
            for (const path of mp3Paths) {
                try {
                    console.log(`🎵 Attempting to load user music file from: ${path}`);
                    const response = await fetch(path);
                    
                    if (response.ok) {
                        const arrayBuffer = await response.arrayBuffer();
                        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                        console.log('✓ User music file loaded successfully!');
                        return; // Success - exit early
                    } else {
                        console.log(`⚠ User music file not found at ${path} (status: ${response.status})`);
                    }
                } catch (error) {
                    console.log(`⚠ Error loading user music from ${path}:`, error.message);
                }
            }
            
            // Fallback: Create synthetic ambient audio (existing code)
            console.log('🎼 No user music file found, generating synthetic ambient audio...');
            
            // Create a synthetic ambient soundtrack
            const duration = 60; // 60 seconds loop
            const sampleRate = this.audioContext.sampleRate;
            const bufferLength = duration * sampleRate;
            
            this.audioBuffer = this.audioContext.createBuffer(2, bufferLength, sampleRate);
            
            // Generate ambient tones
            for (let channel = 0; channel < 2; channel++) {
                const channelData = this.audioBuffer.getChannelData(channel);
                
                for (let i = 0; i < bufferLength; i++) {
                    const time = i / sampleRate;
                    
                    // Create layered ambient tones
                    const tone1 = Math.sin(2 * Math.PI * 220 * time) * 0.05; // A3
                    const tone2 = Math.sin(2 * Math.PI * 330 * time) * 0.03; // E4
                    const tone3 = Math.sin(2 * Math.PI * 440 * time) * 0.02; // A4
                    const tone4 = Math.sin(2 * Math.PI * 660 * time) * 0.015; // E5
                    
                    // Add some subtle variation
                    const variation = Math.sin(2 * Math.PI * 0.1 * time) * 0.01;
                    const noise = (Math.random() - 0.5) * 0.005;
                    
                    // Combine all elements
                    channelData[i] = (tone1 + tone2 + tone3 + tone4 + variation + noise) * 0.8;
                    
                    // Apply envelope for smooth looping
                    const fadeTime = sampleRate * 2; // 2 second fade
                    if (i < fadeTime) {
                        channelData[i] *= i / fadeTime;
                    } else if (i > bufferLength - fadeTime) {
                        channelData[i] *= (bufferLength - i) / fadeTime;
                    }
                }
            }
            
            console.log('✓ Synthetic ambient audio created successfully');
        } catch (error) {
            console.error('Error creating audio:', error);
        }
    }
    
    initializeUI() {
        // Create music control button
        const musicControl = document.createElement('button');
        musicControl.className = 'music-control paused';
        musicControl.setAttribute('aria-label', 'Toggle background music');
        musicControl.innerHTML = `
            <svg class="music-control-icon play-icon" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
            </svg>
            <svg class="music-control-icon pause-icon" viewBox="0 0 24 24" style="display: none;">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
        `;
        
        // Create volume control panel
        const volumeControl = document.createElement('div');
        volumeControl.className = 'volume-control';
        volumeControl.innerHTML = `
            <h4>Background Music</h4>
            <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="${this.volume}">
            <div class="volume-controls">
                <button class="volume-btn mute-btn">Mute</button>
                <button class="volume-btn close-btn">Close</button>
            </div>
        `;
        
        // Create audio visualizer
        const audioVisualizer = document.createElement('div');
        audioVisualizer.className = 'audio-visualizer';
        audioVisualizer.innerHTML = `
            <div class="visualizer-bars">
                ${Array.from({length: 32}, () => '<div class="visualizer-bar"></div>').join('')}
            </div>
        `;
        
        // Append to body
        document.body.appendChild(musicControl);
        document.body.appendChild(volumeControl);
        document.body.appendChild(audioVisualizer);
        
        // Store references
        this.musicControl = musicControl;
        this.volumeControl = volumeControl;
        this.audioVisualizer = audioVisualizer;
        this.volumeSlider = volumeControl.querySelector('.volume-slider');
        this.muteBtn = volumeControl.querySelector('.mute-btn');
        this.closeBtn = volumeControl.querySelector('.close-btn');
        this.visualizerBars = audioVisualizer.querySelectorAll('.visualizer-bar');
    }
    
    setupEventListeners() {
        // Music control button
        this.musicControl.addEventListener('click', () => {
            this.toggleMusic();
        });
        
        // Right-click for volume control
        this.musicControl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.toggleVolumeControl();
        });
        
        // Volume slider
        this.volumeSlider.addEventListener('input', (e) => {
            this.setVolume(parseFloat(e.target.value));
        });
        
        // Mute button
        this.muteBtn.addEventListener('click', () => {
            this.toggleMute();
        });
        
        // Close volume control
        this.closeBtn.addEventListener('click', () => {
            this.hideVolumeControl();
        });
        
        // Click outside to close volume control
        document.addEventListener('click', (e) => {
            if (!this.musicControl.contains(e.target) && !this.volumeControl.contains(e.target)) {
                this.hideVolumeControl();
            }
        });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isPlaying) {
                this.pauseMusic();
            }
        });
        
        // Handle audio context restrictions
        const handleUserInteraction = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
        };
        
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
    }
    
    async toggleMusic() {
        if (this.isPlaying) {
            this.pauseMusic();
        } else {
            await this.playMusic();
        }
    }
    
    async playMusic() {
        try {
            if (!this.audioContext || !this.audioBuffer) {
                console.error('Audio context or buffer not ready');
                return;
            }
            
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Create new source and nodes
            this.source = this.audioContext.createBufferSource();
            this.gainNode = this.audioContext.createGain();
            this.analyser = this.audioContext.createAnalyser();
            
            // Configure analyser for visualization
            this.analyser.fftSize = 128;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Connect audio graph
            this.source.buffer = this.audioBuffer;
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            // Set volume
            this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
            
            // Loop the audio
            this.source.loop = true;
            
            // Start playback
            const currentTime = this.audioContext.currentTime;
            this.source.start(0, this.pauseTime);
            this.startTime = currentTime - this.pauseTime;
            
            this.isPlaying = true;
            this.updateUI();
            this.startVisualization();
            
            console.log('✓ Background music started');
        } catch (error) {
            console.error('Error playing music:', error);
        }
    }
    
    pauseMusic() {
        if (this.source && this.isPlaying) {
            this.pauseTime = this.audioContext.currentTime - this.startTime;
            this.source.stop();
            this.source = null;
            this.isPlaying = false;
            this.updateUI();
            this.stopVisualization();
            
            console.log('✓ Background music paused');
        }
    }
    
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.gainNode) {
            this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
        }
        this.volumeSlider.value = this.volume;
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.gainNode) {
            this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
        }
        this.updateUI();
    }
    
    toggleVolumeControl() {
        this.volumeControl.classList.toggle('visible');
    }
    
    hideVolumeControl() {
        this.volumeControl.classList.remove('visible');
    }
    
    updateUI() {
        // Update play/pause button
        if (this.isPlaying) {
            this.musicControl.classList.remove('paused');
            this.musicControl.classList.add('playing');
        } else {
            this.musicControl.classList.remove('playing');
            this.musicControl.classList.add('paused');
        }
        
        // Update mute state
        if (this.isMuted) {
            this.musicControl.classList.add('muted');
            this.muteBtn.textContent = 'Unmute';
        } else {
            this.musicControl.classList.remove('muted');
            this.muteBtn.textContent = 'Mute';
        }
        
        // Update volume slider
        this.volumeSlider.value = this.volume;
        
        // Update aria label
        this.musicControl.setAttribute('aria-label', 
            this.isPlaying ? 'Pause background music' : 'Play background music'
        );
    }
    
    startVisualization() {
        if (!this.analyser) return;
        
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        
        const animate = () => {
            if (!this.isPlaying) return;
            
            this.analyser.getByteFrequencyData(dataArray);
            
            // Update visualizer bars
            this.visualizerBars.forEach((bar, index) => {
                const value = dataArray[index] || 0;
                const height = Math.max(4, (value / 255) * 40);
                bar.style.height = `${height}px`;
            });
            
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        this.audioVisualizer.classList.add('visible');
        animate();
    }
    
    stopVisualization() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.audioVisualizer.classList.remove('visible');
        
        // Reset bars
        this.visualizerBars.forEach(bar => {
            bar.style.height = '4px';
        });
    }
    
    // Cleanup method
    destroy() {
        this.pauseMusic();
        this.stopVisualization();
        
        if (this.musicControl) this.musicControl.remove();
        if (this.volumeControl) this.volumeControl.remove();
        if (this.audioVisualizer) this.audioVisualizer.remove();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Initialize background music system when DOM is loaded
let backgroundMusic = null;

function initBackgroundMusic() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        backgroundMusic = new BackgroundMusicSystem();
        console.log('✓ Background music system initialized');
    } else {
        console.log('⚠ Background music disabled due to reduced motion preference');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BackgroundMusicSystem, initBackgroundMusic };
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundMusic);
} else {
    initBackgroundMusic();
}