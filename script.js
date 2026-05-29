// ── Loading modal ──────────────────────────────────────────
const loaderModal = document.getElementById('loader-modal');
if (sessionStorage.getItem('visited')) {
    loaderModal.remove();
    document.body.classList.add('cards-visible');
} else {
    sessionStorage.setItem('visited', '1');
    setTimeout(() => {
        loaderModal.classList.add('hide');
        document.body.classList.add('cards-visible');
        setTimeout(() => loaderModal.remove(), 500);
    }, 1500);
}

// ── Card enter animation cleanup (restores hover after animation) ──
document.querySelectorAll('.editor-card').forEach(card => {
    card.addEventListener('animationend', () => {
        card.style.opacity = '1';
        card.style.animation = 'none';
    }, { once: true });
});

// ── Synth image 3D spin on card hover ──────────────────────────
function setupCardSynths() {
    document.querySelectorAll('.card-thumb').forEach(thumb => {
        const img = thumb.querySelector('.card-thumb-img');
        if (!img) return;

        const SPEED      = 30;   // deg/s — matches the editor nav bars
        const RETURN_DUR = 0.8;  // seconds to ease back to 0°

        let angle    = 0;
        let spinning = false;
        let rafId    = null;
        let lastTime = null;

        function applyTransform(a) {
            img.style.transform = `perspective(400px) rotateY(${a}deg)`;
        }

        function spinLoop(ts) {
            if (lastTime == null) lastTime = ts;
            const dt = (ts - lastTime) / 1000;
            lastTime = ts;
            angle = (angle + SPEED * dt) % 360;
            applyTransform(angle);
            if (spinning) rafId = requestAnimationFrame(spinLoop);
        }

        function returnToZero() {
            const remainder  = ((angle % 360) + 360) % 360;
            const startAngle = angle;
            const target     = remainder <= 180
                ? startAngle - remainder
                : startAngle + (360 - remainder);
            const startTime  = performance.now();

            function returnLoop(ts) {
                if (spinning) return;
                const t      = Math.min((ts - startTime) / 1000 / RETURN_DUR, 1);
                const eased  = 1 - Math.pow(1 - t, 3);
                angle        = startAngle + (target - startAngle) * eased;
                applyTransform(angle);
                if (t < 1) {
                    rafId = requestAnimationFrame(returnLoop);
                } else {
                    angle = 0;
                    applyTransform(0);
                }
            }
            rafId = requestAnimationFrame(returnLoop);
        }

        const card = thumb.closest('.editor-card');

        card.addEventListener('mouseenter', () => {
            spinning = true;
            if (rafId) cancelAnimationFrame(rafId);
            lastTime = null;
            rafId = requestAnimationFrame(spinLoop);
        });

        card.addEventListener('mouseleave', () => {
            spinning = false;
            if (rafId) cancelAnimationFrame(rafId);
            returnToZero();
        });
    });
}

setupCardSynths();

// ── Fade-to-black on card click ────────────────────────────────
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

// ── Info card: populate & animate on card hover ─────────────────
const infoCard = document.getElementById('info-card');
const infoEls = {
    model:     document.getElementById('info-model'),
    released:  document.getElementById('info-released'),
    polyphony: document.getElementById('info-polyphony'),
    os:        document.getElementById('info-os'),
    about:     document.getElementById('info-about'),
};

let exitTimeout = null;

document.querySelectorAll('.editor-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        if (exitTimeout) { clearTimeout(exitTimeout); exitTimeout = null; }
        infoCard.classList.remove('exit');

        infoEls.model.textContent     = `Model:      ${card.dataset.model     ?? ''}`;
        infoEls.released.textContent  = `Released:   ${card.dataset.released  ?? ''}`;
        infoEls.polyphony.textContent = `Polyphony:  ${card.dataset.polyphony ?? ''}`;
        infoEls.os.textContent        = `Latest OS:  ${card.dataset.os        ?? ''}`;
        infoEls.about.textContent     = `About:      ${card.dataset.about     ?? ''}`;

        infoCard.classList.remove('animate');
        void infoCard.offsetWidth; // force reflow to restart animation
        infoCard.classList.add('animate');
    });

    card.addEventListener('mouseleave', () => {
        infoCard.classList.add('exit');
        exitTimeout = setTimeout(() => {
            infoCard.classList.remove('exit');
            infoCard.classList.remove('animate');
            Object.values(infoEls).forEach(el => { el.textContent = ''; });
            exitTimeout = null;
        }, 600); // duration (0.30s) + max delay (0.20s) + buffer
    });
});

// ── About modal (triggered from Help menu in Electron) ──────────
if (window.electronAPI) {
    const aboutModal = document.getElementById('about-modal');

    window.electronAPI.onShowAbout(() => {
        aboutModal.classList.add('visible');
    });

    aboutModal.addEventListener('click', () => {
        aboutModal.classList.remove('visible');
    });
}
