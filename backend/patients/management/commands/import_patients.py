from django.core.management.base import BaseCommand

from patients.models import Patient



class Command(BaseCommand):

    help = "Import patient data"



    def handle(self, *args, **kwargs):


        patients = [

            {
                "first_name": "Ab.",
                "last_name": "Kader",
                "mobile": "01677307926",
                "age": 25,
                "gender": "MALE",
                "address": "Dhaka",
                "blood_group": "O+",
                "password": "test12345",
            },


            {
                "first_name": "Morshed",
                "last_name": "Khan",
                "mobile": "01674205677",
                "age": 29,
                "gender": "MALE",
                "address": "Dhaka",
                "blood_group": "O+",
                "password": "test12345",
            },


            {
                "first_name": "Jhorna",
                "last_name": "",
                "mobile": "01675216052",
                "age": 26,
                "gender": "FEMALE",
                "address": "Dhaka",
                "blood_group": "B+",
                "password": "test12345",
            },


            {
                "first_name": "Dhuku",
                "last_name": "Miah",
                "mobile": "01860280511",
                "age": 32,
                "gender": "MALE",
                "address": "Dhaka",
                "blood_group": "B+",
                "password": "test12345",
            },


            {
                "first_name": "Aklima",
                "last_name": "",
                "mobile": "01912850072",
                "age": 30,
                "gender": "FEMALE",
                "address": "Dhaka",
                "blood_group": "AB+",
                "password": "test12345",
            },


            {
                "first_name": "Aslam",
                "last_name": "",
                "mobile": "01854558127",
                "age": 29,
                "gender": "MALE",
                "address": "Dhaka",
                "blood_group": "B+",
                "password": "test12345",
            },


            {
                "first_name": "Kobir",
                "last_name": "",
                "mobile": "01984605450",
                "age": 33,
                "gender": "MALE",
                "address": "Dhaka",
                "blood_group": "A+",
                "password": "test12345",
            },


            {
                "first_name": "Kamruzzaman",
                "last_name": "",
                "mobile": "01925704524",
                "age": 35,
                "gender": "MALE",
                "address": "Dhaka",
                "blood_group": "B+",
                "password": "test12345",
            },


            {
                "first_name": "Munna",
                "last_name": "",
                "mobile": "01747497279",
                "age": 42,
                "gender": "MALE",
                "address": "Dhaka",
                "blood_group": "O+",
                "password": "test12345",
            },


            {
                "first_name": "Ashraful",
                "last_name": "",
                "mobile": "01910786529",
                "age": 38,
                "gender": "MALE",
                "address": "Dhaka",
                "blood_group": "O+",
                "password": "test12345",
            },

        ]



        for data in patients:


            patient, created = Patient.objects.update_or_create(

                mobile=data["mobile"],

                defaults=data

            )


            patient.set_password(data["password"])

            patient.save()



            if created:

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created {patient.first_name} {patient.last_name}"
                    )
                )

            else:

                self.stdout.write(
                    self.style.WARNING(
                        f"Updated {patient.first_name} {patient.last_name}"
                    )
                )