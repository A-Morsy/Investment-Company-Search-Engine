# Investment Company Search Engine

A web application that ranks companies based on search relevance using Natural Language Processing (NLP). Built with Python/Flask backend and React/TypeScript frontend.

## Features

- Semantic search using NLP (Sentence Transformers)
- Real-time search with relevance scoring
- Company management (add/search)
- Paginated results
- Result caching
- Docker containerization

## Tech Stack

### Backend
- Python 3.11
- Flask
- PostgreSQL
- Sentence-Transformers for NLP
- SQLAlchemy ORM
- Flask-CORS

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Local Storage for caching

## Prerequisites

- Docker and Docker Compose
- Git
- Node.js (for local development)
- Python 3.11 (for local development)

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/A-Morsy/Investment-Company-Search-Engine.git
cd Investment-Company-Search-Engine
```

2. Run with Docker:
```bash
docker-compose up --build
```


## Note
After starting the containers:
1. The database will be empty initially
2. You can add companies through:
   - The web interface at http://localhost:3000
   - Or via API: 
     ```bash
     curl -X POST http://localhost:5000/api/companies \
       -H "Content-Type: application/json" \
       -d '{"name":"Test Company","description":"A test company"}'
     ```


## OpenShift Deployment

1. Login to OpenShift:
```bash
oc login <cluster-url>
```

2.Create new project:
```bash
oc new-project investment-search
```

3.Create database secrets:
```bash
oc create secret generic db-secrets \
  --from-literal=username=postgres \
  --from-literal=password=321321
```

4.Deploy PostgreSQL:
```bash
oc new-app postgresql-persistent \
  --param POSTGRESQL_USER=postgres \
  --param POSTGRESQL_PASSWORD=321321 \
  --param POSTGRESQL_DATABASE=investment_search
```

5.Deploy backend:
```bash
oc apply -f backend/openshift/deployment.yaml
oc apply -f backend/openshift/service.yaml
oc apply -f backend/openshift/route.yaml
```

6.Deploy frontend:
```bash
oc apply -f frontend/openshift/deployment.yaml
oc apply -f frontend/openshift/service.yaml
oc apply -f frontend/openshift/route.yaml
```

7.Get and configure routes:
```bash
# Get the backend route URL
oc get route investment-search-backend -o jsonpath='{.spec.host}'

# Update frontend config with backend URL
# Edit frontend/openshift/deployment.yaml and add:
    env:
    - name: REACT_APP_API_URL
      value: 'http://<backend-route-url>'  # URL from previous command

# Apply the updated frontend deployment
oc apply -f frontend/openshift/deployment.yaml
```

8.Verify deployment:
```bash
# Get all routes
oc get routes

# You should see both frontend and backend URLs
```


## Very Important :

1. You first need to deploy everything
2. Get the backend route URL using OpenShift CLI
3. Update the frontend deployment with the actual backend URL
4. Redeploy the frontend to apply the changes
