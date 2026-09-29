# AequISym Patient Management System

A full-stack Patient Management System developed as a recruitment task.

The application provides patient authentication, patient CRUD
operations, patient visit management, and REST API communication.

## Technology Stack

### Backend

-   Python
-   Django
-   Django REST Framework
-   PostgreSQL
-   Simple JWT Authentication

### Frontend

-   React.js
-   Vite
-   Axios
-   React Router

# Project Structure

    aequisym-patient-management-system/

    │
    ├── backend/
    │   │
    │   ├── patients/
    │   │   ├── models.py          # Database models (Patient, PatientVisit)
    │   │   ├── serializers.py     # API serializers
    │   │   ├── views.py           # API views and authentication logic
    │   │   ├── urls.py            # Backend API routes
    │   │   └── management/
    │   │       └── commands/
    │   │           └── import_patients.py  # Dataset import command
    │   │
    │   ├── config/
    │   │   ├── settings.py        # Django project settings
    │   │   └── urls.py            # Main URL configuration
    │   │
    │   ├── manage.py              # Django management command
    │   ├── requirements.txt       # Backend dependencies
    │   └── venv/                  # Python virtual environment
    │
    │
    └── frontend/
        │
        ├── src/
        │   ├── pages/             # React pages
        │   ├── api/               # Axios configuration
        │   └── utils/             # Authentication utilities
        │
        ├── package.json           # Frontend dependencies
        └── vite.config.js         # Vite configuration

# Complete Installation Guide

## Step 1: Clone Repository

Open Git Bash terminal:

``` bash
git clone https://github.com/sayeb12/aequisym-patient-management-system.git
```

Move into project folder:

``` bash
cd aequisym-patient-management-system
```

# Backend Setup

## Step 2: Navigate to Backend

``` bash
cd backend
```

## Step 3: Create Python Virtual Environment

``` bash
python -m venv venv
```

## Step 4: Activate Virtual Environment

### Git Bash (Windows)

``` bash
source venv/Scripts/activate
```

### Windows Command Prompt

``` bash
venv\Scripts\activate
```

After activation, terminal should show:

    (venv)

## Step 5: Install Backend Dependencies

``` bash
pip install -r requirements.txt
```

# PostgreSQL Database Setup

Create PostgreSQL database:

    patient_management_db

Database configuration in Django:

    ENGINE: django.db.backends.postgresql

    NAME: patient_management_db

    USER: postgres

    PASSWORD: postgres123

    HOST: localhost

    PORT: 5432

# Database Migration

Run:

``` bash
python manage.py makemigrations

python manage.py migrate
```

# Import Recruitment Dataset

The provided patient dataset is imported using a Django management
command.

Run:

``` bash
python manage.py import_patients
```

The import script uses:

    update_or_create()

Advantages:

-   Existing patient records are updated.
-   Duplicate records are avoided.
-   New records are inserted.

# Run Backend Server

Start Django server:

``` bash
python manage.py runserver
```

Backend runs at:

    http://127.0.0.1:8000/

# Frontend Setup

Open a new Git Bash terminal.

Navigate to frontend:

``` bash
cd aequisym-patient-management-system/frontend
```

Install dependencies:

``` bash
npm install
```

Run React application:

``` bash
npm run dev
```

Frontend runs at:

    http://localhost:5173/

# Database Models

## Patient Model

Stores patient information.

Fields:

-   first_name
-   last_name
-   mobile
-   age
-   gender
-   address
-   blood_group
-   total_visits
-   last_visit_date
-   password

Authentication:

    Mobile Number + Password

## PatientVisit Model

Stores patient visit information.

Fields:

-   patient (Foreign Key)
-   doctor_name
-   visit_date
-   clinical_note

When a visit is created:

-   total_visits automatically increases.
-   last_visit_date automatically updates.

# REST API Documentation

## Patient APIs

### Get All Patients

Returns all registered patients.

Method:

    GET

Endpoint:

    /api/patients/

### Create Patient

Creates a new patient record.

Method:

    POST

Endpoint:

    /api/patients/

### Get Single Patient

Returns details of a specific patient.

Method:

    GET

Endpoint:

    /api/patients/<id>/

### Update Patient

Updates existing patient information.

Method:

    PUT

Endpoint:

    /api/patients/<id>/

### Delete Patient

Deletes a patient record.

Method:

    DELETE

Endpoint:

    /api/patients/<id>/

# Patient Visit API

### Create Patient Visit

Creates a new patient visit.

Method:

    POST

Endpoint:

    /api/patient-visits/

# Authentication API

### Patient Login

Authenticates patient using mobile number and password.

Method:

    POST

Endpoint:

    /api/login/

### JWT Token Refresh

Generates a new access token.

Method:

    POST

Endpoint:

    /api/token/refresh/

# Frontend Features

## Authentication

-   Mobile number and password login
-   JWT token storage
-   Protected dashboard
-   Logout functionality

## Patient Management

-   Add patient
-   View patient list
-   View complete patient details
-   Update patient information
-   Delete patient

## Patient Visit Management

-   Add patient visit
-   View visit history
-   Automatic visit count update

# Application Workflow

    Login
      |
      |
    Dashboard
      |
      |
    Patient List
      |
      |---- View Patient
      |
      |---- Add Patient
      |
      |---- Update Patient
      |
      |---- Delete Patient
      |
      |---- Add Visit
      |
      |---- View Visits

# Sample Login Credentials

Mobile:

    01700000000

Password:

    test12345

# Running Complete Project

## Terminal 1 - Backend

``` bash
cd backend

source venv/Scripts/activate

python manage.py runserver
```

## Terminal 2 - Frontend

``` bash
cd frontend

npm run dev
```

Open browser:

    http://localhost:5173/

# Author

Md Abu Ubaida Jubaer Sayeb

# GitHub Repository

https://github.com/sayeb12/aequisym-patient-management-system
