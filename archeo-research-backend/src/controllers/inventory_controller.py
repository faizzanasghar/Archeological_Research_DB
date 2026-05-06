from flask import jsonify, request
from src.models.models import EquipmentInventory, db

def list_inventory():
    site_id = request.args.get('siteId')
    query = EquipmentInventory.query
    if site_id:
        query = query.filter_by(site_id=site_id)
        
    items = query.all()
    return jsonify([{
        'id': i.equipment_id,
        'site': i.site.site_name if i.site else 'Unknown',
        'name': i.item_name,
        'quantity': i.quantity,
        'condition': i.condition
    } for i in items]), 200

def add_stock():
    data = request.json
    try:
        new_item = EquipmentInventory(
            site_id=data.get('siteId'),
            item_name=data.get('name'),
            quantity=data.get('quantity'),
            condition=data.get('condition', 'Good')
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"msg": "Stock added", "id": new_item.equipment_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500

def update_stock(item_id):
    try:
        item = EquipmentInventory.query.get_or_404(item_id)
        data = request.json
        if 'quantity' in data:
            item.quantity = data['quantity']
        if 'condition' in data:
            item.condition = data['condition']
        db.session.commit()
        return jsonify({"msg": "Stock updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500
