// Detect if the page is being served from Spring Boot or another origin (like IntelliJ)
const API_BASE = (window.location.origin.includes('localhost:8081')) ? '/api' : 'http://localhost:8081/api';

// Helper to handle fetch errors more clearly
function safeFetch(url, options = {}) {
    return fetch(url, options).catch(err => {
        if (window.location.protocol === 'file:') {
            alert("Chrome blocks data loading when you open the file directly (file://). Please use IntelliJ's 'Open in Browser' icon OR go to http://localhost:8081.");
        } else {
            console.error("Connection failed to backend:", err);
        }
        throw err;
    });
}
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }, 500); // Minimum display time of 500ms
    }
});

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Slight delay for the outline
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation with Intersection Observer (More Performant)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Handle staggered items within the section
            const staggerItems = entry.target.querySelectorAll('.stagger-item');
            staggerItems.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('active');
                }, index * 150);
            });

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .room-detail-card').forEach(el => {
    observer.observe(el);
});

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    // Parallax for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = -(scrolled * 0.4) + 'px';
    }

    // Smooth navbar appearance
    const nav = document.getElementById('navbar');
    if (scrolled > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate hamburger to X
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 6px)' : 'none';
        spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(5px, -6px)' : 'none';
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = menuBtn.querySelectorAll('span');
        spans.forEach(span => span.style.transform = 'none');
        spans[1].style.opacity = '1';
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');

        // Change icon
        if (item.classList.contains('active')) {
            question.style.setProperty('--icon', '"-"');
        } else {
            question.style.setProperty('--icon', '"+"');
        }
    });
});

// Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show a "sending" state
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        const payload = {
            name: document.getElementById('contact_name').value,
            email: document.getElementById('contact_email').value,
            roomType: document.getElementById('contact_room').value,
            message: document.getElementById('contact_message').value
        };

        // Real API call
        safeFetch(`${API_BASE}/inquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (res.ok) {
                    alert('Thank you for your inquiry! Our team will contact you shortly.');
                    contactForm.reset();
                } else {
                    alert('Oops! Something went wrong. Please try again later.');
                }
            })
            .catch(err => {
                alert('Oops! Something went wrong. Please check your connection.');
            })
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
    });
}


// --- Dynamic Content Loading ---
function loadDynamicContent() {
    const dynamicRooms = document.getElementById('dynamic-rooms');
    const dynamicRoomsFull = document.getElementById('dynamic-rooms-full');

    // Rooms
    if (dynamicRooms || dynamicRoomsFull) {
        safeFetch(`${API_BASE}/rooms`)
            .then(res => res.json())
            .then(rooms => {
                if (dynamicRooms) {
                    if (rooms.length === 0) {
                        dynamicRooms.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No rooms available at the moment.</p>';
                    } else {
                        dynamicRooms.innerHTML = '';
                        rooms.forEach(room => {
                            const card = document.createElement('div');
                            card.className = 'room-card';
                            card.innerHTML = `
                                <div class="room-img" style="background-image: url('${room.imagePath}');"></div>
                                <div class="room-info">
                                    <span class="room-price">From $${room.price} / Night</span>
                                    <h4>${room.name}</h4>
                                    <p>${room.description.substring(0, 100)}...</p>
                                    <br>
                                    <a href="rooms.html" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.7rem;">Explore Suites</a>
                                </div>
                            `;
                            dynamicRooms.appendChild(card);
                        });
                    }
                }

                if (dynamicRoomsFull) {
                    if (rooms.length === 0) {
                        dynamicRoomsFull.innerHTML = '<p style="text-align:center;">No rooms available at the moment.</p>';
                    } else {
                        dynamicRoomsFull.innerHTML = '';
                        rooms.forEach(room => {
                            const detailCard = document.createElement('div');
                            detailCard.className = 'room-detail-card reveal';
                            detailCard.innerHTML = `
                                <div class="room-image-large"><img src="${room.imagePath}" alt="${room.name}"></div>
                                <div class="room-text">
                                    <p style="color: var(--secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">Premium Comfort</p>
                                    <h2 style="font-size: 2.5rem; margin-bottom: 20px;">${room.name}</h2>
                                    <p>${room.description}</p>
                                    <ul class="amenities">
                                        <li>🌊 Private Balcony</li>
                                        <li>📶 High-speed Wi-Fi</li>
                                        <li>📺 55" Smart TV</li>
                                    </ul>
                                    <h3 style="color: var(--primary); margin-bottom: 25px;">$${room.price} <span style="font-size: 1rem; color: #888;">/ per night</span></h3>
                                    <a href="index.html#contact" class="btn btn-primary">Reserve Now</a>
                                </div>
                            `;
                            dynamicRoomsFull.appendChild(detailCard);
                            if (typeof observer !== "undefined") {
                                setTimeout(() => { observer.observe(detailCard); }, 100);
                            }
                        });
                    }
                }
            }).catch(err => console.error('Error loading rooms:', err));
    }

    // Reviews
    const dynamicReviews = document.getElementById('dynamic-reviews');
    if (dynamicReviews) {
        safeFetch(`${API_BASE}/reviews`)
            .then(res => res.json())
            .then(reviews => {
                // Support both 'approved' and 'isApproved' property names
                const approvedReviews = reviews.filter(r => (r.approved === true || r.isApproved === true));
                if (approvedReviews.length === 0) {
                    dynamicReviews.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No reviews yet. Be the first to share your experience!</p>';
                } else {
                    dynamicReviews.innerHTML = '';
                    approvedReviews.forEach(rev => {
                        dynamicReviews.innerHTML += `
                            <div style="background: #f8f9fa; padding: 40px; border-radius: 20px; border-left: 5px solid var(--secondary);">
                                <div style="color: var(--secondary); margin-bottom: 15px;">⭐⭐⭐⭐⭐</div>
                                <p style="font-style: italic; margin-bottom: 20px;">"${rev.text}"</p>
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <div style="width: 50px; height: 50px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">${rev.author ? rev.author.charAt(0) : '?'}</div>
                                    <div>
                                        <h5 style="color: var(--primary); margin-bottom: 5px;">${rev.author}</h5>
                                        <small style="color: #666;">${rev.country}</small>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                }
            }).catch(err => console.error('Error loading reviews:', err));
    }

    // Gallery
    const dynamicGallery = document.getElementById('dynamic-gallery');
    if (dynamicGallery) {
        safeFetch(`${API_BASE}/gallery`)
            .then(res => res.json())
            .then(images => {
                if (images.length > 0) {
                    const moreCard = dynamicGallery.lastElementChild;
                    dynamicGallery.innerHTML = '';
                    images.forEach(img => {
                        dynamicGallery.innerHTML += `<div class="gallery-item"><img src="${img.imagePath}" alt="${img.title || 'Resort Photo'}"></div>`;
                    });
                    if (moreCard) dynamicGallery.appendChild(moreCard);
                }
            }).catch(err => console.error('Error loading gallery:', err));
    }

    // Menu
    const dynamicMenu = document.getElementById('dynamic-menu');
    if (dynamicMenu) {
        safeFetch(`${API_BASE}/menu`)
            .then(res => res.json())
            .then(menuItems => {
                if (menuItems.length === 0) {
                    dynamicMenu.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Menu is currently being updated.</p>';
                    return;
                }
                const menuByCategory = {};
                menuItems.forEach(item => {
                    if (!menuByCategory[item.category]) menuByCategory[item.category] = [];
                    menuByCategory[item.category].push(item);
                });
                dynamicMenu.innerHTML = '';
                Object.keys(menuByCategory).forEach(category => {
                    const section = document.createElement('div');
                    section.className = 'menu-section';
                    let html = `<h3 style="color: var(--secondary); margin-bottom: 30px; font-size: 1.8rem;">${category}</h3>`;
                    menuByCategory[category].forEach(item => {
                        let badges = '';
                        // Support both 'veg'/'spicy' and 'isVeg'/'isSpicy' property names
                        if (item.veg || item.isVeg) badges += `<span class="food-badge badge-veg">Veg</span> `;
                        if (item.spicy || item.isSpicy) badges += `<span class="food-badge badge-spicy">Spicy</span>`;
                        let imageHtml = item.imagePath ? `
                            <div style="width: 80px; height: 80px; flex-shrink: 0; margin-right: 15px;">
                                <img src="${item.imagePath}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
                            </div>
                        ` : '';
                        html += `
                            <div class="menu-item" style="justify-content: flex-start; align-items: center; gap: 10px;">
                                ${imageHtml}
                                <div class="item-info" style="flex-grow: 1;">
                                    <h4>${item.name} ${badges}</h4>
                                    <p>${item.description}</p>
                                </div>
                                <div class="price" style="margin-left: auto;">$${item.price}</div>
                            </div>
                        `;
                    });
                    section.innerHTML = html;
                    dynamicMenu.appendChild(section);
                });
            }).catch(err => console.error('Error loading menu:', err));
    }

    // Offers
    const offersSection = document.getElementById('offers-section');
    const dynamicOffers = document.getElementById('dynamic-offers');
    if (offersSection && dynamicOffers) {
        safeFetch(`${API_BASE}/offers`).then(res => res.json())
            .then(offers => {
                if (offers.length > 0) {
                    offersSection.style.display = 'block';
                    dynamicOffers.innerHTML = '';
                    offers.forEach(offer => {
                        const card = document.createElement('div');
                        card.className = 'room-card hover-scale';
                        card.innerHTML = `
                            <div class="room-img" style="background-image: url('${offer.imagePath}'); height: 200px;"></div>
                            <div class="room-info" style="padding: 20px;">
                                <span class="room-price" style="color:var(--secondary); font-size:1.2rem;">${offer.discount}</span>
                                <h4 style="margin: 10px 0;">${offer.title}</h4>
                                <p style="font-size:0.9rem; color:#666; margin-bottom:15px;">${offer.description}</p>
                                <a href="#contact" class="btn btn-primary" style="padding: 8px 15px; font-size: 0.8rem;">Claim Offer</a>
                            </div>
                        `;
                        dynamicOffers.appendChild(card);
                    });
                }
            }).catch(err => console.error('Error loading offers:', err));
    }
}

// Review Form Submission Logic
function initReviewForm() {
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = reviewForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Submitting...';
            btn.disabled = true;

            const payload = {
                author: document.getElementById('rev_name').value,
                country: document.getElementById('rev_country').value,
                text: document.getElementById('rev_text').value,
                rating: 5,
                approved: false // Customers reviews must be approved
            };

            safeFetch(`${API_BASE}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(res => {
                if (res.ok) {
                    alert('Thank you for your review! It will be visible once approved by our team.');
                    reviewForm.reset();
                } else {
                    alert('Could not submit review. Try again.');
                }
            }).catch(err => {
                alert('Connection error! Please ensure the backend is running at http://localhost:8081.');
            }).finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }
}

// Newsletter Logic
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            const emailInput = newsletterForm.querySelector('input').value;
            const originalText = btn.innerText;
            btn.innerText = 'Subscribing...';
            btn.disabled = true;

            safeFetch(`${API_BASE}/subscribers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput })
            }).then(res => {
                if (res.ok) {
                    alert('Thank you for subscribing to Azure Coast Updates!');
                    newsletterForm.reset();
                } else {
                    alert('Something went wrong. Try again.');
                }
            }).catch(err => alert('Could not connect to the server.'))
                .finally(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }
}

// Initialize all dynamic parts with safety wrapper
try {
    loadDynamicContent();
    initReviewForm();
    initNewsletter();
} catch (e) {
    console.warn("Dynamic content failed to load, likely due to backend being offline:", e);
}

