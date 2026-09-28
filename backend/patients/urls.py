from django.urls import path

from .views import (
    PatientListCreateView,
    PatientRetrieveUpdateDestroyView,
    PatientVisitCreateView,
    PatientLoginView
)


urlpatterns = [

    path(
        "patients/",
        PatientListCreateView.as_view(),
        name="patient-list-create"
    ),


    path(
        "patients/<int:pk>/",
        PatientRetrieveUpdateDestroyView.as_view(),
        name="patient-detail"
    ),


    path(
        "patient-visits/",
        PatientVisitCreateView.as_view(),
        name="patient-visit-create"
    ),


    path(
        "login/",
        PatientLoginView.as_view(),
        name="patient-login"
    ),

]