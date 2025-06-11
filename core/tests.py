from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Candidate, JobOffer, Application

# Create your tests here.

class JobOfferAPITests(APITestCase):
    def setUp(self):
        # Créer un utilisateur admin
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            role='admin'
        )
        
        # Créer un recruteur
        self.recruiter = User.objects.create_user(
            username='recruiter',
            email='recruiter@example.com',
            password='recruiterpass123',
            role='recruteur'
        )
        
        # Créer une offre d'emploi
        self.job_offer = JobOffer.objects.create(
            title='Développeur Python',
            description='Poste de développeur Python',
            location='Paris',
            required_skills='Python, Django',
            experience_level='3-5 ans',
            created_by=self.recruiter
        )

    def test_list_job_offers(self):
        """Test de récupération de la liste des offres d'emploi"""
        self.client.force_authenticate(user=self.recruiter)
        url = reverse('joboffer-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_job_offer(self):
        """Test de création d'une offre d'emploi"""
        self.client.force_authenticate(user=self.recruiter)
        url = reverse('joboffer-list')
        data = {
            'title': 'Développeur Frontend',
            'description': 'Poste de développeur React',
            'location': 'Lyon',
            'required_skills': 'React, JavaScript',
            'experience_level': '2-3 ans'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobOffer.objects.count(), 2)

class ApplicationAPITests(APITestCase):
    def setUp(self):
        # Créer un candidat
        self.candidate_user = User.objects.create_user(
            username='candidate',
            email='candidate@example.com',
            password='candidatepass123',
            role='recruteur'
        )
        
        self.candidate = Candidate.objects.create(
            user=self.candidate_user,
            first_name='John',
            last_name='Doe',
            email='john@example.com',
            phone='0123456789',
            skills='Python, Django'
        )
        
        # Créer un recruteur
        self.recruiter = User.objects.create_user(
            username='recruiter',
            email='recruiter@example.com',
            password='recruiterpass123',
            role='recruteur'
        )
        
        # Créer une offre d'emploi
        self.job_offer = JobOffer.objects.create(
            title='Développeur Python',
            description='Poste de développeur Python',
            location='Paris',
            required_skills='Python, Django',
            experience_level='3-5 ans',
            created_by=self.recruiter
        )

    def test_create_application(self):
        """Test de création d'une candidature"""
        self.client.force_authenticate(user=self.candidate_user)
        url = reverse('application-list')
        data = {
            'candidate_id': self.candidate.id,
            'job_offer_id': self.job_offer.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), 1)
