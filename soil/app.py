from flask import Flask, render_template, request, redirect, current_app, session, flash, url_for
from flask_sqlalchemy import SQLAlchemy
#from models.user import User, db  # Import the User model from your database module or file
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from flask_migrate import Migrate
from forms import RegistrationForm, LoginForm
from functools import wraps
import requests
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, EqualTo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'opeyemi'
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:opeyemi@localhost:3306/soil_db?charset=utf8mb4"

# Set the SQLAlchemy track modifications to False
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
#Initialize the db object
#db.init_app(app)
with app.app_context():
    db.create_all()

migrate = Migrate(app, db)

login_manager = LoginManager(app)
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    # Retrieve the user object from the database based on the user_id
    return User.query.get(int(user_id))

"""@login_manager.user_loader
def load_user(user_id):
    # Retrieve the user object from the database based on the user_id
    with app.app_context():
        session = db.session
        return session.get(User, int(user_id))"""

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

class SoilData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    prop = db.Column(db.String(50), nullable=False)
    depth = db.Column(db.String(50), nullable=False)
    value = db.Column(db.String(50), nullable=False)
    #real = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Define the relationship with the User model
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('soil_data', lazy=True))

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already exists. Please choose a different username.', 'danger')
            return redirect(url_for('register'))

        user = User(username=username)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        flash('Registration successful. Please log in.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            # Set the 'user_id' in the session upon successful login
            session['user_id'] = user.id
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password. Please try again.', 'danger')
            return redirect(url_for('login'))

    return render_template('login.html', form=form)

"""@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))"""

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'success')
    return redirect(url_for('home'))


@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

"""@app.route("/")
def landing_page():
    return render_template("index.html")"""

"""@app.route("/profile")
@login_required
def profile_page():
    # Retrieve the user's information from the database
    user = current_user
    
    #User.query.first()  # Retrieve the first user from the User table, modify the query as needed
    #Pass the information to the template
    username = user.username if user else ""  # Get the username from the retrieved user, handle case when user is not found
    email = user.email if user else " "  #Get the email from the retrieved user, handle case when user is not found
    
    return render_template("profile.html", username=username, email=email)"""

"""@app.route("/register", methods=["GET", "POST"])
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
    return render_template("register.html", error_message=error_message)"""

"""@app.route("/login", methods=["GET", "POST"])
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
    return render_template("login.html")"""

"""@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect('/dashboard')

    form = RegistrationForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already exists. Please choose a different username.', 'danger')
            return redirect('/register')

        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()

        flash('Registration successful! You can now log in.', 'success')
        return redirect('/login')

    return render_template('register.html', form=form)"""

"""@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect('/dashboard')
    
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = User.query.filter_by(username=username).first()
        if user and user.password == password:
            session['user_id'] = user.id
            flash('Login successful!', 'success')
            return redirect('/dashboard')
        else:
            flash('Invalid username or password. Please try again.', 'danger')
            return redirect('/login')

    return render_template('login.html', form=form)"""

"""@app.route("/logout")
@login_required
def logout():
    # Log the user out
    logout_user()

    # Render the logout template
    return render_template("logout.html")"""

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'info')
            return redirect('/login')
        return f(*args, **kwargs)
    return decorated_function

@app.route("/soil-properties", methods=("GET", "POST"))
def soil_properties():
    if request.method == "POST":
        latitude = request.form["latitude"]
        longitude = request.form["longitude"]
        prop = request.form["property"]
        depth = request.form["depth"]
        session["latitude"] = latitude
        session["longitude"] = longitude
        session["property"] = prop
        session["depth"] = depth
        flash('Location coordinates saved successfully.', 'success')
        
        url = "https://api.isda-africa.com/v1/soilproperty?key=AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4&lat={}&lon={}&property={}&depth={}".format(latitude, longitude, prop, depth)
        response = requests.get(url)
        data = response.json()
        name = data.get("property")

        for key, value in name.items():
            data_val = value[0].get('value')
            for key2, value2 in data_val.items():
                if key2 == 'value':
                    real = "name: {}\nvalue: {}".format(key, value2)
                    return render_template("soil_properties.html", latitude=latitude, longitude=longitude, result=real)

                #latitude = session.get('latitude')
                #longitude = session.get('longitude')

                # Create a new instance of SoilData and set its attributes
                soil_data = SoilData(latitude=latitude, longitude=longitude, prop=prop, depth=depth, value=data_val.get('value'))
                soil_data.user = current_user  # assign the logged-in user to the soil data

                # Save the soil data to the database
                db.session.add(soil_data)
                db.session.commit()
                #return render_template("soil_properties.html", latitude=latitude, longitude=longitude, result=real)

    return render_template("soil_properties.html")

"""@app.route('/soil-data')
@login_required
def soil_data():
    # Retrieve the user's soil data entries from the database
    if current_user.is_authenticated:
        soil_data = SoilData.query.filter_by(user=current_user).all()
        return render_template('soil_data.html', soil_data=soil_data)
    else:
        return render_template('soil_data.html', soil_data=[])"""

@app.route('/soil-data', methods=['GET', 'POST'])
@login_required
def soil_data():
    if request.method == 'POST':
        # Delete a row of data
        data_id = request.form.get('delete_data')
        if data_id:
            soil_data = SoilData.query.get(data_id)
            if soil_data:
                if soil_data.user == current_user:
                    # Delete the data if it belongs to the current user
                    db.session.delete(soil_data)
                    db.session.commit()
                    flash('Soil data deleted successfully.', 'success')
                else:
                    flash('You are not authorized to delete this soil data.', 'danger')
            else:
                flash('Soil data not found.', 'danger')
            return redirect(url_for('soil_data'))

    # Retrieve the user's soil data entries from the database
    if current_user.is_authenticated:
        # Filter the data based on user inputs
        id = request.args.get('id')
        timestamp = request.args.get('timestamp')
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
        depth = request.args.get('depth')
        prop = request.args.get('property')
        value = request.args.get('value')

        # Build the query
        query = SoilData.query.filter_by(user=current_user)

        if id:
            query = query.filter(SoilData.id == id)
        if timestamp:
            query = query.filter(SoilData.timestamp == timestamp)
        if latitude:
            query = query.filter(SoilData.latitude == latitude)
        if longitude:
            query = query.filter(SoilData.longitude == longitude)
        if depth:
            query = query.filter(SoilData.depth == depth)
        if prop:
            query = query.filter(SoilData.prop == prop)
        if value:
            query = query.filter(SoilData.value == value)

        # Execute the query
        soil_data = query.all()

        return render_template('soil_data.html', soil_data=soil_data)
    else:
        return render_template('soil_data.html', soil_data=[])


"""@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)
    user_id = session['user_id']
    user = User.query.get(user_id)
    return render_template('dashboard.html', user=user)"""

"""@app.route('/logout')
def logout():
    session.clear()
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect('/login')"""

"""@app.route('/soil-properties', methods=['GET', 'POST'])
@login_required
def soil_properties():
    if request.method == 'POST':
        latitude = request.form['latitude']
        longitude = request.form['longitude']
        #Make API request to fetch soil properties based on coordinates
        url = f'https://api.example.com/soil-properties?lat={latitude}&lng={longitude}'
        response = requests.get(url)
        if response.status_code == 200:
            soil_data = response.json()
            return render_template('soil_properties.html', soil_data=soil_data)
        else:
            flash('Failed to fetch soil properties. Please try again.', 'danger')
            return redirect('/soil-properties')

    return render_template('input_coordinates.html')"""

@app.route('/soil-profile/<latitude>/<longitude>')
#@login_required
def soil_profile(latitude, longitude):
    # Make API request to fetch soil profile based on coordinates
    url = f'https://api.example.com/soil-profile?lat={latitude}&lng={longitude}'
    response = requests.get(url)
    if response.status_code == 200:
        soil_profile_data = response.json()
        return render_template('soil_profile.html', soil_profile_data=soil_profile_data)
    else:
        flash('Failed to fetch soil profile. Please try again.', 'danger')
        return redirect('/dashboard')

@app.route('/profile', methods=['GET', 'POST'])
#@login_required
def profile():
    user_id = session['user_id']
    user = User.query.get(user_id)

    if request.method == 'POST':
        user.latitude = request.form['latitude']
        user.longitude = request.form['longitude']
        db.session.commit()
        flash('Location coordinates saved successfully.', 'success')

    return render_template('profile.html', user=user)

"""@app.route("/map")
def map_page():
    return render_template("map.html")"""

@app.route('/map')
@login_required
def map():
    user_id = session['user_id']
    user = User.query.get(user_id)
    #latitude = user.latitude
    #longitude = user.longitude

    return render_template('map.html')#, latitude=latitude, longitude=longitude)

"""@app.route('/soil-map', methods=['GET'])
@login_required
def soil_map():
    # Perform logic to fetch soil properties and coordinates for the map
    # Replace this with your own implementation

    # Example data for demonstration
    soil_properties = [
        {'latitude': 37.7749, 'longitude': -122.4194, 'property': 'Property A'},
        {'latitude': 34.0522, 'longitude': -118.2437, 'property': 'Property B'},
        {'latitude': 39.9526, 'longitude': -75.1652, 'property': 'Property C'}
    ]

    return render_template('soil_map.html', soil_properties=soil_properties)"""

"""class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')"""

"""class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')"""

@app.route('/soil-depths', methods=['GET', 'POST'])
@login_required
def soil_depths():
    if request.method == 'POST':
        depth = request.form.get('depth')
        session['depth'] = depth
        flash('Selected depth saved successfully.', 'success')
        return redirect(url_for('soil_depths'))

    depth = session.get('depth')

    # Perform logic to fetch and display soil properties at the selected depth
    # Replace this with your own implementation

    return render_template('soil_depths.html', depth=depth)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500


# Redirect the user to the login page
    #return redirect("/login")
if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='0.0.0.0', debug=True)
