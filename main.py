# main.py
from flask import Flask, render_template, jsonify, request, g, url_for, redirect, flash
from werkzeug.utils import secure_filename
from database import init_db, get_db, get_sounds
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Line added for flash messages
app.config['UPLOAD_FOLDER'] = os.path.abspath(os.path.join(os.path.dirname(__file__), 'static', 'sounds'))
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

def initialize_app(app):
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
        print(f"Created upload folder at: {app.config['UPLOAD_FOLDER']}")

    with app.app_context():
        try:
            init_db()
            print("Database initialization completed")
        except Exception as e:
            print(f"Failed to initialize database: {e}")
            raise

@app.route('/')
def keyboard():
    return render_template('keyboard.html')

@app.route('/sounds', methods=['GET', 'POST'])
def sounds():
    if request.method == 'POST':
        if 'sound' not in request.files:
            flash('No file part', 'error')
            return redirect(request.url)

        file = request.files['sound']

        if file.filename == '':
            flash('No selected file', 'error')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            try:
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)

                db = get_db()
                db.execute(
                    'INSERT INTO sounds (filename, key_mapping, category) VALUES (?, ?, ?)',
                    (filename, request.form.get('key_mapping'), request.form.get('category'))
                )
                db.commit()
                flash('File uploaded successfully', 'success')
                return redirect(url_for('sounds'))
            except Exception as e:
                flash(f'Error uploading file: {str(e)}', 'error')
                return redirect(request.url)
        else:
            flash('Invalid file type', 'error')
            return redirect(request.url)

    return render_template('sounds.html', sounds=get_sounds())

@app.route('/api/sounds', methods=['GET'])
def list_sounds():
    try:
        sounds = get_sounds()
        return jsonify(sounds)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'wav', 'mp3', 'm4a'}

if __name__ == '__main__':
    initialize_app(app)
    app.run(debug=True, port=3000)