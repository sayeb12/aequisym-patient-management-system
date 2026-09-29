from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


from .models import Patient, PatientVisit

from .serializers import (
    PatientSerializer,
    PatientVisitSerializer
)

from .authentication import PatientLoginSerializer



class PatientListCreateView(generics.ListCreateAPIView):

    queryset = Patient.objects.all()

    serializer_class = PatientSerializer



class PatientRetrieveUpdateDestroyView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Patient.objects.all()

    serializer_class = PatientSerializer



class PatientVisitCreateView(generics.CreateAPIView):

    queryset = PatientVisit.objects.all()

    serializer_class = PatientVisitSerializer



class PatientLoginView(APIView):


    def post(self, request):

        serializer = PatientLoginSerializer(
            data=request.data
        )


        if serializer.is_valid():

            patient = serializer.validated_data["patient"]


            # for_user adds the user_id claim required by JWTAuthentication.
            refresh = RefreshToken.for_user(patient)

            refresh["mobile"] = patient.mobile



            return Response(

                {
                    "refresh": str(refresh),

                    "access": str(refresh.access_token),

                    "patient": {

                        "id": patient.id,

                        "name": (
                            patient.first_name
                            + " "
                            + patient.last_name
                        ),

                        "mobile": patient.mobile

                    }

                },

                status=status.HTTP_200_OK

            )


        return Response(

            serializer.errors,

            status=status.HTTP_400_BAD_REQUEST

        )

class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # AUTH_USER_MODEL is Patient, so request.user is already the patient.
        patient = request.user

        data = {
            "id": patient.id,
            "name": patient.first_name + " " + patient.last_name,
            "mobile": patient.mobile,
            "age": patient.age,
            "gender": patient.gender,
            "address": patient.address,
            "blood_group": patient.blood_group,
            "total_visits": patient.total_visits,
            "last_visit_date": patient.last_visit_date
        }

        return Response(data)


class PatientVisitListView(generics.ListAPIView):

    serializer_class = PatientVisitSerializer


    def get_queryset(self):

        patient_id = self.kwargs["patient_id"]

        return PatientVisit.objects.filter(
            patient_id=patient_id
        )