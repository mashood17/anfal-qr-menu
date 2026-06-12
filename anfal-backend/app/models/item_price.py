from app.extensions import db
import uuid

class ItemPrice(db.Model):
    __tablename__ = 'item_prices'

    id           = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    menu_item_id = db.Column(db.String(36), db.ForeignKey('menu_items.id'), nullable=False)
    label        = db.Column(db.Text, nullable=False)
    price        = db.Column(db.Numeric(10, 2), nullable=False)
    sort_order   = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            'label': self.label,
            'price': float(self.price) if self.price is not None else None,
        }