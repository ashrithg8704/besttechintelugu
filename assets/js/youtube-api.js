// ===== YOUTUBE API INTEGRATION =====

class YouTubeAPI {
    constructor(apiKey, channelId) {
        this.apiKey = apiKey;
        this.channelId = channelId;
        this.baseURL = 'https://www.googleapis.com/youtube/v3';
    }

    // Fetch channel statistics
    async getChannelStats() {
        try {
            const response = await fetch(
                `${this.baseURL}/channels?part=statistics&id=${this.channelId}&key=${this.apiKey}`
            );
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                return data.items[0].statistics;
            }
            return null;
        } catch (error) {
            console.error('Error fetching channel stats:', error);
            return null;
        }
    }

    // Fetch latest videos
    async getLatestVideos(maxResults = 12) {
        try {
            const response = await fetch(
                `${this.baseURL}/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet&order=date&maxResults=${maxResults}&type=video`
            );
            const data = await response.json();
            
            if (data.items) {
                // Get video details including duration and view count
                const videoIds = data.items.map(item => item.id.videoId).join(',');
                const detailsResponse = await fetch(
                    `${this.baseURL}/videos?key=${this.apiKey}&id=${videoIds}&part=contentDetails,statistics`
                );
                const detailsData = await detailsResponse.json();
                
                // Combine search results with detailed info
                return data.items.map((item, index) => {
                    const details = detailsData.items[index];
                    return {
                        id: item.id.videoId,
                        title: item.snippet.title,
                        description: item.snippet.description,
                        thumbnail: item.snippet.thumbnails.medium.url,
                        publishedAt: item.snippet.publishedAt,
                        duration: this.formatDuration(details.contentDetails.duration),
                        viewCount: this.formatViewCount(details.statistics.viewCount),
                        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                        category: this.categorizeVideo(item.snippet.title)
                    };
                });
            }
            return [];
        } catch (error) {
            console.error('Error fetching videos:', error);
            return [];
        }
    }

    // Fetch videos by search query
    async searchVideos(query, maxResults = 10) {
        try {
            const response = await fetch(
                `${this.baseURL}/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video`
            );
            const data = await response.json();
            
            if (data.items) {
                return data.items.map(item => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnail: item.snippet.thumbnails.medium.url,
                    publishedAt: item.snippet.publishedAt,
                    url: `https://www.youtube.com/watch?v=${item.id.videoId}`
                }));
            }
            return [];
        } catch (error) {
            console.error('Error searching videos:', error);
            return [];
        }
    }

    // Format ISO 8601 duration to readable format
    formatDuration(duration) {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = (match[1] || '').replace('H', '');
        const minutes = (match[2] || '').replace('M', '');
        const seconds = (match[3] || '').replace('S', '');
        
        let formatted = '';
        if (hours) formatted += hours + ':';
        formatted += (minutes || '0').padStart(2, '0') + ':';
        formatted += (seconds || '0').padStart(2, '0');
        
        return formatted;
    }

    // Format view count to readable format
    formatViewCount(count) {
        const num = parseInt(count);
        if (num >= 1000000) {
            return Math.floor(num / 1000000) + 'M';
        } else if (num >= 1000) {
            return Math.floor(num / 1000) + 'K';
        }
        return num.toString();
    }

    // Categorize videos based on title keywords
    categorizeVideo(title) {
        const titleLower = title.toLowerCase();
        
        if (titleLower.includes('review') || titleLower.includes('best') || titleLower.includes('vs')) {
            return 'reviews';
        } else if (titleLower.includes('unboxing') || titleLower.includes('first look')) {
            return 'unboxing';
        } else if (titleLower.includes('how to') || titleLower.includes('tutorial') || titleLower.includes('guide')) {
            return 'tutorials';
        } else {
            return 'general';
        }
    }
}

// ===== YOUTUBE INTEGRATION MANAGER =====
class YouTubeIntegration {
    constructor() {
        this.api = null;
        this.isInitialized = false;
    }

    // Initialize with API credentials
    init(apiKey, channelId) {
        if (!apiKey || !channelId) {
            console.warn('YouTube API credentials not provided. Using sample data.');
            return false;
        }
        
        this.api = new YouTubeAPI(apiKey, channelId);
        this.isInitialized = true;
        return true;
    }

    // Update channel statistics in hero section
    async updateChannelStats() {
        if (!this.isInitialized) return;
        
        try {
            const stats = await this.api.getChannelStats();
            if (stats) {
                // Update subscriber count
                const subscriberElement = document.querySelector('[data-count="100"]');
                if (subscriberElement) {
                    const subscriberCount = Math.floor(stats.subscriberCount / 1000);
                    subscriberElement.setAttribute('data-count', subscriberCount);
                }
                
                // Update video count
                const videoElement = document.querySelector('[data-count="500"]');
                if (videoElement) {
                    videoElement.setAttribute('data-count', stats.videoCount);
                }
                
                // Update view count
                const viewElement = document.querySelector('[data-count="1"]');
                if (viewElement) {
                    const viewCount = Math.floor(stats.viewCount / 1000000);
                    viewElement.setAttribute('data-count', viewCount);
                }
            }
        } catch (error) {
            console.error('Error updating channel stats:', error);
        }
    }

    // Load real videos into the video section
    async loadVideos() {
        if (!this.isInitialized) return [];
        
        try {
            const videos = await this.api.getLatestVideos(12);
            return videos;
        } catch (error) {
            console.error('Error loading videos:', error);
            return [];
        }
    }

    // Search videos
    async searchVideos(query) {
        if (!this.isInitialized) return [];
        
        try {
            const videos = await this.api.searchVideos(query);
            return videos;
        } catch (error) {
            console.error('Error searching videos:', error);
            return [];
        }
    }
}

// ===== CONFIGURATION =====
// To enable YouTube API integration, uncomment and configure these:
/*
const YOUTUBE_CONFIG = {
    API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
    CHANNEL_ID: 'YOUR_CHANNEL_ID_HERE'
};
*/

// ===== INITIALIZATION =====
const youtubeIntegration = new YouTubeIntegration();

// Initialize YouTube integration if credentials are available
document.addEventListener('DOMContentLoaded', function() {
    // Uncomment to enable YouTube API
    /*
    if (typeof YOUTUBE_CONFIG !== 'undefined') {
        const initialized = youtubeIntegration.init(YOUTUBE_CONFIG.API_KEY, YOUTUBE_CONFIG.CHANNEL_ID);
        
        if (initialized) {
            // Update stats and load real videos
            youtubeIntegration.updateChannelStats();
            loadRealVideos();
        }
    }
    */
});

// ===== LOAD REAL VIDEOS FUNCTION =====
async function loadRealVideos() {
    const videosGrid = document.getElementById('videos-grid');
    const loadMoreBtn = document.getElementById('load-more-videos');
    
    // Show loading state
    videosGrid.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Loading videos...</p></div>';
    
    try {
        const videos = await youtubeIntegration.loadVideos();
        
        if (videos.length > 0) {
            // Clear loading state
            videosGrid.innerHTML = '';
            
            // Replace sample videos with real ones
            videos.forEach((video, index) => {
                const videoCard = createRealVideoCard(video);
                videosGrid.appendChild(videoCard);
                
                // Add animation delay
                setTimeout(() => {
                    videoCard.style.opacity = '1';
                    videoCard.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
            // Hide load more button since we're showing all videos
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        } else {
            // Fallback to sample data
            videosGrid.innerHTML = '';
            console.log('No videos found, using sample data');
        }
    } catch (error) {
        console.error('Error loading real videos:', error);
        // Fallback to sample data
        videosGrid.innerHTML = '';
    }
}

function createRealVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    
    card.innerHTML = `
        <div class="video-thumbnail">
            <img src="${video.thumbnail}" alt="${video.title}">
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
                <span class="video-views">${video.viewCount} views</span>
                <span class="video-date">${formatVideoDate(video.publishedAt)}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.open(video.url, '_blank');
    });
    
    return card;
}

function formatVideoDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

// Export for use in other files
window.YouTubeIntegration = YouTubeIntegration;
window.youtubeIntegration = youtubeIntegration;
