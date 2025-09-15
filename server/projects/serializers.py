from rest_framework import serializers
from .models import Project
from accounts.models import User
from typing import cast, Dict, Any


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "deadline",
            "contributors",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request else None
        project = Project.objects.create(created_by=user, **validated_data)
        return project


class ContributorSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)

    def validate_username(self, value):
        try:
            user = User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return user

    def update_contributors(self, project, action="add"):
        validated: Dict[str, Any] = cast(Dict[str, Any], self.validated_data)
        user = validated["username"]

        if action == "add":
            project.contributors.add(user)
            message = f"User {user.username} added as contributor"
        elif action == "remove":
            project.contributors.remove(user)
            message = f"User {user.username} removed from contributors"
        else:
            raise ValueError("Invalid action")

        return {
            "message": message,
            "contributors": [u.username for u in project.contributors.all()],
        }
