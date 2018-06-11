from src.controller.svn_parser.parse_list import ParseList
import src.data_api.api as movie_api
import unittest
import os



class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = movie_api.app.test_client()
        self.app.testing = True

    def test_get_list(self):
        parse_list = ParseList(os.getcwd() + '/../controller/data/svn_list.xml').parse()
        self.a



if __name__ == '__main__':
    unittest.main()
