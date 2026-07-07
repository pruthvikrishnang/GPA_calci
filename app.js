// Apex GPA & SGPA Calculator logic

// Grade to Grade Point Mapping
const GRADE_POINTS = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'P': 4,
    'F': 0
};

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    // Initial Lucide Icons rendering
    if (window.lucide) {
        window.lucide.createIcons();
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Subject State Manager
    let subjects = [];

    // Load initial subjects from local storage
    const loadSubjects = () => {
        const saved = localStorage.getItem('gpa_subjects');
        if (saved) {
            try {
                subjects = JSON.parse(saved);
            } catch (e) {
                subjects = [];
            }
        }
    };

    // Save subjects to local storage
    const saveSubjects = () => {
        localStorage.setItem('gpa_subjects', JSON.stringify(subjects));
    };

    // Initial load
    loadSubjects();
});
