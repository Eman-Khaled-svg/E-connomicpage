let qty = 1;
let wishlistActive = false;
let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
 
const allProducts = [
    { id:1,  name:'iPhone 15 Pro Max',        category:'موبايلات',   brand:'Apple',     price:35999, oldPrice:39999, rating:5,   reviews:412, img:'../img/iPhone 15 Pro Max.jpg',        badge:'new',  discount:'10%' },
    { id:2,  name:'Samsung Galaxy S24 Ultra',  category:'موبايلات',   brand:'Samsung',   price:29999, oldPrice:34999, rating:4.8, reviews:287, img:'../img/Samsung Galaxy S24 Ultra.jpg',  badge:'hot',  discount:'14%' },
    { id:3,  name:'Xiaomi 14 Pro',             category:'موبايلات',   brand:'Xiaomi',    price:18999, oldPrice:21999, rating:4.6, reviews:195, img:'../img/Xiaomi 14 Pro.jpg',             badge:'sale', discount:'14%' },
    { id:4,  name:'MacBook Pro 16"',           category:'لابتوبات',   brand:'Apple',     price:49999, oldPrice:54999, rating:5,   reviews:321, img:'../img/MacBook Pro 16.jpg',            badge:'new',  discount:'9%'  },
    { id:5,  name:'Dell XPS 15',               category:'لابتوبات',   brand:'Dell',      price:32999, oldPrice:36999, rating:4.7, reviews:156, img:'../img/Dell XPS 15.jpg',               badge:null,   discount:null  },
    { id:6,  name:'HP Spectre x360',           category:'لابتوبات',   brand:'HP',        price:28999, oldPrice:31999, rating:4.5, reviews:98,  img:'../img/HP Spectre x360.jpg',           badge:'sale', discount:'9%'  },
    { id:7,  name:'Apple Watch Ultra 2',       category:'ساعات ذكية', brand:'Apple',     price:15999, oldPrice:17999, rating:4.9, reviews:234, img:'../img/Apple Watch Ultra 2.jfif',      badge:'new',  discount:'11%' },
    { id:8,  name:'Samsung Galaxy Watch 6',    category:'ساعات ذكية', brand:'Samsung',   price:7999,  oldPrice:9999,  rating:4.6, reviews:178, img:'../img/Samsung Galaxy Watch 6.jfif',   badge:'sale', discount:'20%' },
    { id:9,  name:'Sony WH-1000XM5',           category:'سماعات',     brand:'Sony',      price:9999,  oldPrice:12999, rating:4.9, reviews:543, img:'../img/Sony WH-1000XM5.jfif',          badge:'hot',  discount:'23%' },
    { id:10, name:'AirPods Pro 2',             category:'سماعات',     brand:'Apple',     price:8999,  oldPrice:10999, rating:4.8, reviews:387, img:'../img/AirPods Pro 2.jfif',            badge:'new',  discount:'18%' },
    { id:11, name:'Samsung Galaxy Buds3 Pro',  category:'سماعات',     brand:'Samsung',   price:4999,  oldPrice:5999,  rating:4.5, reviews:213, img:'../img/Samsung Galaxy Buds3 Pro.jfif', badge:null,   discount:null  },
    { id:12, name:'Sony Alpha A7 IV',          category:'كاميرات',    brand:'Sony',      price:42999, oldPrice:47999, rating:5,   reviews:89,  img:'../img/Sony Alpha A7 IV.jfif',         badge:'new',  discount:'10%' },
    { id:13, name:'PlayStation 5',             category:'ألعاب',      brand:'Sony',      price:19999, oldPrice:21999, rating:4.9, reviews:612, img:'../img/PlayStation 5.jfif',            badge:'hot',  discount:'9%'  },
    { id:14, name:'Xbox Series X',             category:'ألعاب',      brand:'Microsoft', price:17999, oldPrice:19999, rating:4.7, reviews:445, img:'../img/Xbox Series X.jfif',            badge:null,   discount:null  },
    { id:15, name:'Xiaomi Smart Watch S3',     category:'ساعات ذكية', brand:'Xiaomi',    price:3999,  oldPrice:4999,  rating:4.3, reviews:167, img:'../img/Xiaomi Smart Watch S3.jfif',    badge:'sale', discount:'20%' },
    { id:16, name:'Lenovo ThinkPad X1',        category:'لابتوبات',   brand:'Lenovo',    price:26999, oldPrice:29999, rating:4.6, reviews:134, img:'../img/Lenovo ThinkPad X1.jfif',       badge:null,   discount:null  },
    { id:17, name:'Samsung Galaxy Tab S9',     category:'موبايلات',   brand:'Samsung',   price:14999, oldPrice:16999, rating:4.7, reviews:203, img:'../img/Samsung Galaxy Tab S9.jfif',    badge:'sale', discount:'12%' },
    { id:18, name:'GoPro Hero 12',             category:'كاميرات',    brand:'GoPro',     price:7999,  oldPrice:8999,  rating:4.6, reviews:321, img:'../img/GoPro Hero 1.jfif',             badge:'new',  discount:'11%' },
];
 
// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id')) || 1;
const product = allProducts.find(p=>p.id===productId) || allProducts[0];
 
// Set product details
document.getElementById('productTitle').textContent = product.name;
document.getElementById('currentPrice').textContent = product.price.toLocaleString()+' ج.م';
document.getElementById('breadcrumbName').textContent = product.name;
document.title = product.name + ' - TechStore';
if (product.brand) document.querySelector('.product-brand span').textContent = product.brand;
if (product.discount) document.getElementById('badgeMain').textContent = 'خصم ' + product.discount;
else document.getElementById('badgeMain').style.display = 'none';
 
// Set main image
const mainImg = document.getElementById('mainImg');
mainImg.src = product.img;
mainImg.alt = product.name;
 
// Set all thumbs to same image 
for (let i = 0; i < 4; i++) {
    const t = document.getElementById('thumb' + i);
    if (t) { t.src = product.img; t.alt = product.name; }
}
 
function updateCartCount() {
    document.getElementById('cartCount').textContent = cartItems.reduce((s,i)=>s+i.qty,0);
}
 
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 2500);
}
 
function changeQty(d) {
    qty = Math.max(1, Math.min(15, qty+d));
    document.getElementById('qtyVal').textContent = qty;
}
 
function selectColor(btn, name) {
    document.querySelectorAll('.color-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('selectedColor').textContent = name;
}
 
function selectStorage(btn, name) {
    document.querySelectorAll('.storage-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('selectedStorage').textContent = name;
}
 
function selectThumb(btn, idx) {
    document.querySelectorAll('.thumb').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    const src = document.getElementById('thumb' + idx)?.src;
    if (src) { document.getElementById('mainImg').src = src; }
}
 
function addToCart() {
    const existing = cartItems.find(i=>i.id===product.id);
    if (existing) existing.qty += qty;
    else cartItems.push({...product, qty});
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    showToast(`✅ تم إضافة ${qty} قطعة من "${product.name}" للسلة`);
}
 
function buyNow() {
    addToCart();
    setTimeout(()=>window.location.href='cart.html', 500);
}
 
function toggleWishlist() {
    wishlistActive = !wishlistActive;
    const btn = document.getElementById('wishlistBtn');
    if (wishlistActive) { btn.classList.add('active'); showToast('❤️ تم الإضافة للمفضلة'); }
    else { btn.classList.remove('active'); showToast('💔 تم الحذف من المفضلة'); }
}
 
function switchTab(name) {
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.tab-nav-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById('tab-'+name).classList.add('active');
    const idx = ['specs','desc','reviews'].indexOf(name);
    document.querySelectorAll('.tab-nav-btn')[idx].classList.add('active');
    document.querySelector('.detail-tabs').scrollIntoView({behavior:'smooth'});
}
 
function renderRelated() {
    const related = allProducts.filter(p=>p.id!==product.id).slice(0,4);
    document.getElementById('relatedGrid').innerHTML = related.map(p=>`
        <div class="related-card" onclick="window.location.href='product-details.html?id=${p.id}'">
            <img class="r-img" src="${p.img}" alt="${p.name}" onerror="this.style.opacity='0.3'">
            <div class="r-info">
                <h4>${p.name}</h4>
                <p class="r-price">${p.price.toLocaleString()} ج.م</p>
                <button class="r-add-btn" onclick="event.stopPropagation(); addRelated(${p.id})">
                    <i class="fas fa-plus"></i> أضف للسلة
                </button>
            </div>
        </div>
    `).join('');
}
 
function addRelated(id) {
    const p = allProducts.find(x=>x.id===id);
    if (!p) return;
    const existing = cartItems.find(i=>i.id===p.id);
    if (existing) existing.qty++;
    else cartItems.push({id:p.id, name:p.name, price:p.price, img:p.img, qty:1});
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    showToast(`✅ تم إضافة "${p.name}" للسلة`);
}
 
updateCartCount();
renderRelated();