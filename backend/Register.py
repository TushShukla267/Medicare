from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Yash@12345',
    'database': 'MediWatch'
}

def get_role_id(role_name):
    db = mysql.connector.connect(**db_config)
    cursor = db.cursor()
    cursor.execute("SELECT id FROM roles WHERE name = %s", (role_name,))
    row = cursor.fetchone()
    cursor.close()
    db.close()
    return row if row else None

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    role = data.get('role')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    full_name = data.get('full_name')

    # Basic validation
    if not all([role, email, phone, password, full_name]):
        return jsonify({"error": "Missing required fields"}), 400

    role_id = get_role_id(role)
    if not role_id:
        return jsonify({"error": "Invalid role"}), 400

    try:
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor()

        cursor.execute(
            """INSERT INTO users (email, phone, password, full_name, role_id)
               VALUES (%s, %s, %s, %s, %s)""",
            (email, phone, password, full_name, role_id)
        )
        user_id = cursor.lastrowid

        if role == 'patient':
            cursor.execute(
                """INSERT INTO patient_profiles (user_id, date_of_birth, gender, marital_status,
                    address, emergency_contact_name, emergency_contact_phone,
                    insurance_provider, policy_number, medical_history, consent)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                (user_id,
                 data.get('date_of_birth'),
                 data.get('gender'),
                 data.get('marital_status'),
                 data.get('address'),
                 data.get('emergency_contact_name'),
                 data.get('emergency_contact_phone'),
                 data.get('insurance_provider'),
                 data.get('policy_number'),
                 data.get('medical_history'),
                 bool(data.get('consent')))
            )
        elif role == 'doctor':
            cursor.execute(
                """INSERT INTO doctor_profiles (user_id, license_number, specialty, years_experience, clinic_name)
                   VALUES (%s, %s, %s, %s, %s)""",
                (user_id,
                 data.get('license_number'),
                 data.get('specialty'),
                 data.get('years_experience'),
                 data.get('clinic_name'))
            )
        elif role == 'admin':
            cursor.execute(
                """INSERT INTO admin_profiles (user_id, employee_id, department, role_title, access_level)
                   VALUES (%s, %s, %s, %s, %s)""",
                (user_id,
                 data.get('employee_id'),
                 data.get('department'),
                 data.get('role_title'),
                 data.get('access_level'))
            )
        elif role == 'guardian':
            cursor.execute(
                """INSERT INTO guardian_profiles (user_id, patient_name)
                   VALUES (%s, %s)""",
                (user_id, data.get('patient_name'))
            )

        db.commit()
        return jsonify({"success": True, "user_id": user_id}), 201

    except mysql.connector.IntegrityError as err:
        db.rollback()
        return jsonify({"error": "Duplicate email/phone"}), 409
    except Exception as ex:
        db.rollback()
        print(ex)
        return jsonify({"error": "Server error"}), 500
    finally:
        cursor.close()
        db.close()

if __name__ == '__main__':
    app.run(port=5000, debug=True)