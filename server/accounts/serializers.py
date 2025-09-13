from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "username",
            "email",
            "about",
            "password",
        ]
        read_only_fields = ["id"]
