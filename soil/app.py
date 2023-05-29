from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from models.user import User, db  # Import the User model from your database module or file
from flask_login import LoginManager, login_user, logout_user, current_user, login_required

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'your_database_uri_here'
db = SQLAlchemy(app)
# Initialize the db object
db.init_app(app)

login_manager = LoginManager(app)
@login_manager.user_loader
def load_user(user_id):
    # Retrieve the user object from the database based on the user_id
    return User.query.get(int(user_id))


@app.route("/")
def landing_page():
    return render_template("index.html")

@app.route("/profile")
@login_required
def profile_page():
    # Retrieve the user's information from the database
    user = current_user
    
    #User.query.first()  # Retrieve the first user from the User table, modify the query as needed
    # Pass the information to the template
    username = user.username if user else ""  # Get the username from the retrieved user, handle case when user is not found
    email = user.email if user else ""  # Get the email from the retrieved user, handle case when user is not found
    
    return render_template("profile.html", username=username, email=email)

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # Process the registration form data
        username = request.form.get("username")
        password = request.form.get("password")

        # Save the user's data in the database
        user = User(username=username, password=password)
        db.session.add(user)
        db.session.commit()

        # Redirect the user to the login page
        return redirect("/login")
    
    # Render the registration form template for GET requests
    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Process the login form data
        username = request.form.get("username")
        password = request.form.get("password")

        # Retrieve the user from the database based on the username
        user = User.query.filter_by(username=username).first()

        # Validate the user's credentials
        if user and user.password == password:
            # Log the user in
            login_user(user)
            # Redirect the user to the profile page if authentication succeeds
            return redirect("/profile")
        else:
            # Handle invalid credentials, e.g., display an error message
            error_message = "Invalid username or password"
            return render_template("login.html", error_message=error_message)

    # Render the login form template for GET requests
    return render_template("login.html")

@app.route("/logout")
@login_required
def logout():
    # Log the user out
    logout_user()

    # Render the logout template
    return render_template("logout.html")

# Redirect the user to the login page
    #return redirect("/login")

