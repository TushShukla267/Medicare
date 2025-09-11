from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import check_password_hash

app = Flask(__name__)
CORS(app)

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Yash@12345',
    'database': 'MediWatch'
}

def get_user_by_role_and_identifier(role, identifier):
    # Map role to the right identifying column(s)
    # Login identifiers per role:
    # patient: email or phone, doctor: email or license_number from doctor_profiles,
    # admin: email or employee_id from admin_profiles,
    # guardian: email or phone from users (guardian_profiles linked by user_id)
    
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)

    user = None
    try:
        if role == 'patient':
            query = "SELECT * FROM users WHERE role_id = (SELECT id FROM roles WHERE name=%s) AND (email=%s OR phone=%s)"
            cursor.execute(query, (role, identifier, identifier))
            user = cursor.fetchone()

        elif role == 'doctor':
            query = """
                SELECT u.*, d.license_number FROM users u
                JOIN doctor_profiles d ON u.id = d.user_id
                WHERE u.role_id = (SELECT id FROM roles WHERE name=%s)
                AND (u.email=%s OR d.license_number=%s)
            """
            cursor.execute(query, (role, identifier, identifier))
            user = cursor.fetchone()

        elif role == 'admin':
            query = """
                SELECT u.*, a.employee_id FROM users u
                JOIN admin_profiles a ON u.id = a.user_id
                WHERE u.role_id = (SELECT id FROM roles WHERE name=%s)
                AND (u.email=%s OR a.employee_id=%s)
            """
            cursor.execute(query, (role, identifier, identifier))
            user = cursor.fetchone()

        elif role == 'guardian':
            query = """
                SELECT * FROM users WHERE role_id = (SELECT id FROM roles WHERE name=%s) AND (email=%s OR phone=%s)
            """
            cursor.execute(query, (role, identifier, identifier))
            user = cursor.fetchone()
    finally:
        cursor.close()
        connection.close()

    return user

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    role = data.get('role')
    identifier = data.get('identifier')
    password = data.get('password')

    if not all([role, identifier, password]):
        return jsonify({"error": "Missing fields"}), 400

    user = get_user_by_role_and_identifier(role, identifier)
    
    if not user:
        return jsonify({"error": "Invalid username or role"}), 401
    
    stored_password = user.get('password')

    if not check_password_hash(stored_password, password):
        return jsonify({"error": "Invalid password"}), 401

    return jsonify({"message": "Login successful", "user_id": user.get('id')}), 200


if __name__ == "__main__":
    app.run(port=5000, debug=True)
