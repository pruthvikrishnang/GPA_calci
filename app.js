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
    '3': [
        { name: 'Transform Calculus & Fourier Series', credits: 3.0, grade: '' },
        { name: 'Data Structures and Applications', credits: 4.0, grade: '' },
        { name: 'Computer Organization and Architecture', credits: 3.0, grade: '' },
        { name: 'Object Oriented Programming with C++', credits: 3.0, grade: '' },
        { name: 'Data Structures Laboratory', credits: 1.0, grade: '' },
        { name: 'Computer Organization Laboratory', credits: 1.0, grade: '' },
        { name: 'Social Connect and Responsibilities', credits: 1.0, grade: '' },
        { name: 'Quantitative Aptitude', credits: 1.0, grade: '' }
    ]
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

    // Curriculum Versioning to invalidate cache when default subjects change
    const CURRICULUM_VERSION = 'v3';
    const checkCurriculumVersion = () => {
        const savedVersion = localStorage.getItem('gpa_curriculum_version');
        if (savedVersion !== CURRICULUM_VERSION) {
            localStorage.removeItem('gpa_subjects_1');
            localStorage.removeItem('gpa_subjects_2');
            localStorage.removeItem('gpa_subjects_3');
            localStorage.setItem('gpa_curriculum_version', CURRICULUM_VERSION);
        }
    };
    checkCurriculumVersion();

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
        const defaults = SEMESTER_SUBJECTS[sem] || [];
        return defaults.map((sub, index) => ({
            id: `${sem}_${index}_${Date.now()}`,
            name: sub.name,
            credits: sub.credits,
            grade: sub.grade
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

            subjects.forEach((subject, index) => {
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
                    updateSubjectProperty(subject.id, 'name', nameInp.value.trim(), false);
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
                    // Animate grade point change
                    gradePointCell.classList.remove('gp-flash');
                    void gradePointCell.offsetWidth; // trigger reflow
                    gradePointCell.classList.add('gp-flash');
                    updateSubjectProperty(subject.id, 'grade', selectedGrade, true);
                });

                listBody.appendChild(tr);
            });

            // Re-initialize icons for newly added elements
            if (window.lucide) {
                window.lucide.createIcons();
            }
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

    // Add subject form handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const grade = gradeInput.value;
        const credits = parseFloat(creditsInput.value);

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
            id: currentSemester === 'custom' ? Date.now().toString() : `${currentSemester}_custom_${Date.now()}`,
            name,
            grade,
            credits
        };

        subjects.push(newSubject);
        saveSubjects();
        renderSubjects();

        // Reset form
        form.reset();
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
