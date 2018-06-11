from flask import Flask, request, abort
from src.data_api.data_handler import DataHandler

import json

app = Flask(__name__)
# data_path = 'src/data/data.json'
# data_handler = DataHandler(data_path)

test_path = './test_data.json'
data_handler = DataHandler(test_path)

"""
    Save data to file
"""
@app.route('/save', methods=['POST'])
def save_state():
    data_handler.save_state()

"""
    Calls different functions that changes the actor state based on request type
"""
@app.route('/api/actors', methods=['GET', 'POST'])
def actor_route():
    if request.method == 'GET':
        return get_actor(request.args)
    elif request.method == 'POST':
        return post_actor(json.loads(request.data.decode('ascii')))

"""
    Calls different functions that changes the actor state based on request type
"""
@app.route('/api/actors/<actor_name>', methods=['GET', 'PUT', 'DELETE'])
def actor_route_with_registration(actor_name):
    parsed_actor_name = actor_name.replace('_', ' ')
    if request.method == 'GET':
        return get_actor({'name':parsed_actor_name})
    elif request.method == 'PUT':
        return put_actor(parsed_actor_name, json.loads(request.data.decode('ascii')))
    elif request.method == 'DELETE':
        return delete_actor(parsed_actor_name)

"""
    Calls different functions that changes the movie state based on request type
"""
@app.route('/api/movies', methods=['GET', 'POST'])
def movie_route():
    if request.method == 'GET':
        return get_movie(request.args)
    elif request.method == 'POST':
        return post_movie(json.loads(request.data.decode('ascii')))

"""
    Calls different functions that changes the movie state based on request type
"""
@app.route('/api/movies/<movie_name>', methods=['GET', 'PUT', 'DELETE'])
def movie_route_with_registration(movie_name):
    parsed_movie_name = movie_name.replace('_', ' ')
    if request.method == 'GET':
        return get_movie({'name':parsed_movie_name})
    elif request.method == 'PUT':
        return put_movie(parsed_movie_name, json.loads(request.data.decode('ascii')))
    elif request.method == 'DELETE':
        return delete_movie(parsed_movie_name)


"""
    Simple wrapper to call DataHandler.get_actor() function
    :param url_args - dict of the args with the url
"""


def get_actor(url_args):
    name = None
    age = None
    total_gross = None
    if 'name' in url_args:
        name = url_args['name']
    if 'age' in url_args:
        age = url_args['age']
    if 'total_gross' in url_args:
        total_gross = url_args['total_gross']
    result = data_handler.get_actor(name=name, age=age, total_gross=total_gross)
    if len(result) == 0:
        return json.dumps(result), 404
    return json.dumps(result), 200

"""
    Simple wrapper to call DataHandler.create_actor() function
    :param url_args - dict of the args with the url
"""
def post_actor(url_args):
    name = ''
    age = -1
    total_gross = 0
    movies = []
    if 'name' in url_args:
        name = url_args['name']
    if 'age' in url_args:
        age = url_args['age']
    if 'total_gross' in url_args:
        total_gross = url_args['total_gross']
    if 'movies' in  url_args:
        movies = url_args['movies']
    result = data_handler.create_actor(name, age, total_gross, movies)
    if result == 201:
        return json.dumps({'status':result, 'message': 'Successfully created object'}), 201
    return json.dumps({'status':result, 'message': 'Unable to created object'}), result

"""
    Simple wrapper to call DataHandler.modify_actor() function
    :param actor_name - actor name to modify
    :param url_args - dict of the args with the url
"""

def put_actor(actor_name, url_args):
    for key in url_args:
        modify_result = data_handler.modify_actor(actor_name, key, url_args[key])
        if modify_result == 404:
            return json.dumps({'status': 404, 'message': 'Unable to find object'}), 404
    return json.dumps({'status':200, 'message': 'Successfully modified object'})


"""
    Simple wrapper to call DataHandler.delete_actor() function
    :param actor_name - actor name to modify
"""
def delete_actor(actor_name):
    result = data_handler.delete_actor(actor_name)
    if result == 200:
        return json.dumps({'status': result, 'message': 'Successfully deleted object'}), 200
    if result == 404:
        return json.dumps({'status': result, 'message': 'Unable to find object'}), 404

"""
    Simple wrapper to call DataHandler.get_movie() function
    :param url_args - dict of the args with the url
"""
def get_movie(url_args):
    name = None
    year = None
    box_office = None
    if 'name' in url_args:
        name = url_args['name']
    if 'year' in url_args:
        year = url_args['year']
    if 'box_office' in url_args:
        box_office = url_args['box_office']
    result = data_handler.get_movie(name=name, year=year, box_office=box_office)
    if len(result) == 0:
        return json.dumps(result), 404
    return json.dumps(result), 200


"""
    Simple wrapper to call DataHandler.create_movie() function
    :param url_args - dict of the args with the url
"""
def post_movie(url_args):
    name = ''
    year = -1
    box_office = 0
    actors = []
    if 'name' in url_args:
        name = url_args['name']
    if 'year' in url_args:
        year = url_args['year']
    if 'box_office' in url_args:
        box_office = url_args['box_office']
    if 'actors' in url_args:
        actors = url_args['actors']
    result = data_handler.create_movie(name, box_office, year, actors)
    if result == 201:
        return json.dumps({'status':result, 'message': 'Successfully created object'}), 201
    return json.dumps({'status':result, 'message': 'Unable to created object'}), result

"""
    Simple wrapper to call DataHandler.modify_movie() function
    :param movie_name - movie name to modify
    :param url_args - dict of the args with the url
"""
def put_movie(movie_name, url_args):
    for key in url_args:
        modify_result = data_handler.modify_movie(movie_name, key, url_args[key])
        if modify_result is None:
            abort(404)
    return json.dumps({'status':200, 'message': 'Successfully modified object'})

"""
    Simple wrapper to call DataHandler.delete_movie() function
    :param movie_name - movie name to modify
"""
def delete_movie(movie_name):
    result = data_handler.delete_movie(movie_name)
    if result == 200:
        return json.dumps({'status': result, 'message': 'Successfully deleted object'}), 200
    if result == 404:
        return json.dumps({'status': result, 'message': 'Unable to find object'}), 404

