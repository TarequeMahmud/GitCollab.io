# root urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# import the routers from apps
from users.urls import router as users_router
from projects.urls import router as projects_router
from tasks.urls import router as tasks_router

# merge routers into one
router = DefaultRouter()
router.registry.extend(users_router.registry)
router.registry.extend(projects_router.registry)
router.registry.extend(tasks_router.registry)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),  # one DRF root, combined
]
