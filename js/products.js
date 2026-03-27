const allProducts = [
    { id: 1, name: 'iPhone 15 Pro Max', category: 'Mobiles', brand: 'Apple', price: 35999, oldPrice: 39999, rating: 5, reviews: 412, img:'../img/iPhone 15 Pro Max.jpg', badge: 'new', discount: '10%' },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', category: 'Mobiles', brand: 'Samsung', price: 29999, oldPrice: 34999, rating: 4.8, reviews: 287, img:'../img/Samsung Galaxy S24 Ultra.jpg', badge: 'hot', discount: '14%' },
    { id: 3, name: 'Xiaomi 14 Pro', category: 'Mobiles', brand: 'Xiaomi', price: 18999, oldPrice: 21999, rating: 4.6, reviews: 195, img:'../img/Xiaomi 14 Pro.jpg', badge: 'sale', discount: '14%' },
    { id: 4, name: 'MacBook Pro 16"', category: 'Laptops', brand: 'Apple', price: 49999, oldPrice: 54999, rating: 5, reviews: 321, img: '../img/MacBook Pro 16.jpg', badge: 'new', discount: '9%' },
    { id: 5, name: 'Dell XPS 15', category: 'Laptops', brand: 'Dell', price: 32999, oldPrice: 36999, rating: 4.7, reviews: 156, img:'../img/Dell XPS 15.jpg', badge: null, discount: null },
    { id: 6, name: 'HP Spectre x360', category: 'Laptops', brand: 'HP', price: 28999, oldPrice: 31999, rating: 4.5, reviews: 98, img:'../img/HP Spectre x360.jpg', badge: 'sale', discount: '9%' },
    { id: 7, name: 'Apple Watch Ultra 2', category: 'Smart Watches', brand: 'Apple', price: 15999, oldPrice: 17999, rating: 4.9, reviews: 234, img:'../img/Apple Watch Ultra 2.jfif', badge: 'new', discount: '11%' },
    { id: 8, name: 'Samsung Galaxy Watch 6', category: 'Smart Watches', brand: 'Samsung', price: 7999, oldPrice: 9999, rating: 4.6, reviews: 178, img:'../img/Samsung Galaxy Watch 6.jfif', badge: 'sale', discount: '20%' },
    { id: 9, name: 'Sony WH-1000XM5', category: 'Headphones', brand: 'Sony', price: 9999, oldPrice: 12999, rating: 4.9, reviews: 543, img:'../img/Sony WH-1000XM5.jfif', badge: 'hot', discount: '23%' },
    { id: 10, name: 'AirPods Pro 2', category: 'Headphones', brand: 'Apple', price: 8999, oldPrice: 10999, rating: 4.8, reviews: 387, img:'../img/AirPods Pro 2.jfif', badge: 'new', discount: '18%' },
    { id: 11, name: 'Samsung Galaxy Buds3 Pro', category: 'Headphones', brand: 'Samsung', price: 4999, oldPrice: 5999, rating: 4.5, reviews: 213, img:'../img/Samsung Galaxy Buds3 Pro.jfif', badge: null, discount: null },
    { id: 12, name: 'Sony Alpha A7 IV', category: 'Cameras', brand: 'Sony', price: 42999, oldPrice: 47999, rating: 5, reviews: 89, img: '../img/Sony Alpha A7 IV.jfif', badge: 'new', discount: '10%' },
    { id: 13, name: 'PlayStation 5', category: 'Gaming', brand: 'Sony', price: 19999, oldPrice: 21999, rating: 4.9, reviews: 612, img:'../img/PlayStation 5.jfif', badge: 'hot', discount: '9%' },
    { id: 14, name: 'Xbox Series X', category: 'Gaming', brand: 'Microsoft', price: 17999, oldPrice: 19999, rating: 4.7, reviews: 445, img:'../img/Xbox Series X.jfif', badge: null, discount: null },
    { id: 15, name: 'Xiaomi Smart Watch S3', category: 'Smart Watches', brand: 'Xiaomi', price: 3999, oldPrice: 4999, rating: 4.3, reviews: 167, img:'../img/Xiaomi Smart Watch S3.jfif', badge: 'sale', discount: '20%' },
    { id: 16, name: 'Lenovo ThinkPad X1', category: 'Laptops', brand: 'Lenovo', price: 26999, oldPrice: 29999, rating: 4.6, reviews: 134, img:'../img/Lenovo ThinkPad X1.jfif', badge: null, discount: null },
    { id: 17, name: 'Samsung Galaxy Tab S9', category: 'Mobiles', brand: 'Samsung', price: 14999, oldPrice: 16999, rating: 4.7, reviews: 203, img:'../img/Samsung Galaxy Tab S9.jfif', badge: 'sale', discount: '12%' },
    { id: 18, name: 'GoPro Hero 12', category: 'Cameras', brand: 'GoPro', price: 7999, oldPrice: 8999, rating: 4.6, reviews: 321, img:'../img/GoPro Hero 12.jpg', badge: 'new', discount: '11%' }
];

let currentCategory = 'all';
let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
let currentPage = 1;
const perPage = 9;

function updateCartCount() {
    document.getElementById('cartCount').textContent = cartItems.reduce((s, i) => s + i.qty, 0);
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function addToCart(product) {
    const existing = cartItems.find(i => i.id === product.id);
    if (existing) existing.qty++;
    else cartItems.push({ ...product, qty: 1 });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    showToast(`✅ "${product.name}" added to cart`);
}

function setCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPage = 1;
    filterProducts();
}

function setView(type, btn) {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const grid = document.getElementById('productsGrid');
    if (type === 'list') {
        grid.style.gridTemplateColumns = '1fr';
    } else {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    }
}

function resetFilters() {
    document.querySelectorAll('input[type=checkbox]').forEach(c => c.checked = false);
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 50000;
    document.getElementById('priceRange').value = 50000;
    document.getElementById('sortSelect').value = 'default';
    document.getElementById('searchInput').value = '';
    currentCategory = 'all';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.tab-btn').classList.add('active');
    currentPage = 1;
    filterProducts();
}

function filterProducts() {
    let filtered = [...allProducts];

    // Category tab
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    // Category checkboxes
    const catChecks = ['Mobiles', 'Laptops', 'Smart Watches', 'Headphones', 'Cameras', 'Gaming'];
    const checkedCats = catChecks.filter((_, i) => document.getElementById('cat' + (i + 1))?.checked);
    if (checkedCats.length) filtered = filtered.filter(p => checkedCats.includes(p.category));

    // Brand checkboxes
    const brandMap = { bApple: 'Apple', bSamsung: 'Samsung', bXiaomi: 'Xiaomi', bSony: 'Sony', bDell: 'Dell', bHP: 'HP' };
    const checkedBrands = Object.entries(brandMap).filter(([id]) => document.getElementById(id)?.checked).map(([, b]) => b);
    if (checkedBrands.length) filtered = filtered.filter(p => checkedBrands.includes(p.brand));

    // Price
    const minP = parseInt(document.getElementById('minPrice').value) || 0;
    const maxP = parseInt(document.getElementById('maxPrice').value) || 50000;
    filtered = filtered.filter(p => p.price >= minP && p.price <= maxP);

    // Rating
    const r5 = document.getElementById('r5')?.checked;
    const r4 = document.getElementById('r4')?.checked;
    const r3 = document.getElementById('r3')?.checked;
    if (r5) filtered = filtered.filter(p => p.rating >= 5);
    else if (r4) filtered = filtered.filter(p => p.rating >= 4);
    else if (r3) filtered = filtered.filter(p => p.rating >= 3);

    // Search
    const q = document.getElementById('searchInput').value.toLowerCase();
    if (q) filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.includes(q));

    // Sort
    const sort = document.getElementById('sortSelect').value;
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    document.getElementById('productCount').textContent = filtered.length;

    // Pagination
    const totalPages = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    renderProducts(paginated);
    updatePagination(totalPages);
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!products.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#8066a0;">
            <i class="fas fa-search" style="font-size:3rem;margin-bottom:15px;display:block;color:#6600cc;"></i>
            No products match your search
        </div>`;
        return;
    }
    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="window.location.href='productDetails.html?id=${p.id}'">
            ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === 'new' ? 'New' : p.badge === 'sale' ? 'Sale' : '🔥 Hot'}</span>` : ''}
            <button class="product-wishlist" onclick="event.stopPropagation(); this.style.color='#ff4466'"><i class="fas fa-heart"></i></button>
            <div class="product-img">
                <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'">
            </div>
            <div class="product-info">
                <p class="product-category">${p.category}</p>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 ? '½' : ''}</span>
                    <span class="rating-count">(${p.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">${p.price.toLocaleString()} EGP</span>
                    ${p.oldPrice ? `<span class="price-old">${p.oldPrice.toLocaleString()}</span>` : ''}
                    ${p.discount ? `<span class="price-discount">-${p.discount}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart({id:${p.id},name:'${p.name}',price:${p.price},emoji:'${p.emoji}'})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn-view" onclick="event.stopPropagation(); window.location.href='productDetails.html?id=${p.id}'">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updatePagination(total) {
    for (let i = 1; i <= 3; i++) {
        const btn = document.getElementById('page' + i);
        if (btn) {
            btn.style.display = i <= total ? 'flex' : 'none';
            btn.classList.toggle('active', i === currentPage);
            btn.onclick = () => { currentPage = i; filterProducts(); window.scrollTo(0, 400); };
        }
    }
}

function changePage(dir) {
    currentPage = Math.max(1, currentPage + dir);
    filterProducts();
    window.scrollTo(0, 400);
}

// Init
updateCartCount();
filterProducts();