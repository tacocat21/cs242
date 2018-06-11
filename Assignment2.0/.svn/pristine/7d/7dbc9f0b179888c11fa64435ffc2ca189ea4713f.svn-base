from unittest import TestCase

from src.crawler.wikipedia_crawler_data_processor import WikipediaCrawlerDataProcessor
from src.crawler.wikipedia_movie_crawler import WikipediaMovieCrawler


class TestWikipediaCrawlerDataProcessor(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.crawler = WikipediaMovieCrawler()
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/Tom_Cruise')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/Morgan_Freeman')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/George_Clooney')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/Ice_Cube')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/Christian_Bale')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/The_Dark_Knight_(film)')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/The_Outsiders_(film)')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/The_Lego_Movie')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/The_Dark_Knight_Rises')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/Looney_Tunes:_Back_in_Action')
        cls.crawler.acquire_data('https://en.wikipedia.org/wiki/Iron_Man_(2008_film)')
        cls.data_processor = WikipediaCrawlerDataProcessor(cls.crawler.get_actor_data(), cls.crawler.get_movie_data())


    def test_get_movie_gross(self):
        self.assertEqual(self.data_processor.get_movie_gross('The Dark Knight (film)'), 1.005 * 10**9)
        self.assertEqual(self.data_processor.get_movie_gross('The Outsiders (film)'), 33.7 * 10 ** 6)

    def test_get_list_movie_by_actor(self):
        self.assertEqual(len(self.data_processor.get_list_movie_by_actor('Morgan Freeman')), 48)
        self.assertEqual(len(self.data_processor.get_list_movie_by_actor('Tom Cruise')), 39)

    def test_get_actor_list_by_movie(self):
        self.assertEqual(self.data_processor.get_actor_list_by_movie('The Lego Movie'), ['Chris Pratt', 'Will Ferrell', 'Elizabeth Banks',
                                                       'Will Arnett', 'Nick Offerman', 'Alison Brie',
                                                       'Charlie Day', 'Liam Neeson', 'Morgan Freeman'])

    def test_get_top_grossing_actors(self):
        top_gross = self.data_processor.get_top_grossing_actors(2)
        self.assertIn((4.316*10**9, 'Morgan Freeman'), top_gross)
        self.assertIn((1*10**9, 'Christian Bale'), top_gross)

    def test_get_top_oldest_actors(self):
        oldest_actors = self.data_processor.get_top_oldest_actors(2)
        self.assertIn(('1961-05-06', 'George Clooney'), oldest_actors)
        self.assertIn(('1937-06-01', 'Morgan Freeman'), oldest_actors)

    def test_get_movie_list_by_year(self):
        looney_tunes = self.data_processor.get_movie_list_by_year(2003)
        self.assertEqual(looney_tunes, ['Looney Tunes: Back in Action'])
        movies_2008 = self.data_processor.get_movie_list_by_year(2008)
        self.assertIn('Iron Man (2008 film)', movies_2008)
        self.assertIn('The Dark Knight (film)', movies_2008)

    def test_get_actor_by_year(self):
        actors_2012 = self.data_processor.get_actor_by_year(2012)
        self.assertIn('Christian Bale', actors_2012)
        self.assertIn('Morgan Freeman', actors_2012)

    def test_get_graph(self):
        graph = self.data_processor.get_graph()
        self.assertEqual(graph.get_num_nodes(), 11)
        christian_bale_node = self.data_processor.actor_mapping['Christian Bale']
        morgan_freeman_node = self.data_processor.actor_mapping['Morgan Freeman']
        lego_movie_node = self.data_processor.movie_mapping['The Lego Movie']
        dark_knight_film = self.data_processor.movie_mapping['The Dark Knight Rises']

        self.assertTrue(graph.is_adjacent(morgan_freeman_node, lego_movie_node))
        self.assertTrue(graph.is_adjacent(morgan_freeman_node, dark_knight_film))
        self.assertFalse(graph.is_adjacent(morgan_freeman_node, christian_bale_node))
        self.assertNotEqual(graph.get_edge_weight(morgan_freeman_node, dark_knight_film),
                            graph.get_edge_weight(christian_bale_node, dark_knight_film))