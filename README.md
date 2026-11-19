# FindIT – Campus Lost & Found Management System
Course: Front End Web Development (26CA205PCB) · MCA · KIET Deemed To Be University

Tech: HTML5, CSS3, Vanilla JavaScript, LocalStorage & SessionStorage (no build step, zero external frameworks).

## How to Run
1. Open `index.html` in any modern web browser, or:
2. Start a simple local HTTP server from the project directory:
   ```bash
   python -m http.server 8000 -d FindIT
   ```
   and visit `http://localhost:8000`.

---

## 🔒 University Access Control & Privacy Architecture
In a real-world university environment, student-reported belongings (including personal phone numbers, photos, student IDs, and lost item locations) must **never be exposed to unauthenticated public visitors**.

### 1. Guest Users (Unauthenticated Visitors)
Guests can access:
- Public Homepage (`index.html`) with how-it-works guide, institutional trust features, and FAQs.
- About Us & Department Information (`about.html`).
- Campus contact form & help desk channels.
- Sign In (`login.html`) and Registration (`register.html`).

Guests **cannot** access:
- Public listings or campus activity feeds (removed from public homepage).
- Item catalog and search (`search.html` — automatically redirects to `login.html?redirect=search.html&reason=browse_required`).
- Item details and ownership claims (`item.html` — redirects to login).
- Report Lost and Report Found forms (`report-lost.html`, `report-found.html` — redirects to login).
- Student Dashboard and My Reports (`dashboard.html`, `my-reports.html` — redirects to login).

### 2. Authenticated Campus Members (Students & Faculty)
After logging in, students gain full access to:
- **Student Dashboard** (`dashboard.html`): Campus metrics, quick reporting actions, personal listings summary, and recent verified items.
- **Browse Items** (`search.html`): Full keyword search, category filtering, campus location search, and date filters.
- **Item Details & Claim Workflow** (`item.html`): Detailed specifications, ownership proof messages, and match recommendations.
- **Report Lost & Report Found** (`report-lost.html`, `report-found.html`): Form with photo upload (PNG, JPG, WebP with live preview).
- **My Reports** (`my-reports.html`): Dedicated management view to edit, resolve, or mark items as returned.
- **Student Profile**: Modal displaying verified enrollment ID, college, and contact info.

---

## Separate Public & Private Navigation
| Navigation State | Links Displayed |
|---|---|
| **Public (Guests)** | `Home` · `How It Works` · `About Us` · `FAQ` · `Contact` · `Sign In` · `Register` |
| **Authenticated (Students)** | `Dashboard` · `Browse Items` · `Report Lost` · `Report Found` · `My Reports` · `Profile [Name]` · `Logout` |

---

## Demo Accounts (Quick Evaluation)
The system automatically initializes demo student accounts in LocalStorage on first launch. You can click on the quick demo login buttons or use:

| Email | Password | Name / Role | College | Student ID |
|---|---|---|---|---|
| `student@kiet.edu` | `Password123` | Aarav Mehta (Student) | KIET Deemed To Be University | 2100290140001 |
| `riya.sharma@kiet.edu` | `Password123` | Riya Sharma (Student) | KIET Deemed To Be University | 2100290140002 |

You can also register a new account anytime on `register.html`.

---

## Complete Page Directory
| File | Module & Description | Access Level |
|---|---|---|
| `index.html` | Public Homepage – university landing page, how it works, why choose FindIT, privacy standards, FAQ | **Public** |
| `about.html` | Institutional mission, campus help desk contact form, and FAQ | **Public** |
| `login.html` | Sign In – email/password validation, show/hide password, remember me, demo quick-fill pills | **Public** |
| `register.html` | Student Registration – 7 validated fields, live password strength meter, duplicate check | **Public** |
| `dashboard.html` | Student Dashboard – personalized welcome, campus metrics, my items overview, recent items | **Authenticated Only** |
| `search.html` | Browse Items – search, filter by category/location/date, sort, responsive grid | **Authenticated Only** |
| `item.html` | Item Details – large photo, metadata table, claim message dialog, suggested matches | **Authenticated Only** |
| `report-lost.html` | Report Lost Item – validated form with image upload dropzone and live thumbnail preview | **Authenticated Only** |
| `report-found.html` | Report Found Item – validated form with image upload dropzone and custody location | **Authenticated Only** |
| `my-reports.html` | Listing Manager – view, resolve, mark returned, or delete user's own reports | **Authenticated Only** |

---

## Important Security Note
> [!NOTE]
> Client-side LocalStorage and SessionStorage authentication in this project is designed for **frontend demonstration, academic grading, and UI prototyping**. In a production enterprise deployment, authentication must be enforced by a backend API (Node.js/Express, Python/Django), bcrypt password hashing, HTTP-only secure session cookies, and database authorization checks.
