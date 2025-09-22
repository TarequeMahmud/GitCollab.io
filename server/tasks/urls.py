from django.urls import path
from . import views
from .views import SubmitTaskViewSet, ReviewSubmissionViewSet

urlpatterns = [
    path("tasks/", views.TaskListCreate.as_view(), name="task-list-create"),
    path("tasks/<int:pk>/", views.TaskDetail.as_view(), name="task-detail"),
    path(
        "tasks/<int:pk>/",
        views.TaskUpdateAndDelete.as_view(),
        name="task-update-delete",
    ),
    path(
        "tasks/<int:pk>/submissions/",
        SubmitTaskViewSet.as_view({"post": "create", "put": "update"}),
        name="submit-task",
    ),
    path(
        "tasks/<int:pk>/reviews/",
        ReviewSubmissionViewSet.as_view({"post": "create", "put": "update"}),
        name="review-submission",
    ),
]
