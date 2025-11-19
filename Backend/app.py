
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import bcrypt
import base64
portfolio_data = []

app = Flask(__name__)
CORS(app, origins=["*"])

MONGO_URI = "mongodb+srv://cavb:abcd1234@projectmanagement.4db0vme.mongodb.net/?appName=ProjectManagement"
client = MongoClient(MONGO_URI)
db = client["WELEAD"]

# Collections
users = db["users"]
projects = db["projects"]
portfolio = db["portfolio"]
client_requests = db["client_requests"]
services = db["services"]
planner = db["report"]
notifications = db["notifications"]
form = db["form"]
feedback = db["feedback"]
activitylogs = db["activity_logs"]

# Add default admin user if not exists
if not users.find_one({"email": "admin@example.com"}):
    hashed_admin_pw = bcrypt.hashpw("admin123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    users.insert_one({
        "first_name": "Admin",
        "last_name": "User",
        "email": "admin@example.com",
        "password": "$2b$12$ro.XhD/FRoEWszfcCe1EJOpJH8RGzyUf1yfyXejBqFlB.S/6KFQQ2",
        "role": "admin",
        "date_created": "2025-10-31"
    })



# -------------------------------
# LOGIN ROUTE
# -------------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Check if account is deactivated
    if user.get("status") == "deactivated":
        return jsonify({"error": "Account is deactivated. Contact admin to reactivate."}), 403

    # Compare hashed password
    stored_hash = user["password"].encode("utf-8")
    if not bcrypt.checkpw(password.encode("utf-8"), stored_hash):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "user": {
            "id": str(user["_id"]),
            "first_name": user.get("first_name"),
            "last_name": user.get("last_name"),
            "email": user["email"],
            "role": user.get("role", "Client"),
            "status": user.get("status", "active"),
            "date_created": user.get("date_created")
        }
    }), 200





# -------------------------------
# CLIENT ACCOUNT STATUS
# -------------------------------
@app.route("/users/<id>/status", methods=["PUT"])
def update_user_status(id):
    data = request.get_json()
    new_status = data.get("status")
    if new_status not in ["active", "deactivated"]:
        return jsonify({"error": "Invalid status"}), 400

    result = users.update_one({"_id": ObjectId(id)}, {"$set": {"status": new_status}})
    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    updated_user = users.find_one({"_id": ObjectId(id)})
    updated_user["_id"] = str(updated_user["_id"])
    return jsonify({"message": f"User status updated to {new_status}", "user": updated_user}), 200




# -------------------------------
# REGISTER ROUTE
# -------------------------------
import re
from flask import request, jsonify
import bcrypt
from datetime import datetime

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    security_question = data.get("securityQuestion")
    security_answer = data.get("securityAnswer")

    # Validate required fields
    if not all([first_name, last_name, email, password, security_question, security_answer]):
        return jsonify({"error": "All fields including security question and answer are required"}), 400

    # Check if email already exists
    if users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    # PASSWORD VALIDATION
    password_pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
    if not re.match(password_pattern, password):
        return jsonify({
            "error": (
                "Password must be at least 8 characters long and include: "
                "1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
            )
        }), 400

    # HASH PASSWORD
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # Create new user document
    new_user = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": hashed_password.decode("utf-8"),
        "securityQuestion": security_question,
        "securityAnswer": security_answer,
        "role": "user",
        "date_created": datetime.utcnow()
    }

    # Insert into MongoDB
    users.insert_one(new_user)

    return jsonify({"message": "Registered successfully"}), 201



# -------------------------------
# GET security question for an email
# -------------------------------
@app.route("/get_security_question")
def get_security_question():
    email = request.args.get("email")
    user = users.find_one({"email": email})
    if not user or "securityQuestion" not in user:
        return jsonify({"error": "Email not found"}), 404
    return jsonify({"securityQuestion": user["securityQuestion"]}), 200



# -------------------------------
# RESET password by answer
# -------------------------------
@app.route("/reset_password", methods=["POST"])
def reset_password():
    data = request.get_json()
    email = data.get("email")
    answer = data.get("answer")
    new_password = data.get("newPassword")

    user = users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get("securityAnswer") != answer:
        return jsonify({"error": "Incorrect answer"}), 400

    # Hash new password
    hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
    users.update_one({"email": email}, {"$set": {"password": hashed_password.decode("utf-8")}})
    return jsonify({"message": "Password reset successfully"}), 200



# ----------------------------------------------------------------------------------------------------------------------------------------



# -------------------------------
# GET all portfolio projects
# -------------------------------
@app.route("/portfolio", methods=["GET"])
def get_portfolio():
    try:
        portfolios = list(portfolio.find())
        # Convert ObjectId to string
        for p in portfolios:
            p["_id"] = str(p["_id"])
        return jsonify({"portfolio": portfolios}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# ADD portfolio project
# -------------------------------
@app.route("/portfolio", methods=["POST"])
def add_portfolio():
    try:
        category = request.form.get("category")
        title = request.form.get("title")
        desc = request.form.get("desc")
        file = request.files.get("imgFile")

        if not file:
            return jsonify({"error": "No image file uploaded"}), 400

        # Case-insensitive duplicate check
        duplicate = portfolio.find_one({
            "title": {"$regex": f"^{re.escape(title)}$", "$options": "i"},
            "desc": {"$regex": f"^{re.escape(desc)}$", "$options": "i"}
        })
        if duplicate:
            return jsonify({"error": "This project is already added to the portfolio"}), 400

        img_base64 = base64.b64encode(file.read()).decode("utf-8")

        new_item = {
            "img": f"data:image/jpeg;base64,{img_base64}",
            "category": category,
            "title": title,
            "desc": desc,
            "featured": False  # default featured status
        }

        result = portfolio.insert_one(new_item)
        new_item["_id"] = str(result.inserted_id)

        print(f"✅ Added new portfolio ({new_item['_id']})")
        return jsonify({"portfolio": new_item}), 200

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": str(e)}), 500




# -------------------------------
# UPDATE portfolio project
# -------------------------------
@app.route("/portfolio/<id>", methods=["PUT"])
def update_portfolio(id):
    try:
        category = request.form.get("category")
        title = request.form.get("title")
        desc = request.form.get("desc")
        file = request.files.get("imgFile")

        update_data = {
            "category": category,
            "title": title,
            "desc": desc
        }

        if file and file.filename != "":
            img_base64 = base64.b64encode(file.read()).decode("utf-8")
            update_data["img"] = f"data:image/jpeg;base64,{img_base64}"

        result = portfolio.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Portfolio not found"}), 404

        updated = portfolio.find_one({"_id": ObjectId(id)})
        updated["_id"] = str(updated["_id"])

        print(f"✅ Updated portfolio {id}")
        return jsonify({"portfolio": updated}), 200

    except Exception as e:
        print("❌ ERROR updating:", e)
        return jsonify({"error": str(e)}), 500


# -------------------------------
# DELETE portfolio project
# -------------------------------
@app.route("/portfolio/<id>", methods=["DELETE"])
def delete_portfolio(id):
    try:
        result = portfolio.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Portfolio project not found"}), 404
        print(f"🗑️ Deleted portfolio {id}")
        return jsonify({"message": "Portfolio project deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




# ----------------------------------------------------------------------------------------------------------------------------------------



# ADD NEW SERVICE REQUEST (Client Form)
@app.route("/add_request", methods=["POST"])
def add_request():
    try:
        data = request.get_json()

        # Build new request document with all fields from React form
        new_request = {
            "client_name": data.get("client_name"),
            "email": data.get("email"),
            "service_type": data.get("service_type"),
            "project_location": data.get("project_location"),
            "contact_number": data.get("contact_number"),
            "budget_range": data.get("budget_range"),
            "timeline": data.get("timeline"),
            "priority": data.get("priority", "Normal"),
            "referral_source": data.get("referral_source"),
            "description": data.get("description"),
            "convenience_fee": data.get("convenience_fee", 0),
            "status": data.get("status", "Pending"),
            "submitted_at": datetime.now().isoformat()
        }

        result = form.insert_one(new_request)
        new_request["_id"] = str(result.inserted_id)

        print(f"✅ New service request added: {new_request['client_name']}")
        return jsonify({"message": "Service request added successfully", "data": new_request}), 201

    except Exception as e:
        print("❌ ERROR adding request:", e)
        return jsonify({"error": str(e)}), 500


# GET ALL SERVICE REQUESTS (Admin View)
@app.route("/get_requests", methods=["GET"])
def get_requests():
    try:
        requests_list = []
        for req in form.find().sort("submitted_at", -1):
            req["_id"] = str(req["_id"])
            requests_list.append(req)
        return jsonify(requests_list), 200

    except Exception as e:
        print("❌ ERROR fetching requests:", e)
        return jsonify({"error": str(e)}), 500



# ----------------------------------------------------------------------------------------------------------------------------------------



# -------------------------------
# PROCEED WITH PROJECT
# -------------------------------
@app.route("/create_project_from_request/<id>", methods=["POST"])
def create_project_from_request(id):
    try:
        # Find the service request
        service_request = form.find_one({"_id": ObjectId(id)})
        if not service_request:
            return jsonify({"error": "Request not found"}), 404

        # Prevent creating project if already exists
        existing_project = projects.find_one({"created_from_request": str(service_request["_id"])})
        if existing_project:
            return jsonify({"error": "Project already created for this request"}), 400

        # Create new project document
        new_project = {
            "name": service_request.get("service_type", "Untitled Project"),
            "client": service_request.get("client_name"),
            "email": service_request.get("email"),
            "description": service_request.get("description", ""),
            "location": service_request.get("project_location", ""),
            "budget_range": service_request.get("budget_range", ""),
            "timeline": service_request.get("timeline", ""),
            "priority": service_request.get("priority", "Normal"),
            "status": "In Progress",
            "approved": True,
            "created_from_request": str(service_request["_id"]),
            "phases": [
                {"name": "Concept Design", "completed": False, "notes": "", "documents": [], "images": []},
                {"name": "Design Development", "completed": False, "notes": "", "documents": [], "images": []},
                {"name": "Construction Documents", "completed": False, "notes": "", "documents": [], "images": []},
                {"name": "Permits", "completed": False, "notes": "", "documents": [], "images": []},
                {"name": "Construction", "completed": False, "notes": "", "documents": [], "images": []},
                {"name": "Turnover", "completed": False, "notes": "", "documents": [], "images": []}
            ],
            "created_at": datetime.now().isoformat()
        }

        result = projects.insert_one(new_project)
        new_project["_id"] = str(result.inserted_id)

        # Update request status to 'Project Started'
        form.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": "Project Started", "updated_at": datetime.now().isoformat()}}
        )

        print(f"✅ Project created from request ({service_request.get('client_name')})")
        return jsonify(new_project), 200

    except Exception as e:
        print("❌ ERROR creating project from request:", e)
        return jsonify({"error": str(e)}), 500


# -------------------------------
# UPDATE THE PROJECT
# -------------------------------
@app.route("/update_request/<id>", methods=["PUT"])
def update_request(id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        result = form.update_one(
            {"_id": ObjectId(id)},
            {"$set": {**data, "updated_at": datetime.now().isoformat()}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Request not found"}), 404

        updated_request = form.find_one({"_id": ObjectId(id)})
        updated_request["_id"] = str(updated_request["_id"])
        return jsonify(updated_request), 200

    except Exception as e:
        print("❌ ERROR updating request:", e)
        return jsonify({"error": str(e)}), 500



# -------------------------------
# GET all featured portfolio projects
# -------------------------------
@app.route("/portfolio/featured", methods=["GET"])
def get_featured_portfolio():
    try:
        # Only return projects where featured == True
        featured_projects = list(portfolio.find({"featured": True}))
        for p in featured_projects:
            p["_id"] = str(p["_id"])
        return jsonify({"portfolio": featured_projects}), 200
    except Exception as e:
        print("❌ ERROR fetching featured portfolio:", e)
        return jsonify({"error": str(e)}), 500




# -------------------------------
# TOGGLE portfolio project FEATURED STATUS
# -------------------------------
@app.route("/portfolio/<id>/featured", methods=["PUT"])
def toggle_portfolio_featured(id):
    try:
        featured_value = request.form.get("featured")
        if featured_value not in ["true", "false"]:
            return jsonify({"error": "Featured value must be 'true' or 'false'"}), 400

        # Convert string to boolean
        is_featured = True if featured_value == "true" else False

        # Update the portfolio item
        result = portfolio.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"featured": is_featured}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Portfolio project not found"}), 404

        updated_project = portfolio.find_one({"_id": ObjectId(id)})
        updated_project["_id"] = str(updated_project["_id"])

        return jsonify({
            "message": f"Portfolio featured status updated to {is_featured}",
            "portfolio": updated_project
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    




# -------------------------------
# GET all users (for admin Control Panel)
# -------------------------------
@app.route("/users", methods=["GET"])
def get_users():
    try:
        all_users = list(users.find())
        for u in all_users:
            u["_id"] = str(u["_id"])
            u["firstName"] = u.get("first_name", "")
            u["lastName"] = u.get("last_name", "")
            u.pop("password", None)
            u.pop("securityAnswer", None)
            u.pop("securityQuestion", None)
        return jsonify({"users": all_users}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500





# -------------------------------
# GET single user profile
# -------------------------------
@app.route("/users/<id>", methods=["GET"])
def get_user(id):
    try:
        user = users.find_one({"_id": ObjectId(id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Convert ObjectId to string
        user["_id"] = str(user["_id"])
        user["firstName"] = user.get("first_name", "")
        user["lastName"] = user.get("last_name", "")

        # Hide sensitive fields
        user.pop("password", None)
        user.pop("securityAnswer", None)
        user.pop("securityQuestion", None)

        return jsonify({"user": user}), 200

    except Exception as e:
        print("❌ Profile fetch error:", e)
        return jsonify({"error": str(e)}), 500





@app.route("/inquiries/statuses", methods=["GET"])
def get_inquiry_statuses():
    try:
        # Fetch all inquiries from 'form' collection retrieving specific fields (including status)
        inquiries = list(form.find({}, {
            "client_name": 1,
            "email": 1,
            "service_type": 1,
            "project_location": 1,
            "contact_number": 1,
            "budget_range": 1,
            "timeline": 1,
            "priority": 1,
            "referral_source": 1,
            "description": 1,
            "convenience_fee": 1,
            "status": 1,
            "submitted_at": 1
        }).sort("submitted_at", -1))

        # Convert ObjectId to string for each inquiry
        for inquiry in inquiries:
            inquiry["_id"] = str(inquiry["_id"])

        # Return inquiries with their status and other relevant fields
        return jsonify({"inquiries": inquiries}), 200

    except Exception as e:
        print("❌ ERROR fetching inquiry statuses:", e)
        return jsonify({"error": str(e)}), 500


    
    
    
    
# -------------------------------
# GET total active clients
# -------------------------------
@app.route("/active_clients", methods=["GET"])
def get_active_clients():
    try:
        # Find distinct clients who have at least one active project
        active_clients = projects.distinct("client", {"status": {"$in": ["Pending", "Approved", "Scheduled", "Proceeded", "In Progress"]}})
        return jsonify({"activeClients": len(active_clients)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


# -------------------------------
# GET tasks overview
# -------------------------------
@app.route("/tasks_overview", methods=["GET"])
def get_tasks_overview():
    try:
        # Example: Assuming each project has a "tasks" array with status field
        all_projects = list(projects.find())
        overview = {"ongoing": 0, "delayed": 0, "approved": 0}

        for proj in all_projects:
            tasks_list = proj.get("tasks", [])  # Each task: {"name": "", "status": ""}
            for t in tasks_list:
                status = t.get("status", "").lower()
                if status == "ongoing":
                    overview["ongoing"] += 1
                elif status == "delayed":
                    overview["delayed"] += 1
                elif status == "approved":
                    overview["approved"] += 1

        return jsonify(overview), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500






# -------------------------------
# GET all projects (for Project Tracker)
# -------------------------------
@app.route("/projects", methods=["GET"])
def get_projects():
    try:
        # TODO: You could filter by email for client view later
        all_projects = list(projects.find())
        for p in all_projects:
            p["_id"] = str(p["_id"])
            if "phases" not in p or not p["phases"]:
                p["phases"] = [
                    {"name": "Concept Design", "completed": False, "notes": "", "documents": [], "images": []},
                    {"name": "Design Development", "completed": False, "notes": "", "documents": [], "images": []},
                    {"name": "Construction Documents", "completed": False, "notes": "", "documents": [], "images": []},
                    {"name": "Permits", "completed": False, "notes": "", "documents": [], "images": []},
                    {"name": "Construction", "completed": False, "notes": "", "documents": [], "images": []},
                    {"name": "Turnover", "completed": False, "notes": "", "documents": [], "images": []}
                ]
            if "approved" not in p:
                p["approved"] = False
        return jsonify(all_projects), 200
    except Exception as e:
        print("❌ ERROR fetching projects:", e)
        return jsonify({"error": str(e)}), 500



# -------------------------------
# UPDATE SINGLE PROJECT PHASE
# -------------------------------
@app.route("/projects/<id>/phases/<int:phase_index>", methods=["PUT"])
def update_project_phase(id, phase_index):
    try:
        data = request.get_json()
        completed = data.get("completed", False)
        notes = data.get("notes", "")
        documents = data.get("documents", [])
        images = data.get("images", [])

        project = projects.find_one({"_id": ObjectId(id)})
        if not project:
            return jsonify({"error": "Project not found"}), 404

        # Update only the specified phase
        if "phases" not in project or len(project["phases"]) <= phase_index:
            return jsonify({"error": "Invalid phase index"}), 400

        project["phases"][phase_index]["completed"] = completed
        project["phases"][phase_index]["notes"] = notes
        project["phases"][phase_index]["documents"] = documents
        project["phases"][phase_index]["images"] = images

        projects.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"phases": project["phases"]}}
        )

        project["_id"] = str(project["_id"])
        return jsonify(project), 200

    except Exception as e:
        print("❌ ERROR updating project phase:", e)
        return jsonify({"error": str(e)}), 500



@app.route("/projects/<id>/archive", methods=["PUT"])
def archive_project(id):
    try:
        project = projects.find_one({"_id": ObjectId(id)})
        if not project:
            return jsonify({"error": "Project not found"}), 404

        # Ensure all phases are completed AND project is approved
        if not project.get("approved", False):
            return jsonify({"error": "Cannot archive unapproved project"}), 400
        if any(not ph.get("completed", False) for ph in project.get("phases", [])):
            return jsonify({"error": "Cannot archive project with incomplete phases"}), 400

        projects.update_one({"_id": ObjectId(id)}, {"$set": {"archived": True}})

        project["_id"] = str(project["_id"])
        project["archived"] = True
        return jsonify(project), 200

    except Exception as e:
        print("❌ ERROR archiving project:", e)
        return jsonify({"error": str(e)}), 500




# -------------------------------
# ADD REQUEST - CLIENT SIDE
# -------------------------------
@app.route("/client_requests", methods=["POST"])
def add_client_request():
    try:
        data = request.get_json()
        milestone = data.get("milestone")
        request_text = data.get("request")
        requested_by = data.get("requestedBy", "Anonymous")

        if not milestone or not request_text:
            return jsonify({"error": "Milestone and request text are required"}), 400

        new_request = {
            "milestone": milestone,  # store the milestone name directly
            "request": request_text,
            "requested_by": requested_by,
            "status": "Pending",
            "comments": "",
            "submitted_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = db.client_requests.insert_one(new_request)
        new_request["_id"] = str(result.inserted_id)

        return jsonify({"message": "Request submitted successfully", "request": new_request}), 201

    except Exception as e:
        print("❌ ERROR adding client request:", e)
        return jsonify({"error": str(e)}), 500



# -------------------------------
# FETCH REQUEST - ADMIN SIDE
# -------------------------------
@app.route("/client_requests", methods=["GET"])
def get_client_requests():
    try:
        requests_list = list(db.client_requests.find().sort("submitted_at", -1))
        for r in requests_list:
            r["_id"] = str(r["_id"])
        return jsonify(requests_list), 200

    except Exception as e:
        print("❌ ERROR fetching client requests:", e)
        return jsonify({"error": str(e)}), 500




# -------------------------------
# UPDATE REQUEST - ADMIN SIDE
# -------------------------------
@app.route("/client_requests/<id>", methods=["PUT"])
def update_client_request(id):
    try:
        data = request.get_json()
        update_fields = {}

        if "status" in data:
            update_fields["status"] = data["status"]
        if "comments" in data:
            update_fields["comments"] = data["comments"]
        if "scheduled_date" in data:
            update_fields["scheduled_date"] = datetime.fromisoformat(data["scheduled_date"])

        update_fields["updated_at"] = datetime.utcnow()

        result = db.client_requests.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_fields}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Request not found"}), 404

        updated_request = db.client_requests.find_one({"_id": ObjectId(id)})
        updated_request["_id"] = str(updated_request["_id"])
        return jsonify(updated_request), 200

    except Exception as e:
        print("❌ ERROR updating client request:", e)
        return jsonify({"error": str(e)}), 500

















# -------------------------------
# MAIN
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
