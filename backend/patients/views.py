from rest_framework import generics

from .models import Patient, PatientVisit
from .serializers import (
    PatientSerializer,
    PatientVisitSerializer
)



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