from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Candidate, Experience, Education, JobOffer, Application

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')
        read_only_fields = ('id',)

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'
        read_only_fields = ('id',)

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'
        read_only_fields = ('id',)

class CandidateSerializer(serializers.ModelSerializer):
    experiences = ExperienceSerializer(many=True, read_only=True)
    educations = EducationSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Candidate
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class JobOfferSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = JobOffer
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by')

    def get_applications_count(self, obj):
        return obj.applications.count()

class ApplicationSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer(read_only=True)
    job_offer = JobOfferSerializer(read_only=True)
    candidate_id = serializers.PrimaryKeyRelatedField(
        queryset=Candidate.objects.all(),
        source='candidate',
        write_only=True
    )
    job_offer_id = serializers.PrimaryKeyRelatedField(
        queryset=JobOffer.objects.all(),
        source='job_offer',
        write_only=True
    )

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('id', 'date_applied', 'match_score')

    def validate(self, data):
        if Application.objects.filter(
            candidate=data['candidate'],
            job_offer=data['job_offer']
        ).exists():
            raise serializers.ValidationError(
                "Une candidature existe déjà pour cette offre"
            )
        return data 