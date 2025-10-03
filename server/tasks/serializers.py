from rest_framework import serializers
from .models import Task, Submission, Review
from projects.models import Project, ProjectContributor
from accounts.models import User


class TaskSerializer(serializers.ModelSerializer):
    project = serializers.UUIDField(write_only=True)
    assignee = serializers.UUIDField(write_only=True, required=False, allow_null=True)

    project_details = serializers.SerializerMethodField(read_only=True)
    assignee_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_project_details(self, obj):
        if obj.project:
            return {
                "id": obj.project.id,
                "title": obj.project.title,
            }
        return None

    def get_assignee_details(self, obj):
        if obj.assignee:
            contributor = ProjectContributor.objects.filter(
            project=obj.project, user=obj.assignee
            ).values(
            "user", "user__username", "user__name", "user__email", "role"
            ).first()
            if contributor:
                return {
                    "user": contributor["user"],
                    "username": contributor["user__username"],
                    "name": contributor["user__name"],
                    "email": contributor["user__email"],
                    "role": contributor["role"],
                }
        return None
    

    def validate(self, attrs):
        project_id = attrs.get("project")

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise serializers.ValidationError({"project": "Project not found"})
        attrs["project"] = project

        assignee_id = attrs.get("assignee")
        if assignee_id:
            try:
                assignee = User.objects.get(id=assignee_id)
            except User.DoesNotExist:
                raise serializers.ValidationError({"assignee": "Assignee not found"})
            attrs["assignee"] = assignee
        else:
            raise serializers.ValidationError({"assignee": "Assignee is required"})

        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request and request.user.is_authenticated else None
        if not user:
            raise serializers.ValidationError(
                "User must be authenticated to create a task"
            )
        return Task.objects.create(**validated_data)


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = [
            "submission_file",
            "comments",
            "task",
            "submitted_by",
            "id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "task", "submitted_by"]

    def _get_task_from_url(self):
        """Extract task instance from URL kwargs"""
        request = self.context.get("request")
        task_id = (
            request.parser_context.get("kwargs", {}).get("pk") if request else None
        )
        if not task_id:
            raise serializers.ValidationError({"task": "Task ID not found in URL"})
        try:
            return Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            raise serializers.ValidationError({"task": "Task not found"})

    def validate(self, attrs):
        request = self.context.get("request")
        task = self._get_task_from_url()

        if task.status == "completed":
            raise serializers.ValidationError(
                {"detail": "Cannot submit a task that is already completed"}
            )

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError(
                {"detail": "User must be authenticated to submit a task"}
            )

        if task.assignee != request.user:
            raise serializers.ValidationError(
                {"detail": "Only the assignee can submit the task"}
            )

        attrs["task"] = task
        attrs["submitted_by"] = request.user
        return attrs


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "reviewed_by", "task"]

    def _get_task_from_url(self):
        """Extract task instance from URL kwargs"""
        request = self.context.get("request")
        task_id = (
            request.parser_context.get("kwargs", {}).get("pk") if request else None
        )
        if not task_id:
            raise serializers.ValidationError({"task": "Task ID not found in URL"})
        try:
            return Task.objects.select_related("project").get(id=task_id)
        except Task.DoesNotExist:
            raise serializers.ValidationError({"task": "Task not found"})

    def validate(self, attrs):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError(
                {"detail": "User must be authenticated to review a task"}
            )

        task = self._get_task_from_url()
        project = task.project
        user = request.user

        # Check if user is a project admin or manager
        is_allowed = ProjectContributor.objects.filter(
            project=project,
            user=user,
            role="admin",
        ).exists()

        if not is_allowed:
            raise serializers.ValidationError(
                {"detail": "Only project admins can review tasks"}
            )

        # Inject task + reviewer into validated data
        attrs["task"] = task
        attrs["reviewed_by"] = user
        return attrs
