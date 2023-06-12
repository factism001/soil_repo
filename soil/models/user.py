from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    def __repr__(self):
        return f"<User {self.username}>"
    """is_active = db.Column(db.Boolean, default=True)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def get_id(self):
        return str(self.id)"""
