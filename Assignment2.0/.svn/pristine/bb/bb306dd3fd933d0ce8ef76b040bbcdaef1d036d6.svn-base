import json

"""
    Controller of the API
"""
class DataHandler:
    def __init__(self, json_file_name):
        self.file_name = json_file_name
        with open(json_file_name, 'r') as json_data:
            data = json.load(json_data)
            self.actors = data[0]
            self.movies = data[1]

    """
        :param name - name of actor. Default to None
        :param age - age of actor. Default to None
        :param total_gross - total_gross of actor. Default to None
        :return a dictionary of actors that meets the name, age, and total_gross criterias. If any parameter
        is None, the parameter will not be considered.
    """
    def get_actor(self, name=None, age=None, total_gross=None):
        if (name is None) and (age is None) and (total_gross is None):
            return self.actors
        result = {}
        for actor in self.actors:
            actor_value = self.actors[actor]
            if (name is not None) and (actor_value['name'] == name):
                result[actor] = actor_value
            elif (age is not None) and (actor_value['age'] == int(age)):
                result[actor] = actor_value
            elif (total_gross is not None) and (actor_value['total_gross'] == int(total_gross)):
                result[actor] = actor_value
        return result

    """
        :param name - name of actor
        :param attribute - attribute of the actor
        :param value - value of the attribute
        :return the status of the request
    """
    def modify_actor(self, name, attribute, value):
        if name not in self.actors:
            return 404
        self.actors[name][attribute] = value
        return 200

    """
        :param name - name of actor
        :param age - age of actor
        :param total_gross - total_gross of actor
        :param movies - movies the actor has been involved
        :return the status code of the request
    """
    def create_actor(self, name, age, total_gross, movies):
        if name in self.actors:
            return 400
        try:
            self.actors[name] = {'json_class':'Actor',
                                 'age':int(age),
                                 'name':name,
                                 'total_gross':int(total_gross),
                                 'movies':movies}
        except:
            return 400
        return 201

    """
        :param actor_name - name of the actor to delete
        :return status code of the request
    """
    def delete_actor(self, actor_name):
        if actor_name not in self.actors:
            return 404
        del self.actors[actor_name]
        return 200

    """
        :param name - name of movie. Default to None
        :param box_office - box_office value of movie. Default to None
        :param year - year movie was released. Default to None
        :return a dictionary of movies that meets the name, box_office, and year criteria. If any parameter
        is None, the parameter will not be considered.
    """
    def get_movie(self, name=None, box_office=None, year=None):
        if (name is None) and (box_office is None) and (year is None):
            return self.movies
        result = {}
        for movie in self.movies:
            movie_value = self.movies[movie]
            if (name is not None) and (movie_value['name'] == name):
                result[movie] = movie_value
            elif (box_office is not None) and (movie_value['box_office'] == int(box_office)):
                result[movie] = movie_value
            elif (year is not None) and (movie_value['year'] == int(year)):
                result[movie] = movie_value
        return result


    """
        :param movie_name - name of movie
        :param box_office - box_office value of movie
        :param year - year movie was released
        :param actors - actors involved in the movie
        :return the status code of the request
    """
    def create_movie(self, movie_name, box_office, year, actors):
        if movie_name in self.movies:
            return 400
        try:
            self.movies[movie_name] = {'json_class':'Movie',
                                        'year':int(year),
                                        'name':movie_name,
                                        'box_office':int(box_office),
                                        'actors':actors}
        except:
            return 400
        return 201


    """
        :param movie_name - name of movie
        :param attribute - attribute of the movie
        :param value - value of the attribute
        :return the status of the request
    """
    def modify_movie(self, movie_name, attribute, value):
        if movie_name not in self.movies:
            return None
        self.movies[movie_name][attribute] = value
        return 200

    """
        :param movie_name - name of the movie to delete
        :return status code of the request
    """
    def delete_movie(self, movie_name):
        if movie_name not in self.movies:
            return 404
        del self.movies[movie_name]
        return 200

    """
        Writes the current state of the actors and movies to file
    """
    def save_state(self):
        with open(self.file_name, 'w') as json_file:
            json_file.write('[\n')
            json_file.write(json.dumps(self.actors))
            json_file.write(',\n')
            json_file.write(json.dumps(self.movies))
            json_file.write('\n]')
