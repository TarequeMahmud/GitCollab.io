from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from accounts import urls as accounts_urls
from projects import urls as projects_urls
from tasks import urls as tasks_urls


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(accounts_urls)),
    path("", include(projects_urls)),
    path("", include(tasks_urls)),
]

# API schema and documentation
urlpatterns += [
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
