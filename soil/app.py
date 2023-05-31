from flask import Flask, render_template, request, redirect, current_app
from flask_sqlalchemy import SQLAlchemy
from models.user import User, db  # Import the User model from your database module or file
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SECRET_KEY'] = 'opeyemi'
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:opeyemi@localhost/soil"

# Set the SQLAlchemy track modifications to False
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#db = SQLAlchemy(app)
# Initialize the db object
db.init_app(app)
with app.app_context():
    db.create_all()

migrate = Migrate(app, db)

login_manager = LoginManager(app)
#@login_manager.user_loader
#def load_user(user_id):
    # Retrieve the user object from the database based on the user_id
    #return User.query.get(int(user_id))

@login_manager.user_loader
def load_user(user_id):
    # Retrieve the user object from the database based on the user_id
    with app.app_context():
        session = db.session
        return session.get(User, int(user_id))


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
    error_message = None
    
    if request.method == "POST":
        # Process the registration form data
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")

        # Check if the username already exists in the database
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            error_message = "Username already exists. Please choose another username."
        else:
            # Save the user's data in the database
            user = User(username=username, email=email, password=password)
            db.session.add(user)
            db.session.commit()

            # Redirect the user to the login page
            return redirect("/login")

    # Render the registration form template for GET requests
    return render_template("register.html", error_message=error_message)

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
if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='0.0.0.0', debug=True)
