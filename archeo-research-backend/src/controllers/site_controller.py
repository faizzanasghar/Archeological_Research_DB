from flask import jsonify, request
from src.models.models import ExcavationSite, db
from datetime import datetime

def list_sites():
    search = request.args.get('search')
    query = ExcavationSite.query
    
    if search:
        query = query.filter(ExcavationSite.site_name.ilike(f'%{search}%'))
        
    sites = query.all()
    return jsonify([{
        'id': s.site_id,
        'name': s.site_name,
        'location': s.location,
        'discoveryDate': s.discovery_date.strftime('%Y-%m-%d') if s.discovery_date else None,
        'description': s.description,
        'gps': s.gps_coordinates
    } for s in sites]), 200

def create_site():
    data = request.json
    try:
        new_site = ExcavationSite(
            site_name=data.get('name'),
            location=data.get('location'),
            description=data.get('description'),
            gps_coordinates=data.get('gps'),
            discovery_date=datetime.strptime(data.get('date'), '%Y-%m-%d') if data.get('date') else None
        )
        db.session.add(new_site)
        db.session.commit()
        return jsonify({"msg": "Site created", "id": new_site.site_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500

def get_site_details(site_id):
    site = ExcavationSite.query.get_or_404(site_id)
    return jsonify({
        'id': site.site_id,
        'name': site.site_name,
        'location': site.location,
        'description': site.description,
        'gps': site.gps_coordinates,
        'discoveryDate': site.discovery_date.strftime('%Y-%m-%d') if site.discovery_date else None,
        'layersCount': len(site.layers),
        'workersCount': len(site.workers)
    }), 200

def delete_site(site_id):
    try:
        site = ExcavationSite.query.get_or_404(site_id)
        db.session.delete(site)
        db.session.commit()
        return jsonify({"msg": "Site deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500
