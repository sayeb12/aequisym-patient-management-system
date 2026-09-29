# AequISym Patient Management System

A full-stack Patient Management System developed as a recruitment task
using Django REST Framework, PostgreSQL, and React.js.

## Fresh Setup Guide

### Clone Repository

``` bash
git clone https://github.com/sayeb12/aequisym-patient-management-system.git
cd aequisym-patient-management-system
```

### Backend Setup

``` bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### PostgreSQL Setup

Database:

    patient_management_db

Configuration:

    ENGINE: django.db.backends.postgresql
    NAME: patient_management_db
    USER: postgres
    PASSWORD: postgres123
    HOST: localhost
    PORT: 5432

### Migration

``` bash
python manage.py makemigrations
python manage.py migrate
```

### Import Dataset

``` bash
python manage.py import_patients
```

The import script uses `update_or_create()` to prevent duplicate
records.

### Run Backend

``` bash
python manage.py runserver
```

Backend URL:

    http://127.0.0.1:8000/

### Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

Frontend URL:

    http://localhost:5173/

## Features

-   JWT authentication
-   Patient login using mobile and password
-   Add patient
-   View patient list
-   View patient details
-   Update patient
-   Delete patient
-   Add patient visit
-   View visit history

## API Endpoints

    GET /api/patients/
    POST /api/patients/
    GET /api/patients/<id>/
    PUT /api/patients/<id>/
    DELETE /api/patients/<id>/

    POST /api/patient-visits/

    POST /api/login/
    POST /api/token/refresh/

## Sample Login

    Mobile:
    01700000000

    Password:
    test12345

## Author

Md Abu Ubaida Jubaer Sayeb

## Repository

https://github.com/sayeb12/aequisym-patient-management-system
