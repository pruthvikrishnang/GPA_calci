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

    // DOM Element References
    const form = document.getElementById('add-subject-form');
    const nameInput = document.getElementById('subject-name');
    const gradeInput = document.getElementById('subject-grade');
    const creditsInput = document.getElementById('subject-credits');
    const listBody = document.getElementById('subject-list-body');
    const emptyStateRow = document.getElementById('empty-state-row');
    const countBadge = document.getElementById('subject-count');

    // Render subjects in the table
    const renderSubjects = () => {
        // Remove existing dynamic subject rows
        const rows = listBody.querySelectorAll('.subject-row');
        rows.forEach(row => row.remove());

        if (subjects.length === 0) {
            emptyStateRow.style.display = 'table-row';
            countBadge.textContent = '0 Subjects';
            countBadge.style.display = 'none';
        } else {
            emptyStateRow.style.display = 'none';
            countBadge.textContent = `${subjects.length} Subject${subjects.length > 1 ? 's' : ''}`;
            countBadge.style.display = 'inline-block';

            subjects.forEach((subject) => {
                const tr = document.createElement('tr');
                tr.className = 'subject-row';
                tr.dataset.id = subject.id;

                const gradePoint = GRADE_POINTS[subject.grade];

                tr.innerHTML = `
                    <td class="font-medium">${escapeHtml(subject.name)}</td>
                    <td><span class="table-grade">${subject.grade}</span></td>
                    <td>${subject.credits.toFixed(1)}</td>
                    <td>${gradePoint}</td>
                    <td class="text-center">
                        <button class="delete-btn" aria-label="Delete Subject">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </td>
                `;

                // Add delete button event listener
                const deleteBtn = tr.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => deleteSubject(subject.id));

                listBody.appendChild(tr);
            });

            // Re-initialize icons for newly added elements
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    };

    // Helper to escape HTML tags to avoid XSS
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    // Delete subject by ID
    const deleteSubject = (id) => {
        subjects = subjects.filter(subject => subject.id !== id);
        saveSubjects();
        renderSubjects();
    };

    // Initial load & render
    loadSubjects();
    renderSubjects();
});
