// ===== BLOG PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initBlogPage();
});

function initBlogPage() {
    // Initialize blog functionality
    initBlogFilters();
    initBlogSearch();
    initBlogPagination();
    initNewsletterForm();
    loadBlogArticles();
    loadPopularArticles();
}

// Sample blog articles data
const blogArticles = [
    {
        id: 1,
        title: 'Top 10 Smartphones to Buy in 2024 - Complete Buying Guide',
        excerpt: 'Comprehensive guide to the best smartphones available in the market with detailed comparisons, pros and cons, and recommendations for different budgets.',
        content: 'Full article content here...',
        image: 'assets/images/blog-1.jpg',
        date: '2024-01-15',
        category: 'reviews',
        author: 'Kanthu Devarakonda',
        readTime: '8 min read',
        views: 1250,
        tags: ['smartphones', 'reviews', '2024', 'buying guide']
    },
    {
        id: 2,
        title: 'How to Choose the Perfect Laptop for Your Needs',
        excerpt: 'Everything you need to know about selecting the right laptop based on your requirements, usage patterns, and budget constraints.',
        content: 'Full article content here...',
        image: 'assets/images/blog-2.jpg',
        date: '2024-01-10',
        category: 'guides',
        author: 'Kanthu Devarakonda',
        readTime: '10 min read',
        views: 980,
        tags: ['laptops', 'buying guide', 'productivity']
    },
    {
        id: 3,
        title: 'Future of Artificial Intelligence in Consumer Technology',
        excerpt: 'Exploring how AI is revolutionizing everyday technology and what consumers can expect in the coming years.',
        content: 'Full article content here...',
        image: 'assets/images/blog-3.jpg',
        date: '2024-01-05',
        category: 'trends',
        author: 'Kanthu Devarakonda',
        readTime: '12 min read',
        views: 1580,
        tags: ['AI', 'artificial intelligence', 'future tech', 'trends']
    },
    {
        id: 4,
        title: 'Best Budget Earphones Under Rs. 2000 - Detailed Review',
        excerpt: 'Complete review of the best budget-friendly earphones that deliver excellent sound quality without breaking the bank.',
        content: 'Full article content here...',
        image: 'assets/images/blog-4.jpg',
        date: '2024-01-01',
        category: 'reviews',
        author: 'Kanthu Devarakonda',
        readTime: '6 min read',
        views: 890,
        tags: ['earphones', 'budget', 'audio', 'reviews']
    },
    {
        id: 5,
        title: 'Complete Guide to Setting Up Your Home Office Tech',
        excerpt: 'Step-by-step tutorial on creating the perfect tech setup for your home office, including essential gadgets and accessories.',
        content: 'Full article content here...',
        image: 'assets/images/blog-5.jpg',
        date: '2023-12-28',
        category: 'tutorials',
        author: 'Kanthu Devarakonda',
        readTime: '15 min read',
        views: 720,
        tags: ['home office', 'productivity', 'setup', 'tutorials']
    },
    {
        id: 6,
        title: 'Gaming Laptops vs Desktop PCs - Which Should You Choose?',
        excerpt: 'Detailed comparison between gaming laptops and desktop PCs to help you make the right choice for your gaming needs.',
        content: 'Full article content here...',
        image: 'assets/images/blog-6.jpg',
        date: '2023-12-25',
        category: 'guides',
        author: 'Kanthu Devarakonda',
        readTime: '9 min read',
        views: 1100,
        tags: ['gaming', 'laptops', 'desktop', 'comparison']
    }
];

let currentFilter = 'all';
let currentPage = 1;
let articlesPerPage = 5;
let filteredArticles = [...blogArticles];

// ===== BLOG FILTERS =====
function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.blog-filters .filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.getAttribute('data-filter');
            currentPage = 1;
            filterAndDisplayArticles();
        });
    });
    
    // Category links in sidebar
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            const targetBtn = document.querySelector(`[data-filter="${category}"]`);
            if (targetBtn) {
                targetBtn.classList.add('active');
            }
            
            currentFilter = category;
            currentPage = 1;
            filterAndDisplayArticles();
        });
    });
}

// ===== BLOG SEARCH =====
function initBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            currentPage = 1;
            filterAndDisplayArticles(searchTerm);
        }, 300);
    });
}

// ===== FILTER AND DISPLAY ARTICLES =====
function filterAndDisplayArticles(searchTerm = '') {
    // Filter by category
    let filtered = currentFilter === 'all' 
        ? [...blogArticles] 
        : blogArticles.filter(article => article.category === currentFilter);
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(article => 
            article.title.toLowerCase().includes(searchTerm) ||
            article.excerpt.toLowerCase().includes(searchTerm) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    filteredArticles = filtered;
    displayArticles();
    updatePagination();
}

// ===== DISPLAY ARTICLES =====
function displayArticles() {
    const blogGrid = document.getElementById('blog-articles-grid');
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = filteredArticles.slice(startIndex, endIndex);
    
    if (articlesToShow.length === 0) {
        blogGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No articles found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }
    
    blogGrid.innerHTML = '';
    
    articlesToShow.forEach((article, index) => {
        const articleCard = createBlogArticleCard(article);
        blogGrid.appendChild(articleCard);
        
        // Add staggered animation
        setTimeout(() => {
            articleCard.style.opacity = '1';
            articleCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function createBlogArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    
    card.innerHTML = `
        <div class="blog-image">
            <img src="${article.image}" alt="${article.title}" onerror="this.src='assets/images/placeholder-blog.jpg'">
            <div class="blog-category">${article.category.charAt(0).toUpperCase() + article.category.slice(1)}</div>
        </div>
        <div class="blog-content">
            <div class="blog-meta">
                <span class="blog-date">${formatDate(article.date)}</span>
                <span class="blog-read-time">${article.readTime}</span>
            </div>
            <h3 class="blog-title">${article.title}</h3>
            <p class="blog-excerpt">${article.excerpt}</p>
            <div class="blog-footer">
                <div class="blog-stats">
                    <span class="blog-views"><i class="fas fa-eye"></i> ${article.views}</span>
                    <span class="blog-author">By ${article.author}</span>
                </div>
                <a href="article.html?id=${article.id}" class="blog-link">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// ===== PAGINATION =====
function initBlogPagination() {
    // Pagination will be handled by updatePagination function
}

function updatePagination() {
    const pagination = document.getElementById('blog-pagination');
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span class="pagination-dots">...</span>';
        }
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayArticles();
    updatePagination();
    
    // Scroll to top of blog content
    document.querySelector('.blog-main').scrollIntoView({ behavior: 'smooth' });
}

// ===== POPULAR ARTICLES =====
function loadPopularArticles() {
    const popularContainer = document.getElementById('popular-articles');
    const popularArticles = [...blogArticles]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    
    popularContainer.innerHTML = '';
    
    popularArticles.forEach(article => {
        const popularItem = document.createElement('div');
        popularItem.className = 'popular-article';
        
        popularItem.innerHTML = `
            <div class="popular-article-image">
                <img src="${article.image}" alt="${article.title}" onerror="this.src='assets/images/placeholder-blog.jpg'">
            </div>
            <div class="popular-article-content">
                <h4><a href="article.html?id=${article.id}">${article.title}</a></h4>
                <div class="popular-article-meta">
                    ${formatDate(article.date)} • ${article.views} views
                </div>
            </div>
        `;
        
        popularContainer.appendChild(popularItem);
    });
}

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate newsletter subscription
        showNotification('Successfully subscribed to newsletter!', 'success');
        this.reset();
    });
}

// ===== LOAD BLOG ARTICLES =====
function loadBlogArticles() {
    filteredArticles = [...blogArticles];
    displayArticles();
    updatePagination();
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Make changePage function global for onclick handlers
window.changePage = changePage;
