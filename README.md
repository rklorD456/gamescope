# GameScope - Game Review Platform

A modern web application for browsing and reviewing games using the RAWG API.

## Features

- Game search and discovery
- Detailed game information
- System requirements
- Game screenshots
- User reviews
- Dark mode support
- Responsive design

## Deployment Instructions

### Local Development

1. Install Python 3.7 or higher
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   python app.py
   ```
4. Visit http://localhost:5000

### Deploying to PythonAnywhere

1. Sign up for a PythonAnywhere account at https://www.pythonanywhere.com/

2. Upload your files:
   - Go to the Files tab
   - Create a new directory for your project
   - Upload all project files

3. Create a virtual environment:
   ```bash
   mkvirtualenv --python=/usr/bin/python3.8 gamescope
   pip install -r requirements.txt
   ```

4. Configure the web app:
   - Go to the Web tab
   - Click "Add a new web app"
   - Choose "Manual configuration"
   - Select Python 3.8
   - Set the path to your virtual environment
   - Set the WSGI configuration file to your wsgi.py

5. Update the WSGI configuration:
   - Click on the WSGI configuration file link
   - Replace the content with the content of your wsgi.py file

6. Set up environment variables:
   - Go to the Web tab
   - Add your RAWG API key to the environment variables

7. Reload your web app

## Project Structure

```
.
├── app.py              # Flask application
├── wsgi.py            # WSGI configuration
├── requirements.txt   # Python dependencies
├── css/              # CSS styles
├── js/               # JavaScript files
└── index.html        # Main page
```

## Environment Variables

- `RAWG_API_KEY`: Your RAWG API key

## License

MIT License 