// Apex GPA & SGPA Calculator logic
// Supported Features:
// - Semester-wise template selector (Semester 1, 2, & 3) with predefined credits
// - Inline editable subject names, credits, and grade selectors in the table
// - Instant calculation updates upon changing cell values
// - Semester-specific local storage persistence (persists custom selections separately)
// - Dynamic adaptive clear/reset button for templates and custom layouts

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

// Major options for Sem 3-6
const MAJOR_OPTIONS = [
    'AIML',
    'Data Science and Engineering',
    'Cloud computing',
    'Cyber Security'
];

// Category order for display
const CATEGORY_ORDER = ['Core', 'Major', 'Minor', 'Elective'];

// Category display colors
const CATEGORY_COLORS = {
    'Core': { bg: 'rgba(99, 102, 241, 0.08)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.15)' },
    'Major': { bg: 'rgba(16, 185, 129, 0.08)', text: '#34d399', border: 'rgba(16, 185, 129, 0.15)' },
    'Minor': { bg: 'rgba(245, 158, 11, 0.08)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.15)' },
    'Elective': { bg: 'rgba(236, 72, 153, 0.08)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.15)' }
};

// Light mode category colors
const CATEGORY_COLORS_LIGHT = {
    'Core': { bg: 'rgba(99, 102, 241, 0.06)', text: '#6366f1', border: 'rgba(99, 102, 241, 0.12)' },
    'Major': { bg: 'rgba(16, 185, 129, 0.06)', text: '#059669', border: 'rgba(16, 185, 129, 0.12)' },
    'Minor': { bg: 'rgba(245, 158, 11, 0.06)', text: '#d97706', border: 'rgba(245, 158, 11, 0.12)' },
    'Elective': { bg: 'rgba(236, 72, 153, 0.06)', text: '#db2777', border: 'rgba(236, 72, 153, 0.12)' }
};

// Helper to check if semester has structured categories (Sem 3-6)
const isStructuredSemester = (sem) => ['3', '4', '5', '6'].includes(sem);

// Built-in semester subjects and credits definitions
const SEMESTER_SUBJECTS = {
    '1': [
        { name: 'CS1812 - Discrete Mathematics and Set Theory', credits: 3.0, grade: '' },
        { name: 'CS1003 - Programming in C', credits: 4.0, grade: '' },
        { name: 'WEB FUNDAMENTALS & UX DESIGN - CS1308', credits: 4.0, grade: '' },
        { name: 'CS1101 - DIGITAL SYSTEM AND COMPUTER ARCHITECTURE', credits: 3.0, grade: '' },
        { name: 'Exploring Science - CS1806', credits: 3.0, grade: '' },
        { name: 'English Communication - CS1927', credits: 2.0, grade: '' },
        { name: 'CS1929 - Structured Innovation with Design Thinking', credits: 2.0, grade: '' },
        { name: 'Constituion of india and professional ethics - CS1928', credits: 2.0, grade: '' }
    ],
    '2': [
        { name: 'CS1807 - Linear Algebra', credits: 3.0, grade: '' },
        { name: 'CS1006 - Data Structures', credits: 4.0, grade: '' },
        { name: 'CS1211 - Database Management Systems', credits: 4.0, grade: '' },
        { name: 'CS1103 - Operating System', credits: 3.0, grade: '' },
        { name: 'CS1102 - Embedded Systems and ARM Microcontroller', credits: 4.0, grade: '' },
        { name: 'CS1841 - Engineering Explorations', credits: 3.0, grade: '' },
        { name: 'CS1940 - Entrepreneurial Mindset', credits: 2.0, grade: '' },
        { name: 'CS1925 - Yoga and Wellbeing', credits: 2.0, grade: '' }
    ],
    '3': {
        core: [
            { name: 'Theory of Computation', credits: 4.0, grade: '', category: 'Core' },
            { name: 'Computer Networks', credits: 3.0, grade: '', category: 'Core' },
            { name: 'Design and Analysis of Algorithms', credits: 4.0, grade: '', category: 'Core' }
        ],
        majors: {
            'AIML': [
                { name: 'Introduction to Machine Learning', credits: 3.0, grade: '', category: 'Major' },
                { name: 'AI Lab', credits: 1.0, grade: '', category: 'Major' }
            ],
            'Data Science and Engineering': [
                { name: 'Data Science Fundamentals', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Data Science Lab', credits: 1.0, grade: '', category: 'Major' }
            ],
            'Cloud computing': [
                { name: 'Cloud Architecture', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Cloud Lab', credits: 1.0, grade: '', category: 'Major' }
            ],
            'Cyber Security': [
                { name: 'Network Security', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Security Lab', credits: 1.0, grade: '', category: 'Major' }
            ]
        },
        minors: [],
        electives: []
    },
    '4': {
        core: [
            { name: 'Operating Systems', credits: 4.0, grade: '', category: 'Core' },
            { name: 'Database Management Systems', credits: 3.0, grade: '', category: 'Core' },
            { name: 'Software Engineering', credits: 3.0, grade: '', category: 'Core' }
        ],
        majors: {
            'AIML': [
                { name: 'Deep Learning', credits: 3.0, grade: '', category: 'Major' },
                { name: 'NLP Fundamentals', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Data Science and Engineering': [
                { name: 'Big Data Analytics', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Statistical Methods', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cloud computing': [
                { name: 'Distributed Systems', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Cloud Security', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cyber Security': [
                { name: 'Cryptography', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Digital Forensics', credits: 3.0, grade: '', category: 'Major' }
            ]
        },
        minors: [],
        electives: []
    },
    '5': {
        core: [
            { name: 'Compiler Design', credits: 4.0, grade: '', category: 'Core' },
            { name: 'Distributed Computing', credits: 3.0, grade: '', category: 'Core' },
            { name: 'Professional Ethics', credits: 2.0, grade: '', category: 'Core' }
        ],
        majors: {
            'AIML': [
                { name: 'Reinforcement Learning', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Computer Vision', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Data Science and Engineering': [
                { name: 'Data Visualization', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Time Series Analysis', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cloud computing': [
                { name: 'DevOps Practices', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Microservices Architecture', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cyber Security': [
                { name: 'Ethical Hacking', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Cyber Law & Compliance', credits: 3.0, grade: '', category: 'Major' }
            ]
        },
        minors: [],
        electives: []
    },
    '6': {
        core: [
            { name: 'Cloud Computing', credits: 4.0, grade: '', category: 'Core' },
            { name: 'Internet of Things', credits: 3.0, grade: '', category: 'Core' },
            { name: 'Project Work', credits: 3.0, grade: '', category: 'Core' }
        ],
        majors: {
            'AIML': [
                { name: 'Generative AI', credits: 3.0, grade: '', category: 'Major' },
                { name: 'MLOps', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Data Science and Engineering': [
                { name: 'Deep Learning for DS', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Data Engineering', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cloud computing': [
                { name: 'Cloud Native Apps', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Serverless Computing', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cyber Security': [
                { name: 'Malware Analysis', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Security Operations', credits: 3.0, grade: '', category: 'Major' }
            ]
        },
        minors: [],
        electives: []
    },
    '7': [],
    '8': []
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
    let currentSemester = 'custom';
    let searchTerm = '';

    // Curriculum Versioning to invalidate cache when default subjects change
    const CURRICULUM_VERSION = 'v5';
    const checkCurriculumVersion = () => {
        const savedVersion = localStorage.getItem('gpa_curriculum_version');
        if (savedVersion !== CURRICULUM_VERSION) {
            // Clear all semester caches when curriculum updates
            for (let i = 1; i <= 8; i++) {
                localStorage.removeItem(`gpa_subjects_${i}`);
            }
            localStorage.setItem('gpa_curriculum_version', CURRICULUM_VERSION);
        }
    };
    checkCurriculumVersion();

    // Show/hide major selector and category form based on semester
    const updateStructuredUI = (sem) => {
        const isStructured = isStructuredSemester(sem);
        if (majorSelector) {
            majorSelector.style.display = isStructured ? 'block' : 'none';
        }
        if (categoryFormGroup) {
            categoryFormGroup.style.display = isStructured ? 'flex' : 'none';
        }
        
        // Update major pill active states
        if (isStructured) {
            const savedMajor = getSelectedMajor(sem);
            majorPills.forEach(pill => {
                if (pill.dataset.major === savedMajor) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
        }
    };

    // Load initial subjects from local storage based on active semester
    const loadSubjects = () => {
        currentSemester = localStorage.getItem('gpa_selected_semester') || 'custom';
        
        // Update UI active states for semester buttons
        semButtons.forEach(btn => {
            if (btn.dataset.sem === currentSemester) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        if (semBadge) {
            semBadge.textContent = currentSemester === 'custom' ? 'Manual Mode' : `Semester ${currentSemester}`;
        }

        // Show/hide structured semester UI
        updateStructuredUI(currentSemester);

        const key = `gpa_subjects_${currentSemester}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                subjects = JSON.parse(saved);
                // Migration: Detect old placeholder subjects and overwrite with the new curriculum
                if (currentSemester === '1' && subjects.some(s => s.name === 'Engineering Mathematics I')) {
                    subjects = getDefaultSemesterData('1');
                    saveSubjects();
                }
            } catch (e) {
                subjects = getDefaultSemesterData(currentSemester);
            }
        } else {
            subjects = getDefaultSemesterData(currentSemester);
            saveSubjects();
        }
        updateClearButtonUI();
    };

    // Get selected major for a semester from localStorage
    const getSelectedMajor = (sem) => {
        return localStorage.getItem(`gpa_major_${sem}`) || '';
    };

    // Save selected major for a semester
    const saveSelectedMajor = (sem, major) => {
        localStorage.setItem(`gpa_major_${sem}`, major);
    };

    // Helper to get default data for a semester template or sample custom data
    const getDefaultSemesterData = (sem) => {
        if (sem === 'custom') {
            return [
                { id: '1', name: 'Advanced Engineering Math', grade: 'O', credits: 4.0 },
                { id: '2', name: 'Data Structures & Algorithms', grade: 'A+', credits: 4.0 },
                { id: '3', name: 'Object Oriented Programming', grade: 'A', credits: 3.0 },
                { id: '4', name: 'Technical Writing', grade: 'B+', credits: 2.0 }
            ];
        }
        
        if (isStructuredSemester(sem)) {
            const data = SEMESTER_SUBJECTS[sem];
            if (!data) return [];
            const result = [];
            
            // Add core subjects
            data.core.forEach((sub, idx) => {
                result.push({
                    id: `${sem}_core_${idx}_${Date.now()}`,
                    name: sub.name,
                    credits: sub.credits,
                    grade: sub.grade || '',
                    category: 'Core'
                });
            });
            
            // Add major subjects if a major is selected
            const savedMajor = getSelectedMajor(sem);
            if (savedMajor && data.majors[savedMajor]) {
                data.majors[savedMajor].forEach((sub, idx) => {
                    result.push({
                        id: `${sem}_major_${idx}_${Date.now()}`,
                        name: sub.name,
                        credits: sub.credits,
                        grade: sub.grade || '',
                        category: 'Major'
                    });
                });
            }
            
            // Saved minors and electives (from user additions)
            if (data.minors) {
                data.minors.forEach((sub, idx) => {
                    result.push({
                        id: `${sem}_minor_${idx}_${Date.now()}`,
                        name: sub.name,
                        credits: sub.credits,
                        grade: sub.grade || '',
                        category: 'Minor'
                    });
                });
            }
            if (data.electives) {
                data.electives.forEach((sub, idx) => {
                    result.push({
                        id: `${sem}_elective_${idx}_${Date.now()}`,
                        name: sub.name,
                        credits: sub.credits,
                        grade: sub.grade || '',
                        category: 'Elective'
                    });
                });
            }
            
            return result;
        }
        
        const defaults = SEMESTER_SUBJECTS[sem] || [];
        return defaults.map((sub, index) => ({
            id: `${sem}_${index}_${Date.now()}`,
            name: sub.name,
            credits: sub.credits,
            grade: sub.grade || ''
        }));
    };

    // Save subjects to local storage
    const saveSubjects = () => {
        const key = `gpa_subjects_${currentSemester}`;
        localStorage.setItem(key, JSON.stringify(subjects));
        localStorage.setItem('gpa_selected_semester', currentSemester);
    };

    // DOM Element References
    const semButtons = document.querySelectorAll('.sem-btn');
    const semBadge = document.getElementById('sem-badge');
    const form = document.getElementById('add-subject-form');
    const nameInput = document.getElementById('subject-name');
    const gradeInput = document.getElementById('subject-grade');
    const creditsInput = document.getElementById('subject-credits');
    const listBody = document.getElementById('subject-list-body');
    const emptyStateRow = document.getElementById('empty-state-row');
    const countBadge = document.getElementById('subject-count');
    const searchInput = document.getElementById('subject-search');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const filterResultsBar = document.getElementById('filter-results-bar');
    const filterResultsText = document.getElementById('filter-results-text');
    const majorSelector = document.getElementById('major-selector');
    const majorPills = document.querySelectorAll('.major-pill');
    const categoryFormGroup = document.getElementById('category-form-group');
    const categorySelect = document.getElementById('subject-category');

    // Result Card DOM Elements
    const gpaDisplay = document.getElementById('gpa-display');
    const ratingBadge = document.getElementById('rating-badge');
    const ratingMessage = document.getElementById('rating-message');
    const metricCredits = document.getElementById('metric-credits');
    const metricPoints = document.getElementById('metric-points');
    const progressCircle = document.getElementById('gpa-progress-circle');

    // Update gauge visual progress
    const updateGauge = (gpa) => {
        if (!progressCircle) return;
        const circumference = 534; // 2 * Math.PI * 85
        const offset = circumference - (gpa / 10) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    };

    // Calculate GPA, cumulative points, total credits, and update results
    const calculateGPA = () => {
        let totalCredits = 0;
        let cumulativePoints = 0;

        subjects.forEach(subj => {
            if (!subj.grade) return; // Skip ungraded subjects
            const gp = GRADE_POINTS[subj.grade];
            totalCredits += subj.credits;
            cumulativePoints += (subj.credits * gp);
        });

        // Update metrics display
        metricCredits.textContent = totalCredits.toFixed(1);
        metricPoints.textContent = cumulativePoints.toFixed(1);

        if (totalCredits === 0) {
            gpaDisplay.textContent = '0.00';
            ratingBadge.textContent = 'Ready to Calculate';
            ratingBadge.className = 'rating-badge rating-ready';
            ratingMessage.textContent = 'Enter your subjects and credits to get your score and rating.';
            updateGauge(0);
            return;
        }

        const gpa = cumulativePoints / totalCredits;
        gpaDisplay.textContent = gpa.toFixed(2);

        // Update gauge visual progress
        updateGauge(gpa);

        // Classify performance rating
        let rating = '';
        let badgeClass = '';
        let desc = '';

        if (gpa >= 9.0) {
            rating = 'Excellent';
            badgeClass = 'rating-excellent';
            desc = 'Exceptional academic standing! You have secured a top tier grade point average. Keep up the phenomenal work!';
        } else if (gpa >= 7.0) {
            rating = 'Very Good';
            badgeClass = 'rating-verygood';
            desc = 'Great performance! Scoring a GPA of 7 or above is very good. You are demonstrating high capabilities and solid work.';
        } else if (gpa >= 6.0) {
            rating = 'Good';
            badgeClass = 'rating-good';
            desc = 'Good job! A solid score. Push just a little harder in your upcoming terms to cross into the Very Good bracket.';
        } else if (gpa >= 5.0) {
            rating = 'Average';
            badgeClass = 'rating-average';
            desc = 'Fair performance. You have passed successfully, but there is clear room for improvement. Focus on higher weightage subjects.';
        } else {
            rating = 'Poor';
            badgeClass = 'rating-poor';
            desc = 'Academic warning. Your GPA is below average. We recommend consulting with your mentors and allocating more study hours.';
        }

        ratingBadge.textContent = rating;
        ratingBadge.className = `rating-badge ${badgeClass}`;
        
        // Check for ungraded subjects to notify user
        const ungradedCount = subjects.filter(s => !s.grade).length;
        if (ungradedCount > 0) {
            desc += ` (${ungradedCount} subject${ungradedCount > 1 ? 's are' : ' is'} currently ungraded and excluded from calculations.)`;
        }
        
        ratingMessage.textContent = desc;
    };

    // Save and restore default empty state content
    const defaultEmptyContent = {
        icon: 'inbox',
        title: 'No subjects added yet.',
        desc: 'Fill in the form above to start calculating your GPA.'
    };

    // Update empty state content for filter/no results
    const setEmptyStateContent = (icon, title, desc) => {
        const content = emptyStateRow.querySelector('.empty-state-content');
        if (!content) return;
        const iconEl = content.querySelector('i');
        const titleEl = content.querySelector('p');
        const descEl = content.querySelector('span');
        if (iconEl) iconEl.setAttribute('data-lucide', icon);
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
        if (window.lucide) window.lucide.createIcons();
    };

    // Restore default empty state
    const resetEmptyState = () => {
        setEmptyStateContent(defaultEmptyContent.icon, defaultEmptyContent.title, defaultEmptyContent.desc);
    };

    // Filter subjects by search term (toggles row visibility)
    const filterSubjects = () => {
        const term = searchTerm.toLowerCase().trim();
        const rows = listBody.querySelectorAll('.subject-row');
        let visibleCount = 0;

        rows.forEach(row => {
            const nameInput = row.querySelector('.table-input-name');
            const name = nameInput ? nameInput.value.toLowerCase() : '';
            if (!term || name.includes(term)) {
                row.classList.remove('filtered-hidden');
                visibleCount++;
            } else {
                row.classList.add('filtered-hidden');
            }
        });

        // Handle filter empty state when no rows match but subjects exist
        if (term && visibleCount === 0 && subjects.length > 0) {
            emptyStateRow.style.display = 'table-row';
            setEmptyStateContent('search', 'No subjects match your search', `Try adjusting your search term or clear the filter to see all ${subjects.length} subjects.`);
        } else if (!term && subjects.length > 0) {
            emptyStateRow.style.display = 'none';
            resetEmptyState();
        } else if (subjects.length === 0) {
            resetEmptyState();
        }

        // Update filter results info bar
        if (filterResultsText && filterResultsBar) {
            if (term && subjects.length > 0) {
                filterResultsText.textContent = `Showing ${visibleCount} of ${subjects.length} subject${subjects.length !== 1 ? 's' : ''}`;
                filterResultsBar.classList.toggle('visible', true);
            } else {
                filterResultsBar.classList.toggle('visible', false);
            }
        }

        // Update count badge contextually
        if (term && subjects.length > 0) {
            countBadge.textContent = `${visibleCount}/${subjects.length} Subject${subjects.length !== 1 ? 's' : ''}`;
        } else if (subjects.length > 0) {
            countBadge.textContent = `${subjects.length} Subject${subjects.length > 1 ? 's' : ''}`;
        }
    };

    // Get category colors based on theme
    const getCategoryColor = (category) => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const palette = isLight ? CATEGORY_COLORS_LIGHT : CATEGORY_COLORS;
        return palette[category] || { bg: 'transparent', text: 'var(--text-muted)', border: 'var(--border-color)' };
    };

    // Render a category header row
    const renderCategoryHeader = (category) => {
        const colors = getCategoryColor(category);
        // Display 'Majors' instead of 'Major' as the user requested
        const displayName = category === 'Major' ? 'Majors' : category;
        const tr = document.createElement('tr');
        tr.className = 'category-header-row';
        tr.innerHTML = `
            <td colspan="5">
                <div class="category-header-content">
                    <span class="cat-label" style="background: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.border};">${displayName}</span>
                    <span class="cat-line"></span>
                </div>
            </td>
        `;
        return tr;
    };

    // Render a single subject row
    const renderSubjectRow = (subject, index) => {
        const tr = document.createElement('tr');
        tr.className = 'subject-row';
        tr.dataset.id = subject.id;
        tr.style.animationDelay = `${index * 0.04}s`;

        const gradePoint = subject.grade ? GRADE_POINTS[subject.grade] : '-';
        const gradeClass = getGradeClass(subject.grade);
        const cat = subject.category || '';
        const catColors = cat ? getCategoryColor(cat) : null;
        const catBadge = cat ? `<span class="cat-badge" style="background: ${catColors.bg}; color: ${catColors.text}; border: 1px solid ${catColors.border};">${cat}</span>` : '';

        tr.innerHTML = `
            <td>
                <input type="text" class="table-input-name" value="${escapeHtml(subject.name)}" title="${escapeHtml(subject.name)}" placeholder="Subject Name" aria-label="Subject Name">
                ${catBadge}
            </td>
            <td>
                <select class="table-select-grade ${gradeClass}" aria-label="Grade for ${escapeHtml(subject.name)}">
                    <option value="" ${subject.grade === '' ? 'selected' : ''}>Grade</option>
                    <option value="O" ${subject.grade === 'O' ? 'selected' : ''}>O (Outstanding)</option>
                    <option value="A+" ${subject.grade === 'A+' ? 'selected' : ''}>A+ (Excellent)</option>
                    <option value="A" ${subject.grade === 'A' ? 'selected' : ''}>A (Very Good)</option>
                    <option value="B+" ${subject.grade === 'B+' ? 'selected' : ''}>B+ (Good)</option>
                    <option value="B" ${subject.grade === 'B' ? 'selected' : ''}>B (Above Average)</option>
                    <option value="C" ${subject.grade === 'C' ? 'selected' : ''}>C (Average)</option>
                    <option value="P" ${subject.grade === 'P' ? 'selected' : ''}>P (Pass)</option>
                    <option value="F" ${subject.grade === 'F' ? 'selected' : ''}>F (Fail)</option>
                </select>
            </td>
            <td>
                <input type="number" class="table-input-credits" value="${subject.credits}" min="0.5" max="20" step="0.5" placeholder="Credits" aria-label="Credits for ${escapeHtml(subject.name)}">
            </td>
            <td class="font-medium text-center grade-point-cell">${gradePoint}</td>
            <td class="text-center">
                <button class="delete-btn" aria-label="Delete Subject">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;

        // Add delete button event listener
        const deleteBtn = tr.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteSubject(subject.id));

        // Add name input listener
        const nameInp = tr.querySelector('.table-input-name');
        nameInp.addEventListener('input', () => {
            updateSubjectProperty(subject.id, 'name', nameInp.value.trim(), false);
            if (searchTerm) {
                filterSubjects();
            }
        });

        // Add credits input listener
        const creditsInp = tr.querySelector('.table-input-credits');
        creditsInp.addEventListener('input', () => {
            const val = parseFloat(creditsInp.value);
            if (!isNaN(val) && val >= 0.5 && val <= 20) {
                creditsInp.classList.remove('input-invalid');
                updateSubjectProperty(subject.id, 'credits', val, true);
            } else {
                creditsInp.classList.add('input-invalid');
            }
        });

        // Add grade select listener
        const gradeSelect = tr.querySelector('.table-select-grade');
        const gradePointCell = tr.querySelector('.grade-point-cell');
        gradeSelect.addEventListener('change', () => {
            const selectedGrade = gradeSelect.value;
            gradeSelect.className = `table-select-grade ${getGradeClass(selectedGrade)}`;
            const gp = selectedGrade ? GRADE_POINTS[selectedGrade] : '-';
            gradePointCell.textContent = gp;
            gradePointCell.classList.remove('gp-flash');
            void gradePointCell.offsetWidth;
            gradePointCell.classList.add('gp-flash');
            updateSubjectProperty(subject.id, 'grade', selectedGrade, true);
        });

        return tr;
    };

    // Render subjects in the table (with category grouping for structured semesters)
    const renderSubjects = () => {
        // Remove existing dynamic rows + category headers
        const existing = listBody.querySelectorAll('.subject-row, .category-header-row');
        existing.forEach(row => row.remove());

        if (subjects.length === 0) {
            emptyStateRow.style.display = 'table-row';
            resetEmptyState();
            countBadge.textContent = '0 Subjects';
            countBadge.style.display = 'none';
        } else {
            emptyStateRow.style.display = 'none';
            countBadge.textContent = `${subjects.length} Subject${subjects.length > 1 ? 's' : ''}`;
            countBadge.style.display = 'inline-block';

            const isStructured = isStructuredSemester(currentSemester);
            
            if (isStructured) {
                // Group subjects by category
                const grouped = {};
                CATEGORY_ORDER.forEach(cat => {
                    const items = subjects.filter(s => s.category === cat);
                    if (items.length > 0) {
                        grouped[cat] = items;
                    }
                });
                
                // Render each category group
                let globalIdx = 0;
                CATEGORY_ORDER.forEach(cat => {
                    const items = grouped[cat];
                    if (!items) return;
                    
                    // Add category header
                    listBody.appendChild(renderCategoryHeader(cat));
                    
                    // Add subject rows
                    items.forEach((subject) => {
                        const tr = renderSubjectRow(subject, globalIdx);
                        listBody.appendChild(tr);
                        globalIdx++;
                    });
                });
            } else {
                // Flat rendering for non-structured semesters
                subjects.forEach((subject, index) => {
                    const tr = renderSubjectRow(subject, index);
                    listBody.appendChild(tr);
                });
            }

            // Re-initialize icons
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
        
        if (searchTerm) {
            filterSubjects();
        }
        calculateGPA();
    };

    // Helper to escape HTML tags to avoid XSS
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    // Helper to map grade to visual css classes
    const getGradeClass = (grade) => {
        if (!grade) return 'grade-empty';
        if (grade === 'O') return 'grade-o';
        if (grade === 'A+' || grade === 'A') return 'grade-a';
        if (grade === 'B+' || grade === 'B') return 'grade-b';
        if (grade === 'C') return 'grade-c';
        return 'grade-f';
    };

    // Delete subject by ID
    const deleteSubject = (id) => {
        subjects = subjects.filter(subject => subject.id !== id);
        saveSubjects();
        renderSubjects();
    };

    // Update subject property by ID and save
    const updateSubjectProperty = (id, prop, value, recalculate = true) => {
        const index = subjects.findIndex(s => s.id === id);
        if (index !== -1) {
            subjects[index][prop] = value;
            saveSubjects();
            if (recalculate) {
                calculateGPA();
            }
        }
    };

    // Shake helper function for invalid input feedback
    const triggerShake = (element) => {
        element.classList.add('shake-input');
        setTimeout(() => {
            element.classList.remove('shake-input');
        }, 300);
        element.focus();
    };

    const toggleClearButton = () => {
        if (!searchClearBtn) return;
        if (searchInput.value.trim()) {
            searchClearBtn.classList.add('visible');
        } else {
            searchClearBtn.classList.remove('visible');
        }
    };

    // Search/filter event listener
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchTerm = searchInput.value;
            if (subjects.length > 0) {
                filterSubjects();
            }
            toggleClearButton();
        });

        // Focus search with Ctrl+F / Cmd+F
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f' && searchInput) {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        });

        // Escape to clear search and blur
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchTerm = '';
                if (subjects.length > 0) {
                    filterSubjects();
                }
                searchInput.blur();
                toggleClearButton();
            }
        });

        // Clear button click handler
        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', () => {
                searchInput.value = '';
                searchTerm = '';
                if (subjects.length > 0) {
                    filterSubjects();
                }
                searchInput.focus();
                toggleClearButton();
            });
        }
    }

    // Helper to safely regenerate structured semester data with preservation
    const regenerateStructuredData = () => {
        // Preserve user-added Minor/Elective subjects
        const customSubjects = subjects.filter(s => s.category === 'Minor' || s.category === 'Elective');
        
        // Preserve grades from all existing subjects by name
        const gradeMap = {};
        subjects.forEach(s => {
            if (s.grade) gradeMap[s.name] = s.grade;
        });
        
        // Regenerate fresh template subjects (Core + Major)
        const fresh = getDefaultSemesterData(currentSemester);
        
        // Re-apply preserved grades to matching template subjects
        fresh.forEach(s => {
            if (gradeMap[s.name]) s.grade = gradeMap[s.name];
        });
        
        // Merge back user-added custom subjects (with preserved grades)
        customSubjects.forEach(cs => {
            if (!fresh.some(fs => fs.id === cs.id)) {
                fresh.push(cs);
            }
        });
        
        subjects = fresh;
        saveSubjects();
        renderSubjects();
    };

    // Major selector click handlers
    majorPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const major = pill.dataset.major;
            
            // Update active state
            majorPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            // Save major selection
            saveSelectedMajor(currentSemester, major);
            
            regenerateStructuredData();
        });
    });

    // Add subject form handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const grade = gradeInput.value;
        const credits = parseFloat(creditsInput.value);
        const category = isStructuredSemester(currentSemester) ? categorySelect.value : '';

        let hasError = false;

        if (!name) {
            triggerShake(nameInput);
            hasError = true;
        }

        if (!grade) {
            triggerShake(gradeInput);
            hasError = true;
        }

        if (isNaN(credits) || credits < 0.5 || credits > 20) {
            triggerShake(creditsInput);
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const newSubject = {
            id: `${currentSemester}_custom_${Date.now()}`,
            name,
            grade,
            credits,
            category: category || ''
        };

        subjects.push(newSubject);
        saveSubjects();
        renderSubjects();

        // Reset form
        form.reset();
        if (categorySelect) categorySelect.value = 'Minor';
        nameInput.focus();
    });


    // Helper to update the clear button title & aria-label
    const updateClearButtonUI = () => {
        const clearBtn = document.getElementById('clear-all-btn');
        if (!clearBtn) return;
        if (currentSemester === 'custom') {
            clearBtn.title = 'Clear All Subjects';
            clearBtn.setAttribute('aria-label', 'Clear All Subjects');
        } else {
            clearBtn.title = 'Reset Semester Defaults';
            clearBtn.setAttribute('aria-label', 'Reset Semester Defaults');
        }
    };

    // Clear all subjects or Reset semester defaults handler
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (currentSemester === 'custom') {
                if (confirm('Are you sure you want to clear all subjects? This action cannot be undone.')) {
                    subjects = [];
                    saveSubjects();
                    renderSubjects();
                }
            } else {
                if (confirm(`Are you sure you want to reset Semester ${currentSemester} to its default subjects and credits? This will clear entered grades.`)) {
                    subjects = getDefaultSemesterData(currentSemester);
                    saveSubjects();
                    renderSubjects();
                }
            }
        });
    }

    // Handle semester changes
    const handleSemesterChange = (sem) => {
        const key = `gpa_subjects_${sem}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                subjects = JSON.parse(saved);
            } catch (e) {
                subjects = getDefaultSemesterData(sem);
            }
        } else {
            subjects = getDefaultSemesterData(sem);
            saveSubjects();
        }
        updateStructuredUI(sem);
        renderSubjects();
        updateClearButtonUI();
    };

    // Semester selector tab listeners
    semButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sem = btn.dataset.sem;
            if (sem === currentSemester) return;

            semButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentSemester = sem;
            if (semBadge) {
                semBadge.textContent = sem === 'custom' ? 'Manual Mode' : `Semester ${sem}`;
            }

            handleSemesterChange(sem);
        });
    });

    // Initial load & render
    loadSubjects();
    renderSubjects();
});
