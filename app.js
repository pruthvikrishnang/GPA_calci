document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

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

    const initParticles = () => {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = []; let animId = null;
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1; this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5; this.opacity = Math.random() * 0.5 + 0.2;
                this.color = ['#6366f1','#a855f7','#ec4899','#818cf8'][Math.floor(Math.random()*4)];
                this.pulse = Math.random() * Math.PI * 2;
            }
            update() {
                this.x += this.speedX; this.y += this.speedY; this.pulse += 0.02;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                const pulseOpacity = Math.sin(this.pulse) * 0.2 + 0.6;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color; ctx.globalAlpha = this.opacity * pulseOpacity; ctx.fill();
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
                        ctx.beginPath(); ctx.strokeStyle = '#a855f7';
                        ctx.globalAlpha = (1 - dist / 120) * 0.15; ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles(); ctx.globalAlpha = 1;
            animId = requestAnimationFrame(animate);
        };
        animate();
    };
    initParticles();

    // ========================
    // CGPA Calculator
    // ========================
    let cgpaSemesters = [];
    let selectedSemCount = 0;

    const semCountBtns = document.querySelectorAll('.sem-count-btn');
    const cgpaStep2 = document.getElementById('cgpa-step-2');
    const cgpaInputs = document.getElementById('cgpa-inputs');
    const cgpaCalcBtn = document.getElementById('cgpa-calc-btn');
    const cgpaResetBtn = document.getElementById('cgpa-reset-btn');
    const cgpaResultSection = document.getElementById('cgpa-result-section');
    const cgpaResultDisplay = document.getElementById('cgpa-result-display');
    const cgpaProgressCircle = document.getElementById('cgpa-progress-circle');
    const cgpaRatingBadge = document.getElementById('cgpa-rating-badge');
    const cgpaRatingMessage = document.getElementById('cgpa-rating-message');
    const cgpaSemBreakdown = document.getElementById('cgpa-sem-breakdown');
    const cgpaRecalcBtn = document.getElementById('cgpa-recalc-btn');

    const buildCgpaInputs = (count) => {
        if (!cgpaInputs) return;
        cgpaInputs.innerHTML = '';
        cgpaSemesters = [];
        const icons = ['layers','book-open','hash','star','award','trending-up','bar-chart-3','sparkles'];
        for (let i = 1; i <= count; i++) {
            cgpaSemesters.push({ sem: i, sgpa: '' });
            const row = document.createElement('div');
            row.className = 'cgpa-input-row';
            const icon = icons[(i - 1) % icons.length];
            row.innerHTML = `<div class="sem-label"><i data-lucide="${icon}"></i><span>Semester ${i}</span><span class="sem-badge">SGPA</span></div><div class="input-wrapper"><input type="number" class="cgpa-sem-input" data-sem="${i}" min="0" max="10" step="0.01" placeholder="0.0 - 10.0" autocomplete="off" inputmode="decimal"></div>`;
            cgpaInputs.appendChild(row);
            const input = row.querySelector('.cgpa-sem-input');
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const sem = parseInt(input.dataset.sem);
                const idx = cgpaSemesters.findIndex(s => s.sem === sem);
                if (idx !== -1) {
                    const num = parseFloat(val);
                    if (val === '' || (!isNaN(num) && num >= 0 && num <= 10)) {
                        cgpaSemesters[idx].sgpa = val === '' ? '' : num;
                        input.classList.toggle('sgpa-filled', val !== '' && !isNaN(num));
                    }
                }
                if (cgpaCalcBtn) cgpaCalcBtn.disabled = cgpaSemesters.filter(s => s.sgpa !== '').length === 0;
            });
        }
        if (window.lucide) window.lucide.createIcons();
        if (cgpaCalcBtn) cgpaCalcBtn.disabled = true;
    };

    const calculateCGPA = () => {
        const filled = cgpaSemesters.filter(s => s.sgpa !== '');
        if (filled.length === 0) return;
        let total = 0;
        filled.forEach(s => total += s.sgpa);
        const cgpa = total / filled.length;
        cgpaResultSection.style.display = 'block';

        // Animate counter
        if (cgpaResultDisplay) {
            const start = 0; const duration = 1000;
            const startTime = performance.now();
            const tick = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                cgpaResultDisplay.textContent = (start + (cgpa - start) * eased).toFixed(2);
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }

        // Update gauge
        if (cgpaProgressCircle) {
            const circumference = 534;
            cgpaProgressCircle.style.strokeDashoffset = circumference - (Math.min(cgpa, 10) / 10) * circumference;
        }

        // Rating
        let rating = '', badgeClass = '', desc = '';
        if (cgpa >= 9.0) { rating='Excellent'; badgeClass='rating-excellent'; desc='Exceptional cumulative performance!'; }
        else if (cgpa >= 8.0) { rating='Very Good'; badgeClass='rating-verygood'; desc='Great cumulative performance!'; }
        else if (cgpa >= 7.0) { rating='Good'; badgeClass='rating-good'; desc='Solid cumulative performance.'; }
        else if (cgpa >= 6.0) { rating='Average'; badgeClass='rating-average'; desc='Fair cumulative performance.'; }
        else { rating='Needs Improvement'; badgeClass='rating-poor'; desc='Cumulative GPA is below average.'; }

        if (cgpaRatingBadge) { cgpaRatingBadge.textContent = rating; cgpaRatingBadge.className = `rating-badge ${badgeClass}`; }
        if (cgpaRatingMessage) cgpaRatingMessage.textContent = desc;

        // Breakdown
        if (cgpaSemBreakdown) {
            cgpaSemBreakdown.innerHTML = '<div class="cgpa-sem-breakdown-title">Semester-wise SGPA Breakdown</div>';
            filled.forEach(s => {
                const row = document.createElement('div');
                row.className = 'cgpa-breakdown-row';
                row.innerHTML = `<span class="bd-sem">Semester ${s.sem}</span><span class="bd-sgpa">${s.sgpa.toFixed(2)}</span>`;
                cgpaSemBreakdown.appendChild(row);
            });
        }
        cgpaResultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    semCountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            semCountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSemCount = parseInt(btn.dataset.count);
            buildCgpaInputs(selectedSemCount);
            cgpaStep2.style.display = 'block';
            cgpaStep2.scrollIntoView({ behavior: 'smooth', block: 'start' });
            cgpaResultSection.style.display = 'none';
        });
    });

    if (cgpaCalcBtn) cgpaCalcBtn.addEventListener('click', calculateCGPA);
    if (cgpaResetBtn) {
        cgpaResetBtn.addEventListener('click', () => {
            document.querySelectorAll('.cgpa-sem-input').forEach(inp => { inp.value = ''; inp.classList.remove('sgpa-filled'); });
            cgpaSemesters.forEach(s => s.sgpa = '');
            if (cgpaCalcBtn) cgpaCalcBtn.disabled = true;
            cgpaResultSection.style.display = 'none';
        });
    }
    if (cgpaRecalcBtn) {
        cgpaRecalcBtn.addEventListener('click', () => {
            cgpaResultSection.style.display = 'none';
            cgpaStep2.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
});
