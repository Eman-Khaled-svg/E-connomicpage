// ==== CONFIG & CART STATE ====
const PROMO_CODES = { 'TECH20':'20', 'SAVE10':'10', 'FIRST15':'15' };
let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
let appliedDiscount = 0;

const suggested = [
    {id:9,name:'Sony WH-1000XM5',price:9999,emoji:'🎧'},
    {id:7,name:'Apple Watch Ultra 2',price:15999,emoji:'⌚'},
    {id:13,name:'PlayStation 5',price:19999,emoji:'🎮'},
    {id:4,name:'MacBook Pro 16"',price:49999,emoji:'💻'},
];

// ==== TOAST ====
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 2500);
}

// ==== LOCAL STORAGE ====
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// ==== CART COUNT ====
function updateCartCount() {
    const total = cartItems.reduce((sum,i)=>sum+i.qty,0);
    document.getElementById('cartCount').textContent = total;
    const countText = document.getElementById('itemCountText');
    if (countText) countText.textContent = total;
}

// ==== QUANTITY HANDLING ====
function changeQty(id, delta) {
    const item = cartItems.find(i=>i.id===id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cartItems = cartItems.filter(i=>i.id!==id);
        showToast('🗑️ Item removed from cart');
    }
    saveCart();
    renderCart();
}

function removeItem(id) {
    cartItems = cartItems.filter(i=>i.id!==id);
    saveCart();
    renderCart();
    showToast('🗑️ Item removed from cart');
}

function clearCart() {
    if (!cartItems.length) return;
    if (confirm('Are you sure you want to clear the cart?')) {
        cartItems = [];
        saveCart();
        renderCart();
        showToast('🗑️ Cart cleared');
    }
}

// ==== PROMO CODE ====
function applyPromo() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    const msg = document.getElementById('promoMsg');
    if (PROMO_CODES[code]) {
        appliedDiscount = parseInt(PROMO_CODES[code]);
        msg.textContent = `✅ Promo applied: ${appliedDiscount}% off`;
        msg.className = 'promo-msg success';
        renderCart();
    } else {
        appliedDiscount = 0;
        msg.textContent = '❌ Invalid promo code';
        msg.className = 'promo-msg error';
        renderCart();
    }
}

// ==== CHECKOUT ====
function checkout() {
    if (!cartItems.length) return;
    const btn = document.getElementById('checkoutBtn');
    btn.disabled = true;
    showToast('🎉 Order confirmed! We will contact you soon.');
    setTimeout(()=>{
        cartItems = [];
        appliedDiscount = 0;
        saveCart();
        renderCart();
        btn.disabled = false;
    }, 2000);
}

// ==== ADD SUGGESTED ITEM ====
function addSuggested(item) {
    const existing = cartItems.find(i=>i.id===item.id);
    if (existing) existing.qty++;
    else cartItems.push({...item, qty:1});
    saveCart();
    renderCart();
    showToast(`✅ "${item.name}" added to cart`);
}

// ==== RENDER CART ====
function renderCart() {
    updateCartCount();
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('subtotalVal');
    const taxEl = document.getElementById('taxVal');
    const totalEl = document.getElementById('totalVal');
    const discountRow = document.getElementById('discountRow');
    const discountEl = document.getElementById('discountVal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartItems.length) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty!</h3>
                <p>Add some amazing products and start shopping now.</p>
                <a href="products.html" class="btn-shop"><i class="fas fa-store"></i> Browse Products</a>
            </div>`;
        checkoutBtn.disabled = true;
        subtotalEl.textContent = '0 EGP';
        taxEl.textContent = '0 EGP';
        totalEl.textContent = '0 EGP';
        discountRow.style.display = 'none';
        return;
    }

    checkoutBtn.disabled = false;

    container.innerHTML = cartItems.map(item => `
        <div class="cart-item" id="item-${item.id}">
            <div class="item-emoji">${item.emoji||'📦'}</div>
            <div class="item-details">
                <p class="item-category">${item.category||'Electronics'}</p>
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price">${item.price.toLocaleString()} EGP / each</p>
                <div class="qty-control">
                    <button class="qty-btn" onclick="changeQty(${item.id},-1)"><i class="fas fa-minus"></i></button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id},1)"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <div class="item-actions">
                <p class="item-total">${(item.price*item.qty).toLocaleString()} EGP</p>
                <button class="remove-btn" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i> Remove</button>
            </div>
        </div>
    `).join('');

    const subtotal = cartItems.reduce((sum,i)=>sum+i.price*i.qty,0);
    const discountAmt = Math.round(subtotal * appliedDiscount/100);
    const afterDiscount = subtotal - discountAmt;
    const tax = Math.round(afterDiscount * 0.14);
    const total = afterDiscount + tax;

    subtotalEl.textContent = subtotal.toLocaleString()+' EGP';
    taxEl.textContent = tax.toLocaleString()+' EGP';
    totalEl.textContent = total.toLocaleString()+' EGP';

    if (appliedDiscount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-${discountAmt.toLocaleString()} EGP (${appliedDiscount}%)`;
    } else {
        discountRow.style.display = 'none';
    }
}

// ==== RENDER SUGGESTED ====
function renderSuggested() {
    const grid = document.getElementById('suggestedGrid');
    grid.innerHTML = suggested.map(p => `
        <div class="suggested-card">
            <div class="s-emoji">${p.emoji}</div>
            <h4>${p.name}</h4>
            <p class="s-price">${p.price.toLocaleString()} EGP</p>
            <button class="s-add-btn" onclick="addSuggested({id:${p.id},name:'${p.name}',price:${p.price},emoji:'${p.emoji}'})">
                <i class="fas fa-plus"></i> Add to Cart
            </button>
        </div>
    `).join('');
}

// ==== INIT ====
renderCart();
renderSuggested();