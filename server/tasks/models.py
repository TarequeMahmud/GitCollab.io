from gitcollab.commons.models import TimeStampedUUIDModel
from django.db import models


class Task(TimeStampedUUIDModel):
    STATUS_CHOICES = [
        ("to-do", "To Do"),
        ("in-progress", "In Progress"),
        ("completed", "Completed"),
    ]

    PRIORITY_CHOICES = [
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    project = models.ForeignKey(
        "projects.Project", on_delete=models.CASCADE, null=True, related_name="tasks"
    )
    assignee = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, related_name="tasks"
    )
    deadline = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)


class Submission(TimeStampedUUIDModel):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="submissions")
    submitted_by = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="submissions"
    )
    submission_file = models.FileField(
        upload_to="task_submissions/", blank=True, null=True
    )
    comments = models.TextField(blank=True, null=True)


class Review(TimeStampedUUIDModel):
    REVIEW_STATUS = [
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("needs_changes", "Needs Changes"),
        ("pending", "Pending"),
    ]
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name="reviews", null=True, blank=True
    )
    reviewed_by = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="reviews"
    )
    feedback = models.TextField()
    review_status = models.CharField(
        max_length=20, choices=REVIEW_STATUS, default="pending"
    )
