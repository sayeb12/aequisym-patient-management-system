from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class PatientManager(BaseUserManager):

    def create_patient(self, mobile, password=None, **extra_fields):
        if not mobile:
            raise ValueError("Patient must have a mobile number")

        patient = self.model(
            mobile=mobile,
            **extra_fields
        )

        patient.set_password(password)
        patient.save(using=self._db)

        return patient


class Patient(AbstractBaseUser):

    GENDER_CHOICES = (
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    )

    first_name = models.CharField(max_length=100)

    last_name = models.CharField(
        max_length=100,
        blank=True
    )

    mobile = models.CharField(
        max_length=15,
        unique=True
    )

    age = models.PositiveIntegerField()

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES
    )

    address = models.TextField(
        blank=True
    )

    blood_group = models.CharField(
        max_length=5
    )

    total_visits = models.PositiveIntegerField(
        default=0
    )

    last_visit_date = models.DateField(
        null=True,
        blank=True
    )

    USERNAME_FIELD = "mobile"

    REQUIRED_FIELDS = [
        "first_name",
        "age",
        "gender",
        "blood_group"
    ]

    objects = PatientManager()


    def __str__(self):
        return self.mobile



class PatientVisit(models.Model):

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="visits"
    )

    doctor_name = models.CharField(
        max_length=100
    )

    visit_date = models.DateField()

    clinical_note = models.TextField()


    def __str__(self):
        return f"{self.patient.mobile} - {self.visit_date}"