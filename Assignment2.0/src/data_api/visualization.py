import matplotlib.pyplot as plt
import networkx as nx
from src.data_api.load_graph import LoadGraph
import math

"""
    Class to visualize the graph data structure
"""
class Visualization:
    def __init__(self, graph, num_actor=6, num_movie=6):
        self.visual_graph = nx.Graph()
        node_list = graph.get_nodes()
        current_num_actor = 0
        current_num_movie = 0
        self.actor_pos = {}
        self.movie_pos = {}
        self.actor_node_list = []
        self.movie_node_list = []
        self.edge_list = []
        # add nodes
        for node in node_list:
            if current_num_actor == num_actor and current_num_movie == num_movie:
                break
            node_value = node.get_value()
            if node_value['json_class'] == 'Actor' and current_num_actor < num_actor:
                actor_str = node_value['name'] + '\nAge:' + str(node_value['age'])
                self.visual_graph.add_node(actor_str)
                self.actor_node_list.append(actor_str)
                current_num_actor += 1
            elif node_value['json_class'] == 'Movie' and current_num_movie < num_movie:
                movie_str = node_value['name'] + '\n$' + str(node_value['box_office'])
                self.visual_graph.add_node(movie_str)
                self.movie_node_list.append(movie_str)
                current_num_movie += 1

        # add edges
        current_num_movie = 0
        current_num_actor = 0
        for node in node_list:
            if current_num_actor == num_actor and current_num_movie == num_movie:
                break
            node_value = node.get_value()
            if node_value['json_class'] == 'Actor' and current_num_actor < num_actor:
                actor_str = node_value['name'] + '\nAge:' + str(node_value['age'])
                for neighbor_node in node.get_neighbor_list():
                    try:
                        neighbor_value = neighbor_node[0].get_value()
                        neighbor_str = neighbor_value['name'] + '\n$' + str(neighbor_value['box_office'])
                        new_edge = self.visual_graph.add_edge(actor_str, neighbor_str)
                        self.edge_list.append(new_edge)
                        print('added edge')
                    except:
                        continue
                current_num_actor += 1
            elif node_value['json_class'] == 'Movie' and current_num_movie < num_movie:
                current_num_movie += 1

    """
        Display the visualization
    """
    def display(self):
        nx.draw_circular(self.visual_graph, with_labels=True, nodelist=self.actor_node_list, node_size=800,
                         node_color='orange')
        nx.draw_circular(self.visual_graph, with_labels=True, nodelist=self.movie_node_list, node_size=800,
                         node_color='green')
        plt.show()


if __name__ == '__main__':
    lg = LoadGraph('../data/data.json')
    # lg = LoadGraph('../../test/data_api/test_data.json')
    graph = lg.get_graph()
    visual = Visualization(graph, 500, 500)
    visual.display()
