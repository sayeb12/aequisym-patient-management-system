# AequISym Patient Management System

A full-stack Patient Management System developed as a recruitment task
using Django REST Framework, PostgreSQL, and React.js.

------------------------------------------------------------------------

# Technology Stack

## Backend

-   Python
-   Django
-   Django REST Framework
-   PostgreSQL
-   Simple JWT Authentication

## Frontend

-   React.js
-   Vite
-   Axios
-   React Router

------------------------------------------------------------------------

# Project Structure

    aequisym-patient-management-system/

    ├── backend/
    │   ├── patients/
    │   ├── config/
    │   ├── manage.py
    │   └── requirements.txt
    │
    └── frontend/
        ├── src/
        ├── package.json
        └── vite.config.js

------------------------------------------------------------------------

# Backend Setup

## 1. Go to backend folder

``` bash
cd backend
```

## 2. Create virtual environment

``` bash
python -m venv venv
```

## 3. Activate virtual environment

Windows:

``` bash
venv\Scripts\activate
```

## 4. Install dependencies

``` bash
pip install -r requirements.txt
```

------------------------------------------------------------------------

# PostgreSQL Database Setup

Database used:

    patient_management_db

Database configuration:

    ENGINE: django.db.backends.postgresql
    NAME: patient_management_db
    USER: postgres
    PASSWORD: postgres123
    HOST: localhost
    PORT: 5432

------------------------------------------------------------------------

# Database Migration

Run:

``` bash
python manage.py makemigrations
python manage.py migrate
```

------------------------------------------------------------------------

# Import Patient Dataset

The recruitment task dataset is imported using a Django management
command.

Run:

``` bash
python manage.py import_patients
```

The script uses `update_or_create()`.

Behavior:

-   Existing patients are updated.
-   Duplicate rows are not created.
-   New patients are inserted.

------------------------------------------------------------------------

# Run Backend Server

``` bash
python manage.py runserver
```

Backend URL:

    http://127.0.0.1:8000/

------------------------------------------------------------------------

# Database Models

## Patient Table

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

Login:

    mobile + password

------------------------------------------------------------------------

## PatientVisit Table

Fields:

-   patient (Foreign Key)
-   doctor_name
-   visit_date
-   clinical_note

Creating a visit automatically updates:

-   total_visits
-   last_visit_date

------------------------------------------------------------------------

# REST API Endpoints

## Patient APIs

Get all patients:

    GET /api/patients/

Create patient:

    POST /api/patients/

Get single patient:

    GET /api/patients/<id>/

Update patient:

    PUT /api/patients/<id>/

Delete patient:

    DELETE /api/patients/<id>/

------------------------------------------------------------------------

## Patient Visit API

Create visit:

    POST /api/patient-visits/

------------------------------------------------------------------------

## Authentication API

Login:

    POST /api/login/

JWT Refresh:

    POST /api/token/refresh/

------------------------------------------------------------------------

# Frontend Setup

## 1. Go to frontend folder

``` bash
cd frontend
```

## 2. Install packages

``` bash
npm install
```

## 3. Start React application

``` bash
npm run dev
```

Frontend URL:

    http://localhost:5173/

------------------------------------------------------------------------

# Frontend Features

## Authentication

-   Login using mobile number and password
-   JWT based authentication
-   Protected dashboard

## Patient Management

Implemented:

-   Add patient
-   View patient list
-   View patient details
-   Update patient
-   Delete patient

## Patient Visit Management

Implemented:

-   Add patient visit
-   View visit history

Automatically updates:

    total_visits
    last_visit_date

------------------------------------------------------------------------

# API Communication

Frontend communicates with backend using:

    Axios

------------------------------------------------------------------------

# Development Approach

Backend:

-   Django Class Based Views
-   Django REST Framework Generic Views
-   Serializers
-   JWT Authentication

Frontend:

-   React Components
-   React Router
-   Axios API requests

------------------------------------------------------------------------

# Sample Login

Mobile:

    01700000000

Password:

    test12345

------------------------------------------------------------------------

# Complete Run Process

## Backend Terminal

``` bash
cd backend

venv\Scripts\activate

python manage.py runserver
```

## Frontend Terminal

``` bash
cd frontend

npm run dev
```

Open:

    http://localhost:5173/

------------------------------------------------------------------------

# Author

Md Abu Ubaida Jubaer Sayeb

------------------------------------------------------------------------

# GitHub Repository

    https://github.com/sayeb12/aequisym-patient-management-system
