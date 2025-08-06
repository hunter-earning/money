// Configuration
const CONFIG = {
    // ... existing config ...
};

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = isMobileDevice();
    
    initializeBackground(isMobile);
    initializeAppCards(isMobile);
    initializeVideo();
});

// Video Initialization
function initializeVideo() {
    const video = document.querySelector('.background-video');
    if (!video) return;

    // Remove muted attribute to allow sound
    video.removeAttribute('muted');
    
    // Try to play video with sound
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Video is playing with sound
            console.log('Video playing with sound');
        }).catch(error => {
            // Auto-play with sound was prevented
            console.log('Autoplay with sound prevented:', error);
            
            // Add muted attribute and try again
            video.muted = true;
            video.play().catch(error => {
                console.log('Autoplay even with mute prevented:', error);
            });
        });
    }

    // Add click handler to unmute
    video.addEventListener('click', () => {
        if (video.muted) {
            video.muted = false;
        }
    });

    // Handle visibility change to prevent stopping when tab is inactive
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            video.play();
        }
    });
}

// Function to handle image loading effects
function initImageLoading() {
    const appIcons = document.querySelectorAll('.app-icon');
    
    appIcons.forEach(icon => {
        const img = icon.querySelector('img');
        if (img) {
            // Add loading class initially
            icon.classList.add('loading');
            
            // Handle image load
            img.onload = () => {
                icon.classList.remove('loading');
                icon.classList.add('loaded');
                
                // Simple fade in
                img.style.opacity = '0';
                requestAnimationFrame(() => {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                });
            };
            
            // Handle image error
            img.onerror = () => {
                icon.classList.remove('loading');
                icon.classList.add('error');
            };
            
            // If image is already loaded
            if (img.complete) {
                img.onload();
            }
        }
    });
}

// Function to create background particles
function createBackgroundParticles(isMobile) {
    const particleCount = isMobile ? 15 : 50;
    const stars = document.querySelector('.stars');
    
    if (stars) {
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            
            // Smaller size on mobile
            const size = isMobile ? Math.random() * 2 + 1 : Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Slower animation on mobile
            const duration = isMobile ? Math.random() * 8 + 8 : Math.random() * 10 + 10;
            particle.style.animationDuration = `${duration}s`;
            
            stars.appendChild(particle);
        }
    }
}

// Function to add entrance animations for app cards
function initAppCardAnimations(isMobile) {
    const appCards = document.querySelectorAll('.app-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Simpler animation for mobile
                if (isMobile) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                } else {
                    // Desktop animations
                    const elements = [
                        entry.target.querySelector('.app-icon'),
                        entry.target.querySelector('.app-title'),
                        entry.target.querySelector('.app-tags'),
                        entry.target.querySelector('.app-details p'),
                        entry.target.querySelector('.app-link')
                    ];
                    
                    elements.forEach((el, index) => {
                        if (el) {
                            setTimeout(() => {
                                el.style.opacity = '1';
                                el.style.transform = 'translateY(0)';
                            }, index * 100);
                        }
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    });
    
    appCards.forEach(card => {
        // Set initial states
        if (isMobile) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.3s ease';
        } else {
            const elements = card.querySelectorAll('.app-header, .app-details p, .app-link');
            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        }
        
        observer.observe(card);
    });
}

// Function to add interactive effects to app cards
function initAppCardInteractions(isMobile) {
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(card => {
        if (!isMobile) {
            // Desktop hover effects
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'none';
            });
        } else {
            // Simple touch feedback for mobile
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            card.addEventListener('touchend', () => {
                card.style.transform = 'none';
            }, { passive: true });
        }
    });
}

// Function to create typing effect for the tagline
function createTypingEffect(isMobile) {
    const tagline = document.querySelector('.tagline');
    if (!tagline) return;
    
    const text = tagline.textContent;
    tagline.textContent = '';
    
    const typingSpeed = isMobile ? 30 : 50;
    let i = 0;
    
    const interval = setInterval(() => {
        if (i < text.length) {
            tagline.textContent = text.substring(0, i + 1);
            i++;
        } else {
            clearInterval(interval);
            tagline.classList.add('typed');
        }
    }, typingSpeed);
}

// Function to refresh animations
function refreshAppCardAnimations() {
    const appCards = document.querySelectorAll('.app-card:not(.animated)');
    appCards.forEach(card => {
        card.classList.add('animated');
        card.style.opacity = '1';
        card.style.transform = 'none';
    });
}