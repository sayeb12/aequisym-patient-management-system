from rest_framework import serializers
from django.contrib.auth.hashers import check_password

from .models import Patient


class PatientLoginSerializer(serializers.Serializer):

    mobile = serializers.CharField()

    password = serializers.CharField(
        write_only=True
    )


    def validate(self, data):

        mobile = data.get("mobile")
        password = data.get("password")


        try:

            patient = Patient.objects.get(
                mobile=mobile
            )

        except Patient.DoesNotExist:

            raise serializers.ValidationError(
                "Invalid mobile or password"
            )


        if not check_password(
            password,
            patient.password
        ):

            raise serializers.ValidationError(
                "Invalid mobile or password"
            )


        data["patient"] = patient

        return data