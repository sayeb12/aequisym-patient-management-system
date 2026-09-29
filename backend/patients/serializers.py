from rest_framework import serializers
from .models import Patient, PatientVisit


class PatientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Patient
        fields = [
            "id",
            "first_name",
            "last_name",
            "mobile",
            "age",
            "gender",
            "address",
            "blood_group",
            "total_visits",
            "last_visit_date",
            "password",
        ]

        extra_kwargs = {
            "password": {
                "write_only": True,
                "required": False
            }
        }


    def create(self, validated_data):

        password = validated_data.pop("password")

        patient = Patient.objects.create(
            **validated_data
        )

        patient.set_password(password)
        patient.save()

        return patient

    def update(self, instance, validated_data):

        password = validated_data.pop(
            "password",
            None
        )


        for attr, value in validated_data.items():

            setattr(
                instance,
                attr,
                value
            )


        if password:
            instance.set_password(password)


        instance.save()

        return instance


class PatientVisitSerializer(serializers.ModelSerializer):

    class Meta:
        model = PatientVisit

        fields = [
            "id",
            "patient",
            "doctor_name",
            "visit_date",
            "clinical_note",
        ]


    def create(self, validated_data):

        visit = PatientVisit.objects.create(
            **validated_data
        )

        patient = visit.patient

        patient.total_visits += 1
        patient.last_visit_date = visit.visit_date

        patient.save()

        return visit