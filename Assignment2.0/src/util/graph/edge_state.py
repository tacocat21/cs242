from src.util.graph.node import Node

"""
    Abstract class to represent the edges in the graph
"""


class EdgeState:
    """
        Constructor.
        :param node_1 - if edge is directed, node_1 is the source node. Otherwise it does not matter order of the node
        :param node_2 - if edge is directed, node_2 is the sink node. Otherwise it does not matter order of the node
        :param directed - if true, the edge is directed. Otherwise, the edge is undirected
        :param weight - weight of the edge
        :param status - status of the edge. Used for graph traversal, flow network, etc.
        :raise RunTimeError - if node_1 or node_2 is of NoneType
        :raise TypeError - raise TypeError if directed parameter is not a boolean or the node parameter is a not a Node Type
    """

    def __init__(self, node_1, node_2, directed=False, weight=None, status=None):
        if node_1 is None or node_2 is None:
            raise RuntimeError('node object is None')
        if not type(directed) is bool:
            raise TypeError('directed parameter is not a BooleanType')
        if not isinstance(node_1, Node) or not isinstance(node_2, Node):
            raise TypeError('vector parameters is not a Node type')
        self.directed = directed
        self.weight = weight
        self.vertices = (node_1, node_2)
        self.status = status

    """
        Sets the weight of the edge
        :param weight - set the edge's weight to this value
    """

    def set_weight(self, weight):
        self.weight = weight

    """
        :return the weight of the edge
    """

    def get_weight(self):
        return self.weight

    """
        Sets the status of the edge
        :param status - set the edge's status to this value
    """

    def set_status(self, status):
        self.status = status

    """
        :return the status of the edge
    """

    def get_status(self):
        return self.status

    """
        :return a tuple of vectors. If the vector is directed, then the tuple corresponds to
        (source vector, sink vector)
    """

    def get_vertices(self):
        return self.vertices

    """
        :return true if the edge is directed
    """

    def is_directed(self):
        return self.directed
