# Student & Course Management System

A modern, responsive web-based Academic Management System built for tracking student enrollments and course curricula. Developed using **HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), jQuery, and JSON Server** with full CRUD capabilities over RESTful endpoints and automatic LocalStorage fallback.

---

## 🚀 Quick Setup & How to Run

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
* Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox)

### Step 1: Clone the Repository
```bash
git clone https://github.com/dhruv-2197/Full-Stack-Web-Development---Project-1.git
cd Full-Stack-Web-Development---Project-1
```

### Step 2: Start the Mock REST API (JSON Server)
You can launch the backend using `npm` or directly with `npx`:

**Option A (Recommended via npm):**
```bash
npm install
npm start
```

**Option B (Using npx directly):**
```bash
npx json-server --watch data/db.json --port 3000
```

> **Expected Server Output:**
> ```text
> Loading data/db.json
> Done
> 
> Resources
> http://localhost:3000/students
> http://localhost:3000/courses
> 
> Home
> http://localhost:3000
> ```

### Step 3: Launch the Application
Open `index.html` directly in your web browser, or launch it with VS Code Live Server.

> **Offline Fallback:** If the JSON Server is not running, the application automatically uses browser `localStorage` so that all UI operations and evaluations continue to work seamlessly.

---

## 1. Project Purpose & Highlights

Educational institutions need an intuitive system to manage student enrollments and course curricula without cumbersome spreadsheets:
* **Executive Dashboard:** Live metrics displaying Total Students, Active Students, Courses, and Academic Departments.
* **Student Directory (CRUD):** Add, view, edit, and delete student records with instant modal forms, live search filtering by name/department, and badge indicators.
* **Course Catalog (CRUD):** Manage course offerings with course codes, instructor assignments, credit points, and department mappings.
* **Offline Resiliency:** Features an automated LocalStorage fallback layer so that UI functionality remains operational during evaluations.

---

## 2. Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure, accessible forms, data tables, and modal dialogs |
| **CSS3** | Modern typography, custom badges, elevation shadows, and responsive layout |
| **Bootstrap 5.3** | 12-column responsive grid, modal windows, navigation tabs, and toast components |
| **JavaScript (ES6+)** | Asynchronous HTTP requests (`fetch`), REST client architecture, state management |
| **jQuery 3.7.1** | Declarative DOM manipulation, event listeners, dynamic filtering, and modal control |
| **JSON Server** | Lightweight mock REST API server providing real HTTP endpoints backed by `data/db.json` |

---

## 3. Directory Structure

```text
.
├── assets/
│   ├── css/
│   │   └── style.css            # Custom CSS styles and Bootstrap overrides
│   └── js/
│       ├── api.js               # REST API service with automatic local storage fallback
│       └── app.js               # Main jQuery event listeners and DOM controllers
├── data/
│   └── db.json                  # Mock REST API database (Students & Courses)
├── index.html                   # Executive Dashboard & KPI metrics
├── students.html                # Students Directory & Enrollment CRUD
├── courses.html                 # Course Offerings & Curriculum CRUD
├── package.json                 # Project configuration & npm scripts
├── .gitignore                   # Ignored files for Git version control
├── LICENSE                      # MIT Open Source License
└── README.md                    # Setup and execution guide
```

---

## 4. REST API Endpoints Specification

### Students Resource (`/students`)
* `GET /students` – Retrieve all student records.
* `POST /students` – Add a new student record (Payload: `name`, `email`, `rollNo`, `department`, `year`, `course`, `status`).
* `PUT /students/:id` – Update an existing student record by ID.
* `DELETE /students/:id` – Delete a student record by ID.

### Courses Resource (`/courses`)
* `GET /courses` – Retrieve all course offerings.
* `POST /courses` – Add a new course (Payload: `courseCode`, `title`, `instructor`, `credits`, `department`).
* `PUT /courses/:id` – Update course details by ID.
* `DELETE /courses/:id` – Delete a course by ID.

---

## 5. Verification & Test Cases

| Test Case | Inputs / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **TC-01: Create Student** | Name: "Neha Gupta", Email: "neha@college.edu", Roll: "2024CS199" | Record saved, POST returns 201, appears in table | **Pass** |
| **TC-02: Form Validation** | Submit empty form | Browser displays HTML5 validation errors on required fields | **Pass** |
| **TC-03: Live Search** | Type "Diya" in search bar | Table filters to show only records matching "Diya" | **Pass** |
| **TC-04: Update Student** | Edit student course to "Cloud Computing" | Record updated via PUT, UI table updates | **Pass** |
| **TC-05: Delete Student** | Click Delete $\rightarrow$ Confirm | Record removed via DELETE, counter decrements | **Pass** |

---

## 6. License
This project is open-source and available under the [MIT License](LICENSE).
