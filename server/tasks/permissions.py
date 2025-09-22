from rest_framework.permissions import BasePermission
from projects.models import ProjectContributor


class TaskRolePermission(BasePermission):
    def __init__(self, allowed_roles=None):
        self.allowed_roles = allowed_roles or []

    def has_permission(self, request, view):  # type: ignore[override]
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method == "POST":
            project_id = request.data.get("project")
            if not project_id:
                return False
            return ProjectContributor.objects.filter(
                project_id=project_id,
                user=request.user,
                role__in=self.allowed_roles,
            ).exists()

        return True

    def has_object_permission(self, request, view, obj):  # type: ignore[override]
        print("working on task permission")
        project = self._get_project_from_object(obj)
        print("project is:", project)
        if not project:
            return False

        return ProjectContributor.objects.filter(
            project=project, user=request.user, role__in=self.allowed_roles
        ).exists()

    def _get_project_from_object(self, obj):
        if hasattr(obj, "project"):
            return obj.project
        elif hasattr(obj, "task") and hasattr(obj.task, "project"):
            return obj.task.project
        elif (
            hasattr(obj, "submission")
            and hasattr(obj.submission, "task")
            and hasattr(obj.submission.task, "project")
        ):
            return obj.submission.task.project
        return None


class TaskAdminPermission(TaskRolePermission):
    def __init__(self):
        super().__init__(allowed_roles=["admin"])


class TaskManagerPermission(TaskRolePermission):
    def __init__(self):
        super().__init__(allowed_roles=["admin", "manager"])


class TaskAllRolesPermission(TaskRolePermission):
    def __init__(self):
        super().__init__(allowed_roles=["admin", "manager", "member"])
