# Apex GPA Calculator 📊

A beautiful, smooth, and interactive GPA/SGPA calculator designed to help students track their academic performance.

## Features
- **Dynamic Subject Management**: Easily add and delete subjects on the fly.
- **Predefined Grades Dropdown**: No need to manually remember grade points. Select from standard grades (O, A+, A, B+, B, C, P, F) with pre-mapped weightages.
- **Real-time Calculations**: Computes cumulative GPA points, total credits, and overall GPA dynamically as you edit.
- **Aesthetic Visual Feedback**: Beautiful circular progress gauge showing performance levels with intuitive text ratings (Excellent, Very Good, Good, etc.).
- **Theme Toggle**: Sleek glassmorphism design with responsive light/dark mode.
- **Interactive UI**: Micro-interactions, hover effects, and smooth animations.

## Tech Stack
- HTML5 (Semantic Structure)
- CSS3 (Vanilla Custom Properties, Flexbox/Grid, Keyframe Animations, Glassmorphism)
- JavaScript (Vanilla ES6+, Dynamic DOM Manipulation)
- Lucide Icons (For clean UI icons)
- Google Fonts (Outfit & Inter)

## Installation & Usage
1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. Start calculating your GPA!

## Grading Scale & Performance Classification
The calculator is configured to map letter grades to grade points automatically:
- **O (Outstanding)**: 10
- **A+ (Excellent)**: 9
- **A (Very Good)**: 8
- **B+ (Good)**: 7
- **B (Above Average)**: 6
- **C (Average)**: 5
- **P (Pass)**: 4
- **F (Fail)**: 0

### Performance Ratings
- **GPA >= 9.0**: Excellent 🟢
- **GPA >= 7.0**: Very Good 🔵 (A GPA of 7 gives a "Very Good" rating)
- **GPA >= 6.0**: Good 🟣
- **GPA >= 5.0**: Average 🟡
- **GPA < 5.0**: Poor 🔴

## Pushing to GitHub
This repository contains a clean, detailed history of 20+ commits outlining the step-by-step development process. To push this to your GitHub account:

1. Create a new, empty repository on GitHub (do not initialize with README, license, or .gitignore).
2. Copy the repository URL.
3. Open your terminal in this project folder and run:
   ```bash
   # Add your GitHub repository as the remote origin
   git remote add origin <your-github-repo-url>
   
   # Rename the branch to main (if not already main)
   git branch -M main
   
   # Push the commits to GitHub
   git push -u origin main
   ```
4. Verify the commits and files on your GitHub page!
