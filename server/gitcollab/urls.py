from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)


from accounts.urls import router as accounts_router
from projects.urls import router as projects_router
from tasks.urls import router as tasks_router

router = DefaultRouter()
router.registry.extend(accounts_router.registry)
router.registry.extend(projects_router.registry)
router.registry.extend(tasks_router.registry)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
    path("auth/", include("accounts.urls")),
]

# API schema and documentation
urlpatterns += [
    # API schema endpoint
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    # Swagger UI
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    # ReDoc UI (alternative)
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
