from rest_framework import generics, mixins
from .models import Task
from .serializers import TaskSerializer
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
