from unittest import TestCase
from bs4 import BeautifulSoup
import json

from src.crawler.wikipedia_movie_crawler import WikipediaMovieCrawler


class TestWikipediaMovieCrawler(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.crawler = WikipediaMovieCrawler()
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/Tom_Cruise')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/Morgan_Freeman')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/Ice_Cube')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/The_Dark_Knight_(film)')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/The_Outsiders_(film)')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/The_Lego_Movie')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/The_Dark_Knight_Rises')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/Looney_Tunes:_Back_in_Action')


    def test_get_actor_data_as_json(self):
        json_result = self.crawler.get_actor_data_as_json()
        try:
            self.assertDictEqual(json.loads(json_result), self.crawler.get_actor_data())
        except:
            self.fail()


    def test_get_movie_data_as_json(self):
        json_result = self.crawler.get_movie_data_as_json()
        try:
            self.assertDictEqual(json.loads(json_result), self.crawler.get_movie_data())
        except:
            self.fail()

    def test_is_movie(self):
        self.assertTrue(self.crawler.is_movie(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/The_Dark_Knight_(film)')))
        self.assertTrue(self.crawler.is_movie(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/The_Lego_Movie')))
        self.assertTrue(self.crawler.is_movie(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/The_Outsiders_(film)')))
        self.assertTrue(self.crawler.is_movie(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/Looney_Tunes:_Back_in_Action')))
        self.assertFalse(self.crawler.is_movie(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/Morgan_Freeman')))

    def test_is_actor(self):
        self.assertTrue(self.crawler.is_actor(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/Morgan_Freeman')))
        self.assertTrue(self.crawler.is_actor(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/Tom_Cruise')))
        self.assertTrue(self.crawler.is_actor(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/Ice_Cube')))

    def test_get_cached_soup_object(self):
        self.assertTrue(isinstance(self.crawler.get_cached_soup_object(
            'https://en.wikipedia.org/wiki/The_Dark_Knight_(film)'),
            BeautifulSoup))
        self.assertTrue(isinstance(self.crawler.get_cached_soup_object(
            'https://en.wikipedia.org/wiki/Morgan_Freeman'),
            BeautifulSoup))
        self.assertTrue(self.crawler.get_cached_soup_object('') is None)

    def test_get_title(self):
        self.assertEqual(
            self.crawler.get_title(
                self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/Morgan_Freeman')),
            'Morgan Freeman')
        self.assertEqual(
            self.crawler.get_title(
                self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/The_Dark_Knight_(film)')),
            'The Dark Knight (film)')

    def test_parse_movie(self):
        outsiders_result = self.crawler.parse_movie(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/The_Outsiders_(film)'))
        self.assertEqual(outsiders_result['gross_value'], 33.7 * 10**6)
        self.assertEqual(outsiders_result['release_date'], '1983-03-25')
        self.assertEqual(outsiders_result['actors'], ['C. Thomas Howell', 'Matt Dillon',
                                                       'Ralph Macchio', 'Patrick Swayze',
                                                       'Rob Lowe', 'Diane Lane', 'Emilio Estevez',
                                                       'Tom Cruise', 'Leif Garrett'])
        lego_movie_result = self.crawler.parse_movie(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/The_Lego_Movie'))
        self.assertEqual(lego_movie_result['gross_value'], 469.2 * 10**6)
        self.assertEqual(lego_movie_result['release_date'], '2014-02-01')
        self.assertEqual(lego_movie_result['actors'], ['Chris Pratt', 'Will Ferrell', 'Elizabeth Banks',
                                                       'Will Arnett', 'Nick Offerman', 'Alison Brie',
                                                       'Charlie Day', 'Liam Neeson', 'Morgan Freeman'])
        dark_knight_rises_result = self.crawler.parse_movie(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/The_Dark_Knight_Rises'))
        self.assertEqual(dark_knight_rises_result['gross_value'], 1.085 * 10**9)
        self.assertEqual(dark_knight_rises_result['release_date'], '2012-07-16')
        self.assertEqual(dark_knight_rises_result['actors'], ['Christian Bale', 'Michael Caine', 'Gary Oldman',
                                                       'Anne Hathaway', 'Tom Hardy', 'Marion Cotillard',
                                                       'Joseph Gordon-Levitt', 'Morgan Freeman'])

    def test_parse_actor(self):
        tom_cruise_result = self.crawler.parse_actor(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/Tom_Cruise'))
        self.assertEqual(tom_cruise_result['birth_day'], '1962-07-03')
        tom_cruise_movies = tom_cruise_result['movies']
        self.assertEqual(len(tom_cruise_movies), 39)
        self.assertEqual(tom_cruise_movies[0], 'Taps')
        self.assertEqual(tom_cruise_movies[10], 'Days of Thunder')
        self.assertEqual(tom_cruise_movies[38], 'The Mummy')
        self.assertEqual(tom_cruise_result['gross_value'], 8.2*10**9)

        morgan_freeman_result = self.crawler.parse_actor(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/Morgan_Freeman'))
        self.assertEqual(morgan_freeman_result['birth_day'], '1937-06-01')
        morgan_freeman_movies = morgan_freeman_result['movies']
        self.assertEqual(len(morgan_freeman_movies), 48)
        self.assertEqual(morgan_freeman_movies[0], 'Brubaker')
        self.assertEqual(morgan_freeman_movies[5], 'Lean on Me')
        self.assertEqual(morgan_freeman_result['gross_value'], 4.316*10**9)

        ice_cube_result = self.crawler.parse_actor(
            self.crawler.get_cached_soup_object('https://en.wikipedia.org/wiki/Ice_Cube'))
        self.assertEqual(ice_cube_result['birth_day'], '1969-06-15')
        ice_cube_movies = ice_cube_result['movies']
        self.assertEqual(len(ice_cube_movies), 39)
        self.assertEqual(ice_cube_movies[0], 'Boyz n the Hood')
        self.assertEqual(ice_cube_movies[5], 'Friday')
        self.assertEqual(ice_cube_result['gross_value'], 0)