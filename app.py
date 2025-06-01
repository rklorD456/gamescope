from flask import Flask, send_from_directory, jsonify, request
import requests
import os

app = Flask(__name__, static_folder='.')

RAWG_API_KEY = '3f8c88dd32804bbabf6f07f93c8e0109'
RAWG_API_URL = 'https://api.rawg.io/api/games'

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/game')
def game():
    return send_from_directory('.', 'game.html')

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/api/search')
def search_games():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    try:
        response = requests.get(
            f'{RAWG_API_URL}?key={RAWG_API_KEY}&search={query}&page_size=20&language=en'
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trending')
def trending_games():
    try:
        response = requests.get(
            f'{RAWG_API_URL}?key={RAWG_API_KEY}&ordering=-rating&page_size=6&language=en'
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/game/<int:game_id>')
def game_details(game_id):
    try:
        response = requests.get(f'{RAWG_API_URL}/{game_id}?key={RAWG_API_KEY}&language=en')
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/game/<int:game_id>/screenshots')
def game_screenshots(game_id):
    try:
        response = requests.get(f'{RAWG_API_URL}/{game_id}/screenshots?key={RAWG_API_KEY}&language=en')
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/game/<int:game_id>/recommendations')
def game_recommendations(game_id):
    try:
        response = requests.get(f'{RAWG_API_URL}/{game_id}/suggested?key={RAWG_API_KEY}&page_size=6&language=en')
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/games')
def get_games():
    try:
        # Get filter parameters
        ordering = request.args.get('ordering', '-rating')
        platform = request.args.get('platform')
        genre = request.args.get('genre')
        year = request.args.get('year')
        
        # Build the API URL with filters
        url = f'{RAWG_API_URL}?key={RAWG_API_KEY}&ordering={ordering}&page_size=20&language=en'
        if platform:
            url += f'&platforms={platform}'
        if genre:
            url += f'&genres={genre}'
        if year:
            url += f'&dates={year}-01-01,{year}-12-31'
            
        response = requests.get(url)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/platforms')
def get_platforms():
    try:
        response = requests.get(f'https://api.rawg.io/api/platforms?key={RAWG_API_KEY}&language=en')
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/genres')
def get_genres():
    try:
        response = requests.get(f'https://api.rawg.io/api/genres?key={RAWG_API_KEY}&language=en')
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 