from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404
from accounts.models import User
from .models import Project, ProjectContributor
from .permissions import ProjectRolePermission
from .serializers import ProjectSerializer, ProjectContributorSerializer, ProjectContributorDetailSerializer
from tasks.serializers import TaskSerializer


class ProjectsView(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in [
            "update",
            "destroy",
        ]:
            return [IsAuthenticated(), ProjectRolePermission(["admin"])]

        elif self.action in [
            "partial_update",
            "add_contributor",
            "remove_contributor",
            "get_tasks",
        ]:
            return [IsAuthenticated(), ProjectRolePermission(["admin", "manager"])]

        elif self.action == "list":
            return [
                IsAdminUser(),
            ]

        elif self.action == "retrieve":
            return [
                IsAuthenticated(),
                ProjectRolePermission(["admin", "manager", "member"]),
            ]

        return [IsAuthenticated()]

    @action(detail=True, methods=["get"], url_path="get-tasks")
    def get_tasks(self, request, pk=None):
        project = self.get_object()
        tasks = project.tasks.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    @extend_schema(
        request=ProjectContributorSerializer,
        responses={200: ProjectContributorSerializer},
        description="Add a contributor to the project by username.",
    )
    @action(detail=True, methods=["post"], url_path="add-contributor")
    def add_contributor(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectContributorSerializer(data=request.data)
        if serializer.is_valid():
            result = serializer.modify_contributors(project, action="add")
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=None,
        responses={200: ProjectContributorDetailSerializer(many=True)},
        description="Remove a contributor from the project by user ID (UUID).",
    )
    @action(
        detail=True,
        methods=["delete"],
        url_path=r"remove-contributor/(?P<user_id>[0-9a-f-]+)",
    )
    def remove_contributor(self, request, pk=None, user_id=None):
        project = self.get_object()
        user = get_object_or_404(User, id=user_id)

        # Remove contributor
        ProjectContributor.objects.filter(project=project, user=user).delete()

        contributors = ProjectContributor.objects.filter(
            project=project
        ).select_related("user")

        serializer = ProjectContributorDetailSerializer(contributors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)