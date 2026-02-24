
from flask import Flask, render_template
import os
from flask_wtf import CSRFProtect

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-me')
csrf = CSRFProtect(app)

@app.route('/')
def index():
	return render_template('index.html')

if __name__ == '__main__':
	app.run()
