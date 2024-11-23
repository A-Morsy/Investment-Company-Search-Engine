from flask import Blueprint, request, jsonify
from .models import db, Company
from sentence_transformers import SentenceTransformer
import numpy as np
from numpy.linalg import norm
from werkzeug.exceptions import BadRequest

# Initialize blueprint
main = Blueprint('main', __name__)

# Initialize sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

@main.route('/api/companies', methods=['POST'])
def add_company():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'name' not in data or 'description' not in data:
            return jsonify({'error': 'Name and description are required'}), 400
            
        # Check if company already exists
        existing_company = Company.query.filter_by(name=data['name']).first()
        if existing_company:
            return jsonify({'error': f"Company with name '{data['name']}' already exists"}), 409
            
        embedding = model.encode(data['description']).tolist()
        company = Company(
            name=data['name'],
            description=data['description'],
            embedding=embedding
        )
        
        db.session.add(company)
        db.session.commit()
        return jsonify({'message': 'Company added successfully', 'id': company.id}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
@main.route('/api/companies/search', methods=['GET'])
def search_companies():
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify({'error': 'Search query required'}), 400
            
        query_embedding = model.encode(query).tolist()
        companies = Company.query.all()
        results = []
        
        for company in companies:
            if company.embedding:
                similarity = calculate_similarity(query_embedding, company.embedding)
                results.append({
                    'id': company.id,
                    'name': company.name,
                    'description': company.description,
                    'relevance': round(similarity, 4)
                })
        
        results.sort(key=lambda x: x['relevance'], reverse=True)
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def calculate_similarity(embedding1, embedding2):

   embedding1 = np.array(embedding1)
   embedding2 = np.array(embedding2)

   dot_product = np.dot(embedding1, embedding2)
   norm1 = norm(embedding1)
   norm2 = norm(embedding2)
   
   return dot_product / (norm1 * norm2)