# WebGen

# 🩺 WebGen

An AI-driven platform for seamless doctor-patient consultations and medical record management.

WebGen is a modern, full-stack web application designed to streamline the interaction between patients, doctors, and administrators. It features a sleek, role-based interface where patients can request appointments and get AI-powered medical advice, doctors can manage their schedules and patient records, and admins can oversee the entire system. A key highlight is the integration with Google's Gemini API via Genkit for an intelligent chatbot experience, all wrapped in a responsive UI built with Next.js and ShadCN.

---

## ✨ Features

### 👨‍⚕️ For Patients
- **👤 Profile Management**: Easily update personal and comprehensive medical information (diagnoses, allergies, medications).
- **📅 Appointment Scheduling**: Request appointments with specific doctors, choose preferred dates, and provide reasons for the visit.
- **🤖 AI Medical Advisor**: Engage with an AI chatbot (powered by Gemini) that provides medical advice based on your profile, with built-in safety disclaimers.
- **🔒 Secure PMR Sharing**: Upload Personal Medical Records (PMR) and generate a secure, time-sensitive access code to share them with doctors.
- **🗓️ Appointment Tracking**: View a complete history of past and upcoming appointments, with options to respond to rescheduling requests or cancel.

### 👩‍⚕️ For Doctors
- **📊 Professional Dashboard**: Get an at-a-glance view of your professional summary, total patients, and a weekly calendar of approved appointments.
- **📋 Appointment Management**: Review, approve, deny, cancel, or reschedule incoming patient appointment requests.
- **👥 Patient Roster**: Access a list of all your patients and dive into their detailed profiles, including medical history and past appointments.
- **📂 Secure Record Viewing**: View patient-shared PMRs by entering the secure access code provided by the patient.

### ⚙️ For Admins
- **🖥️ Centralized Dashboard**: Manage all doctors and patients in the system from a single, intuitive interface.
- **👤 User Management (CRUD)**: Add, view, edit, and remove user accounts for both doctors and patients.
- **🔑 Password Reset**: Securely reset passwords for any user, which generates a temporary password and requires the user to change it upon their next login.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (with App Router), React, TypeScript
- **Backend/Server**: Next.js (Server Actions), Genkit
- **AI Tools & APIs**: Genkit, Google Gemini API
- **Styling**: Tailwind CSS, ShadCN UI
- **UI Components**: Radix UI
- **Form Management**: React Hook Form, Zod (for validation)
- **Routing**: Next.js App Router
- **Date/Time**: `date-fns`

---

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites
- **Node.js**: Version 20.x or higher.
- **Google AI API Key**: You'll need an API key for the Gemini model. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Firebase Configuration
This project does not require a Firebase project to run locally, as it uses mock data. However, for a production environment, you would configure Firebase services (Auth, Firestore, etc.).

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/WebGen.git
    cd WebGen
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Environment Variable Setup
1.  Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
2.  Add your Google AI API key to the `.env` file:
    ```
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

### Running the Application
1.  **Start the development server**:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to `http://localhost:9002` to see the application in action.

---

## 📂 Project Structure

```
.
├── src
│   ├── app
│   │   ├── (app)                # Authenticated routes (dashboards)
│   │   │   ├── admin
│   │   │   ├── doctor
│   │   │   └── patient
│   │   ├── (auth)               # Authentication routes (login)
│   │   ├── globals.css          # Global styles
│   │   └── layout.tsx           # Root layout
│   ├── ai
│   │   ├── flows                # Genkit AI flows (e.g., chatbot logic)
│   │   └── genkit.ts            # Genkit configuration
│   ├── components
│   │   ├── admin                # Admin-specific components
│   │   ├── auth                 # Login form
│   │   ├── doctor               # Doctor-specific components
│   │   ├── patient              # Patient-specific components
│   │   ├── shared               # Reusable components (header, footer)
│   │   └── ui                   # ShadCN UI components
│   ├── context                  # React context providers (Auth, Users, Appointments)
│   ├── hooks                    # Custom React hooks
│   ├── lib
│   │   ├── actions.ts           # Next.js server actions
│   │   ├── data.ts              # Mock data for the application
│   │   └── types.ts             # TypeScript type definitions
└── ...
```

---

## 🔮 Future Improvements

- **Real-time Chat**: Implement a real-time chat feature between doctors and patients for direct communication.
- **Notifications**: Add email or in-app notifications for appointment confirmations, cancellations, and reminders.
- **Payment Integration**: Integrate a payment gateway like Stripe to handle consultation fees.
- **Prescription Management**: Allow doctors to generate and manage digital prescriptions for patients.
- **Data Visualization**: Add charts and graphs to the admin and doctor dashboards to visualize user data and appointment statistics.
