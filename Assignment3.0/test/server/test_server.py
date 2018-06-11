from src.controller.svn_parser.parse_list import ParseList
import src.data_api.api as movie_api
import unittest
import os



class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = movie_api.app.test_client()
        self.app.testing = True



if __name__ == '__main__':
    unittest.main()
