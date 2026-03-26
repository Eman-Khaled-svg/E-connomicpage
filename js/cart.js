const PROMO_CODES = { 'TECH20':'20', 'SAVE10':'10', 'FIRST15':'15' };
let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
let appliedDiscount = 0;

const suggested = [
    {id:9,name:'Sony WH-1000XM5',price:9999,emoji:'🎧'},
    {id:7,name:'Apple Watch Ultra 2',price:15999,emoji:'⌚'},
    {id:13,name:'PlayStation 5',price:19999,emoji:'🎮'},
    {id:4,name:'MacBook Pro 16"',price:49999,emoji:'💻'},
];

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 2500);
}

function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function updateCartCount() {
    const total = cartItems.reduce((s,i)=>s+i.qty,0);
    document.getElementById('cartCount').textContent = total;
    document.getElementById('itemCountText').textContent = total;
}

function changeQty(id, delta) {
    const item = cartItems.find(i=>i.id===id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cartItems = cartItems.filter(i=>i.id!==id);
        showToast('🗑️ تم حذف المنتج');
    }
    saveCart();
    render();
}

function removeItem(id) {
    cartItems = cartItems.filter(i=>i.id!==id);
    saveCart();
    render();
    showToast('🗑️ تم حذف المنتج من السلة');
}

function clearCart() {
    if (!cartItems.length) return;
    if (confirm('هل أنت متأكد من مسح كل المنتجات؟')) {
        cartItems = [];
        saveCart();
        render();
        showToast('🗑️ تم مسح السلة');
    }
}

function applyPromo() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    const msg = document.getElementById('promoMsg');
    if (PROMO_CODES[code]) {
        appliedDiscount = parseInt(PROMO_CODES[code]);
        msg.textContent = `✅ تم تطبيق خصم ${appliedDiscount}%!`;
        msg.className = 'promo-msg success';
        render();
    } else {
        appliedDiscount = 0;
        msg.textContent = '❌ كود غير صحيح، حاول مرة أخرى';
        msg.className = 'promo-msg error';
        render();
    }
}

function checkout() {
    if (!cartItems.length) return;
    showToast('🎉 تم تأكيد طلبك! سيتم التواصل معك قريباً');
    setTimeout(()=>{
        cartItems = [];
        saveCart();
        render();
    }, 2000);
}

function addSuggested(p) {
    const existing = cartItems.find(i=>i.id===p.id);
    if (existing) existing.qty++;
    else cartItems.push({...p,qty:1});
    saveCart();
    render();
    showToast(`✅ تم إضافة "${p.name}" للسلة`);
}

function render() {
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
                <h3>سلتك فارغة!</h3>
                <p>أضف منتجات رائعة وابدأ التسوق الآن</p>
                <a href="products.html" class="btn-shop"><i class="fas fa-store"></i> تصفح المنتجات</a>
            </div>`;
        checkoutBtn.disabled = true;
        subtotalEl.textContent = '0 ج.م';
        taxEl.textContent = '0 ج.م';
        totalEl.textContent = '0 ج.م';
        discountRow.style.display = 'none';
        return;
    }

    checkoutBtn.disabled = false;
    container.innerHTML = cartItems.map(item => `
        <div class="cart-item" id="item-${item.id}">
            <div class="item-emoji">${item.emoji||'📦'}</div>
            <div class="item-details">
                <p class="item-category">${item.category||'إلكترونيات'}</p>
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price">${item.price.toLocaleString()} ج.م / للقطعة</p>
                <div class="qty-control">
                    <button class="qty-btn" onclick="changeQty(${item.id},-1)"><i class="fas fa-minus"></i></button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id},1)"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <div class="item-actions">
                <p class="item-total">${(item.price*item.qty).toLocaleString()} ج.م</p>
                <button class="remove-btn" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i> حذف</button>
            </div>
        </div>
    `).join('');

    const subtotal = cartItems.reduce((s,i)=>s+i.price*i.qty,0);
    const discountAmt = Math.round(subtotal * appliedDiscount/100);
    const afterDiscount = subtotal - discountAmt;
    const tax = Math.round(afterDiscount * 0.14);
    const total = afterDiscount + tax;

    subtotalEl.textContent = subtotal.toLocaleString()+' ج.م';
    taxEl.textContent = tax.toLocaleString()+' ج.م';
    totalEl.textContent = total.toLocaleString()+' ج.م';

    if (appliedDiscount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = '-'+discountAmt.toLocaleString()+' ج.م';
    } else {
        discountRow.style.display = 'none';
    }
}

function renderSuggested() {
    document.getElementById('suggestedGrid').innerHTML = suggested.map(p=>`
        <div class="suggested-card" onclick="window.location.href='product-details.html?id=${p.id}'">
            <div class="s-emoji">${p.emoji}</div>
            <h4>${p.name}</h4>
            <p class="s-price">${p.price.toLocaleString()} ج.م</p>
            <button class="s-add-btn" onclick="event.stopPropagation(); addSuggested({id:${p.id},name:'${p.name}',price:${p.price},emoji:'${p.emoji}'})">
                <i class="fas fa-plus"></i> أضف للسلة
            </button>
        </div>
    `).join('');
}

render();
renderSuggested();