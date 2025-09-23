from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UsersView, MeViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"accounts", UsersView, basename="accounts")

urlpatterns = router.urls + [
    path("auth/login/", TokenObtainPairView.as_view(), name="auth-login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
    path("accounts/me/tasks/", MeViewSet.as_view({"get": "tasks"}), name="me-tasks"),
    path(
        "accounts/me/projects/",
        MeViewSet.as_view({"get": "projects"}),
        name="me-projects",
    ),
    path(
        "accounts/me/submissions/",
        MeViewSet.as_view({"get": "submissions"}),
        name="me-submissions",
    ),
]
