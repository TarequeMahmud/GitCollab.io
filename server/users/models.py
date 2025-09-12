from django.db import models


class User(models.Model):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("manager", "Manager"),
        ("member", "Member"),
    ]

    name = models.CharField(max_length=255)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(
        max_length=128
    )  # store hashed password manually if needed
    about = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username
