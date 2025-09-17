from django.urls import path
from . import views

urlpatterns = [
    path("tasks/", views.TaskList.as_view(), name="task-list"),
    path("tasks/", views.TaskCreate.as_view(), name="task-create"),
    path("tasks/<int:pk>/", views.TaskDetail.as_view(), name="task-detail"),
    path(
        "tasks/<int:pk>/",
        views.TaskUpdateAndDelete.as_view(),
        name="task-update-delete",
    ),
]
