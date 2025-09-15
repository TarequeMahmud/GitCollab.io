from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from drf_spectacular.utils import extend_schema

from .models import Project
from .serializers import ProjectSerializer, ContributorSerializer


class ProjectsView(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    @extend_schema(
        request=ContributorSerializer,
        responses={200: ContributorSerializer},
        description="Add a contributor to the project by username.",
    )
    @action(detail=True, methods=["post"], url_path="add-contributor")
    def add_contributor(self, request, pk=None):
        project = self.get_object()
        serializer = ContributorSerializer(data=request.data)
        if serializer.is_valid():
            result = serializer.update_contributors(project, action="add")
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=ContributorSerializer,
        responses={200: ContributorSerializer},
        description="Remove a contributor from the project by username.",
    )
    @action(detail=True, methods=["post"], url_path="remove-contributor")
    def remove_contributor(self, request, pk=None):
        project = self.get_object()
        serializer = ContributorSerializer(data=request.data)
        if serializer.is_valid():
            result = serializer.update_contributors(project, action="remove")
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
