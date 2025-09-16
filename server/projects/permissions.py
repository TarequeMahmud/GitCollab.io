from rest_framework.permissions import BasePermission
from .models import ProjectContributor


class ProjectRolePermission(BasePermission):
    """
    Allows access if the user has one of the allowed roles in the project.
    """

    def __init__(self, allowed_roles):
        self.allowed_roles = allowed_roles

    def has_object_permission(self, request, view, obj):  # type: ignore[override]
        return ProjectContributor.objects.filter(
            project=obj, user=request.user, role__in=self.allowed_roles
        ).exists()
