// Cart
const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
document.getElementById('cartCount').textContent = cart.reduce((s,i)=>s+i.qty,0);

// Toast
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 2500);
}

// Char counter
function updateChar() {
    const val = document.getElementById('inp-msg').value.length;
    document.getElementById('charCount').textContent = val;
}

// FAQ
function toggleFaq(el) {
    const item = el.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
}

// Form validation
function validate() {
    let ok = true;
    const name = document.getElementById('inp-name').value.trim();
    const email = document.getElementById('inp-email').value.trim();
    const phone = document.getElementById('inp-phone').value.trim();
    const msg = document.getElementById('inp-msg').value.trim();

    document.getElementById('grp-name').classList.toggle('error', name.length < 2);
    if (name.length < 2) ok = false;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    document.getElementById('grp-email').classList.toggle('error', !emailOk);
    if (!emailOk) ok = false;

    if (phone) {
        const phoneOk = /^01[0-9]{9}$/.test(phone.replace(/\s/g,''));
        document.getElementById('grp-phone').classList.toggle('error', !phoneOk);
        if (!phoneOk) ok = false;
    }

    document.getElementById('grp-msg').classList.toggle('error', msg.length < 10);
    if (msg.length < 10) ok = false;

    return ok;
}

function submitForm() {
    if (!validate()) { showToast('❌ يرجى تصحيح الأخطاء أولاً'); return; }
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ الإرسال...';
    setTimeout(() => {
        document.querySelectorAll('.form-group, .submit-btn, h2, .form-desc').forEach(el=>el.style.display='none');
        document.getElementById('successMsg').style.display = 'block';
        showToast('✅ تم إرسال رسالتك بنجاح!');
    }, 1500);
}

function resetForm() {
    document.getElementById('successMsg').style.display = 'none';
    document.querySelectorAll('.form-group').forEach(el=>el.style.display='block');
    document.getElementById('submitBtn').style.display = 'flex';
    document.querySelector('.contact-form h2').style.display = 'block';
    document.querySelector('.form-desc').style.display = 'block';
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('submitBtn').innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الرسالة';
    document.getElementById('inp-name').value = '';
    document.getElementById('inp-email').value = '';
    document.getElementById('inp-phone').value = '';
    document.getElementById('inp-msg').value = '';
    document.getElementById('charCount').textContent = '0';
}