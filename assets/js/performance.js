// ===== PERFORMANCE OPTIMIZATION =====

class PerformanceOptimizer {
    constructor() {
        this.lazyImages = [];
        this.intersectionObserver = null;
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupCriticalResourceHints();
        this.setupServiceWorker();
        this.monitorPerformance();
    }

    // ===== LAZY LOADING =====
    setupLazyLoading() {
        // Lazy load images
        this.lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        this.intersectionObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            this.lazyImages.forEach(img => {
                this.intersectionObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.lazyImages.forEach(img => this.loadImage(img));
        }

        // Lazy load videos
        this.setupVideoLazyLoading();
    }

    loadImage(img) {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
        
        img.onload = () => {
            img.style.opacity = '1';
        };
    }

    setupVideoLazyLoading() {
        const lazyVideos = document.querySelectorAll('video[data-src]');
        
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        video.src = video.dataset.src;
                        video.load();
                        videoObserver.unobserve(video);
                    }
                });
            });

            lazyVideos.forEach(video => {
                videoObserver.observe(video);
            });
        }
    }

    // ===== IMAGE OPTIMIZATION =====
    setupImageOptimization() {
        // Convert images to WebP if supported
        this.setupWebPSupport();
        
        // Implement responsive images
        this.setupResponsiveImages();
    }

    setupWebPSupport() {
        // Check WebP support
        const webpSupported = this.supportsWebP();
        
        if (webpSupported) {
            document.documentElement.classList.add('webp');
        } else {
            document.documentElement.classList.add('no-webp');
        }
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    setupResponsiveImages() {
        const images = document.querySelectorAll('img[data-srcset]');
        
        images.forEach(img => {
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    }

    // ===== CRITICAL RESOURCE HINTS =====
    setupCriticalResourceHints() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Prefetch next page resources
        this.prefetchResources();
    }

    preloadCriticalResources() {
        const criticalResources = [
            { href: 'assets/css/style.css', as: 'style' },
            { href: 'assets/js/main.js', as: 'script' },
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
            document.head.appendChild(link);
        });
    }

    prefetchResources() {
        const prefetchResources = [
            'blog.html',
            'assets/images/kanthu-about.jpg',
            'assets/js/blog.js'
        ];

        // Prefetch after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                prefetchResources.forEach(resource => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = resource;
                    document.head.appendChild(link);
                });
            }, 2000);
        });
    }

    // ===== SERVICE WORKER =====
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // ===== PERFORMANCE MONITORING =====
    monitorPerformance() {
        // Monitor Core Web Vitals
        this.measureCoreWebVitals();
        
        // Monitor resource loading
        this.monitorResourceLoading();
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    monitorResourceLoading() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart);
            console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.fetchStart);
            console.log('First Paint:', performance.getEntriesByType('paint')[0]?.startTime);
        });
    }

    // ===== UTILITY METHODS =====
    
    // Debounce function for performance
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle function for performance
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

    // Request Animation Frame wrapper
    raf(callback) {
        if ('requestAnimationFrame' in window) {
            return requestAnimationFrame(callback);
        } else {
            return setTimeout(callback, 16);
        }
    }

    // Cancel Animation Frame wrapper
    cancelRaf(id) {
        if ('cancelAnimationFrame' in window) {
            cancelAnimationFrame(id);
        } else {
            clearTimeout(id);
        }
    }
}

// ===== RESOURCE COMPRESSION =====
class ResourceCompressor {
    constructor() {
        this.init();
    }

    init() {
        this.compressImages();
        this.minifyCSS();
        this.minifyJS();
    }

    compressImages() {
        // This would typically be done at build time
        console.log('Image compression should be done at build time');
    }

    minifyCSS() {
        // This would typically be done at build time
        console.log('CSS minification should be done at build time');
    }

    minifyJS() {
        // This would typically be done at build time
        console.log('JS minification should be done at build time');
    }
}

// ===== CACHING STRATEGY =====
class CacheManager {
    constructor() {
        this.cacheName = 'kanthu-website-v1';
        this.init();
    }

    init() {
        this.setupCacheHeaders();
        this.implementCacheStrategy();
    }

    setupCacheHeaders() {
        // This would be configured on the server
        console.log('Cache headers should be configured on the server');
    }

    implementCacheStrategy() {
        // Cache static assets
        const staticAssets = [
            '/',
            '/index.html',
            '/blog.html',
            '/assets/css/style.css',
            '/assets/css/responsive.css',
            '/assets/css/animations.css',
            '/assets/js/main.js',
            '/assets/js/blog.js',
            '/assets/js/performance.js'
        ];

        // This would be implemented in service worker
        console.log('Cache strategy should be implemented in service worker');
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    const performanceOptimizer = new PerformanceOptimizer();
    const resourceCompressor = new ResourceCompressor();
    const cacheManager = new CacheManager();
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PerformanceOptimizer,
        ResourceCompressor,
        CacheManager
    };
}
