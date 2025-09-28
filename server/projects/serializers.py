from rest_framework import serializers
from .models import Project, ProjectContributor
from accounts.models import User
from typing import cast, Dict, Any


class ProjectContributorDetailSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.name", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = ProjectContributor
        fields = ["user", "name", "username", "email", "role", "added_at"]
        read_only_fields = fields


class ProjectSerializer(serializers.ModelSerializer):
    contributors = ProjectContributorDetailSerializer(
        source="project_contributors", many=True, read_only=True
    )

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
        if not user or not user.is_authenticated:
            raise serializers.ValidationError(
                "User must be authenticated to create a project"
            )
        project = Project.objects.create(**validated_data)
        ProjectContributor.objects.create(project=project, user=user, role="admin")
        return project


class ProjectContributorSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    role = serializers.ChoiceField(
        choices=ProjectContributor.ROLE_CHOICES, required=True
    )

    def validate_username(self, value):
        """Check if user exists and return the user object."""
        try:
            return User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

    def modify_contributors(
        self, project: Project, action: str = "add"
    ) -> Dict[str, Any]:
        """
        Add, update, or remove a contributor from a project.
        """
        validated: Dict[str, Any] = cast(Dict[str, Any], self.validated_data)
        user: User = validated["username"]
        role: str = validated["role"]

        if action == "add":
            contributor, created = ProjectContributor.objects.get_or_create(
                project=project,
                user=user,
                defaults={"role": role},
            )
            if not created:
                contributor.role = role
                contributor.save()
            message = f"User {user.username} added/updated as {role}"

        elif action == "remove":
            deleted, _ = ProjectContributor.objects.filter(
                project=project, user=user
            ).delete()
            if deleted:
                message = f"User {user.username} removed from contributors"
            else:
                message = f"User {user.username} was not a contributor"

        else:
            raise ValueError("Invalid action")

        contributors = ProjectContributor.objects.filter(
            project=project
        ).select_related("user")

        return {
            "message": message,
            "contributors": [
                {"username": c.user.username, "role": c.role} for c in contributors
            ],
        }
