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

        thumb.addEventListener('mouseenter', () => {
            spinning = true;
            if (rafId) cancelAnimationFrame(rafId);
            lastTime = null;
            rafId = requestAnimationFrame(spinLoop);
        });

        thumb.addEventListener('mouseleave', () => {
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
