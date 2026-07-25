document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    // SPA Routing
    const navigateTo = (hash) => {
        const pageId = hash === '/' || !hash ? 'home' : hash.replace('#', '');
        const pageMap = { 'home': 'page-home', 'sgpa': 'page-sgpa', 'cgpa': 'page-cgpa' };
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const targetId = pageMap[pageId];
        if (targetId) {
            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');
        }
        if (window.lucide) window.lucide.createIcons();
    };
    window.addEventListener('hashchange', () => navigateTo(window.location.hash));
    const initialHash = window.location.hash || '#home';
    navigateTo(initialHash);

    // Theme toggle for all pages
    const setupThemeToggle = (btnId) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', () => {
            const current = htmlElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    };
    setupThemeToggle('home-theme-toggle');
    setupThemeToggle('cgpa-theme-toggle');

    // Particle Animation System
    const initParticles = () => {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId = null;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = ['#6366f1', '#a855f7', '#ec4899', '#818cf8'][Math.floor(Math.random() * 4)];
                this.pulse = Math.random() * Math.PI * 2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.pulse += 0.02;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                const pulseOpacity = Math.sin(this.pulse) * 0.2 + 0.6;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity * pulseOpacity;
                ctx.fill();
            }
        }

        const count = Math.min(80, Math.floor(canvas.width * canvas.height / 10000));
        for (let i = 0; i < count; i++) particles.push(new Particle());

        const connectParticles = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = '#a855f7';
                        ctx.globalAlpha = alpha;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            ctx.globalAlpha = 1;
            animId = requestAnimationFrame(animate);
        };
        animate();
    };
    initParticles();
});
