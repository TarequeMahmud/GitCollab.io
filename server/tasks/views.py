from rest_framework import generics, mixins, viewsets
from rest_framework.decorators import action
from django.http import FileResponse, Http404
from .models import Task, Submission, Review
from .serializers import TaskSerializer, SubmissionSerializer, ReviewSerializer
from .permissions import (
    TaskAdminPermission,
    TaskManagerPermission,
    TaskAllRolesPermission,
)
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class TaskListCreate(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAdminUser()]
        elif self.request.method == "POST":
            return [IsAuthenticated(), TaskManagerPermission()]
        return [IsAuthenticated()]


class TaskDetail(generics.RetrieveAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [
        IsAuthenticated,
        TaskAllRolesPermission,
    ]


class TaskUpdateAndDelete(
    mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView
):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [
        IsAuthenticated,
        TaskAdminPermission,
    ]

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class SubmitTaskViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    @action(detail=True, methods=["get"])
    def download_file(self, request, pk=None, task_id=None):
        submission = self.get_object() 
        file = submission.submission_file
        if not file:
            return Response({"detail": "No file uploaded"}, status=404)

        response = FileResponse(file.open("rb"), as_attachment=True, filename=file.name)
        return response


class ReviewSubmissionViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
