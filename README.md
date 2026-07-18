# Apex GPA & SGPA Calculator 📊

Welcome to the **Apex GPA Calculator**! A sleek, premium, and fully responsive single-page web application designed for students to calculate and track their Semester Grade Point Average (SGPA) and cumulative CGPA across all semesters.

Built with modern glassmorphism aesthetics, dynamic SVG visualizations, and a polished interactive experience, it makes academic tracking simple, engaging, and accurate.

---

## 🚀 Live Demo
The calculator is deployed on GitHub Pages for instant access.
* **Live URL**: *https://pruthvikrishnang.github.io/GPA_calci/* 🔗

---

## ✨ Features

### Core Functionality
- **Semester-Wise Templates**: Auto-fills standard curricula for Semesters 1–8 with one-click glassmorphic selector tabs
- **Major Selection**: Choose your major (AIML, Data Science, Cloud Computing, Cyber Security) for structured semesters 3–8
- **Interactive Inline Editing**: Edit subject names, credits, and select letter grades directly inside table rows
- **Real-time GPA Calculation**: Manual calculation with animated number counter that counts up smoothly
- **Cumulative CGPA Tracking**: Save semester results and track your overall CGPA across all semesters

### Visual & Experience
- **Circular SVG Gauge**: Animated progress ring with gradient colors representing your GPA
- **Performance Ratings**: Contextual badges (Excellent, Very Good, Good, Average, Poor) with descriptive messages
- **Confetti Celebration**: Colorful confetti burst when achieving Excellent GPA (≥ 9.0)
- **Grade Distribution Bar**: Visual breakdown of all grades earned in the current semester
- **Dark/Light Theme**: Toggle between dark and light modes with smooth transitions
- **Glassmorphic UI**: Backdrop blurs, responsive grids, hover glows, and micro-interactions

### Data Management
- **Local Storage Persistence**: All subjects, grades, and saved semesters persist across sessions
- **Semester-Specific Storage**: Separately tracks data for each semester and the custom mode
- **Curriculum Versioning**: Automatically resets semester data when curriculum definitions change
- **Bulk Grade Fill**: Quickly assign grades to all ungraded subjects at once

### Export Options
- **PNG Export**: Download a styled GPA report card as an image
- **PDF Export**: Generate a downloadable PDF report
- **CSV Export**: Export subject data as a CSV file for spreadsheet analysis
- **Print Optimization**: Clean print layout accessible via Ctrl+P

### Search & Organization
- **Subject Search**: Real-time filtering with Ctrl+F keyboard shortcut
- **Category Grouping**: Core, Major, Minor, and Elective sections for structured semesters
- **Subject Count Limit**: Maximum 50 subjects per semester with warning

### Accessibility & UX
- **Keyboard Shortcuts**: Arrow keys to switch semesters, Escape to clear search, Ctrl+F to focus search
- **Copy GPA**: Click the GPA value to copy it to your clipboard
- **Input Validation**: Shake animations and visual feedback for invalid inputs
- **Responsive Design**: Optimized for desktop, tablet, and mobile screens
- **Auto-scroll**: Results section auto-scrolls into view on mobile after calculation

---

## 📖 How to Use

1. **Choose Mode / Semester**: Select **Manual** mode to input subjects from scratch, or click any **Semester** tab to load predefined subjects
2. **Select Major** (Semesters 3–8): Choose your major from the pill selector to load major-specific subjects
3. **Enter Grades**: Select grades from the inline dropdown in each subject row
4. **Add Custom Subjects**: Use the "Add New Subject" form for additional subjects
5. **Calculate SGPA**: Press the **Calculate SGPA** button to compute your score
6. **Save Semester**: Click "Save Semester Result" to track your progress in the cumulative CGPA
7. **Export**: Use the export buttons (PNG, PDF, CSV) or Print to save your report

---

## 📊 Grading Scheme

| Letter Grade | Grade Description | Grade Point |
| :---: | :--- | :---: |
| **O** | Outstanding | 10 |
| **A+** | Excellent | 9 |
| **A** | Very Good | 8 |
| **B+** | Good | 7 |
| **B** | Above Average | 6 |
| **C** | Average | 5 |
| **P** | Pass | 4 |
| **F** | Fail | 0 |

### Performance Ratings
- **GPA ≥ 9.0**: `Excellent` 🎉
- **GPA ≥ 7.0**: `Very Good` 
- **GPA ≥ 6.0**: `Good`
- **GPA ≥ 5.0**: `Average`
- **GPA < 5.0**: `Poor`

---

## 🛠️ Tech Stack

- **Structure**: HTML5 (Semantic elements, Open Graph meta tags)
- **Styling**: Vanilla CSS3 (Custom properties, CSS grid/flex, animations, glassmorphism)
- **Behavior**: Vanilla ES6+ JavaScript (LocalStorage, dynamic DOM manipulation)
- **Icons**: Lucide Icons CDN
- **Fonts**: Outfit (Headers) & Inter (Body)
- **Exports**: html2canvas, jsPDF (loaded on demand from CDN)

---

## 🖥️ Local Installation

```bash
git clone https://github.com/pruthvikrishnang/GPA_calci.git
cd GPA_calci
# Open index.html in your browser (no build tools required)
```
