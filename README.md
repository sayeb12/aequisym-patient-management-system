# AequISym Patient Management System

A full-stack Patient Management System developed using:

- Backend: Django + Django REST Framework
- Database: PostgreSQL
- Frontend: React.js
- API Communication: Axios


## Project Structure
aequisym-patient-management-system/
├── backend/
│   ├── patients/
│   ├── config/
│   └── manage.py
│
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js



# Backend Setup


## 1. Go to backend folder
cd backend



## 2. Create virtual environment
python -m venv venv



## 3. Activate virtual environment

Windows:
venv\Scripts\activate



## 4. Install dependencies
pip install -r requirements.txt



## 5. PostgreSQL Database Setup

Create database:
patient_management_db



Database configuration:
ENGINE: django.db.backends.postgresql
NAME: patient_management_db
USER: postgres
PASSWORD: postgres123
HOST: localhost
PORT: 5432



## 6. Run migrations
python manage.py makemigrations
python manage.py migrate



## 7. Import sample patient data
python manage.py import_patients



## 8. Run Django server
python manage.py runserver

Backend runs at:
http://127.0.0.1:8000/




# Frontend Setup


## 1. Open frontend folder
cd frontend


## 2. Install packages
npm install


## 3. Start React application
npm run dev


Frontend runs at:
http://localhost:5173/



# Features


## Patient Authentication

- Login using mobile number and password
- JWT authentication


## Patient Management

- Create patient
- View patient list
- Update patient
- Delete patient


## Patient Visit

- Add patient visit
- Automatically updates:
    - total visits
    - last visit date



# API Endpoints


## Patient

GET
/api/patients/

POST
/api/patients/

GET single patient
/api/patients/<id>/

PUT
/api/patients/<id>/

DELETE
/api/patients/<id>/


## Patient Visit

POST
/api/patient-visits/


## Login

POST
/api/login/



# Technologies Used

- Python
- Django
- Django REST Framework
- PostgreSQL
- React
- Axios
- JWT


# Author

Md Abu Ubaida Jubaer Sayeb