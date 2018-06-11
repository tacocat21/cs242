from src.util.graph.node import Node
from src.util.graph.edge_state import EdgeState
from queue import Queue

"""
    Undirected UndirectedGraph abstract data structure
"""
class UndirectedGraph:
    """
        Constructor
        :param directed - if true, the graph is directed. By default the graph is undirected
        :raise TypeError - raise TypeError if directed parameter is not a boolean type
    """
    def __init__(self):
        self.num_nodes = 0
        self.nodes = []

    """
        :param node_1 - first node to compare
        :param node_2 - second node to compare
        :return return true if there exists an edge between the nodes
        :raise RuntimeError if node_1 is not in graph
    """
    def is_adjacent(self, node_1, node_2):
        if not isinstance(node_1, Node) or not isinstance(node_2, Node):
            raise TypeError('node paramaters are not instances of the Node object')
        return node_1.is_adjacent(node_2)

    """
        Adds a node to the graph
        :param value - value of the new node to add
        :return node added to the graph
    """
    def add_node(self, value):
        self.num_nodes += 1
        new_node = Node(value)
        self.nodes.append(new_node)
        return new_node

    """
        :return number of nodes in the graph
    """
    def get_num_nodes(self):
        return self.num_nodes

    """
        :param id - id to compare
        :return node with the same id
    """
    def get_node_by_id(self, id):
        for node in self.nodes:
            if node.get_id() == id:
                return node
        return None

    """
        :return the node removed from the graph
    """
    def remove_node(self, target_node):
        for idx in range(len(self.nodes)):
            if self.nodes[idx].equals(target_node):
                self.nodes.pop(idx)
                target_node.clear_neighbor()
                self.num_nodes -= 1
                return True
        return False

    """
        Adds an edge between node_1 and node_2. If graph is directed, node_1 is a source node and node_2 is a sink node
        :param node_1 - If graph is directed, node_1 is a source node
        :param node_2 - If graph is directed, node_2 is a sink node
        :param edge_weight - weight of the edge
        :param edge_status - status of the edge. Used for graph traversals, flow networks, etc.
        :raise TypeError if a node parameter is not an instance of a Node object
        :return the new added edge connecting node_1 and node_2
    """
    def add_edge(self, node_1, node_2, edge_weight=None, edge_status=None):
        if not isinstance(node_1, Node) or not isinstance(node_2, Node):
            raise TypeError('node parameters are not an instance of Node object')
        edge_state = EdgeState(node_1, node_2, directed=False, weight=edge_weight, status=edge_status)
        node_1.add_neighbor(node_2, edge_state)
        node_2.add_neighbor(node_1, edge_state)


    """
        Removes edge between node_1 and node_2
        :param node_1 - If graph is directed, node_1 is a source node. Otherwise, it doesn't matter
        :param node_2 - If graph is directed, node_2 is a sink node. Otherwise, it doesn't matter
    """
    def remove_edge(self, node_1, node_2):
        node_1.remove_neighbor(node_2)
        node_2.remove_neighbor(node_1)


    """
        :param node - node to get value
        :return the node value
    """
    def get_node_value(self, node):
        return node.get_value()

    """
        Set the node's value to value
        :param node - target node to set value
        :param value - value to set node's value
    """
    def set_node_value(self, node, value):
        node.set_value(value)

    """
        Get the edge weight connecting node_1 and node_2
        :param node_1 - first node
        :param node_2 - second node
        :return return edge weight between the two nodes. If edge does not exist, return None
    """
    def get_edge_weight(self, node_1, node_2):
        for node in self.nodes:
            if node.equals(node_1):
                return node.get_edge_weight(node_2)

    """
        Set the edge value connecting node_1 and node_2 to value
    """
    def set_edge_weight(self, node_1, node_2, value):
        for node in self.nodes:
            if node.equals(node_1):
                edge_state = node.get_edge_state(node_2)
                edge_state.set_weight(value)

    """
        :return a list of nodes in the graph
    """
    def get_nodes(self):
        return self.nodes

    """
        :param source_node - root node to start with
        :return the shortest path from source_node if every edge length is 1. If node is not in the return dictionary,
        the node is unreachable from the source_node
    """
    def shortest_path_edge_length_1(self, source_node):
        if len(source_node.get_neighbor_list()) == 0:
            return None
        queue = Queue()
        dist = {source_node:0}
        queue.put(source_node)

        while not queue.empty():
            current_node = queue.get()
            adjacent_node_list = current_node.get_neighbor_list()
            current_dist = dist[current_node]
            for adjacent_node_pair in adjacent_node_list:
                adjacent_node = adjacent_node_pair[0]
                if adjacent_node not in dist:
                    dist[adjacent_node] = current_dist + 1
                    queue.put(adjacent_node)
        return dist


