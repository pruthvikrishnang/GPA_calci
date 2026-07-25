document.addEventListener('DOMContentLoaded', () => {
    const navigateTo = (hash) => {
        const pageId = hash === '/' || !hash ? 'home' : hash.replace('#', '');
        const pageMap = { 'home': 'page-home', 'sgpa': 'page-sgpa', 'cgpa': 'page-cgpa' };
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const targetId = pageMap[pageId];
        if (targetId) {
            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');
        }
    };
    window.addEventListener('hashchange', () => navigateTo(window.location.hash));
    const initialHash = window.location.hash || '#home';
    navigateTo(initialHash);
});
