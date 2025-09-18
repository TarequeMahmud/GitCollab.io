from django.urls import path
from . import views

urlpatterns = [
    path("tasks/", views.TaskListCreate.as_view(), name="task-list-create"),
    path("tasks/<int:pk>/", views.TaskDetail.as_view(), name="task-detail"),
    path(
        "tasks/<int:pk>/",
        views.TaskUpdateAndDelete.as_view(),
        name="task-update-delete",
    ),
]
