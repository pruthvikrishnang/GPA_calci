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
* **Live Deployment Link**: *[Insert your GitHub Pages link here once deployed]* 🔗
> **Tip for Users**: You can open this link on your computer, tablet, or smartphone to calculate your grades on the go!

---

## ✨ Features

- **Real-time calculations**: Computes total credits, cumulative grade points, and final SGPA instantly.
- **Predefined Grades Dropdown**: Contains standard academic letter grades (O, A+, A, B+, B, C, P, F).
- **Dynamic Circular Gauge**: An SVG-based circular progress chart that animates smoothly from 0.00 to 10.00 using gradients.
- **Glassmorphic UI**: High-end styling featuring backdrop blurs, responsive grids, hover glows, and a responsive light/dark mode switch.
- **Interactive Form Validation**: Shakes invalid input fields (e.g. credits less than 0.5 or empty names) to provide instant visual error feedback.
- **Clear All Option**: A convenient reset button to wipe your data and start fresh with a simple confirmation prompt.
- **Print Optimization**: Automatically formats the page for clean printing by hiding form fields and control buttons when `Ctrl + P` is pressed.

---

## 📖 How to Use

1. **Enter Subject Name**: Type the name of your course (e.g. *Computer Networks*).
2. **Select Grade**: Choose the grade you scored (or expect to score) from the dropdown list.
3. **Enter Credits**: Input the credits assigned to that course (typically between 0.5 and 10.0).
4. **Click Add**: The subject will slide into the table and the circular gauge will dynamically animate to show your new SGPA.
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

## 🌐 Deploying to GitHub Pages

1. Push the code to your GitHub repository (see instructions below).
2. On GitHub, navigate to your repository settings.
3. In the sidebar, select **Pages** (under the "Code and automation" section).
4. Under **Build and deployment**, select **Deploy from a branch** as the source.
5. Under **Branch**, select `main` (or `master`) and `/ (root)` folder, then click **Save**.
6. GitHub will generate your live link in about a minute! Copy the link and paste it into the deployment section in this `README.md`.
