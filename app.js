document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    // SPA Routing
    const navigateTo = (hash) => {
        const pageId = hash === '/' || !hash ? 'home' : hash.replace('#', '');
        const pageMap = { 'home': 'page-home', 'sgpa': 'page-cgpa', 'cgpa': 'page-cgpa' };
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

    // Theme toggle for home page
    const homeThemeToggle = document.getElementById('home-theme-toggle');
    if (homeThemeToggle) {
        homeThemeToggle.addEventListener('click', () => {
            const current = htmlElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }
});
