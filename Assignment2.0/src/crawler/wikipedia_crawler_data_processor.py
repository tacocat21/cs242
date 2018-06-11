import heapq
from src.util.graph.undirectedgraph import UndirectedGraph

"""
    Class to process the data gathered by the WikipediaMovieCrawler object
    :param actor_data - dictionary of all of the actor's data collected from the WikipediaMovieCrawler
    :param movie_data - dictionary of all of the movie's data collected from the WikipediaMovieCrawler
    :raise TypeError if the inputs are not instances of dict
"""
class WikipediaCrawlerDataProcessor:
    def __init__(self, actor_data, movie_data):
        if not isinstance(actor_data, dict):
            raise TypeError('actor_data parameter is not a dictionary')
        if not isinstance(movie_data, dict):
            raise TypeError('movie_data parameter is not a dictionary')
        self.actor_data = actor_data
        self.movie_data = movie_data
        self.oldest_actors = None
        self.top_grossing_actors = None
        self.graph = None
        # maps name to node
        self.actor_mapping = {}
        self.movie_mapping = {}

    """
        :param movie_name - title of the movie to search
        :return an estimate of the gross value of the movie
    """
    def get_movie_gross(self, movie_name):
        if movie_name in self.movie_data:
            return self.movie_data[movie_name]['gross_value']
        return None

    """
        :param actor_name - name of the actor
        :return a list of the movies the actor was involved in
    """
    def get_list_movie_by_actor(self, actor_name):
        if actor_name in self.actor_data:
            return self.actor_data[actor_name]['movies']
        return None

    """
        :param movie_name - name of the movie
        :return a list of actors in the movie
    """
    def get_actor_list_by_movie(self, movie_name):
        if movie_name in self.movie_data:
            return self.movie_data[movie_name]['actors']

    """
        :param number_actors - number of actors to retrieve
        :return a list of size number_actors of the top grossing actors
    """
    def get_top_grossing_actors(self, number_actors):
        if not isinstance(number_actors, int) or number_actors < 0:
            raise TypeError('number_actors parameter is invalid')
        if not self.top_grossing_actors is None:
            return heapq.nsmallest(number_actors, self.top_grossing_actors)
        self.top_grossing_actors = []
        for actor in self.actor_data:
            actor_value = self.actor_data[actor]['gross_value']
            if actor_value == 0:
                continue
            heapq.heappush(self.top_grossing_actors, (actor_value, actor))
        return heapq.nsmallest(number_actors, self.top_grossing_actors)

    """
        :param number_actors - number of actors to retrieve
        :return a list of size number_actors of the top grossing actors
    """
    def get_top_oldest_actors(self, number_actors):
        if not isinstance(number_actors,int) or number_actors < 0:
            raise TypeError('number_actors parameter is invalid')
        if not self.oldest_actors is None:
            return heapq.nsmallest(number_actors, self.oldest_actors)
        self.oldest_actors = []
        for actor in self.actor_data:
            actor_birthday = self.actor_data[actor]['birth_day']
            if actor_birthday == '0000-00-00':
                continue
            heapq.heappush(self.oldest_actors, (actor_birthday, actor))
        return heapq.nsmallest(number_actors, self.oldest_actors)

    """
        :param year - year to get movie list
        :return a list of movies from year
    """
    def get_movie_list_by_year(self, year):
        year_str = str(year)
        if len(year_str) != 4:
            raise Exception('year parameter input is invalid')
        movie_list = []
        for movie in self.movie_data:
            if self.movie_data[movie]['release_date'][0:4] == year_str:
                movie_list.append(movie)
        return movie_list

    """
        :param year - year to get actor list
        :return a list of actors that acted in that year
    """
    def get_actor_by_year(self, year):
        year_str = str(year)
        if len(year_str) != 4:
            raise Exception('year parameter input is invalid')

        actor_list = []
        for actor in self.actor_data:
            actor_movie = self.actor_data[actor]['movies']
            for movie in actor_movie:
                if movie not in self.movie_data:
                    continue
                if self.movie_data[movie]['release_date'][0:4] == year_str:
                    actor_list.append(actor)
                    break
        return actor_list

    """
        :return an undirected graph representation of the processed data
    """
    def get_graph(self):
        if self.graph is not None:
            return self.graph
        self.graph = UndirectedGraph()
        for actor in self.actor_data:
            self.actor_mapping[actor] = self.graph.add_node((actor, self.actor_data[actor]))

        for movie in self.movie_data:
            self.movie_mapping[movie] = self.graph.add_node((movie, self.movie_data[movie]))

        for actor in self.actor_data:
            movie_list = self.actor_data[actor]['movies']
            for movie in movie_list:
                if movie in self.movie_mapping:
                    try:
                        movie_gross = self.movie_data[movie]['gross_value']
                        idx = self.movie_data[movie]['actors'].index(actor)
                        movie_gross *= (1/(2*(idx+1)))
                        self.graph.add_edge(actor, movie, edge_weight=movie_gross)
                    except:
                        continue

        for movie in self.movie_data:
            actor_list = self.movie_data[movie]['actors']
            movie_gross = self.movie_data[movie]['gross_value']
            for idx in range(len(actor_list)):
                actor = actor_list[idx]
                if actor not in self.actor_mapping:
                    continue
                if self.graph.is_adjacent(self.actor_mapping[actor], self.movie_mapping[movie]):
                    continue
                gross = movie_gross* (1 / (2 * (idx + 1)))
                self.graph.add_edge(self.actor_mapping[actor], self.movie_mapping[movie], edge_weight=gross)

        return self.graph
