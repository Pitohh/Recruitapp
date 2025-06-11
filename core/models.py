from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', _('Administrateur')
        RECRUTEUR = 'recruteur', _('Recruteur')
    
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.RECRUTEUR,
        verbose_name=_('Rôle')
    )

    class Meta:
        verbose_name = _('Utilisateur')
        verbose_name_plural = _('Utilisateurs')

class RecruiterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recruiter_profile')
    company_name = models.CharField(max_length=200, verbose_name=_('Nom de l\'entreprise'))
    phone = models.CharField(max_length=20, verbose_name=_('Téléphone'))
    is_active = models.BooleanField(default=True, verbose_name=_('Actif'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Profil recruteur')
        verbose_name_plural = _('Profils recruteurs')

    def __str__(self):
        return f"{self.user.username} - {self.company_name}"

class Candidate(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate_profile')
    first_name = models.CharField(max_length=100, verbose_name=_('Prénom'))
    last_name = models.CharField(max_length=100, verbose_name=_('Nom'))
    email = models.EmailField(unique=True, verbose_name=_('Email'))
    phone = models.CharField(max_length=20, verbose_name=_('Téléphone'))
    cv_file = models.FileField(upload_to='cvs/', verbose_name=_('CV'))
    skills = models.TextField(verbose_name=_('Compétences'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Candidat')
        verbose_name_plural = _('Candidats')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Experience(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='experiences')
    job_title = models.CharField(max_length=200, verbose_name=_('Poste'))
    company = models.CharField(max_length=200, verbose_name=_('Entreprise'))
    duration = models.CharField(max_length=100, verbose_name=_('Durée'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    start_date = models.DateField(verbose_name=_('Date de début'))
    end_date = models.DateField(null=True, blank=True, verbose_name=_('Date de fin'))

    class Meta:
        verbose_name = _('Expérience')
        verbose_name_plural = _('Expériences')

    def __str__(self):
        return f"{self.job_title} chez {self.company}"

class Education(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='educations')
    degree = models.CharField(max_length=200, verbose_name=_('Diplôme'))
    institution = models.CharField(max_length=200, verbose_name=_('Établissement'))
    year = models.IntegerField(verbose_name=_('Année'))
    description = models.TextField(blank=True, verbose_name=_('Description'))

    class Meta:
        verbose_name = _('Formation')
        verbose_name_plural = _('Formations')

    def __str__(self):
        return f"{self.degree} - {self.institution} ({self.year})"

class JobOffer(models.Model):
    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    description = models.TextField(verbose_name=_('Description'))
    location = models.CharField(max_length=200, verbose_name=_('Localisation'))
    required_skills = models.TextField(verbose_name=_('Compétences requises'))
    experience_level = models.CharField(max_length=100, verbose_name=_('Niveau d\'expérience'))
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_offers')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, verbose_name=_('Actif'))

    class Meta:
        verbose_name = _('Offre d\'emploi')
        verbose_name_plural = _('Offres d\'emploi')

    def __str__(self):
        return self.title

class Application(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', _('En attente')
        IN_PROGRESS = 'in_progress', _('En cours')
        ACCEPTED = 'accepted', _('Acceptée')
        REJECTED = 'rejected', _('Refusée')

    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='applications')
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name=_('Statut')
    )
    date_applied = models.DateTimeField(auto_now_add=True)
    match_score = models.IntegerField(null=True, blank=True, verbose_name=_('Score de correspondance'))
    notes = models.TextField(blank=True, verbose_name=_('Notes'))

    class Meta:
        verbose_name = _('Candidature')
        verbose_name_plural = _('Candidatures')
        unique_together = ['candidate', 'job_offer']

    def __str__(self):
        return f"{self.candidate} - {self.job_offer}"
