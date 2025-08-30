// ===== SERVICE WORKER FOR CACHING =====

const CACHE_NAME = 'kanthu-website-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/blog.html',
    '/assets/css/style.css',
    '/assets/css/responsive.css',
    '/assets/css/animations.css',
    '/assets/css/blog.css',
    '/assets/js/main.js',
    '/assets/js/blog.js',
    '/assets/js/youtube-api.js',
    '/assets/js/performance.js',
    '/assets/images/logo.png',
    '/assets/images/kanthu-hero.jpg',
    '/assets/images/kanthu-about.jpg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache resources:', error);
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then(response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // Return offline page for navigation requests
                if (event.request.destination === 'document') {
                    return caches.match('/offline.html');
                }
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
    if (event.tag === 'newsletter-sync') {
        event.waitUntil(syncNewsletter());
    }
});

// Push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New content available!',
        icon: '/assets/images/logo.png',
        badge: '/assets/images/logo.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Content',
                icon: '/assets/images/logo.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/images/logo.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Best Tech in Telugu', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper functions
async function syncContactForm() {
    try {
        const formData = await getStoredFormData('contact-form');
        if (formData) {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                await clearStoredFormData('contact-form');
            }
        }
    } catch (error) {
        console.error('Failed to sync contact form:', error);
    }
}

async function syncNewsletter() {
    try {
        const formData = await getStoredFormData('newsletter');
        if (formData) {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                await clearStoredFormData('newsletter');
            }
        }
    } catch (error) {
        console.error('Failed to sync newsletter:', error);
    }
}

async function getStoredFormData(key) {
    return new Promise((resolve) => {
        // This would typically use IndexedDB
        resolve(null);
    });
}

async function clearStoredFormData(key) {
    return new Promise((resolve) => {
        // This would typically clear from IndexedDB
        resolve();
    });
}
