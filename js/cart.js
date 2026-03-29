// ==== CONFIG & CART STATE ====
const PROMO_CODES = { 'TECH20':'20', 'SAVE10':'10', 'FIRST15':'15' };
let appliedDiscount = 0;


const suggested = [
    {id:9,  name:'Sony WH-1000XM5',   price:9999,  img:'../img/Sony WH-1000XM5.jpg'},
    {id:7,  name:'Apple Watch Ultra 2',price:15999, img:'../img/Apple Watch Ultra 2.jpg'},
    {id:13, name:'PlayStation 5',      price:19999, img:'../img/PlayStation 5.jpg'},
    {id:4,  name:'MacBook Pro 16"',    price:49999, img:'../img/MacBook Pro 16.jpg'},
];


let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

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

// ==== QUANTITY ====
function changeQty(id, delta) {
    const item = cartItems.find(i=>i.id===id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cartItems = cartItems.filter(i=>i.id!==id);
        showToast('🗑️ Item removed');
    }
    saveCart();
    renderCart();
}

function removeItem(id) {
    cartItems = cartItems.filter(i=>i.id!==id);
    saveCart();
    renderCart();
    showToast('🗑️ Item removed');
}

function clearCart() {
    if (!cartItems.length) return;
    if (confirm('Clear cart?')) {
        cartItems = [];
        saveCart();
        renderCart();
    }
}

// ==== PROMO ====
function applyPromo() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    const msg = document.getElementById('promoMsg');

    if (PROMO_CODES[code]) {
        appliedDiscount = parseInt(PROMO_CODES[code]);
        msg.textContent = `✅ ${appliedDiscount}% off`;
        msg.className = 'promo-msg success';
    } else {
        appliedDiscount = 0;
        msg.textContent = '❌ Invalid';
        msg.className = 'promo-msg error';
    }
    renderCart();
}

// ==== CHECKOUT ====
function checkout() {
    if (!cartItems.length) return;

    const btn = document.getElementById('checkoutBtn');
    btn.disabled = true;

    showToast('🎉 Order confirmed');

    setTimeout(()=>{
        cartItems = [];
        appliedDiscount = 0;
        saveCart();
        renderCart();
        btn.disabled = false;
    },2000);
}

// ==== ADD SUGGESTED ====
function addSuggested(id) {
    const item = suggested.find(p=>p.id===id);
    if (!item) return;

    const existing = cartItems.find(i=>i.id===id);

    if (existing) {
        existing.qty++;
    } else {
        cartItems.push({
            id: item.id,
            name: item.name,
            price: item.price,
            img: item.img, 
            qty: 1
        });
    }

    saveCart();
    renderCart();
    showToast('✅ Added to cart');
}

// ==== RENDER CART ====
function renderCart() {
    updateCartCount();

    const container  = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('subtotalVal');
    const taxEl      = document.getElementById('taxVal');
    const totalEl    = document.getElementById('totalVal');
    const discountRow= document.getElementById('discountRow');
    const discountEl = document.getElementById('discountVal');
    const checkoutBtn= document.getElementById('checkoutBtn');

    if (!cartItems.length) {
        container.innerHTML = `<h3>Cart is empty</h3>`;
        checkoutBtn.disabled = true;
        subtotalEl.textContent = '0 EGP';
        taxEl.textContent = '0 EGP';
        totalEl.textContent = '0 EGP';
        return;
    }

    checkoutBtn.disabled = false;

    container.innerHTML = cartItems.map(item => `
        <div class="cart-item">

            <div class="item-img">  
                <img src="${item.img}" alt="${item.name}">
            </div>

            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.price} EGP</p>

                <button onclick="changeQty(${item.id},-1)" class='btns'>-</button>
                ${item.qty}
                <button onclick="changeQty(${item.id},1)" class='btns'>+</button>
            </div>

            <div>
                <p>${item.price * item.qty} EGP</p>
                <button onclick="removeItem(${item.id})" class='remove-btn'>Remove</button>
            </div>

        </div>
    `).join('');

    const subtotal = cartItems.reduce((sum,i)=>sum+i.price*i.qty,0);
    const discount = subtotal * appliedDiscount / 100;
    const tax = (subtotal - discount) * 0.14;
    const total = subtotal - discount + tax;

    subtotalEl.textContent = subtotal + ' EGP';
    taxEl.textContent = Math.round(tax) + ' EGP';
    totalEl.textContent = Math.round(total) + ' EGP';

    if (appliedDiscount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = '-' + Math.round(discount) + ' EGP';
    } else {
        discountRow.style.display = 'none';
    }
}

// ==== RENDER SUGGESTED ====
function renderSuggested() {
    const grid = document.getElementById('suggestedGrid');

    grid.innerHTML = suggested.map(p => `
        <div class="suggested-card">
            <img src="${p.img}" width="80" style='margin-top:30px'>
            <h4>${p.name}</h4>
            <p>${p.price} EGP</p>
            <button onclick="addSuggested(${p.id})" class='add'>Add</button>
        </div>
    `).join('');
}

// ==== INIT ====
renderCart();
renderSuggested();