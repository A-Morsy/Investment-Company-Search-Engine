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
git clone https://github.com/yourusername/Investment-Company-Search-Engine.git
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