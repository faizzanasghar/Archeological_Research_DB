from flask import jsonify, request
from src.models.models import Artifact, Layer, db

def list_artifacts():
    artifacts = Artifact.query.all()
    return jsonify([{
        'id': a.artifact_id,
        'siteName': a.layer.site.site_name if a.layer and a.layer.site else "Unknown",
        'layer': a.layer.layer_name if a.layer else "Unknown",
        'material': a.material,
        'condition': a.condition,
        'dimensions': a.dimensions,
        'museum': a.museum.museum_name if a.museum else "Unknown"
    } for a in artifacts]), 200

def create_artifact():
    data = request.json
    try:
        new_artifact = Artifact(
            layer_id=data.get('layerId'),
            museum_id=data.get('museumId'),
            material=data.get('material'),
            dimensions=data.get('dimensions'),
            condition=data.get('condition')
        )
        db.session.add(new_artifact)
        db.session.commit()
        return jsonify({"msg": "Artifact registered", "id": new_artifact.artifact_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500

def list_layers(site_id):
    layers = Layer.query.filter_by(site_id=site_id).all()
    return jsonify([{
        'id': l.layer_id,
        'name': l.layer_name,
        'soilType': l.soil_type,
        'depth': l.depth,
        'age': l.estimated_age
    } for l in layers]), 200
