# Campus Life Planner

**Campus Life Planner** is a lightweight, browser-based scheduling and productivity app designed for students to plan, track, and organize their academic and personal tasks. It helps users stay on top of their coursework, manage daily routines, and record achievements — all within a clean, accessible interface that works offline.

---

## Purpose

The **Campus Life Planner** aims to help students balance their studies, activities, and personal goals. It provides a structured yet flexible way to manage deadlines, tasks, and records without depending on heavy online services.  

It’s built using **vanilla HTML, CSS, and JavaScript**, with local storage persistence — making it fast, private, and easy to use.

---

## Features

- **Event Scheduling:** Add, edit, and remove upcoming academic or personal events.  
- **Tags & Categories:** Organize activities using keyword-based tagging.  
- **Duration Tracking:** Record study sessions, classes, or meetings with precise duration fields.  
- **Smart Search:** Filter tasks by keyword or tag.  
- **Records View:** View saved entries in chronological order with sorting and filtering.  
- **Settings Page:** Customize app preferences such as time units and maximum events.  
- **Persistent Storage:** All data is saved to `localStorage`, ensuring it stays even after closing the browser.  
- **Theme Toggle:** Built-in light/dark mode for comfortable viewing.  
- **Accessible Design:** Keyboard navigation, ARIA labeling, and color contrast compliant.

---

## Regex Catalog

The app uses a set of regular expressions for validation and consistency across forms (see `scripts/validators.js`).

| Field | Pattern | Description | Example (Valid) | Example (Invalid) |
|--------|----------|--------------|-----------------|------------------|
| **title** | `/^\\S(?:.*\\S)?$/` | No leading or trailing spaces | `"Project Plan"` | `"  Homework  "` |
| **dueDate** | `/^\\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\\d\|3[01])$/` | Strict ISO-style date format (YYYY-MM-DD) | `2025-10-17` | `17-10-2025` |
| **duration** | `/^(0\|[1-9]\\d*)(\\.\\d{1,2})?$/` | Integer or decimal duration (up to 2 decimals) | `1.5`, `90` | `1.234`, `-2` |
| **tag** | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Letters, optionally separated by spaces or hyphens | `Group Work`, `Self-study` | `Math_101`, `!urgent` |
| **duplicateWord** | `/\\b(\\w+)\\s+\\1\\b/` | Detects repeated consecutive words | `"This is nice"` | `"This this is wrong"` |

These patterns ensure all inputs follow consistent naming and formatting standards.

---

## Keyboard Map

The app provides intuitive keyboard shortcuts for accessibility and productivity:

| Shortcut | Action |
|-----------|--------|
| **Enter** | Submit active form (add/edit event) |
| **Esc** | Close modals or cancel input |
| **↑ / ↓** | Navigate through records list |
| **Ctrl + F** | Focus on search bar |
| **Ctrl + S** | Save current form (if active) |
| **Tab** | Move between input fields |
| **Shift + Tab** | Reverse field navigation |

---

## Accessibility (A11y) Notes

The Campus Life Planner follows key accessibility principles:

- All forms and buttons include descriptive `aria-label`s.
- Keyboard navigation is fully supported (no mouse required).
- Sufficient contrast between text and background in both light and dark modes.
- Focus states are visibly highlighted for interactive elements.
- Validation feedback (success/error messages) announced via `aria-live` regions.
- Uses semantic HTML elements (`<main>`, `<nav>`, `<section>`) for screen reader compatibility.

---

## Running Tests

There’s no formal testing framework (like Jest or Mocha) integrated — instead, tests are done **manually through form validation and localStorage behavior**.  

You can still verify functionality through the browser console:

1. Open **Developer Tools → Console**.
2. Run:
   ```js
   import { validateField } from "./scripts/validators.js";
   validateField("title", "Project Alpha"); // → true
   validateField("dueDate", "2025-02-31");  // → false
3. Inspect stored data:
    ```js
    JSON.parse(localStorage.getItem("campusPlanner:events"));
4. Check event ID generation:
    ```js
    import "./scripts/forms.js";
    // Then submit a new event and confirm IDs increment (event_001, event_002, etc.)

---

## Demo Video
Watch the demo video on Youtube: https://youtu.be/j3s7xMSzKsk

---

## Live URL
Run the app online using this link: https://mackun-ui.github.io/campus-life-planner/

---

## How to Run App Locally
1. Clone or download this repository:
    ```bash
    git clone https://github.com/your-username/campus-life-planner.git
    cd campus-life-planner
2. Open index.html directly in your browser (no build step required).
3. All functionality will run offline — your data is saved in the browser’s localStorage.

---

## Project Structure
    
    campus-life-planner/
    ├── index.html
    ├── forms.html
    ├── records.html
    ├── settings.html
    ├── assets/
    │   └── Wireframes.png
    ├── scripts/
    │   ├── dashboard.js
    │   ├── forms.js
    │   ├── records.js
    │   ├── search.js
    │   ├── settings.js
    │   ├── sidebar.js
    │   ├── state.js
    │   ├── storage.js
    │   ├── theme.js
    │   ├── ui.js
    │   └── validators.js
    └── styles/
        └── main.css

---
### Author: Manuelle Aseye Ackun
© 2025 Campus Life Planner – Built to simplify student organization and productivity.


