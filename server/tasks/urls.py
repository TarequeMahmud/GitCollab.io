from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"tasks", views.TasksView, basename="task")

urlpatterns = router.urls
