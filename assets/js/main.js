// ===== MAIN JAVASCRIPT FILE =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Navigation functionality
    initNavigation();
    
    // Hero stats counter
    initStatsCounter();
    
    // Video section functionality
    initVideoSection();
    
    // Blog section functionality
    initBlogSection();
    
    // Contact form functionality
    initContactForm();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Scroll effects
    initScrollEffects();
});

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Active link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== STATS COUNTER =====
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateStats() {
        if (animated) return;
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + (target >= 1000 ? 'K' : '') + (target >= 1000000 ? 'M' : '');
            }, 20);
        });
        
        animated = true;
    }

    // Trigger animation when hero section is in view
    const heroSection = document.querySelector('.hero');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
            }
        });
    });
    
    if (heroSection) {
        observer.observe(heroSection);
    }
}

// ===== VIDEO SECTION =====
function initVideoSection() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const videosGrid = document.getElementById('videos-grid');
    const loadMoreBtn = document.getElementById('load-more-videos');
    
    let currentFilter = 'all';
    let videosLoaded = 0;
    const videosPerLoad = 6;

    // Sample video data (replace with actual YouTube API data)
    const sampleVideos = [
        {
            id: '1',
            title: 'Best Power Banks Under Rs.1500 - Complete Review',
            thumbnail: 'assets/images/video-thumb-1.jpg',
            duration: '12:45',
            views: '25K',
            category: 'reviews',
            url: 'https://youtube.com/watch?v=77VFlFhaP18'
        },
        {
            id: '2',
            title: 'DON\'T Buy Screen Protector Before Watching This',
            thumbnail: 'assets/images/video-thumb-2.jpg',
            duration: '8:30',
            views: '18K',
            category: 'tutorials',
            url: 'https://youtube.com/watch?v=2praZzvNmH4'
        },
        {
            id: '3',
            title: 'Best Trimmers for Men in 2025 - Detailed Review',
            thumbnail: 'assets/images/video-thumb-3.jpg',
            duration: '15:20',
            views: '32K',
            category: 'reviews',
            url: 'https://youtube.com/watch?v=m6YeIyYtUHY'
        },
        {
            id: '4',
            title: 'Beware of TWS Earphones - What You Need to Know',
            thumbnail: 'assets/images/video-thumb-4.jpg',
            duration: '10:15',
            views: '22K',
            category: 'tutorials',
            url: 'https://youtube.com/watch?v=KxTwbmIF3qs'
        },
        {
            id: '5',
            title: 'Latest Smartphone Unboxing - First Impressions',
            thumbnail: 'assets/images/video-thumb-5.jpg',
            duration: '14:30',
            views: '28K',
            category: 'unboxing',
            url: '#'
        },
        {
            id: '6',
            title: 'Tech Podcast - Future of Technology',
            thumbnail: 'assets/images/video-thumb-6.jpg',
            duration: '45:20',
            views: '15K',
            category: 'tutorials',
            url: 'https://youtube.com/watch?v=SljRIxALkKM'
        }
    ];

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            videosLoaded = 0;
            loadVideos(true);
        });
    });

    // Load more functionality
    loadMoreBtn.addEventListener('click', () => {
        loadVideos(false);
    });

    function loadVideos(reset = false) {
        if (reset) {
            videosGrid.innerHTML = '';
            videosLoaded = 0;
        }

        const filteredVideos = currentFilter === 'all' 
            ? sampleVideos 
            : sampleVideos.filter(video => video.category === currentFilter);

        const videosToShow = filteredVideos.slice(videosLoaded, videosLoaded + videosPerLoad);
        
        videosToShow.forEach((video, index) => {
            const videoCard = createVideoCard(video);
            videosGrid.appendChild(videoCard);
            
            // Add animation delay
            setTimeout(() => {
                videoCard.style.opacity = '1';
                videoCard.style.transform = 'translateY(0)';
            }, index * 100);
        });

        videosLoaded += videosToShow.length;
        
        // Hide load more button if all videos are loaded
        if (videosLoaded >= filteredVideos.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        
        card.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='assets/images/placeholder-video.jpg'">
                <div class="video-overlay">
                    <div class="play-btn">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-meta">
                    <span class="video-views">${video.views} views</span>
                    <span class="video-category">${video.category}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (video.url !== '#') {
                window.open(video.url, '_blank');
            }
        });
        
        return card;
    }

    // Initial load
    loadVideos();
}

// ===== BLOG SECTION =====
function initBlogSection() {
    const blogGrid = document.getElementById('blog-grid');
    
    // Sample blog data
    const sampleBlogs = [
        {
            title: 'Top 10 Smartphones to Buy in 2024',
            excerpt: 'Comprehensive guide to the best smartphones available in the market with detailed comparisons and recommendations.',
            image: 'assets/images/blog-1.jpg',
            date: '2024-01-15',
            category: 'Reviews',
            readTime: '5 min read'
        },
        {
            title: 'How to Choose the Perfect Laptop for Your Needs',
            excerpt: 'Everything you need to know about selecting the right laptop based on your requirements and budget.',
            image: 'assets/images/blog-2.jpg',
            date: '2024-01-10',
            category: 'Guides',
            readTime: '8 min read'
        },
        {
            title: 'Future of Artificial Intelligence in Consumer Tech',
            excerpt: 'Exploring how AI is revolutionizing everyday technology and what to expect in the coming years.',
            image: 'assets/images/blog-3.jpg',
            date: '2024-01-05',
            category: 'Tech Trends',
            readTime: '6 min read'
        }
    ];

    sampleBlogs.forEach((blog, index) => {
        const blogCard = createBlogCard(blog);
        blogGrid.appendChild(blogCard);
    });

    function createBlogCard(blog) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', '100');
        
        card.innerHTML = `
            <div class="blog-image">
                <img src="${blog.image}" alt="${blog.title}" onerror="this.src='assets/images/placeholder-blog.jpg'">
                <div class="blog-category">${blog.category}</div>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-date">${formatDate(blog.date)}</span>
                    <span class="blog-read-time">${blog.readTime}</span>
                </div>
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-excerpt">${blog.excerpt}</p>
                <a href="#" class="blog-link">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        
        return card;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== THEME TOGGLE (Optional) =====
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    initScrollEffects();
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here
});

// ===== ACCESSIBILITY =====
// Focus management for mobile menu
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.focus();
        }
    }
});

// ===== YOUTUBE API INTEGRATION (Optional) =====
// Uncomment and configure if you want to fetch real YouTube data
/*
async function fetchYouTubeVideos() {
    const API_KEY = 'YOUR_YOUTUBE_API_KEY';
    const CHANNEL_ID = 'YOUR_CHANNEL_ID';
    const maxResults = 12;
    
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}`
        );
        
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}
*/
