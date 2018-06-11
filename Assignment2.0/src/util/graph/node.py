"""
    Vertex of the Graph data structure
"""


class Node:
    __node_id = 0

    """
        Constructor
        :param value - value of the node
    """

    def __init__(self, value):
        self.id = Node.__node_id
        Node.__node_id += 1
        self.neighbor_list = []  # list of tuple (neighbor node, edge_state)
        self.value = value

    """
        :return the value of the node
    """

    def get_value(self):
        return self.value

    """
        sets the value of the node
    """

    def set_value(self, value):
        self.value = value

    """
        :return a list of tuple of (neighbor node, edge_state) this node connects to
    """

    def get_neighbor_list(self):
        return self.neighbor_list

    """
        adds a node to the neighbor list
        :param neighbor_node - node to add as neighbor to the vector
        :param edge_state - edge state of the edge between the two nodes
        :raise TypeError if neighbor_node is not an EdgeState or neighbor_node is not a Node
    """

    def add_neighbor(self, neighbor_node, edge_state):
        if not isinstance(neighbor_node, Node):
            raise TypeError("neighbor_node parameter is not an instance of Node object")
        self.neighbor_list.append((neighbor_node, edge_state))

    """
        remove the edge connecting to the vertex object
        :param node - node to remove from the neighbor list
        :return true if the node is removed from the neighbor list
        :raise RuntimeError - raises RuntimeError if node is of NoneType
    """

    def remove_neighbor(self, node):
        if node is None:
            raise RuntimeError('node object is of NoneType')
        for idx in range(len(self.neighbor_list)):
            if self.neighbor_list[idx][0].equals(node):
                self.neighbor_list.pop(idx)
                return True
        return False

    """
        :param other_node - other node that this node connects to
        :return edge state between the two nodes. If edge state does not exist, return None
    """

    def get_edge_state(self, other_node):
        if not isinstance(other_node, Node):
            return None
        for (neighbor_node, edge_state) in self.neighbor_list:
            if neighbor_node.equals(other_node):
                return edge_state
        return None

    """
        :param other_node - node to get edge value
        :return edge weight between this node and other_node
    """

    def get_edge_weight(self, other_node):
        edge_state = self.get_edge_state(other_node)
        if edge_state is None:
            return None
        return edge_state.get_weight()

    """
        :param node - node to see if adjacent
        :return true if the vertex parameter is adjacent to this vector object
    """

    def is_adjacent(self, node):
        if node is None or not isinstance(node, Node):
            return False
        for node_tuple in self.neighbor_list:
            if node_tuple[0].equals(node):
                return True
        return False

    """
        :param node - node to compare to
        :return true if node has the same id as this node
    """

    def equals(self, node):
        if node is None or not isinstance(node, Node):
            return False
        if node.get_id() == self.id:
            return True
        return False

    """
        :return node's unique id
    """

    def get_id(self):
        return self.id

    """
        removes edges that connects to this node
        :raise RuntimeError from the remove_neighbor() function
    """

    def clear_neighbor(self):
        for (node, edge_state) in self.neighbor_list:
            node.remove_neighbor(self)
        self.neighbor_list = []
