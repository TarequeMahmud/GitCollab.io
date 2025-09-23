from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from tasks.models import Task, Submission
from tasks.serializers import TaskSerializer, SubmissionSerializer
from projects.models import Project
from projects.serializers import ProjectSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .models import User
from .serializers import UserSerializer


class IsSelfOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj == request.user


class UsersView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]
        elif self.action == "list":
            permission_classes = [IsAdminUser]
        elif self.action in ["retrieve", "update", "partial_update", "destroy"]:
            permission_classes = [IsSelfOrAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class MeViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def tasks(self, request):
        """GET /accounts/me/tasks/ → my tasks"""
        tasks = Task.objects.filter(assignee=request.user)
        serializer = TaskSerializer(tasks, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def projects(self, request):
        projects = (
            Project.objects.filter(project_contributors__user=request.user)
            .distinct()
            .prefetch_related("contributors")
        )
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def submissions(self, request):
        """GET /accounts/me/submissions/ → my submissions"""
        submissions = Submission.objects.filter(submitted_by=request.user)
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)
