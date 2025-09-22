from rest_framework import serializers
from .models import Task, Submission, Review
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


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        task = attrs.get("task")
        submitted_by = attrs.get("submitted_by")

        if not task or not submitted_by:
            raise serializers.ValidationError(
                {"detail": "Task and Submitted By fields are required"}
            )
        if task.assignee != submitted_by:
            raise serializers.ValidationError(
                {"detail": "Only the assignee can submit the task"}
            )

        assigneeObj = User.objects.get(id=task.assignee.id)
        if not assigneeObj:
            raise serializers.ValidationError({"detail": "Assignee user not found"})

        taskObj = Task.objects.get(id=task.id)
        if not taskObj:
            raise serializers.ValidationError({"detail": "Task not found"})

        if taskObj.status == "completed":
            raise serializers.ValidationError(
                {"detail": "Cannot submit a task that is already completed"}
            )

        return attrs


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        submission = attrs.get("submission")
        reviewed_by = attrs.get("reviewed_by")

        if not submission or not reviewed_by:
            raise serializers.ValidationError(
                {"detail": "Submission and Reviewed By fields are required"}
            )

        submissionObj = Submission.objects.get(id=submission.id)
        if not submissionObj:
            raise serializers.ValidationError({"detail": "Submission not found"})

        taskObj = Task.objects.get(id=submissionObj.task.id)
        if not taskObj:
            raise serializers.ValidationError({"detail": "Task not found"})

        return attrs
