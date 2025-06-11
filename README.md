# RecruitApp - Backend

Backend Django REST pour l'application RecruitApp, un système de gestion de recrutement.

## 🚀 Fonctionnalités

- Authentification JWT
- Gestion des candidats et CV
- Gestion des offres d'emploi
- Suivi des candidatures
- API REST complète
- Gestion des fichiers (CV)
- Statistiques de recrutement

## 🛠️ Technologies

- Django 5.0
- Django REST Framework
- MySQL
- JWT Authentication
- Docker & Docker Compose
- Nginx
- Gunicorn

## 📋 Prérequis

- Python 3.12+
- Docker & Docker Compose
- MySQL 8.0+

## 🔧 Installation

1. Cloner le repository :
```bash
git clone <repository-url>
cd recruitapp
```

2. Créer un fichier `.env` basé sur `.env.example` :
```bash
cp .env.example .env
```

3. Modifier les variables d'environnement dans `.env`

4. Lancer avec Docker Compose :
```bash
docker-compose up -d
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/refresh/` - Rafraîchir le token

### Candidats
- `GET /api/candidates/` - Liste des candidats
- `POST /api/candidates/` - Créer un candidat
- `GET /api/candidates/{id}/` - Détails d'un candidat
- `PUT /api/candidates/{id}/` - Mettre à jour un candidat
- `DELETE /api/candidates/{id}/` - Supprimer un candidat

### Offres d'emploi
- `GET /api/offers/` - Liste des offres
- `POST /api/offers/` - Créer une offre
- `GET /api/offers/{id}/` - Détails d'une offre
- `PUT /api/offers/{id}/` - Mettre à jour une offre
- `DELETE /api/offers/{id}/` - Supprimer une offre

### Candidatures
- `GET /api/applications/` - Liste des candidatures
- `POST /api/applications/` - Créer une candidature
- `GET /api/applications/{id}/` - Détails d'une candidature
- `PUT /api/applications/{id}/` - Mettre à jour une candidature
- `DELETE /api/applications/{id}/` - Supprimer une candidature

### Statistiques
- `GET /api/applications/statistics/` - Statistiques globales

## 🔐 Rôles et Permissions

- **Admin** : Accès total à toutes les fonctionnalités
- **Recruteur** : Accès limité à ses propres offres et candidatures

## 📦 Structure du Projet

```
recruitapp/
├── core/                    # Application principale
│   ├── models.py           # Modèles de données
│   ├── serializers.py      # Sérialiseurs API
│   ├── views.py            # Vues API
│   ├── urls.py             # URLs API
│   └── permissions.py      # Permissions personnalisées
├── recruitapp/             # Configuration du projet
├── media/                  # Fichiers uploadés
├── staticfiles/           # Fichiers statiques
├── logs/                  # Logs de l'application
├── Dockerfile            # Configuration Docker
├── docker-compose.yml    # Configuration Docker Compose
├── nginx.conf           # Configuration Nginx
└── requirements.txt     # Dépendances Python
```

## 🚀 Déploiement

1. Configurer les variables d'environnement
2. Construire les images Docker :
```bash
docker-compose build
```

3. Lancer les services :
```bash
docker-compose up -d
```

4. Appliquer les migrations :
```bash
docker-compose exec web python manage.py migrate
```

5. Créer un superutilisateur :
```bash
docker-compose exec web python manage.py createsuperuser
```

## 📝 Logs

Les logs sont disponibles dans le dossier `logs/` et via Docker :
```bash
docker-compose logs -f web
```

## 🔒 Sécurité

- Authentification JWT
- Protection CORS
- Validation des données
- Permissions par rôle
- Protection des fichiers uploadés

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request # Recruitapp
