from unittest import TestCase
from src.util.graph.edge_state import EdgeState
from src.util.graph.node import Node


class TestEdgeState(TestCase):
    @classmethod
    def setUp(cls):
        cls.node_1 = Node(1)
        cls.node_2 = Node(2)
        cls.edge_state = EdgeState(cls.node_1, cls.node_2, directed=False, weight='weight', status='status')

    def test_set_weight(self):
        self.assertEqual(self.edge_state.get_weight(), 'weight')
        self.edge_state.set_weight('new weight')
        self.assertEqual(self.edge_state.get_weight(), 'new weight')

    def test_get_weight(self):
        self.assertEqual(self.edge_state.get_weight(), 'weight')

    def test_set_status(self):
        self.assertEqual(self.edge_state.get_status(), 'status')
        self.edge_state.set_status('new status')
        self.assertEqual(self.edge_state.get_status(), 'new status')

    def test_get_status(self):
        self.assertEqual(self.edge_state.get_status(), 'status')

    def test_get_vertices(self):
        self.assertEqual((self.node_1, self.node_2), self.edge_state.get_vertices())

    def test_is_directed(self):
        self.assertFalse(self.edge_state.is_directed())
