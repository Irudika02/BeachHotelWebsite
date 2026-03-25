// Detect if the page is being served from Spring Boot or another origin (like IntelliJ)
const API_BASE = (window.location.origin.includes('localhost:8081')) ? '/api' : 'http://localhost:8081/api';

// Helper to handle fetch errors more clearly
function safeFetch(url, options = {}) {
    return fetch(url, options).catch(err => {
        if (window.location.protocol === 'file:') {
            alert("Chrome blocks data loading when you open the file directly (file://). Please use IntelliJ's 'Open in Browser' icon OR go to http://localhost:8081.");
        } else {
            console.error("Connection failed to backend:", err);
            // alert("Connecting to backend failed. Make sure Spring Boot is running on port 8081!");
        }
        throw err;
    });
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(btn.getAttribute('data-target')).classList.add('active');
    });
});

// Load Inquiries
function loadInquiries() {
    safeFetch(`${API_BASE}/inquiries`).then(res => res.json()).then(data => {
        document.getElementById('stat-inquiries').innerText = data.length;
        const tbody = document.getElementById('inquiries-table-body'); tbody.innerHTML = '';
        if (data.length === 0) { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No inquiries yet.</td></tr>`; return; }
        data.forEach(inq => {
            tbody.innerHTML += `<tr>
                <td><strong>${inq.name}</strong></td><td><a href="mailto:${inq.email}">${inq.email}</a></td>
                <td>${inq.roomType || '-'}</td><td>${inq.message || '-'}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteInquiry(${inq.id})">Delete</button></td>
            </tr>`;
        });
    });
}

// Load Rooms
function loadRooms() {
    safeFetch(`${API_BASE}/rooms`).then(res => res.json()).then(data => {
        document.getElementById('stat-rooms').innerText = data.length;
        const tbody = document.getElementById('rooms-table-body'); tbody.innerHTML = '';
        if (data.length === 0) { tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No rooms added.</td></tr>`; return; }
        data.forEach(room => {
            tbody.innerHTML += `<tr>
                <td><img src="${room.imagePath}" width="60" style="border-radius: 5px;"></td>
                <td><strong>${room.name}</strong></td><td>$${room.price}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteRoom(${room.id})">Delete</button></td>
            </tr>`;
        });
    });
}

// Load Menu
function loadMenu() {
    safeFetch(`${API_BASE}/menu`).then(res => res.json()).then(data => {
        document.getElementById('stat-menu').innerText = data.length;
        const tbody = document.getElementById('menu-table-body'); tbody.innerHTML = '';
        if (data.length === 0) { tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No menu items added.</td></tr>`; return; }
        data.forEach(item => {
            const hasSpicy = (item.spicy === true || item.isSpicy === true);
            const hasVeg = (item.veg === true || item.isVeg === true);
            const safeName = item.name.replace(/'/g, "\\'");
            const safeDesc = item.description.replace(/'/g, "\\'");
            const safeCat = item.category.replace(/'/g, "\\'");
            const safeImg = (item.imagePath || '').replace(/'/g, "\\'");
            tbody.innerHTML += `<tr>
                <td>${item.imagePath ? `<img src="${item.imagePath}" width="60" style="border-radius:5px;">` : 'No Image'}</td>
                <td><strong>${item.name}</strong></td><td>${item.category}</td><td>$${item.price}</td>
                <td>
                    <button class="btn btn-sm" style="background:#007bff; margin-right:5px;" onclick="editMenu(${item.id}, '${safeName}', '${item.price}', '${safeCat}', '${hasSpicy}', '${hasVeg}', '${safeDesc}', '${safeImg}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMenu(${item.id})">Delete</button>
                </td>
            </tr>`;
        });
    });
}

// Load Gallery
function loadGallery() {
    safeFetch(`${API_BASE}/gallery`).then(res => res.json()).then(data => {
        const tbody = document.getElementById('gallery-table-body'); tbody.innerHTML = '';
        if (data.length === 0) { tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No images added.</td></tr>`; return; }
        data.forEach(img => {
            tbody.innerHTML += `<tr>
                <td><img src="${img.imagePath}" width="60" style="border-radius: 5px;"></td>
                <td><strong>${img.title}</strong></td><td>${img.imagePath}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteGallery(${img.id})">Delete</button></td>
            </tr>`;
        });
    });
}

// Load Reviews
function loadReviews() {
    safeFetch(`${API_BASE}/reviews`).then(res => res.json()).then(data => {
        const pendingCount = data.filter(r => (r.approved === false && r.isApproved === false) || (typeof r.approved === 'undefined' && r.isApproved === false)).length;
        document.getElementById('stat-reviews').innerText = pendingCount;
        const tbody = document.getElementById('reviews-table-body'); tbody.innerHTML = '';
        if (data.length === 0) { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No reviews added.</td></tr>`; return; }
        data.forEach(rev => {
            const isApproved = (rev.approved === true || rev.isApproved === true);
            tbody.innerHTML += `<tr>
                <td><strong>${rev.author}</strong></td><td>${rev.country}</td><td>${(rev.text || '').substring(0, 50)}...</td>
                <td>${isApproved ? '<span style="color:green;font-weight:bold;">Approved</span>' : '<span style="color:orange;font-weight:bold;">Pending</span>'}</td>
                <td>
                    ${!isApproved ? `<button class="btn btn-sm" style="background:#28a745; margin-right:5px;" onclick="approveReview(${rev.id})">Approve</button>` : ''}
                    <button class="btn btn-danger btn-sm" onclick="deleteReview(${rev.id})">Delete</button>
                </td>
            </tr>`;
        });
    });
}


// Add Room
document.getElementById('add-room-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('r_name').value, price: document.getElementById('r_price').value,
        imagePath: document.getElementById('r_image').value, description: document.getElementById('r_desc').value
    };
    safeFetch(`${API_BASE}/rooms`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(() => { document.getElementById('add-room-form').reset(); loadRooms(); });
});

// Add Menu
document.getElementById('add-menu-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('m_name').value, price: document.getElementById('m_price').value,
        category: document.getElementById('m_cat').value, description: document.getElementById('m_desc').value,
        spicy: document.getElementById('m_spicy').checked, veg: document.getElementById('m_veg').checked,
        imagePath: document.getElementById('m_image').value
    };

    // Add edit functionality
    if (currentEditMenuId) {
        payload.id = currentEditMenuId;
    }

    safeFetch(`${API_BASE}/menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(() => {
            const formBtn = document.querySelector('#add-menu-form button');
            formBtn.innerText = 'Save Item';
            formBtn.style.background = 'var(--secondary)';
            currentEditMenuId = null;
            document.getElementById('add-menu-form').reset();
            loadMenu();
        });
});

// Add Gallery
document.getElementById('add-gallery-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = { title: document.getElementById('g_title').value, imagePath: document.getElementById('g_url').value };
    safeFetch(`${API_BASE}/gallery`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(() => { document.getElementById('add-gallery-form').reset(); loadGallery(); });
});

// Load Offers
function loadOffers() {
    safeFetch(`${API_BASE}/offers`).then(res => res.json()).then(data => {
        document.getElementById('stat-offers').innerText = data.length;
        const tbody = document.getElementById('offers-table-body'); tbody.innerHTML = '';
        if (data.length === 0) { tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No offers added.</td></tr>`; return; }
        data.forEach(offer => {
            tbody.innerHTML += `<tr>
                <td><img src="${offer.imagePath}" width="60" style="border-radius: 5px;"></td>
                <td><strong>${offer.title}</strong></td><td><strong style="color:var(--secondary);">${offer.discount}</strong></td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteOffer(${offer.id})">Delete</button></td>
            </tr>`;
        });
    });
}

// Load Subscribers
function loadSubscribers() {
    safeFetch(`${API_BASE}/subscribers`).then(res => res.json()).then(data => {
        document.getElementById('stat-subscribers').innerText = data.length;
        const tbody = document.getElementById('subscribers-table-body'); tbody.innerHTML = '';
        if (data.length === 0) { tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;">No subscribers yet.</td></tr>`; return; }
        data.forEach(sub => {
            tbody.innerHTML += `<tr>
                <td>${sub.email}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteSubscriber(${sub.id})">Delete</button></td>
            </tr>`;
        });
    });
}

// Add Offer
document.getElementById('add-offer-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
        title: document.getElementById('o_title').value, discount: document.getElementById('o_discount').value,
        imagePath: document.getElementById('o_image').value, description: document.getElementById('o_desc').value
    };
    safeFetch(`${API_BASE}/offers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(() => { document.getElementById('add-offer-form').reset(); loadOffers(); });
});

// Deletes & Approves & Edits
function deleteInquiry(id) { if (confirm("Are you sure?")) safeFetch(`${API_BASE}/inquiries/${id}`, { method: 'DELETE' }).then(() => loadInquiries()); }
function deleteRoom(id) { if (confirm("Are you sure?")) safeFetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' }).then(() => loadRooms()); }
function deleteMenu(id) { if (confirm("Are you sure?")) safeFetch(`${API_BASE}/menu/${id}`, { method: 'DELETE' }).then(() => loadMenu()); }

let currentEditMenuId = null;
function editMenu(id, name, price, category, spicy, veg, desc, img) {
    currentEditMenuId = id;
    document.getElementById('m_name').value = name;
    document.getElementById('m_price').value = price;
    document.getElementById('m_cat').value = category;
    document.getElementById('m_desc').value = desc;
    document.getElementById('m_spicy').checked = (spicy === 'true');
    document.getElementById('m_veg').checked = (veg === 'true');
    document.getElementById('m_image').value = img || '';
    const formBtn = document.querySelector('#add-menu-form button');
    formBtn.innerText = 'Update Item';
    formBtn.style.background = '#28a745';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteGallery(id) { if (confirm("Are you sure?")) safeFetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' }).then(() => loadGallery()); }
function deleteReview(id) { if (confirm("Are you sure?")) safeFetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' }).then(() => loadReviews()); }
function approveReview(id) { safeFetch(`${API_BASE}/reviews/${id}/approve`, { method: 'PUT' }).then(() => loadReviews()); }
function deleteOffer(id) { if (confirm("Are you sure?")) safeFetch(`${API_BASE}/offers/${id}`, { method: 'DELETE' }).then(() => loadOffers()); }
function deleteSubscriber(id) { if (confirm("Are you sure?")) safeFetch(`${API_BASE}/subscribers/${id}`, { method: 'DELETE' }).then(() => loadSubscribers()); }

// Init
loadInquiries(); loadRooms(); loadMenu(); loadGallery(); loadReviews(); loadOffers(); loadSubscribers();
