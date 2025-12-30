# Person Manager - Application SOA Nour Nsiri
Repository Link: https://github.com/NourNsiri20/SOA-Project-.git

Une application web complète de gestion des personnes avec une architecture Service-Oriented (SOA) utilisant un backend REST et un frontend React moderne.

---

## Vue d'ensemble

**Person Manager** est une application de gestion de données simple mais puissante qui permet de créer, lire, modifier et supprimer des enregistrements de personnes. L'application suit une architecture complète avec :
- **Backend REST** : API JAX-RS/Jersey déployée sur Apache Tomcat
- **Frontend** : Application React avec interface moderne et responsive
- **Base de données** : MySQL 8.0 pour la persistance des données

---

## Fonctionnement de l'application

### Architecture générale

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend React                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components: Header, SearchBar, PersonTable, EditModal   │  │
│  │  Service: personService.js (appels HTTP)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                    HTTP Requests/Responses
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│              Backend REST              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PersonResource.java (Endpoints JAX-RS)                  │   │
│  │  GET /api/persons (tous les enregistrements)             │   │
│  │  GET /api/persons/{id} (un enregistrement)               │   │
│  │  GET /api/persons/search (recherche par nom)             │   │
│  │  POST /api/persons (créer)                               │   │
│  │  PUT /api/persons/{id} (modifier)                        │   │
│  │  DELETE /api/persons/{id} (supprimer)                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                         JPA/Hibernate
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│              Base de données MySQL                     │
│  Database: person_db                                              │
│  Table: persons (id, name, age)                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Flux de requête-réponse

1. **L'utilisateur interagit avec le frontend React**
   - Clique sur un bouton ou soumet un formulaire

2. **Le composant appelle personService.js**
   - Utilise la Fetch API pour envoyer des requêtes HTTP
   - Gère les erreurs et formate les réponses

3. **Le backend traite la requête**
   - PersonResource.java route la requête
   - JPAUtil manage la session EntityManager
   - Hibernate traduit les opérations en requêtes SQL

4. **MySQL exécute la requête**
   - Récupère ou modifie les données
   - Retourne le résultat

5. **La réponse JSON revient au frontend**
   - Le React met à jour l'état (state)
   - L'interface s'actualise automatiquement

---

## Fonctionnalités réalisées

### 1. **Affichage des personnes** 
- Tableau interactif affichant toutes les personnes de la base de données
- Colonnes : ID, Nom, Âge, Actions
- Actualisation en temps réel avec le bouton "Refresh"
- Message informatif si aucune personne n'existe

```javascript
// API : GET /api/persons
// Récupère la liste complète des personnes stockées en BD
```

### 2. **Recherche** 
- **Recherche par ID** : Saisir un nombre pour trouver une personne spécifique
- **Recherche par nom** : Utiliser du texte pour filtrer les personnes
- Support de la recherche partielle (contient le texte)
- Touche Entrée pour soumettre la recherche
- Bouton "Effacer" pour réinitialiser et afficher tous les enregistrements

```javascript
// API : GET /api/persons/search?name=Ahmed
// Recherche insensible à la casse avec LIKE SQL
```

### 3. **Création de personnes** 
- Formulaire modal pour ajouter une nouvelle personne
- Champs requis : Nom et Âge
- Validation côté client :
  - Le nom doit avoir au minimum 2 caractères
  - L'âge doit être un entier positif
- Messages d'erreur détaillés
- Boutons : "Créer" (envoyer) et "Annuler"

```javascript
// API : POST /api/persons
// Envoie les données en JSON et crée un nouvel enregistrement
```

### 4. **Modification de personnes** 
- Clic sur "Edit" dans la table pour ouvrir un modal
- Le modal pré-remplit les données actuelles
- Validation des données avant envoi
- L'ID reste en lecture seule (non modifiable)
- Confirmation avec le bouton "Save Changes"

```javascript
// API : PUT /api/persons/{id}
// Modifie un enregistrement existant
```

### 5. **Suppression de personnes** 
- Bouton "Delete" dans la colonne Actions
- Confirmation avec message d'alerte
- Suppression immédiate et actualisation du tableau

```javascript
// API : DELETE /api/persons/{id}
// Supprime un enregistrement de la base de données
```

### 6. **Design réactif et moderne** 
- Interface utilisateur intuitive et épurée
- Thème moderne avec couleurs cohérentes
- Responsive design (adapté à mobile et desktop)
- Feedback visuel pour les actions de l'utilisateur
- Gestion des états de chargement et d'erreur

---

## Communication avec le backend REST

### Architecture des endpoints

Le backend expose une API RESTful sur le chemin `/api/persons` avec les opérations CRUD standard :

| Opération | Verbe HTTP | Endpoint | Description |
|-----------|-----------|----------|-------------|
| **Lire tous** | GET | `/api/persons` | Retourne tous les enregistrements |
| **Lire un** | GET | `/api/persons/{id}` | Retourne une personne par ID |
| **Chercher** | GET | `/api/persons/search?name=X` | Cherche par nom (partial match) |
| **Créer** | POST | `/api/persons` | Crée une nouvelle personne |
| **Modifier** | PUT | `/api/persons/{id}` | Modifie une personne existante |
| **Supprimer** | DELETE | `/api/persons/{id}` | Supprime une personne |

### Format des données (JSON)

**Requête de création/modification :**
```json
{
  "id": null,  // Auto-généré à la création
  "name": "Ahmed",
  "age": 21
}
```

**Réponse du serveur :**
```json
{
  "id": 1,
  "name": "Ahmed",
  "age": 21
}
```

### Gestion des erreurs

Le frontend capture et affiche les erreurs :
- **400 Bad Request** : Données invalides
- **404 Not Found** : Ressource inexistante
- **500 Internal Server Error** : Erreur serveur

Messages d'erreur clairs affichés à l'utilisateur.

### Configuration réseau

**Configuration webpack dev-server** (`frontend/webpack.config.js`) :
```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080/person-backend1',
      changeOrigin: true
    }
  }
}
```

Les requêtes vers `/api` sont automatiquement redirigées vers le backend Tomcat.

### Code du service (Frontend)

**personService.js** encapsule tous les appels API :

```javascript
// Récupère tous les enregistrements
personService.getAll()

// Récupère un enregistrement par ID
personService.getById(id)

// Cherche par nom
personService.searchByName(name)

// Crée une personne
personService.create({ name, age })

// Modifie une personne
personService.update(id, { name, age })

// Supprime une personne
personService.delete(id)
```

Chaque méthode :
- Utilise la Fetch API moderne
- Définit les bons headers HTTP
- Traite les réponses JSON
- Lance des erreurs explicites en cas d'échec

### Technologie ORM (Backend)

**Hibernate/JPA** gère la liaison entre Java et la base de données :

- **Entity** : `Person.java` = classe Java représentant une ligne de la table
- **Named Queries** : Requêtes SQL prédéfinies pour éviter les injections SQL
- **EntityManager** : Gère la session de persistance
- **Transactions** : Assure la cohérence des données

Exemple de Named Query :
```java
@NamedQuery(
  name = "Person.searchByName", 
  query = "SELECT p FROM Person p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))"
)
```

---

## Démarrage de l'application

### Prérequis
- Java 8+
- Maven 3.6+
- Node.js 14+ et npm
- MySQL 8.0+

### Lancer le backend
```bash
mvn clean package
# Tomcat démarre automatiquement à http://localhost:8080/person-backend1
```

### Lancer le frontend
```bash
cd frontend
npm install
npm start
# L'app s'ouvre à http://localhost:3001
```

---

## Structure du projet

```
SOA-project/
├── src/main/java/com/example/
│   ├── model/Person.java           # Entity JPA
│   ├── resource/PersonResource.java # Endpoints REST
│   ├── util/JPAUtil.java           # Gestion EntityManager
│   ├── filter/CORSFilter.java      # Support CORS
│   └── config/RestApplication.java # Configuration JAX-RS
├── src/main/resources/
│   └── META-INF/persistence.xml    # Configuration JPA
├── frontend/
│   ├── src/
│   │   ├── App.js                  # Composant racine
│   │   ├── App.css                 # Styles globaux
│   │   ├── components/
│   │   │   ├── Header.js           # En-tête
│   │   │   ├── SearchBar.js        # Barre de recherche
│   │   │   ├── PersonTable.js      # Tableau des personnes
│   │   │   └── EditModal.js        # Modal de modification
│   │   └── services/
│   │       └── personService.js    # Appels API
│   └── webpack.config.js           # Configuration Webpack
└── pom.xml                         # Dépendances Maven
```

---


## Développé avec

- **Backend** : Java 8, JAX-RS/Jersey 2.35, JPA 2.2/Hibernate 5.6
- **Frontend** : React 18, Webpack 5, Babel 7
- **Base de données** : MySQL 8.0
- **Serveur** : Apache Tomcat 9.0.86

---

**Auteur** : Nour Nsiri  
**Date** : Décembre 2025  
**Version** : 1.0.0
