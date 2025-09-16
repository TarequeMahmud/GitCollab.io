from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from drf_spectacular.utils import extend_schema

from .models import Project
from .permissions import ProjectRolePermission
from .serializers import ProjectSerializer, ProjectContributorSerializer


class ProjectsView(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in [
            "update",
            "destroy",
        ]:
            return [IsAuthenticated(), ProjectRolePermission(["admin"])]

        elif self.action in ["partial_update", "add_contributor", "remove_contributor"]:
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
        request=ProjectContributorSerializer,
        responses={200: ProjectContributorSerializer},
        description="Remove a contributor from the project by username.",
    )
    @action(detail=True, methods=["post"], url_path="remove-contributor")
    def remove_contributor(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectContributorSerializer(data=request.data)
        if serializer.is_valid():
            result = serializer.modify_contributors(project, action="remove")
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
