from django.conf import settings
from gitcollab.commons.models import TimeStampedUUIDModel
from django.db import models


class Project(TimeStampedUUIDModel):

    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, default="")
    deadline = models.DateField(blank=True, null=True, db_index=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="projects",
        on_delete=models.CASCADE,
        db_index=True,
    )

    contributors = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="contributed_projects",
        blank=True,
    )

    def __str__(self):
        return self.title
