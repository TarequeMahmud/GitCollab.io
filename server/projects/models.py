from django.conf import settings
from gitcollab.commons.models import TimeStampedUUIDModel
from django.db import models


class ProjectContributor(models.Model):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("manager", "Manager"),
        ("member", "Member"),
    ]
    project = models.ForeignKey(
        "Project", on_delete=models.CASCADE, related_name="project_contributors"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="project_contributions",
    )
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("project", "user")

    def __str__(self):
        return f"{self.user.username} - {self.project.title} ({self.role})"


class Project(TimeStampedUUIDModel):

    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, default="")
    deadline = models.DateField(blank=True, null=True, db_index=True)
    contributors = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through="ProjectContributor",
        related_name="projects",
        blank=False,
    )

    def __str__(self):
        return self.title
