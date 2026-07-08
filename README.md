# Apex GPA & SGPA Calculator 📊

Welcome to the **Apex GPA Calculator**! A sleek, premium, and fully responsive single-page web application designed for students to calculate and track their Semester Grade Point Average (SGPA) and cumulative grade points. 

Built with modern glassmorphism aesthetics, dynamic SVG visualizations, and real-time calculations, it makes academic tracking simple, engaging, and accurate.

---

## 🌟 The Use Case

Keeping track of academic performance can be tedious. Students often have to deal with manual formulas, look up grade weightages, or use cluttered, outdated calculators. 

**Apex GPA Calculator** solves this by providing:
1. **Frictionless Inputting**: Direct dropdowns for letter grades, eliminating the need to memorize grade points (e.g., *O = 10, A+ = 9, etc.*).
2. **Instant Feedback**: Values recalculate on every single keypress, form submission, or row deletion.
3. **Performance Assessment**: Generates clear, contextual badges (e.g., *Excellent, Very Good*) and rating messages to help students understand their standing at a glance.
4. **PDF/Print Readiness**: Built-in print stylesheets clean up the page so users can save their calculated report cards directly to PDF or print them with a single click (`Ctrl + P`).

---

## 🚀 Deployed Application
The calculator is designed to be hosted on GitHub Pages for instant public access.
* **Live Deployment Link**: *https://pruthvikrishnang.github.io/GPA_calci/* 🔗
> **Tip for Users**: You can open this link on your computer, tablet, or smartphone to calculate your grades on the go!

---

## ✨ Features

- **Semester-Wise Integration**: Auto-fills standard curricula (subjects and credits) for Semesters 1, 2, and 3 with one-click glassmorphic selector tabs.
- **Interactive Inline Table Editing**: Edit subject names, credits, and select letter grades directly inside the table rows, triggering real-time GPA recalculations.
- **Semester-Specific Persistence**: Separately persists subjects and user-entered grades for each semester, remembering the last active tab on page reload.
- **Real-time calculations**: Computes total credits, cumulative grade points, and final SGPA instantly.
- **Predefined Grades Dropdown**: Contains standard academic letter grades (O, A+, A, B+, B, C, P, F).
- **Dynamic Circular Gauge**: An SVG-based circular progress chart that animates smoothly from 0.00 to 10.00 using gradients.
- **Glassmorphic UI**: High-end styling featuring backdrop blurs, responsive grids, hover glows, and a responsive light/dark mode switch.
- **Interactive Form Validation**: Shakes invalid input fields (e.g. credits less than 0.5 or empty names) to provide instant visual error feedback.
- **Dynamic Clear & Reset**: Automatically adapts to clear all custom subjects in Manual mode, or reset defaults in semester modes with safety prompts.
- **Print Optimization**: Automatically formats the page for clean printing by hiding form fields and control buttons when `Ctrl + P` is pressed.

---

## 📖 How to Use

1. **Choose Mode / Semester**: Select **Manual** mode to input subjects from scratch, or click **Sem 1**, **Sem 2**, or **Sem 3** to load predefined subjects and credits.
2. **Enter Grades**: For preloaded semesters, simply select your grade from the inline dropdown in the table for each subject. SGPA will update instantly.
3. **Customize Curriculum**: Click directly into the subject name or credits input field in the table row to make custom adjustments. Use the trash icon to delete subjects, or the "Reset" icon in the table header to return to defaults.
4. **Add Custom Subject**: Use the form at the top to add any extra subjects to your active semester.
5. **Delete/Reset**: Click the trash icon next to any subject to delete it, or the refresh icon in the table header to clear the list.
6. **Print or Save**: Press `Ctrl + P` (or `Cmd + P` on Mac) to print your grades or save them as a clean PDF report card.

---

## 📊 Grading & Scoring Scheme

The calculator maps letter grades to standard grade points according to the following weights:

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
Based on the final calculated GPA, the application evaluates your standing:
* **GPA $\ge$ 9.0**: `Excellent` 🟢 (Exceptional academic standing!)
* **GPA $\ge$ 7.0**: `Very Good` 🔵 (Includes GP of 7.xx)
* **GPA $\ge$ 6.0**: `Good` 🟣
* **GPA $\ge$ 5.0**: `Average` 🟡
* **GPA < 5.0**: `Poor` 🔴

---

## 🛠️ Tech Stack & Architecture

- **Structure**: HTML5 (Semantic elements)
- **Styling**: Vanilla CSS3 (Custom properties, CSS grid/flex, animations)
- **Behavior**: Vanilla ES6+ JavaScript
- **Icons**: Lucide Icons CDN
- **Fonts**: Outfit (Headers) & Inter (Body/Inputs)

---

## 🖥️ Local Installation

To run this project locally without any dependencies:
1. Clone this repository:
   ```bash
   git clone https://github.com/pruthvikrishnang/GPA_calci.git
   ```
2. Open `index.html` in your web browser.

---
