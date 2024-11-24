from flask import Blueprint, request, jsonify
from .models import db, Company
from flask_cors import cross_origin
from sentence_transformers import SentenceTransformer
import numpy as np
from numpy.linalg import norm
from werkzeug.exceptions import BadRequest
from sqlalchemy import func
# Initialize blueprint
main = Blueprint('main', __name__)

# Initialize sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

@main.route('/api/companies', methods=['POST'])
@cross_origin()
def add_company():
   try:
       data = request.get_json()
       print("Received data:", data)

       if not data or 'name' not in data or 'description' not in data:
           return jsonify({'error': 'Name and description are required'}), 400
           
       # Convert to lowercase before checking existence
       name_lower = data['name'].lower()
       existing_company = Company.query.filter(func.lower(Company.name) == name_lower).first()
       if existing_company:
           return jsonify({'error': f"Company with name '{data['name']}' already exists"}), 409
           
       # Create embedding from lowercase description
       embedding = model.encode(data['description'].lower()).tolist()
       company = Company(
           name=data['name'],
           description=data['description'],
           embedding=embedding
       )
       
       db.session.add(company)
       db.session.commit()
       return jsonify({'message': 'Company added successfully', 'id': company.id}), 201
       
   except Exception as e:
       print("Error:", str(e))
       db.session.rollback()
       return jsonify({'error': str(e)}), 400

@main.route('/api/companies/search', methods=['GET'])
@cross_origin()
def search_companies():
   try:
       query = request.args.get('q', '').strip().lower()
       page = int(request.args.get('page', 1))
       per_page = int(request.args.get('per_page', 10))

       if not query:
           return jsonify({'error': 'Search query required'}), 400
           
       query_embedding = model.encode(query).tolist()
       companies = Company.query.all()
       results = []
       
       for company in companies:
           if company.embedding:
               similarity = max(0, calculate_similarity(query_embedding, company.embedding))
               
               company_name_lower = company.name.lower()
               name_bonus = 0
               if query == company_name_lower:
                   name_bonus = 0.5
               elif query in company_name_lower:
                   name_bonus = 0.3
               elif company_name_lower in query:
                   name_bonus = 0.2
               
               desc_lower = company.description.lower()
               desc_bonus = 0
               if query in desc_lower:
                   desc_bonus = 0.1
               
               final_score = max(0, min(1.0, similarity + name_bonus + desc_bonus))
               
               # Only include results with relevance >= 0.1 (10%)
               if final_score >= 0.05:
                   results.append({
                       'id': company.id,
                       'name': company.name,
                       'description': company.description,
                       'relevance': round(final_score, 4)
                   })
       
       results.sort(key=lambda x: x['relevance'], reverse=True)
       
       start_index = (page - 1) * per_page
       end_index = start_index + per_page
       paginated_results = results[start_index:end_index]
       
       return jsonify({
           'results': paginated_results,
           'total_results': len(results),
           'page': page,
           'per_page': per_page
       })
       
   except Exception as e:
       print("Search error:", str(e))
       return jsonify({'error': str(e)}), 500
   
def calculate_similarity(embedding1, embedding2):

   embedding1 = np.array(embedding1)
   embedding2 = np.array(embedding2)

   dot_product = np.dot(embedding1, embedding2)
   norm1 = norm(embedding1)
   norm2 = norm(embedding2)
   
   return dot_product / (norm1 * norm2)