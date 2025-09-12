from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

# register api viewsets
router = DefaultRouter()

router.register(r"users", viewset=views.UsersView, basename="user")


# API endpoints
urlpatterns = [
    path("", include(router.urls)),
]
