from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer


class TasksView(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
