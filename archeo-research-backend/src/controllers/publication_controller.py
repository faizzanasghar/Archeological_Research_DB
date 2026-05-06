from flask import jsonify, request
from src.models.models import Publication, db

def list_publications():
    pubs = Publication.query.all()
    return jsonify([{
        'id': p.publication_id,
        'title': p.title,
        'publisher': p.publisher,
        'doi': p.doi_number,
        'date': p.pub_date.strftime('%Y-%m-%d') if p.pub_date else None
    } for p in pubs]), 200

def create_publication():
    data = request.json
    try:
        new_pub = Publication(
            title=data.get('title'),
            publisher=data.get('publisher'),
            doi_number=data.get('doi'),
            pub_date=db.func.current_timestamp()
        )
        db.session.add(new_pub)
        db.session.commit()
        return jsonify({"msg": "Publication recorded", "id": new_pub.publication_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500
