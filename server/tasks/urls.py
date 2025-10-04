from django.urls import path
from . import views
from .views import SubmitTaskViewSet, ReviewSubmissionViewSet

urlpatterns = [
    path("tasks/", views.TaskListCreate.as_view(), name="task-list-create"),
    path("tasks/<uuid:pk>/", views.TaskDetail.as_view(), name="task-detail"),
    path(
        "tasks/<uuid:pk>/",
        views.TaskUpdateAndDelete.as_view(),
        name="task-update-delete",
    ),
    path(
        "tasks/<uuid:pk>/submissions/",
        SubmitTaskViewSet.as_view({"post": "create", "put": "update"}),
        name="submit-task",
    ),
    path(
        "tasks/<uuid:task_id>/submissions/<uuid:pk>/download/",
        SubmitTaskViewSet.as_view({"get": "download_file"}),
        name="submission-download",
    ),

    path(
        "tasks/<uuid:pk>/reviews/",
        ReviewSubmissionViewSet.as_view({"post": "create", "put": "update"}),
        name="review-submission",
    ),
]
