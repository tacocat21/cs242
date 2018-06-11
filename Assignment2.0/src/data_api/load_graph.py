from src.util.graph.undirectedgraph import UndirectedGraph
import json

"""
    Helper class to create a graph from a json file
"""
class LoadGraph:
    def __init__(self, json_file_name):
        self.graph = UndirectedGraph()
        self.movie_nodes = {}
        self.actor_nodes = {}
        with open(json_file_name, 'r') as json_data:
            data = json.load(json_data)
            actor_dict = data[0]
            movie_dict = data[1]
            # Adds the actors to the graph and actor list
            for actor in actor_dict:
                actor_node = self.graph.add_node(actor_dict[actor])
                self.actor_nodes[actor] = actor_node

            # Adds the movies to the graph and movies list
            for movie in movie_dict:
                movie_node = self.graph.add_node(movie_dict[movie])
                self.movie_nodes[movie] = movie_node

            # Adds edges between the actors and the movie nodes
            for actor_name in self.actor_nodes:
                # Get actor node
                actor_node = self.actor_nodes[actor_name]
                # Get movies the actor was involved with
                movie_list = actor_node.get_value()['movies']
                for movie in movie_list:
                    # If there exists a movie node
                    if movie in self.movie_nodes:
                        try:
                            movie_node = self.movie_nodes[movie]
                            movie_node_value = movie_node.get_value()
                            movie_gross = movie_node_value['box_office']
                            idx = movie_node_value['actors'].index(actor_name)
                            movie_gross *= (1 / (2 * (idx + 1)))
                            self.graph.add_edge(actor_node, movie_node, edge_weight=movie_gross)
                        except:
                            continue

            # Adds edges between the actors and the movie nodes
            for movie_name in self.movie_nodes:
                movie_node = self.movie_nodes[movie_name]
                try:
                    movie_node_value = movie_node.get_value()
                    actor_list = movie_node_value['actors']
                    movie_gross = movie_node_value['box_office']
                    for idx in range(len(actor_list)):
                        actor = actor_list[idx]
                        if actor not in self.actor_nodes:
                            continue
                        actor_node = self.actor_nodes[actor]
                        if self.graph.is_adjacent(actor_node, movie_node):
                            continue
                        gross = movie_gross * (1 / (2 * (idx + 1)))
                        self.graph.add_edge(actor_node, movie_node, edge_weight=gross)
                except:
                    continue

    """
        :return the graph
    """
    def get_graph(self):
        return self.graph

    """
        :return the movie nodes
    """
    def get_movie_nodes(self):
        return self.movie_nodes

    """
        :return the actor nodes
    """
    def get_actor_nodes(self):
        return self.actor_nodes

if __name__ == '__main__':
    lg = LoadGraph('../data/data.json')
    graph = lg.get_graph()
