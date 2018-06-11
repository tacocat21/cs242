from src.data_api.data_handler import DataHandler
import src.data_api.api as movie_api
import unittest
import json

"""
    Unit test for the API
"""


class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = movie_api.app.test_client()
        self.app.testing = True

    def test_get_all_actors(self):
        result = self.app.get('/api/actors')
        result_dict = json.loads(result.data.decode('ascii'))
        self.assertTrue('Bruce Willis' in result_dict)
        self.assertTrue('Charlotte Rampling' in result_dict)
        self.assertTrue('James Mason' in result_dict)
        self.assertEqual(result.status_code, 200)

    def test_get_specific_actor(self):
        result = self.app.get('/api/actors/Bruce_Willis')
        result_dict = json.loads(result.data.decode('ascii'))

        self.assertEqual(result_dict['Bruce Willis']['age'], 61)
        self.assertEqual(result_dict['Bruce Willis']['total_gross'], 562709189)
        self.assertEqual(result_dict['Bruce Willis']['name'], 'Bruce Willis')
        self.assertEqual(result.status_code, 200)

    def test_get_actor_by_attribute(self):
        result = self.app.get('/api/actors?age=71')
        result_dict = json.loads(result.data.decode('ascii'))

        self.assertTrue('Charlotte Rampling' in result_dict)
        self.assertTrue('Helen Mirren' in result_dict)
        self.assertEqual(len(result_dict), 2)

    def test_get_actor_not_found(self):
        result = self.app.get('/api/actors/Not_Found')
        self.assertEqual(result.status_code, 404)

    def test_put_actor(self):
        put_result = self.app.put('/api/actors/Bruce_Willis',
                                  data=json.dumps({'age': 10}),
                                  content_type='applications/json')
        self.assertEqual(put_result.status_code, 200)

        get_result = self.app.get('/api/actors/Bruce_Willis')
        get_result_dict = json.loads(get_result.data.decode('ascii'))
        self.assertEqual(get_result_dict['Bruce Willis']['age'], 10)

        # undo changes so it won't mess up the other tests
        self.app.put('/api/actors/Bruce_Willis',
                     data=json.dumps({'age': 61}),
                     content_type='applications/json')

    def test_put_not_found(self):
        put_result = self.app.put('/api/actors/Morgan_Freeman',
                                  data=json.dumps({'age': 70,
                                                   'name': 'Morgan Freeman'}),
                                  content_type='applications/json')
        self.assertEqual(put_result.status_code, 404)

        get_result = self.app.get('/api/actors/Morgan_Freeman')
        self.assertEqual(get_result.status_code, 404)

    def test_post_actor(self):
        post_result = self.app.post('/api/actors',
                                    data=json.dumps({'age': 70,
                                                     'name': 'Morgan Freeman'}),
                                    content_type='applications/json')
        self.assertEqual(post_result.status_code, 201)

        get_result = self.app.get('/api/actors/Morgan_Freeman')
        get_result_dict = json.loads(get_result.data.decode('ascii'))
        self.assertEqual(get_result.status_code, 200)
        self.assertEqual(get_result_dict['Morgan Freeman']['age'], 70)
        self.assertEqual(get_result_dict['Morgan Freeman']['name'], 'Morgan Freeman')

        # Undo changes
        self.app.delete('/api/actors/Morgan_Freeman')

    def test_post_actor_fail(self):
        post_result = self.app.post('/api/actors',
                                    data=json.dumps({'age': 70,
                                                     'name': 'Morgan Freeman'}),
                                    content_type='applications/json')
        self.assertEqual(post_result.status_code, 201)
        post_result = self.app.post('/api/actors',
                                    data=json.dumps({'age': 50,
                                                     'name': 'Morgan Freeman'}),
                                    content_type='applications/json')
        self.assertEqual(post_result.status_code, 400)

        get_result = self.app.get('/api/actors/Morgan_Freeman')
        get_result_dict = json.loads(get_result.data.decode('ascii'))
        self.assertEqual(get_result.status_code, 200)
        self.assertEqual(get_result_dict['Morgan Freeman']['age'], 70)
        self.assertEqual(get_result_dict['Morgan Freeman']['name'], 'Morgan Freeman')

        # Undo changes
        self.app.delete('/api/actors/Morgan_Freeman')

    def test_delete_actor(self):
        get_result = self.app.get('/api/actors/Charlotte_Rampling')
        self.assertEqual(get_result.status_code, 200)
        delete_result = self.app.delete('/api/actors/Charlotte_Rampling')
        self.assertEqual(delete_result.status_code, 200)
        get_result = self.app.get('/api/actors/Charlotte_Rampling')
        self.assertEqual(get_result.status_code, 404)
        delete_result = self.app.delete('/api/actors/Charlotte_Rampling')
        self.assertEqual(delete_result.status_code, 404)

        # Undo changes
        self.app.post('/api/actors',
                      data=json.dumps({"json_class": "Actor",
                                       "name": "Charlotte Rampling",
                                       "age": 71,
                                       "total_gross": 0}),
                      content_type='applications/json')

    def test_get_all_movies(self):
        result = self.app.get('/api/movies')
        result_dict = json.loads(result.data.decode('ascii'))
        self.assertTrue('The Verdict' in result_dict)
        self.assertTrue('Planet Terror' in result_dict)
        self.assertTrue('Exodus' in result_dict)
        self.assertEqual(result.status_code, 200)

    def test_get_specific_movie(self):
        result = self.app.get('/api/movies/Planet_Terror')
        result_dict = json.loads(result.data.decode('ascii'))

        self.assertEqual(result_dict['Planet Terror']['year'], 2007)
        self.assertEqual(result_dict['Planet Terror']['box_office'], 10)
        self.assertEqual(result_dict['Planet Terror']['name'], 'Planet Terror')
        self.assertEqual(result.status_code, 200)

    def test_get_movie_by_attribute(self):
        result = self.app.get('/api/movies?year=2007')
        result_dict = json.loads(result.data.decode('ascii'))

        self.assertTrue('The Astronaut Farmer' in result_dict)
        self.assertTrue('Planet Terror' in result_dict)
        self.assertEqual(len(result_dict), 2)

    def test_get_movie_not_found(self):
        result = self.app.get('/api/movies/Not_Found')
        self.assertEqual(result.status_code, 404)

    def test_put_movie(self):
        put_result = self.app.put('/api/movies/The_Astronaut_Farmer',
                                  data=json.dumps({'year': 3000}),
                                  content_type='applications/json')
        self.assertEqual(put_result.status_code, 200)

        get_result = self.app.get('/api/movies/The_Astronaut_Farmer')
        get_result_dict = json.loads(get_result.data.decode('ascii'))
        self.assertEqual(get_result_dict['The Astronaut Farmer']['year'], 3000)

        # Undo changes
        self.app.put('/api/movies/The_Astronaut_Farmer',
                     data=json.dumps({'year': 2007}),
                     content_type='applications/json')

    def test_put_movie_not_found(self):
        put_result = self.app.put('/api/movies/The_Lego_Movie',
                                  data=json.dumps({'year': 2015,
                                                   'name': 'The Lego Movie'}),
                                  content_type='applications/json')
        self.assertEqual(put_result.status_code, 404)

        get_result = self.app.get('/api/movies/The_Lego_Movie')
        self.assertEqual(get_result.status_code, 404)

    def test_post_movie(self):
        post_result = self.app.post('/api/movies',
                                    data=json.dumps({'year': 2015,
                                                     'name': 'The Lego Movie',
                                                     'box_office': 5}),
                                    content_type='applications/json')
        self.assertEqual(post_result.status_code, 201)

        get_result = self.app.get('/api/movies/The_Lego_Movie')
        get_result_dict = json.loads(get_result.data.decode('ascii'))
        self.assertEqual(get_result.status_code, 200)
        self.assertEqual(get_result_dict['The Lego Movie']['year'], 2015)
        self.assertEqual(get_result_dict['The Lego Movie']['box_office'], 5)
        self.assertEqual(get_result_dict['The Lego Movie']['name'], 'The Lego Movie')

        # Undo changes
        self.app.delete('/api/movies/The_Lego_Movie')

    def test_post_movie_fail(self):
        post_result = self.app.post('/api/movies',
                                    data=json.dumps({'year': 2015,
                                                     'name': 'The Lego Movie',
                                                     'box_office': 5}),
                                    content_type='applications/json')
        self.assertEqual(post_result.status_code, 201)
        post_result = self.app.post('/api/movies',
                                    data=json.dumps({'year': 2015,
                                                     'name': 'The Lego Movie',
                                                     'box_office': 5}),
                                    content_type='applications/json')
        self.assertEqual(post_result.status_code, 400)

        get_result = self.app.get('/api/movies/The_Lego_Movie')
        get_result_dict = json.loads(get_result.data.decode('ascii'))
        self.assertEqual(get_result.status_code, 200)
        self.assertEqual(get_result_dict['The Lego Movie']['year'], 2015)
        self.assertEqual(get_result_dict['The Lego Movie']['box_office'], 5)
        self.assertEqual(get_result_dict['The Lego Movie']['name'], 'The Lego Movie')

        self.app.delete('/api/movies/The_Lego_Movie')

    def test_delete_actor(self):
        get_result = self.app.get('/api/movies/The_Verdict')
        self.assertEqual(get_result.status_code, 200)
        delete_result = self.app.delete('/api/movies/The_Verdict')
        self.assertEqual(delete_result.status_code, 200)
        get_result = self.app.get('/api/movies/The_Verdict')
        self.assertEqual(get_result.status_code, 404)
        delete_result = self.app.delete('/api/movies/The_Verdict')
        self.assertEqual(delete_result.status_code, 404)
        self.app.post('/api/movies',
                      data=json.dumps({
                          "json_class": "Movie",
                          "name": "The Verdict",
                          "wiki_page": "https://en.wikipedia.org/wiki/The_Verdict",
                          "box_office": 53977250,
                          "year": 1982}),
                      content_type='applications/json')


if __name__ == '__main__':
    unittest.main()
