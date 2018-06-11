from unittest import TestCase
from src.util.graph.node import Node
from src.util.graph.edge_state import EdgeState

class TestNode(TestCase):
    @classmethod
    def setUp(self):
        Node.__node_id = 0
        self.node_0 = Node(0)
        self.node_1 = Node(1)
        self.node_2 = Node(2)
        self.node_3 = Node(3)
        self.node_4 = Node(4)
        self.node_5 = Node(5)
        self.edge_state_1_2 = EdgeState(self.node_1, self.node_2, weight='1-2')
        self.node_1.add_neighbor(self.node_2, self.edge_state_1_2)
        self.node_2.add_neighbor(self.node_1, self.edge_state_1_2)

        self.edge_state_2_3 = EdgeState(self.node_2, self.node_3, weight='2-3')
        self.node_2.add_neighbor(self.node_3, self.edge_state_2_3)
        self.node_3.add_neighbor(self.node_2, self.edge_state_2_3)

        self.edge_state_1_3 = EdgeState(self.node_1, self.node_3, weight='1-3')
        self.node_1.add_neighbor(self.node_3, self.edge_state_1_3)
        self.node_3.add_neighbor(self.node_1, self.edge_state_1_3)

    def test_get_id(self):
        self.assertEqual(self.node_1.get_id(), 31)

    def test_get_value(self):
        self.assertEqual(self.node_1.get_value(), 1)
        self.assertEqual(self.node_2.get_value(), 2)

    def test_set_value(self):
        self.node_1.set_value(0)
        self.assertEqual(self.node_1.get_value(), 0)

    def test_get_neighbor_list(self):
        self.assertEqual(self.node_0.get_neighbor_list(), [])
        self.assertEqual(self.node_1.get_neighbor_list(), [(self.node_2, self.edge_state_1_2), (self.node_3, self.edge_state_1_3)])

    def test_add_neighbor(self):
        edge_state_1_4 = EdgeState(self.node_1, self.node_4, weight='1-4')
        self.node_1.add_neighbor(self.node_4, edge_state_1_4)
        self.node_4.add_neighbor(self.node_1, edge_state_1_4)
        self.assertEqual(self.node_1.get_neighbor_list(), [(self.node_2, self.edge_state_1_2), (self.node_3, self.edge_state_1_3),
                                                           (self.node_4, edge_state_1_4)])

    def test_remove_neighbor(self):
        self.assertTrue(self.node_1.remove_neighbor(self.node_2))
        self.assertFalse(self.node_1.remove_neighbor(self.node_0))
        self.assertEqual(self.node_1.get_neighbor_list(), [(self.node_3, self.edge_state_1_3)])

    def test_get_edge_state(self):
        self.assertEqual(self.node_1.get_edge_state(self.node_2), self.edge_state_1_2)

    def test_get_edge_weight(self):
        self.assertEqual(self.node_1.get_edge_weight(self.node_2), '1-2')
        self.assertEqual(self.node_1.get_edge_weight(self.node_0), None)

    def test_is_adjacent(self):
        self.assertTrue(self.node_1.is_adjacent(self.node_2))
        self.assertFalse(self.node_1.is_adjacent(self.node_0))

    def test_equals(self):
        self.assertTrue(self.node_1.equals(self.node_1))
        self.assertFalse(self.node_1.equals(self.node_2))

    def test_clear_neighbor(self):
        self.node_1.clear_neighbor()
        self.assertEqual(self.node_1.get_neighbor_list(), [])
