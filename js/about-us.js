// Animate stats counter
function animateCounter(id, target, suffix='') {
    const el = document.getElementById(id);
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
        start += step;
        if (start >= target) { el.textContent = target.toLocaleString() + suffix; clearInterval(timer); return; }
        el.textContent = Math.floor(start).toLocaleString() + suffix;
    }, 25);
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounter('s1', 10000, '+');
            animateCounter('s2', 500, '+');
            animateCounter('s3', 50, '+');
            animateCounter('s4', 6, '');
            observer.disconnect();
        }
    });
}, { threshold: 0.3 });
observer.observe(document.querySelector('.stats'));

// Cart count
const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
document.getElementById('cartCount').textContent = cart.reduce((s,i)=>s+i.qty,0);