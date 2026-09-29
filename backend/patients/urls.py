from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    PatientListCreateView,
    PatientRetrieveUpdateDestroyView,
    PatientVisitCreateView,
    PatientLoginView,
    PatientProfileView
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

    path(
        "profile/",
        PatientProfileView.as_view(),
        name="patient-profile"
    ),

    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh"
    ),

]
