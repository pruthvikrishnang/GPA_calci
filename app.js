// Apex GPA & SGPA Calculator logic
// Supported Features:
// - Semester-wise template selector (Semester 1, 2, & 3) with predefined credits
// - Inline editable subject names, credits, and grade selectors in the table
// - Manual calculation: SGPA is computed only when the Calculate button is pressed
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
const isStructuredSemester = (sem) => ['3', '4', '5', '6', '7', '8'].includes(sem);

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
            { name: 'CS2806-Calculus', credits: 2.0, grade: '', category: 'Core' },
            { name: 'CS2000-Design and Analysis of Algorithms', credits: 4.0, grade: '', category: 'Core' },
            { name: 'CS2403-Computer Networks', credits: 3.0, grade: '', category: 'Core' },
            { name: 'CS2403-Internet of Things', credits: 3.0, grade: '', category: 'Core' }
        ],
        majors: {
            'AIML': [
                { name: 'CS2227-AI/ML', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Data Science and Engineering': [
                { name: 'CS2231-Data Science', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cloud computing': [
                { name: 'CS2500-Cloud Computing and Big Data', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cyber Security': [
                { name: 'CS2405-Cyber Security', credits: 3.0, grade: '', category: 'Major' }
            ]
        },
        minors: [],
        electives: []
    },
    '4': {
        core: [
            { name: 'CS2800-Probability and Statistics', credits: 4.0, grade: '', category: 'Core' },
            { name: 'CS2024-Object Oriented Programming with Java', credits: 4.0, grade: '', category: 'Core' },
            { name: 'CS2005-Agile Software Engineering and DevOps', credits: 3.0, grade: '', category: 'Core' },
            { name: 'CS2306-Mobile App Development Essentials', credits: 2.0, grade: '', category: 'Core' }
        ],
        majors: {
            'AIML': [
                { name: 'CS2228-Deep Learning', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Data Science and Engineering': [
                { name: 'CS2226-Machine Learning for Data Science', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cloud computing': [
                { name: 'CS2307-Full Stack Application Development', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cyber Security': [
                { name: 'CS2406-Incident Response and Digital Forensics', credits: 3.0, grade: '', category: 'Major' }
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
    '7': {
        core: [
            { name: 'Capstone Project - I', credits: 4.0, grade: '', category: 'Core' },
            { name: 'Professional Ethics & Values', credits: 2.0, grade: '', category: 'Core' }
        ],
        majors: {
            'AIML': [
                { name: 'Advanced Deep Learning', credits: 3.0, grade: '', category: 'Major' },
                { name: 'AI in Production', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Data Science and Engineering': [
                { name: 'Big Data Engineering', credits: 3.0, grade: '', category: 'Major' },
                { name: 'ML Pipeline Architecture', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cloud computing': [
                { name: 'Kubernetes & Orchestration', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Cloud Architecture Design', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cyber Security': [
                { name: 'Cyber Threat Intelligence', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Incident Response & Forensics', credits: 3.0, grade: '', category: 'Major' }
            ]
        },
        minors: [],
        electives: []
    },
    '8': {
        core: [
            { name: 'Capstone Project - II', credits: 6.0, grade: '', category: 'Core' },
            { name: 'Seminar & Technical Presentation', credits: 2.0, grade: '', category: 'Core' }
        ],
        majors: {
            'AIML': [
                { name: 'AI Ethics & Governance', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Research in AI/ML', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Data Science and Engineering': [
                { name: 'Data Science Capstone', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Advanced Analytics', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cloud computing': [
                { name: 'Cloud Migration Strategy', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Enterprise Cloud Solutions', credits: 3.0, grade: '', category: 'Major' }
            ],
            'Cyber Security': [
                { name: 'Security Architecture', credits: 3.0, grade: '', category: 'Major' },
                { name: 'Cyber Warfare & Defense', credits: 3.0, grade: '', category: 'Major' }
            ]
        },
        minors: [],
        electives: []
    }
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
    let hasUncalculatedChanges = false;

    // Curriculum Versioning to invalidate cache when default subjects change
    const CURRICULUM_VERSION = 'v8';
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
                { id: '1', name: 'Advanced Engineering Math', grade: '', credits: 4.0 },
                { id: '2', name: 'Data Structures & Algorithms', grade: '', credits: 4.0 },
                { id: '3', name: 'Object Oriented Programming', grade: '', credits: 3.0 },
                { id: '4', name: 'Technical Writing', grade: '', credits: 2.0 }
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

    // Update grade distribution visual bar in results
    const updateGradeDistribution = () => {
        const metricsGrid = document.querySelector('.metrics-grid');
        if (!metricsGrid) return;
        // Remove old distribution bar
        const oldDist = document.querySelector('.grade-distribution-bar');
        if (oldDist) oldDist.remove();
        
        const gradeOrder = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];
        const graded = subjects.filter(s => s.grade);
        if (graded.length === 0) return;
        
        const dist = document.createElement('div');
        dist.className = 'grade-distribution-bar';
        dist.style.cssText = 'grid-column: 1 / -1; display: flex; gap: 3px; height: 8px; border-radius: 4px; overflow: hidden;';
        
        const colorMap = { 'O': '#10b981', 'A+': '#3b82f6', 'A': '#6366f1', 'B+': '#8b5cf6', 'B': '#a855f7', 'C': '#f59e0b', 'P': '#f97316', 'F': '#ef4444' };
        
        gradeOrder.forEach(grade => {
            const count = subjects.filter(s => s.grade === grade).length;
            if (count === 0) return;
            const pct = (count / graded.length) * 100;
            const seg = document.createElement('div');
            seg.style.cssText = `width: ${pct}%; background: ${colorMap[grade]}; min-width: ${pct > 0 ? '3px' : '0'};`;
            seg.title = `${grade}: ${count} subject${count > 1 ? 's' : ''}`;
            dist.appendChild(seg);
        });
        
        metricsGrid.appendChild(dist);
    };

    // Calculate summary statistics for display
    const calculateSubjectStats = () => {
        const total = subjects.length;
        const withGrade = subjects.filter(s => s.grade).length;
        const avgCredits = total > 0 ? subjects.reduce((s, sub) => s + sub.credits, 0) / total : 0;
        // Grade distribution
        const grades = {};
        Object.keys(GRADE_POINTS).forEach(g => {
            grades[g] = subjects.filter(s => s.grade === g).length;
        });
        return { total, withGrade, avgCredits, grades };
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
            ratingMessage.textContent = 'Enter your subjects and credits, then press "Calculate SGPA" to get your score and rating.';
            updateGauge(0);
            setCalculateButtonState('ready');
            return;
        }

        const gpa = cumulativePoints / totalCredits;
        animateCounter(gpa);

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
        // Store last calculated timestamp
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem('gpa_last_calculated_' + currentSemester, timestamp);
        
        // Update grade distribution visual
        updateGradeDistribution();
        
        hasUncalculatedChanges = false;
        setCalculateButtonState('calculated');
        updateSaveButtonState();
        
        // Trigger confetti for Excellent performance
        if (gpa >= 9.0) {
            triggerConfetti();
        }
        
        // Auto-scroll results into view on mobile
        const resultsSection = document.querySelector('.results-card');
        if (resultsSection && window.innerWidth <= 968) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Copy GPA to clipboard on click
    if (gpaDisplay) {
        gpaDisplay.style.cursor = 'pointer';
        gpaDisplay.title = 'Click to copy GPA value';
        gpaDisplay.addEventListener('click', async () => {
            const text = gpaDisplay.textContent;
            try {
                await navigator.clipboard.writeText(text);
                showToast(`GPA ${text} copied to clipboard!`);
            } catch {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                showToast(`GPA ${text} copied!`);
            }
        });
    }

    // Animated counter for GPA display
    const animateCounter = (target) => {
        const start = parseFloat(gpaDisplay.textContent) || 0;
        const duration = 800;
        const startTime = performance.now();
        
        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (target - start) * eased;
            gpaDisplay.textContent = current.toFixed(2);
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };
        requestAnimationFrame(tick);
    };

    // Confetti celebration effect
    const triggerConfetti = () => {
        const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1', '#22d3ee'];
        const gaugeWrapper = document.querySelector('.gauge-wrapper');
        if (gaugeWrapper) gaugeWrapper.classList.add('celebrate');
        
        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = (Math.random() * 6 + 4) + 'px';
            piece.style.height = (Math.random() * 6 + 4) + 'px';
            piece.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
            piece.style.animationDelay = (Math.random() * 0.8) + 's';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            document.body.appendChild(piece);
            
            setTimeout(() => {
                piece.remove();
            }, 3500);
        }
        
        setTimeout(() => {
            if (gaugeWrapper) gaugeWrapper.classList.remove('celebrate');
        }, 3000);
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
        tr.innerHTML = `
            <td>
                <input type="text" class="table-input-name" value="${escapeHtml(subject.name)}" title="${escapeHtml(subject.name)}" placeholder="Subject Name" aria-label="Subject Name">
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
            updateSubjectProperty(subject.id, 'name', nameInp.value.trim());
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
                updateSubjectProperty(subject.id, 'credits', val);
            } else {
                creditsInp.classList.add('input-invalid');
            }
        });

        // Add grade select listener
        const gradeSelect = tr.querySelector('.table-select-grade');
        const gradePointCell = tr.querySelector('.grade-point-cell');
        gradeSelect.addEventListener('change', () => {
            const selectedGrade = gradeSelect.value;
            // Use classList to swap grade classes without removing the base class
            gradeSelect.classList.remove('grade-empty', 'grade-o', 'grade-a', 'grade-b', 'grade-c', 'grade-f');
            gradeSelect.classList.add(getGradeClass(selectedGrade));
            const gp = selectedGrade ? GRADE_POINTS[selectedGrade] : '-';
            gradePointCell.textContent = gp;
            // Restart gp-flash animation without forcing a synchronous reflow
            gradePointCell.classList.remove('gp-flash');
            requestAnimationFrame(() => {
                gradePointCell.classList.add('gp-flash');
            });
            updateSubjectProperty(subject.id, 'grade', selectedGrade);
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
        markUncalculated();
    };

    // Update subject property by ID and save — never auto-calculate, always mark as needing recalculation
    const updateSubjectProperty = (id, prop, value) => {
        const index = subjects.findIndex(s => s.id === id);
        if (index !== -1) {
            subjects[index][prop] = value;
            saveSubjects();
            markUncalculated();
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
        // Preserve user-added custom subjects (including Core, Major, Minor, Elective)
        const customSubjects = subjects.filter(s => (s.id && s.id.includes('_custom_')) || s.category === 'Minor' || s.category === 'Elective');
        
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
        markUncalculated();
    };

    // Mark that results need recalculation (UI state changes)
    const markUncalculated = () => {
        hasUncalculatedChanges = true;
        setCalculateButtonState('pending');
    };

    // Update the calculate button visual state
    const setCalculateButtonState = (state) => {
        const btn = document.getElementById('calculate-btn');
        if (!btn) return;
        const hint = document.getElementById('calculate-hint');
        
        if (state === 'pending') {
            btn.classList.add('btn-pending');
            btn.classList.remove('btn-calculated');
            if (hint) {
                hint.textContent = 'Grades changed — press to recalculate';
                hint.style.color = 'var(--warning-color, #f59e0b)';
            }
        } else if (state === 'calculated') {
            btn.classList.remove('btn-pending');
            btn.classList.add('btn-calculated');
            if (hint) {
                hint.textContent = 'SGPA is up to date ✓';
                hint.style.color = 'var(--success-color, #10b981)';
            }
        } else {
            btn.classList.remove('btn-pending', 'btn-calculated');
            if (hint) {
                hint.textContent = 'Press to compute your SGPA';
                hint.style.color = 'var(--text-muted, #6b7280)';
            }
        }
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

        // Check for duplicate subject name
        const duplicate = subjects.some(s => s.name.toLowerCase() === name.toLowerCase());
        if (duplicate) {
            showToast(`Warning: "${name}" already exists in the list`, true);
        }

        // Enforce maximum subject count
        const MAX_SUBJECTS = 50;
        if (subjects.length >= MAX_SUBJECTS) {
            showToast(`Maximum ${MAX_SUBJECTS} subjects allowed!`, true);
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
        markUncalculated();

        // Reset form
        form.reset();
        if (categorySelect) categorySelect.value = 'Core';
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
                    initResultsDisplay();
                }
            } else {
                if (confirm(`Are you sure you want to reset Semester ${currentSemester} to its default subjects and credits? This will clear entered grades.`)) {
                    subjects = getDefaultSemesterData(currentSemester);
                    saveSubjects();
                    renderSubjects();
                    initResultsDisplay();
                }
            }
        });
    }

    // Calculate button event listener — only calculates when user clicks
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateGPA);
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
        initResultsDisplay();
    };

    // Keyboard shortcuts for semester switching
    document.addEventListener('keydown', (e) => {
        // Left arrow: previous semester
        if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const sems = ['custom', '1', '2', '3', '4', '5', '6', '7', '8'];
            const idx = sems.indexOf(currentSemester);
            if (idx > 0) {
                const prev = sems[idx - 1];
                const btn = document.querySelector(`.sem-btn[data-sem="${prev}"]`);
                if (btn) btn.click();
            }
            e.preventDefault();
        }
        // Right arrow: next semester
        if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const sems = ['custom', '1', '2', '3', '4', '5', '6', '7', '8'];
            const idx = sems.indexOf(currentSemester);
            if (idx < sems.length - 1) {
                const next = sems[idx + 1];
                const btn = document.querySelector(`.sem-btn[data-sem="${next}"]`);
                if (btn) btn.click();
            }
            e.preventDefault();
        }
    });

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

    // ========================
    // Export Functionality
    // ========================

    const exportToast = document.getElementById('export-toast');
    const exportToastMessage = document.getElementById('export-toast-message');
    let toastTimeout = null;

    const showToast = (message, isError = false) => {
        if (toastTimeout) clearTimeout(toastTimeout);
        exportToastMessage.textContent = message;
        exportToast.className = `export-toast visible${isError ? ' error' : ''}`;
        if (window.lucide) window.lucide.createIcons();
        toastTimeout = setTimeout(() => {
            exportToast.classList.remove('visible');
        }, 3000);
    };

    // Dynamically load a script from CDN
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const exportPNGBtn = document.getElementById('export-png-btn');
    const exportPDFBtn = document.getElementById('export-pdf-btn');
    const exportPrintBtn = document.getElementById('export-print-btn');

    // Build a report info line: semester + major details
    const getExportHeaderText = () => {
        const semLabel = currentSemester === 'custom' ? 'Manual Mode' : `Semester ${currentSemester}`;
        const savedMajor = getSelectedMajor(currentSemester);
        if (savedMajor) {
            return `${semLabel}  •  Major: ${savedMajor}`;
        }
        return semLabel;
    };

    // Build a subject summary table for the export
    const buildExportSubjectTable = () => {
        if (subjects.length === 0) return null;

        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'margin-top: 1.5rem; width: 100%;';

        const title = document.createElement('div');
        title.textContent = 'Subjects Summary';
        title.style.cssText = `
            font-family: 'Outfit', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            color: #f3f4f6;
            margin-bottom: 0.75rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        `;
        wrapper.appendChild(title);

        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            font-size: 0.78rem;
        `;

        const isStructured = isStructuredSemester(currentSemester);

        if (isStructured) {
            // Group by category
            const grouped = {};
            CATEGORY_ORDER.forEach(cat => {
                const items = subjects.filter(s => s.category === cat);
                if (items.length > 0) grouped[cat] = items;
            });

            CATEGORY_ORDER.forEach(cat => {
                const items = grouped[cat];
                if (!items) return;

                // Category header row (always use dark theme colors for export)
                const catColors = CATEGORY_COLORS[cat] || { bg: 'transparent', text: '#9ca3af', border: 'rgba(255,255,255,0.08)' };
                const displayName = cat === 'Major' ? 'Majors' : cat;
                const catRow = document.createElement('tr');
                const catCell = document.createElement('td');
                catCell.colSpan = 4;
                catCell.style.cssText = `
                    padding: 0.6rem 0.5rem 0.3rem 0.5rem;
                    border-bottom: none;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                `;
                catCell.innerHTML = `<span style="background:${catColors.bg}; color:${catColors.text}; border:1px solid ${catColors.border}; padding:0.15rem 0.6rem; border-radius:999px;">${displayName}</span>`;
                catRow.appendChild(catCell);
                table.appendChild(catRow);

                // Subject rows for this category
                items.forEach((sub, idx) => {
                    const gp = sub.grade ? GRADE_POINTS[sub.grade] : '-';
                    const row = document.createElement('tr');
                    const cells = [
                        { text: escapeHtml(sub.name), styles: 'text-align:left; font-weight:500; color:#f3f4f6;' },
                        { text: sub.grade || '-', styles: `text-align:center; font-weight:600; color:${sub.grade ? '#9ca3af' : '#6b7280'};` },
                        { text: sub.credits.toFixed(1), styles: 'text-align:center; color:#9ca3af;' },
                        { text: gp, styles: 'text-align:center; font-weight:600; color:#9ca3af;' }
                    ];
                    row.innerHTML = cells.map(c => `<td style="padding:0.3rem 0.5rem; border-bottom:1px solid rgba(255,255,255,0.04); ${c.styles}">${c.text}</td>`).join('');
                    table.appendChild(row);
                });
            });
        } else {
            // Flat table for non-structured semesters
            // Header row
            const headRow = document.createElement('tr');
            const headers = ['Subject', 'Grade', 'Credits', 'Grade Pt.'];
            headRow.innerHTML = headers.map(h => 
                `<th style="padding:0.4rem 0.5rem; border-bottom:1px solid rgba(255,255,255,0.1); color:#6b7280; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; text-align:${h === 'Subject' ? 'left' : 'center'};">${h}</th>`
            ).join('');
            table.appendChild(headRow);

            subjects.forEach(sub => {
                const gp = sub.grade ? GRADE_POINTS[sub.grade] : '-';
                const row = document.createElement('tr');
                const cells = [
                    { text: escapeHtml(sub.name), styles: 'text-align:left; font-weight:500; color:#f3f4f6;' },
                    { text: sub.grade || '-', styles: `text-align:center; font-weight:600; color:${sub.grade ? '#9ca3af' : '#6b7280'};` },
                    { text: sub.credits.toFixed(1), styles: 'text-align:center; color:#9ca3af;' },
                    { text: gp, styles: 'text-align:center; font-weight:600; color:#9ca3af;' }
                ];
                row.innerHTML = cells.map(c => `<td style="padding:0.35rem 0.5rem; border-bottom:1px solid rgba(255,255,255,0.04); ${c.styles}">${c.text}</td>`).join('');
                table.appendChild(row);
            });
        }

        wrapper.appendChild(table);
        return wrapper;
    };

    // Build the full export element: report header + results card + subject table
    const prepareExportElement = () => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            background: #0b0f19;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            color: #f3f4f6;
            font-family: 'Inter', sans-serif;
            width: 500px;
            margin: 0 auto;
        `;

        // --- Report Header ---
        const header = document.createElement('div');
        header.style.cssText = `
            text-align: center;
            padding-bottom: 1rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        `;

        const reportTitle = document.createElement('div');
        reportTitle.textContent = 'Apex GPA - GPA Report';
        reportTitle.style.cssText = `
            font-family: 'Outfit', sans-serif;
            font-size: 1.2rem;
            font-weight: 700;
            background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.25rem;
        `;

        const reportInfo = document.createElement('div');
        reportInfo.textContent = getExportHeaderText();
        reportInfo.style.cssText = `
            font-size: 0.78rem;
            color: #9ca3af;
            font-weight: 500;
        `;

        header.appendChild(reportTitle);
        header.appendChild(reportInfo);
        wrapper.appendChild(header);

        // --- Results Card Content ---
        const resultsCard = document.querySelector('.results-card');
        const clone = resultsCard.cloneNode(true);

        // Remove export buttons from clone
        const exportBtns = clone.querySelector('.export-buttons');
        if (exportBtns) exportBtns.remove();

        // Remove the card-header from clone (we have our own report header)
        const cardHeader = clone.querySelector('.card-header');
        if (cardHeader) cardHeader.remove();

        // Style the cloned results content
        clone.style.background = 'transparent';
        clone.style.border = 'none';
        clone.style.padding = '0';
        clone.style.boxShadow = 'none';
        clone.style.margin = '0';
        clone.style.width = '100%';

        // Fix gauge text colors
        const gaugeNum = clone.querySelector('.gauge-number');
        if (gaugeNum) {
            gaugeNum.style.background = 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)';
            gaugeNum.style.webkitBackgroundClip = 'text';
            gaugeNum.style.webkitTextFillColor = 'transparent';
        }

        const gaugeLabel = clone.querySelector('.gauge-label');
        if (gaugeLabel) gaugeLabel.style.color = '#9ca3af';

        // Fix metric cards
        const metricCards = clone.querySelectorAll('.metric-card');
        metricCards.forEach(c => {
            c.style.background = 'rgba(17, 24, 39, 0.5)';
            c.style.border = '1px solid rgba(255, 255, 255, 0.08)';
        });

        // Fix rating box
        const ratingBox = clone.querySelector('.rating-box');
        if (ratingBox) {
            ratingBox.style.background = 'rgba(255, 255, 255, 0.02)';
            ratingBox.style.border = '1px solid rgba(255, 255, 255, 0.08)';
        }

        // Fix metric values
        const metricValues = clone.querySelectorAll('.metric-value');
        metricValues.forEach(v => v.style.color = '#f3f4f6');

        const metricHeaders = clone.querySelectorAll('.metric-header');
        metricHeaders.forEach(h => h.style.color = '#6b7280');

        // Fix rating message
        const ratingMsg = clone.querySelector('.rating-message');
        if (ratingMsg) ratingMsg.style.color = '#9ca3af';

        // Fix rating badge
        const ratingBadgeEl = clone.querySelector('.rating-badge');
        if (ratingBadgeEl) {
            const colorMap = {
                'rating-excellent': '#10b981',
                'rating-verygood': '#3b82f6',
                'rating-good': '#8b5cf6',
                'rating-average': '#f59e0b',
                'rating-poor': '#ef4444'
            };
            for (const [cls, color] of Object.entries(colorMap)) {
                if (ratingBadgeEl.classList.contains(cls)) {
                    ratingBadgeEl.style.color = color;
                    break;
                }
            }
        }

        wrapper.appendChild(clone);

        // --- Subject Summary Table ---
        const subjectTable = buildExportSubjectTable();
        if (subjectTable) {
            wrapper.appendChild(subjectTable);
        }

        return wrapper;
    };

    // Export as PNG
    const exportPNG = async () => {
        const btn = exportPNGBtn;
        btn.classList.add('exporting');
        btn.innerHTML = '<i data-lucide="loader-2"></i>';
        if (window.lucide) window.lucide.createIcons();

        try {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            
            const exportEl = prepareExportElement();
            exportEl.style.position = 'absolute';
            exportEl.style.left = '-9999px';
            exportEl.style.top = '0';
            document.body.appendChild(exportEl);

            const canvas = await window.html2canvas(exportEl, {
                scale: 2,
                backgroundColor: '#0b0f19',
                useCORS: true,
                logging: false
            });

            document.body.removeChild(exportEl);

            // Download PNG
            const link = document.createElement('a');
            link.download = `GPA_Report_${currentSemester === 'custom' ? 'Manual' : `Sem${currentSemester}`}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('PNG report downloaded!');
        } catch (err) {
            console.error('PNG export failed:', err);
            showToast('Failed to export PNG. Please try Print instead.', true);
        } finally {
            btn.classList.remove('exporting');
            btn.innerHTML = '<i data-lucide="image"></i>';
            if (window.lucide) window.lucide.createIcons();
        }
    };

    // Export as PDF
    const exportPDF = async () => {
        const btn = exportPDFBtn;
        btn.classList.add('exporting');
        btn.innerHTML = '<i data-lucide="loader-2"></i>';
        if (window.lucide) window.lucide.createIcons();

        try {
            await Promise.all([
                loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
                loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
            ]);

            const exportEl = prepareExportElement();
            exportEl.style.position = 'absolute';
            exportEl.style.left = '-9999px';
            exportEl.style.top = '0';
            document.body.appendChild(exportEl);

            const canvas = await window.html2canvas(exportEl, {
                scale: 2,
                backgroundColor: '#0b0f19',
                useCORS: true,
                logging: false
            });

            document.body.removeChild(exportEl);

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`GPA_Report_${currentSemester === 'custom' ? 'Manual' : `Sem${currentSemester}`}.pdf`);

            showToast('PDF report downloaded!');
        } catch (err) {
            console.error('PDF export failed:', err);
            showToast('Failed to export PDF. Please try Print instead.', true);
        } finally {
            btn.classList.remove('exporting');
            btn.innerHTML = '<i data-lucide="file-text"></i>';
            if (window.lucide) window.lucide.createIcons();
        }
    };

    // Export as CSV
    const exportCSV = () => {
        if (subjects.length === 0) {
            showToast('No subjects to export!', true);
            return;
        }
        const header = 'Subject,Grade,Credits,Grade Point';
        const rows = subjects.map(s => {
            const gp = s.grade ? GRADE_POINTS[s.grade] : '-';
            return `"${s.name}",${s.grade || '-'},${s.credits.toFixed(1)},${gp}`;
        });
        
        // Add summary row
        let totalCredits = 0;
        let totalPoints = 0;
        subjects.forEach(s => {
            if (s.grade) {
                totalCredits += s.credits;
                totalPoints += s.credits * GRADE_POINTS[s.grade];
            }
        });
        const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 'N/A';
        rows.push('');
        rows.push(`Overall SGPA,,,${gpa}`);
        
        const csv = [header, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `GPA_Data_${currentSemester === 'custom' ? 'Manual' : `Sem${currentSemester}`}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        showToast('CSV exported successfully!');
    };

    // Print report
    const printReport = () => {
        window.print();
    };

    // ========================
    // Saved Semesters & Cumulative CGPA
    // ========================

    let savedSemesters = [];

    const loadSavedSemesters = () => {
        try {
            const saved = localStorage.getItem('gpa_saved_semesters');
            savedSemesters = saved ? JSON.parse(saved) : [];
        } catch (e) {
            savedSemesters = [];
        }
    };

    const saveSavedSemesters = () => {
        localStorage.setItem('gpa_saved_semesters', JSON.stringify(savedSemesters));
    };

    const recalculateCGPA = () => {
        if (savedSemesters.length === 0) return null;
        
        let totalCredits = 0;
        let totalPoints = 0;
        
        savedSemesters.forEach(sem => {
            totalCredits += sem.totalCredits;
            totalPoints += sem.cumulativePoints;
        });
        
        return {
            cgpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
            totalCredits,
            totalPoints,
            count: savedSemesters.length
        };
    };

    const renderSavedSemesters = () => {
        const savedSection = document.getElementById('saved-section');
        const savedList = document.getElementById('saved-list');
        const savedListEmpty = document.getElementById('saved-list-empty');
        const cgpaSummary = document.getElementById('cgpa-summary');
        const cgpaValue = document.getElementById('cgpa-value');
        const cgpaTotalCredits = document.getElementById('cgpa-total-credits');
        const cgpaSemCount = document.getElementById('cgpa-sem-count');
        const cgpaBadge = document.getElementById('cgpa-badge');

        if (!savedSection) return;

        if (savedSemesters.length === 0) {
            savedSection.style.display = 'none';
            return;
        }

        savedSection.style.display = 'block';

        // Calculate cumulative CGPA
        const cgpaData = recalculateCGPA();
        
        if (cgpaData && cgpaData.totalCredits > 0) {
            cgpaSummary.style.display = 'block';
            cgpaValue.textContent = cgpaData.cgpa.toFixed(2);
            cgpaTotalCredits.textContent = cgpaData.totalCredits.toFixed(1);
            cgpaSemCount.textContent = cgpaData.count;
            if (cgpaBadge) {
                cgpaBadge.textContent = `CGPA: ${cgpaData.cgpa.toFixed(2)}`;
                cgpaBadge.style.display = 'inline-block';
            }
        } else {
            cgpaSummary.style.display = 'none';
            if (cgpaBadge) {
                cgpaBadge.textContent = 'CGPA: 0.00';
                cgpaBadge.style.display = 'inline-block';
            }
        }

        // Render saved semester items
        savedListEmpty.style.display = 'none';
        savedList.innerHTML = '';

        savedSemesters.forEach((sem, idx) => {
            const item = document.createElement('div');
            item.className = 'saved-list-item';
            item.style.animationDelay = `${idx * 0.05}s`;
            
            const semColors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#10b981', '#3b82f6'];
            const semIdx = sem.semKey === 'custom' ? 0 : (parseInt(sem.semKey) || 1);
            const iconColor = semColors[(semIdx - 1) % semColors.length];
            let displayName = sem.name;
            
            item.innerHTML = `
                <div class="saved-list-icon" style="background: ${iconColor}22;">
                    <i data-lucide="layers" style="color: ${iconColor};"></i>
                </div>
                <div class="saved-list-info">
                    <div class="saved-list-name">${escapeHtml(displayName)}</div>
                    <div class="saved-list-detail">${sem.totalCredits.toFixed(1)} credits  •  ${sem.cumulativePoints.toFixed(1)} grade pts</div>
                </div>
                <div class="saved-list-sgpa">${sem.sgpa.toFixed(2)}</div>
                <button class="saved-list-delete" data-sem-id="${escapeHtml(sem.id)}" aria-label="Delete saved semester">
                    <i data-lucide="x"></i>
                </button>
            `;
            
            savedList.appendChild(item);
            
            // Delete button handler
            const deleteBtn = item.querySelector('.saved-list-delete');
            deleteBtn.addEventListener('click', () => {
                deleteSavedSemester(sem.id);
            });
        });

        if (window.lucide) window.lucide.createIcons();
    };

    const saveCurrentSemester = () => {
        // Calculate current semester data
        let totalCredits = 0;
        let cumulativePoints = 0;
        
        subjects.forEach(subj => {
            if (!subj.grade) return;
            const gp = GRADE_POINTS[subj.grade];
            totalCredits += subj.credits;
            cumulativePoints += (subj.credits * gp);
        });

        if (totalCredits === 0) {
            showToast('No graded subjects to save!', true);
            return;
        }

        const sgpa = cumulativePoints / totalCredits;
        
        // Create semester label
        let semLabel;
        if (currentSemester === 'custom') {
            const savedMajor = getSelectedMajor(currentSemester);
            semLabel = savedMajor ? `Manual (${savedMajor})` : 'Manual';
        } else {
            const savedMajor = getSelectedMajor(currentSemester);
            semLabel = savedMajor ? `Semester ${currentSemester} (${savedMajor})` : `Semester ${currentSemester}`;
        }

        // Check if already saved, overwrite if same semester
        const existingIdx = savedSemesters.findIndex(s => s.semKey === currentSemester);
        
        const semData = {
            id: `saved_${currentSemester}_${Date.now()}`,
            semKey: currentSemester,
            name: semLabel,
            sgpa,
            totalCredits,
            cumulativePoints
        };

        if (existingIdx !== -1) {
            savedSemesters[existingIdx] = semData;
            showToast(`Updated ${semLabel} — SGPA: ${sgpa.toFixed(2)}`);
        } else {
            savedSemesters.push(semData);
            showToast(`Saved ${semLabel} — SGPA: ${sgpa.toFixed(2)}`);
        }
        
        saveSavedSemesters();
        renderSavedSemesters();
        updateSaveButtonState();
    };

    const deleteSavedSemester = (id) => {
        const sem = savedSemesters.find(s => s.id === id);
        savedSemesters = savedSemesters.filter(s => s.id !== id);
        saveSavedSemesters();
        renderSavedSemesters();
        updateSaveButtonState();
        if (sem) {
            showToast(`Removed ${sem.name}`);
        }
    };

    const updateSaveButtonState = () => {
        const saveBtn = document.getElementById('save-sem-btn');
        const saveHint = document.getElementById('save-hint');
        if (!saveBtn) return;

        // Check if current semester data has been calculated and has grades
        let totalCredits = 0;
        subjects.forEach(subj => {
            if (subj.grade) {
                totalCredits += subj.credits;
            }
        });

        if (totalCredits === 0 || hasUncalculatedChanges) {
            saveBtn.disabled = true;
            if (saveHint) {
                saveHint.textContent = hasUncalculatedChanges
                    ? 'Calculate SGPA first to save this semester'
                    : 'Add subjects with grades to save this semester';
            }
        } else {
            saveBtn.disabled = false;
            if (saveHint) {
                const existing = savedSemesters.find(s => s.semKey === currentSemester);
                saveHint.textContent = existing
                    ? 'Semester already saved — click to update'
                    : 'Save this semester to cumulative CGPA';
            }
        }
    };

    // Save button event listener
    const saveSemBtn = document.getElementById('save-sem-btn');
    if (saveSemBtn) {
        saveSemBtn.addEventListener('click', saveCurrentSemester);
    }

    // Event listeners
    if (exportPNGBtn) exportPNGBtn.addEventListener('click', exportPNG);
    if (exportPDFBtn) exportPDFBtn.addEventListener('click', exportPDF);
    if (exportPrintBtn) exportPrintBtn.addEventListener('click', printReport);

    // Initialize display to "ready" state
    const initResultsDisplay = () => {
        metricCredits.textContent = '0.0';
        metricPoints.textContent = '0.0';
        gpaDisplay.textContent = '0.00';
        ratingBadge.textContent = 'Ready to Calculate';
        ratingBadge.className = 'rating-badge rating-ready';
        ratingMessage.textContent = 'Enter your subjects and credits, then press "Calculate SGPA" to get your score and rating.';
        updateGauge(0);
        setCalculateButtonState('ready');
    };

    // Initial load & render
    loadSavedSemesters();
    loadSubjects();
    renderSubjects();
    initResultsDisplay();
    renderSavedSemesters();
    updateSaveButtonState();
});
