from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from .models import Candidate, Experience, Education, JobOffer, Application
from .serializers import (
    CandidateSerializer, ExperienceSerializer, EducationSerializer,
    JobOfferSerializer, ApplicationSerializer, UserSerializer
)
from .permissions import (
    IsAdminOrReadOnly, IsRecruiterOrAdmin,
    IsOwnerOrAdmin, IsApplicationOwnerOrAdmin
)

# Create your views here.

class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Candidate.objects.all()
        return Candidate.objects.filter(user=self.request.user)

class ExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return Experience.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        candidate = Candidate.objects.get(user=self.request.user)
        serializer.save(candidate=candidate)

class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return Education.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        candidate = Candidate.objects.get(user=self.request.user)
        serializer.save(candidate=candidate)

class JobOfferViewSet(viewsets.ModelViewSet):
    queryset = JobOffer.objects.all()
    serializer_class = JobOfferSerializer
    permission_classes = [IsAuthenticated, IsRecruiterOrAdmin]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return JobOffer.objects.all()
        return JobOffer.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def applications(self, request, pk=None):
        job_offer = self.get_object()
        applications = Application.objects.filter(job_offer=job_offer)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsApplicationOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Application.objects.all()
        return Application.objects.filter(job_offer__created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        if request.user.role != 'admin':
            return Response(
                {"detail": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        stats = {
            'total_candidates': Candidate.objects.count(),
            'total_job_offers': JobOffer.objects.count(),
            'applications_by_status': dict(
                Application.objects.values('status')
                .annotate(count=Count('id'))
                .values_list('status', 'count')
            )
        }
        return Response(stats)
