# 🎹 Amazing Piano App

Welcome to the **Amazing Piano App**, a Flask-based web application where you can create, play, and manage virtual keyboard sounds! 🎶 Whether you're an aspiring musician or just looking for some fun, this app has something for everyone. Let's dive in! 🚀

## 🌟 Features

### 🎵 Play the Virtual Keyboard
- Use your computer keyboard to play virtual keys (A-K) or click directly on the keys.
- Supports both white and black keys for a full range of notes.

### 🎚️ Choose Your Instrument
- Select from built-in instruments:
  - Synth
  - Piano
  - Bass Synth
  - Lead Synth
  - **Custom Sounds** (upload your own!)

### 🚀 Effects Control
- Toggle effects with a single button to experiment with unique soundscapes.

### 📂 Sound Management
- **Upload Your Own Sounds**: Add custom sound files (supported formats: `.wav`, `.mp3`, `.m4a`).
- Sounds are saved to a database for future use.

### 🔗 API Access
- Get a list of all uploaded sounds with a simple API endpoint: `/api/sounds`.

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/amazing-piano-app.git
cd amazing-piano-app
```

### 2. Set Up Dependencies
Create a virtual environment and install the required packages:
```bash
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Initialize the App
Run the following command to create the database and static folders:
```bash
python main.py
```

### 4. Start the App
Run the Flask app:
```bash
python main.py
```
The app will be available at [http://127.0.0.1:3000](http://127.0.0.1:3000).

## 📂 Project Structure

```
Amazing-Piano-App/
|-- main.py               # Application entry point
|-- templates/            # HTML templates
|   |-- keyboard.html     # Main keyboard page
|-- static/               # Static files
|   |-- js/               # JavaScript files
|   |-- sounds/           # Uploaded sounds
|-- database.py           # Database initialization and queries
|-- requirements.txt      # Python dependencies
```

## 🌐 Usage

1. Open the app in your browser.
2. Choose your instrument from the dropdown menu.
3. Start playing the virtual keyboard by pressing the keys or clicking on the keys on-screen.
4. Upload your own sounds to personalize the experience.

## 🧩 API Reference

### List All Sounds
- **Endpoint**: `/api/sounds`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "filename": "example.mp3",
      "key_mapping": "A",
      "category": "Custom"
    }
  ]
  ```

## 🚧 Limitations

- Maximum file size for uploads: **16 MB**.
- Supported file formats for uploads: `.wav`, `.mp3`, `.m4a`.

## 🚀 Future Enhancements

- Add more built-in instruments.
- Support real-time audio effects configuration.
- Enhance the UI/UX with animations and sound visualizations.

## 📜 License

This project is licensed under the MIT License. Feel free to use and modify it as you like. 😊

## 🙌 Acknowledgments

- **[Flask](https://flask.palletsprojects.com/)** - For the lightweight web framework.
- **[Tone.js](https://tonejs.github.io/)** - For creating and managing audio.

---

🎵 **Enjoy making music!** 🎶

