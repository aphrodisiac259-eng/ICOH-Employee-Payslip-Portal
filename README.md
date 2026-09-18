# ICOH Employee Payslip Request Portal

Official Payslip Request & Tracking Portal for the **INTERCOUNTRY CENTRE FOR ORAL HEALTH (ICOH) FOR AFRICA**, a parastatal agency under the Federal Ministry of Health, Federal Republic of Nigeria.

---

## 1. Project Overview

The **ICOH Employee Payslip Request Portal** consists of two distinct operational interfaces:

1. **Public Employee Portal**: A simple, unauthenticated form where ICOH employees submit monthly payslip requests using their official full name or IPPIS number, active official email, and required payslip month/year.
2. **Secure Admin Console**: A role-based, Firebase-authenticated dashboard for designated ICOH Payroll Desk Officers and Super Administrators to review, search, filter, and track requests.

> **Operational Scope Note:** The portal is the **request management and tracking mechanism**, not an automated email delivery engine. The workflow concludes when an authorized payroll officer updates the request status to **Completed/Sent** after obtaining the official payslip PDF from local storage and transmitting it to the employee's official email via the ICOH email client.

---

## 2. Key Features

- **Institutional Design**: Federal Republic of Nigeria institutional colors (Federal Green `#008C45` and crisp white), typography, and accessible cards.
- **Public Request Submission**:
  - Employee Identification toggle: Full Name OR IPPIS Number.
  - Official Email Address validation.
  - Calendar month and year selector.
  - Optional clarifying remarks for the Payroll Desk.
  - Instant generation of unique reference numbers: `ICOH-PS-YYYY-XXXXXX`.
  - Confirmation receipt with clipboard copy and print capability.
- **Duplicate Request Detection**: Automatically checks for identical requests submitted for the same employee/email and month, alerting administrators without blocking submission.
- **Secure Admin Console**:
  - **Firebase Authentication** exclusively (email and password).
  - Role-Based Access Control (RBAC): **Super Administrator** and **Payroll Desk Officer**.
  - KPI Dashboard summary cards: Total Requests, Pending, Processing, Completed/Sent, Attention Needed, and Current Month volume.
  - Searchable, filterable requests table with multi-criteria search (Name, IPPIS, Email, Reference Number), month filter, status filter, and pagination (10 to 50 items/page).
  - Detailed Request Inspector: Full history timeline, status updater, internal processing notes, and optional local PDF attachment metadata logging.
  - **Super Administrator Features**: Action & Security Audit Trail, Admin User Management, and System Settings configuration.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Backend & Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Build Tool**: Vite

---

## 4. Firebase Setup & Deployment Guide

### Step 1: Create or Connect a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named `icoh-payslip-portal` or select your existing organization project.

### Step 2: Enable Firebase Authentication
1. In the Firebase Console, go to **Build > Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, enable **Email/Password**.

### Step 3: Create Firestore Database
1. In the Firebase Console, go to **Build > Firestore Database**.
2. Click **Create Database**.
3. Choose your preferred region (e.g. `europe-west2` or `us-central1`).

### Step 4: Deploy Firestore Security Rules
Deploy the security rules contained in `firestore.rules`:
```bash
firebase deploy --only firestore:rules
```
The rules guarantee that:
- Unauthenticated public users can **ONLY** create payslip requests (`allow create`).
- Only authenticated admins can read, query, and update requests.
- Only SuperAdmins can manage other admin roles and view audit logs.

### Step 5: Creating the First Super Administrator
1. Go to **Authentication > Users** in the Firebase Console.
2. Click **Add user**.
3. Enter your administrative email (e.g., `admin@icoh.gov.ng`) and a secure password.
4. When this user logs into the Admin Console for the first time, our system registers their profile under the `admins` collection with **SuperAdmin** role.
5. You can also assign the custom claim `{"role": "SuperAdmin"}` using the Firebase Admin SDK if desired.

### Step 6: Creating Payroll Desk Officer Accounts
1. Create additional Firebase Authentication users for payroll staff.
2. In the Admin Console under **Admin Officers**, Super Administrators can authorize emails and designate them as **Payroll Desk Officer**.

---

## 5. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in your Firebase credentials in .env if overriding the default json

# 3. Start local development server
npm run dev
```

- Public Portal: `http://localhost:3000/`
- Admin Console: Navigate to `http://localhost:3000/` and click **Admin Login**.

---

## 6. Building and Deploying to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Set Framework Preset to **Vite**.
5. Add the environment variables from `.env.example`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
6. Click **Deploy**.

---

## 7. Operational Contact

**Intercountry Centre for Oral Health (ICOH) for Africa**  
ICOH Complex, Jos, Plateau State, Nigeria  
Payroll Desk: `payroll@icoh.gov.ng`
