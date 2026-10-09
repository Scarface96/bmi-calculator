# ⚖️ BMI Calculator

A simple React app that calculates your **Body Mass Index (BMI)** from your weight and height, shows a short message about the result, and displays a matching illustration.

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

<p align="center"><img src="docs/images/app.png" alt="BMI calculator showing a reading of 17.2 on the measuring-tape scale" width="320"></p>

## 🌐 Live Demo

**[scarface96.github.io/bmi-calculator](https://scarface96.github.io/bmi-calculator/)** — rebuilt and redeployed automatically on every push to `main`.

## ✨ Features

- **Metric or imperial** — kg/cm or lb/ft/in, and the app remembers your choice
- **Measuring-tape scale** with the four WHO bands and a marker that slides to your reading
- Correct **WHO adult categories**: underweight (< 18.5), healthy (18.5–24.9), overweight (25–29.9), obese (30+)
- **Healthy weight range** for your height, plus how much to gain or lose to reach it
- **Reading history** — your last 8 results, saved in your browser
- Friendly **inline validation** that catches empty fields and impossible values (like 1700 cm)
- Responsive, keyboard-accessible, and respects reduced-motion settings

## 🛠️ Built With

- **React 18** (functional components, `useState`, `useEffect`, lazy state initialisers)
- **Create React App**, plain CSS
- **Jest** unit tests for the BMI logic (`src/bmi.test.js`)
- **GitHub Actions** → GitHub Pages deployment (`.github/workflows/deploy.yml`)

## 📁 Project Structure

```
src/
├── App.js        # UI: unit switch, form, tape scale, results, history
├── bmi.js        # Pure BMI logic: conversions, categories, healthy range
├── bmi.test.js   # Unit tests for bmi.js
├── index.js      # App entry point
└── index.css     # Styles
```

## 🚀 Getting Started

```bash
git clone https://github.com/Scarface96/bmi-calculator.git
cd bmi-calculator
npm install
npm start         # dev server
npm test          # unit tests
```

Then open [http://localhost:3000](http://localhost:3000).

## 📚 What I Learned

Handling form input with React state, preventing default form submission, conditional rendering, and loading images dynamically based on state.

---

👤 **Tony Mulunda** — [GitHub @Scarface96](https://github.com/Scarface96)

## About This Project

A React application that converts user input into an immediate BMI result through a simple interactive interface. The project demonstrates component-based UI development, React state management, form handling, validation and conditional rendering.
