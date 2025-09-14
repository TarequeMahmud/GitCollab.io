from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UsersView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"accounts", UsersView, basename="accounts")

urlpatterns = router.urls + [
    path("auth/login/", TokenObtainPairView.as_view(), name="auth-login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
]
