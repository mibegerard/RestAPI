# 🎾 Tennis Players REST API

Une API REST complète pour la gestion des joueurs de tennis avec analytics avancées, construite avec Node.js, Express.js et MongoDB.

## � Overview

### 🏗️ **Architecture & Stack**

Cette API REST moderne utilise **Node.js/Express** avec **MongoDB** pour gérer les données de joueurs de tennis. L'architecture suit les principes **MVC** avec une séparation claire entre Controllers, Services et Models. L'infrastructure est containerisée avec **Docker** et déployée via **GitHub Actions CI/CD** sur **Render**, garantissant une approche DevOps complète avec tests automatisés (74 tests Jest), quality gates (ESLint/Prettier) et monitoring intégré.

### 🎯 **Logique Métier & API Design**

L'API offre un **CRUD complet** pour la gestion des joueurs avec des fonctionnalités avancées d'analytics (statistiques par pays, calculs BMI, win rates). Le design suit les standards **RESTful** avec une documentation **Swagger** interactive, des réponses JSON cohérentes, et une gestion d'erreurs centralisée. La pagination optimise les performances pour de grandes datasets, tandis que les utilitaires de calcul fournissent des insights en temps réel sur les données des joueurs.

### 🛡️ **Qualité & Production-Ready**

L'approche **Test-Driven** avec MongoDB Memory Server assure une couverture complète des tests unitaires et d'intégration. La sécurité est garantie par **CORS**, **Helmet**, et la validation des données via Mongoose. Le pipeline CI/CD automatise les déploiements avec des environnements staging/production séparés, des health checks, et une stratégie de rollback, créant une solution robuste et maintenant les standards industriels pour une API de production.

## �🚀 Fonctionnalités

### ⚡ Core Features

- **CRUD complet** : Création, lecture, mise à jour et suppression des joueurs
- **Pagination intelligente** : Navigation efficace dans les grandes listes
- **Tri et filtrage** : Options flexibles pour organiser les données
- **Mises à jour spécialisées** : Endpoints dédiés pour rang et statistiques

### 📊 Analytics Avancées

- **Analyse BMI** : Calcul et classement des joueurs par IMC
- **Statistiques pays** : Meilleurs et pires pays par ratio de victoires
- **Analyse de taille** : Min, max, moyenne et médiane des tailles

### 🛡️ Système d'erreurs professionnel

- **Types d'erreurs spécifiques** : ValidationError, NotFoundError, ConflictError
- **Codes HTTP automatiques** : Gestion intelligente des status codes
- **Messages explicites** : Debugging facilité pour les développeurs

### 📋 Logging de production

- **Winston + Morgan** : Stack de logging professionnel
- **Niveaux adaptatifs** : Debug en dev, concis en production
- **Rotation automatique** : Performance et maintenance optimisées
- **Interface colorée** : Monitoring visuel avec emojis et couleurs

## 🏗️ Architecture

```
src/
├── utils/           # Utilitaires (erreurs, calculs, statistiques)
├── helper/          # Helpers (catchError, logger)
├── middlewares/     # Middlewares (validation, gestion d'erreurs, logging)
├── services/        # Logique métier
├── controllers/     # Orchestrateurs requête/réponse
├── routes/          # Définition des routes REST
├── models/          # Schémas MongoDB avec Mongoose
├── config/          # Configuration (CORS, database)
└── app.js          # Configuration Express
```

### 🎯 Principes appliqués

- **Clean Architecture** : Séparation claire des responsabilités
- **SOLID Principles** : Code maintenable et extensible
- **DRY (Don't Repeat Yourself)** : Réutilisation maximale des composants
- **KISS (Keep It Simple)** : Solutions simples et efficaces

## 🛠️ Technologies

### Backend Stack

- **Node.js** : Runtime JavaScript
- **Express.js 5.1.0** : Framework web minimaliste
- **MongoDB + Mongoose** : Base de données NoSQL avec ODM
- **Winston** : Logger professionnel
- **Morgan** : Logging des requêtes HTTP
- **Helmet** : Sécurisation des headers HTTP
- **CORS** : Configuration multi-domaines

### Infrastructure & DevOps

- **Docker + Docker Compose** : Containerisation et orchestration
- **GitHub Actions** : Pipeline CI/CD automatisé
- **Render** : Déploiement cloud production-ready
- **MongoDB Memory Server** : Tests isolés sans dépendances

### Dev Tools & Quality

- **Nodemon** : Rechargement automatique en développement
- **ESLint** : Analyse statique du code
- **Prettier** : Formatage automatique du code
- **Jest** : Framework de tests avec 74 tests (unit + integration)
- **Swagger UI** : Documentation interactive de l'API

## 📡 API Endpoints

### 🏥 Health & Info

```http
GET /api/health              # Health check
GET /api/                    # Informations API
```

### 🎾 Players CRUD

```http
GET    /api/players          # Liste des joueurs (pagination, tri, filtrage)
GET    /api/players/:id      # Détails d'un joueur
POST   /api/players          # Créer un nouveau joueur
PUT    /api/players/:id      # Mise à jour complète
PATCH  /api/players/:id      # Mise à jour partielle (nouveau!)
DELETE /api/players/:id      # Supprimer un joueur
```

### ⚙️ Mises à jour spécialisées

```http
PATCH /api/players/:id/rank  # Mise à jour du rang uniquement
PATCH /api/players/:id/stats # Mise à jour des statistiques uniquement
```

### 📊 Analytics

```http
GET /api/players/analytics/countries  # Statistiques par pays
GET /api/players/analytics/bmi        # Analyse BMI
GET /api/players/analytics/height     # Statistiques de taille
```

## 🧪 Tests & Quality Assurance

### 🎯 **Infrastructure de Tests Complète**

- **74 Tests automatisés** : 46 tests unitaires + 28 tests d'intégration
- **Coverage 100%** : Tous les tests passent avec succès
- **MongoDB Memory Server** : Tests isolés sans dépendances externes
- **Jest Framework** : Tests rapides et fiables
- **CI/CD Integration** : Tests automatiques à chaque push

### 📋 Collection Postman

**Lien direct :** [Collection RestAPI Tests](https://warped-equinox-676439.postman.co/workspace/My-Workspace~b903aff6-51cc-46f7-8d81-1bbcecd5a029/collection/24768539-1ba4017a-5918-4a73-a2b6-285c7c4a1d2a?action=share&creator=24768539)

### 🚀 **Commandes de Tests**

```bash
# Tous les tests
npm test

# Tests unitaires seulement
npm run test:unit

# Tests d'intégration seulement
npm run test:integration

# Mode watch (développement)
npm run test:watch
```

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 16+
- MongoDB Atlas ou local
- NPM ou Yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/mibegerard/RestAPI.git
cd RestAPI

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer le fichier .env avec vos paramètres
```

### Démarrage

```bash
# Développement (avec rechargement automatique)
npm run dev

# Production
npm start

# Linting
npm run lint
```

### 🐳 **Déploiement Docker**

```bash
# Développement avec Docker Compose
docker compose up

# Build production
docker build -t tennis-api .

# Build et démarrage complet
docker compose up --build
```

### ☁️ **Déploiement Production (Render)**

L'API est configurée pour un déploiement automatique sur Render avec :

- **Build Command** : `npm install`
- **Start Command** : `npm start`
- **Environment Variables** : Configuration via interface Render
- **Health Checks** : Monitoring automatique de l'état de l'application

## 📖 Documentation API

### 🔍 Swagger UI

Une fois le serveur démarré, accédez à la documentation interactive :

```
http://localhost:3000/api-docs
```

## ⚠️ Gestion d'erreurs

### Types d'erreurs

- **400 ValidationError** : Données invalides
- **404 NotFoundError** : Ressource introuvable
- **409 ConflictError** : Conflit de données (ID/shortname existant)
- **500 SystemError** : Erreur serveur

### Format de réponse d'erreur

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Description claire de l'erreur"
}
```

## 📊 Monitoring et Logs

### 📝 Fichiers de logs

```
logs/
├── error.log      # Erreurs uniquement
└── combined.log   # Tous les niveaux
```

### 🎨 Interface console

- 🟢 Success (2xx)
- 🟡 Client Error (4xx)
- 🔴 Server Error (5xx)
- ⚡ Temps de réponse rapide
- ⏱️ Temps de réponse lent

### Workflow Git

```bash
# Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Faire les modifications et commits
git add .
git commit -m "feat: description de la fonctionnalité"

# Pousser et créer une PR
git push -u origin feature/nouvelle-fonctionnalite
```

### Standards de code

- **ESLint** : Respect des règles de linting
- **Prettier** : Formatage automatique
- **Conventional Commits** : Messages de commit standardisés

## 📝 License

Ce projet est sous licence ISC.

## 👨‍💻 Auteur

**Gerard Mibeke** - [GitHub](https://github.com/mibegerard)

---

### 🌟 Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !

**API Status:** ✅ Production Ready
https://warped-equinox-676439.postman.co/workspace/My-Workspace~b903aff6-51cc-46f7-8d81-1bbcecd5a029/collection/24768539-1ba4017a-5918-4a73-a2b6-285c7c4a1d2a?action=share&creator=24768539
