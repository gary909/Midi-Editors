// ── Loading modal ──────────────────────────────────────────
const loaderModal = document.getElementById('loader-modal');
if (sessionStorage.getItem('visited')) {
    loaderModal.remove();
} else {
    sessionStorage.setItem('visited', '1');
    setTimeout(() => {
        loaderModal.classList.add('hide');
        setTimeout(() => loaderModal.remove(), 500);
    }, 1500);
}

// ── Fade-to-black on card click ─────────────────────────────
const overlay = document.getElementById('fade-overlay');

document.querySelectorAll('.editor-card').forEach(card => {
    card.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        overlay.classList.add('active');
        setTimeout(() => {
            window.location.href = href;
        }, 450);
    });
});
