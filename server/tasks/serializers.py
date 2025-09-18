from rest_framework import serializers
from .models import Task
from projects.models import Project
from accounts.models import User


class TaskSerializer(serializers.ModelSerializer):
    project = serializers.UUIDField(write_only=True)
    assignee = serializers.UUIDField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]

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
