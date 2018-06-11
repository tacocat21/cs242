
from src.data_api.load_graph import LoadGraph
import matplotlib.pyplot as plt

class DataAnalysis:
    def __init__(self, graph):
        self.graph = graph

    """
        Iterate through the actor nodes in the graph and saves a text file of the number of actors
        the actor has a movie in common. The data is saved to actor_hub.txt
    """
    def get_list_most_connections(self):
        nodes = self.graph.get_nodes()
        actor_list = []
        for node in nodes:
            node_value = node.get_value()
            num_connections = 0
            connected_actor = {node_value['name']: True}
            # checks if node is an actor
            if node_value['json_class'] == 'Actor':
                # get the movie nodes the actor is adjacent to
                neighbor_list = node.get_neighbor_list()
                for movie_neighbor_pair in neighbor_list:
                    movie_node = movie_neighbor_pair[0]
                    for actor_neighbor_pair in movie_node.get_neighbor_list():
                        actor = actor_neighbor_pair[0].get_value()
                        # increment the number of actors the actor has common connection
                        if actor['name'] not in connected_actor:
                            connected_actor[actor['name']] = True
                            num_connections += 1
                actor_list.append((node_value['name'], num_connections))
        actor_list.sort(key=lambda tup: tup[1], reverse=True)
        with open('actor_hub.txt', 'w') as result:
            for actor in actor_list:
                result.write(actor[0] + ' ' + str(actor[1]) + '\n')

    """
        Iterates through the actor nodes in the graph and creates a graph of gross value vs. age. Graph
        is saved to wealth_distribution.png
    """
    def get_gross_by_age_group(self):
        nodes = self.graph.get_nodes()
        begin_age = 15
        wealth_dist = [0 for age in range(begin_age, 101)]
        for node in nodes:
            node_value = node.get_value()
            if node_value['json_class'] == 'Actor':
                age = node_value['age']
                if age == -1:
                    continue
                wealth_dist[age-begin_age] += node_value['total_gross']
        fig, ax = plt.subplots()
        plt.bar([age for age in range(begin_age, 101)], wealth_dist)
        plt.xlabel('Age')
        plt.ylabel('Gross Value')
        plt.title('Gross Value vs. Age')
        fig.tight_layout()
        plt.savefig('wealth_distribution.png')


    """
        Iterates through the actor nodes in the graph and saves a text file of the average number of
        separation between an actor and every other actor. Saves the data to degree_separation.txt
    """
    def six_degree_kevin_bacon(self):
        max_degree = -1
        max_degree_pair = None
        actor_degree_list = []
        total_degree_separation = 0
        total_pairs = 0
        for curr_node in self.graph.get_nodes():
            curr_node_value = curr_node.get_value()
            # do not consider movie nodes
            if curr_node_value['json_class'] == 'Movie':
                continue
            dist = self.graph.shortest_path_edge_length_1(curr_node)
            if dist is None:
                actor_degree_list.append((curr_node_value['name'], 'undefined'))
                continue
            num_connected_node = 0
            sum_dist = 0
            for dist_node in dist:
                # For every actor node, sum the distance between the current node to target node
                if dist_node.get_value()['json_class'] == 'Actor':
                    num_connected_node += 1
                    sum_dist += dist[dist_node]
                    if dist[dist_node] > max_degree:
                        max_degree = dist[dist_node]
                        max_degree_pair = (curr_node_value['name'], dist_node.get_value()['name'])
            # actor node does not connect to any other actor node
            if num_connected_node == 1:
                actor_degree_list.append((curr_node_value['name'], 'undefined'))
                continue
            total_degree_separation += sum_dist
            total_pairs += num_connected_node
            avg_degree = sum_dist/(num_connected_node-1)
            actor_degree_list.append((curr_node_value['name'], avg_degree))
        actor_degree_list.sort(key=lambda tup: tup[0])
        # Save to file
        with open('degree_separation.txt', 'w') as result:
            if max_degree_pair is not None:
                result.write('Max degree of separation: ' + str(max_degree) + ' between ' + max_degree_pair[0] + ' and ' + max_degree_pair[1] + '\n')
            result.write('Total degree of separation: ' + str(total_degree_separation) + ' between ' + str(total_pairs) + ' total pairs\n')
            result.write('Graph avg degree of separation: ' + str(total_degree_separation/total_pairs) + '\n')
            for actor in actor_degree_list:
                result.write(actor[0] + ', avg degree separation ' + str(actor[1]) + '\n')

if __name__ == '__main__':
    lg = LoadGraph('../data/data.json')
    da = DataAnalysis(lg.get_graph())
    da.get_list_most_connections()
    da.get_gross_by_age_group()
    da.six_degree_kevin_bacon()



