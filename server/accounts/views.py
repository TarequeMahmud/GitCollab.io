from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from tasks.models import Task, Submission
from tasks.serializers import TaskSerializer, SubmissionSerializer
from projects.models import Project
from projects.serializers import ProjectSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .models import User
from .serializers import UserSerializer


class IsSelfOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj == request.user
    

class UsersView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]
        elif self.action == "list":
            permission_classes = [IsAdminUser]
        elif self.action in ["retrieve", "update", "partial_update", "destroy"]:
            permission_classes = [IsSelfOrAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class MeViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def tasks(self, request):
        """GET /accounts/me/tasks/ → my tasks"""
        tasks = Task.objects.filter(assignee=request.user)
        serializer = TaskSerializer(tasks, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def projects(self, request):
        projects = (
            Project.objects.filter(project_contributors__user=request.user)
            .distinct()
            .prefetch_related("contributors")
        )
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def submissions(self, request):
        """GET /accounts/me/submissions/ → my submissions"""
        submissions = Submission.objects.filter(submitted_by=request.user)
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            data = response.data
            if data and "refresh" in data:
                refresh = data.pop("refresh")
                response.set_cookie(
                    "refresh_token",
                    refresh,
                    httponly=True,
                    secure=True,
                    samesite="Strict",
                    max_age=15 * 24 * 60 * 60,
                )
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh_token")
        if refresh is None:
            return Response({"detail": "No refresh token"}, status=401)

        data = request.data.copy()  # type: ignore[attr-defined]
        data["refresh"] = refresh
        request._full_data = data  # Override the parsed data for this request
        return super().post(request, *args, **kwargs)


class IsSelf(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj == request.user

class LogoutView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    def post(self, request):
        response = Response({"detail": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie("refresh_token")
        return response