from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.config import config
from app.extensions import db, migrate
import os

def create_app(env=None):
    env = env or os.getenv('FLASK_ENV', 'development')
    app = Flask(__name__)
    app.config.from_object(config[env])
    app.config['JWT_SECRET_KEY']           = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)

    # ── CORS ──────────────────────────────────────────────────
    # Parse origins from env — strip whitespace, filter empty strings
    raw_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173')
    origins     = [o.strip() for o in raw_origins.split(',') if o.strip()]

    CORS(
        app,
        origins=origins,
        supports_credentials=True,
        allow_headers=['Content-Type', 'Authorization'],
        methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        expose_headers=['Content-Type', 'Authorization'],
    )

    # Explicitly handle OPTIONS preflight for all /api/* routes
    @app.before_request
    def handle_options():
        from flask import request, Response
        if request.method == 'OPTIONS':
            resp = Response()
            origin = request.headers.get('Origin', '')
            if origin in origins:
                resp.headers['Access-Control-Allow-Origin']      = origin
                resp.headers['Access-Control-Allow-Credentials'] = 'true'
                resp.headers['Access-Control-Allow-Headers']     = 'Content-Type, Authorization'
                resp.headers['Access-Control-Allow-Methods']     = 'GET, POST, PUT, DELETE, OPTIONS'
            return resp, 200

    # ── Blueprints ────────────────────────────────────────────
    # Public
    from app.routes.restaurants import bp as restaurants_bp
    from app.routes.categories  import bp as categories_bp
    from app.routes.items       import bp as items_bp
    app.register_blueprint(restaurants_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(items_bp)

    # Auth
    from app.routes.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    # Upload
    from app.routes.upload import bp as upload_bp
    app.register_blueprint(upload_bp)

    # Admin CRUD
    from app.routes.admin.categories import bp as admin_cat_bp
    from app.routes.admin.items      import bp as admin_items_bp
    from app.routes.admin.branding   import bp as admin_brand_bp
    app.register_blueprint(admin_cat_bp)
    app.register_blueprint(admin_items_bp)
    app.register_blueprint(admin_brand_bp)

    # Health check
    @app.route('/api/health')
    def health():
        return {'status': 'ok'}

    # Debug route — remove after confirming deployment
    @app.route('/api/debug/routes')
    def list_routes():
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append({
                'endpoint': rule.endpoint,
                'methods':  sorted(rule.methods),
                'path':     str(rule),
            })
        return {'routes': sorted(routes, key=lambda r: r['path'])}

    return app