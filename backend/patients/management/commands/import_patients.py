from django.core.management.base import BaseCommand
from patients.models import Patient
from datetime import date


class Command(BaseCommand):

    help = "Import patient data"

    def handle(self, *args, **kwargs):

        patients = [
            {
                "first_name": "Rahim",
                "last_name": "Ahmed",
                "mobile": "01711111111",
                "age": 30,
                "gender": "MALE",
                "address": "Dhaka",
                "blood_group": "A+",
            },

            {
                "first_name": "Karim",
                "last_name": "Hasan",
                "mobile": "01822222222",
                "age": 45,
                "gender": "MALE",
                "address": "Chittagong",
                "blood_group": "B+",
            }
        ]


        for data in patients:

            patient, created = Patient.objects.update_or_create(
                mobile=data["mobile"],
                defaults=data
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created {patient.first_name}"
                    )
                )

            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"Updated {patient.first_name}"
                    )
                )