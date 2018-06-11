from bs4 import BeautifulSoup
import json
import logging
import urllib
import re
import queue
import time

class WikipediaMovieCrawler:
    def __init__(self, max_num_movie: int = 130, max_num_actor: int = 250, initial_website: str = 'https://en.wikipedia.org/wiki/Morgan_Freeman') -> object:
        self.max_num_movie = max_num_movie
        self.max_num_actor = max_num_actor
        self.initial_website = initial_website
        self.current_num_movie = 0
        self.current_num_actor = 0
        self.actor = {}
        self.movie = {}
        self.soup_object = {}  # maps url to soup objects
        self.wiki_url = 'https://en.wikipedia.org'
        logging.basicConfig(filename='CrawlerLog.txt', level=logging.DEBUG)
        self.actor_queue = queue.Queue()
        self.movie_queue = queue.Queue()


    """
        Initializes the crawler
    """
    def run(self):
        logging.info('Initializing crawler. initial website is ' + self.initial_website)
        self.acquire_data(self.initial_website)
        start = time.time()
        count = 0
        while self.current_num_movie < self.max_num_movie or self.current_num_actor < self.max_num_actor:
            if self.current_num_movie < self.max_num_movie:
                try:
                    movie_href = self.wiki_url + self.movie_queue.get_nowait()
                    result = self.acquire_data(movie_href)
                    if not result is None:
                        print('acquired ' + movie_href)
                        self.current_num_movie += 1
                        count += 1
                        logging.info('Successfully able to acquire information from ' + movie_href)
                except:
                    pass

            if self.current_num_actor < self.max_num_actor:
                try:
                    actor_href = self.wiki_url + self.actor_queue.get_nowait()
                    result = self.acquire_data(actor_href)
                    if not result is None:
                        print('acquired ' + actor_href)
                        self.current_num_actor += 1
                        count += 1
                        logging.info('Successfully able to acquire information from ' + actor_href)
                except:
                    pass
            if count%5 == 0:
                time.sleep(4)
                count = 1
        end = time.time()
        print('Finished running in ' + str(end-start))
        logging.info('Crawler finished running successfully. Acquired '
                     + str(self.current_num_actor) + ' actors ' +
                     ' and ' + str(self.current_num_movie) + ' movies.')

    """
        :return the actor data gathered from the crawler
    """
    def get_actor_data(self):
        return self.actor

    """
        :return the movie data gathered from the crawler
    """
    def get_movie_data(self):
        return self.movie

    """
        :return the actor data gathered from the crawler as a json
    """
    def get_actor_data_as_json(self):
        return json.dumps(self.actor)

    """
        Saves the actor data to json
    """
    def save_actor_data_json(self):
        with open('actor.json', 'w') as actor_data:
            return json.dumps(self.movie, actor_data)

    """
        :return the movie data gathered from the crawler as a json
    """

    def get_movie_data_as_json(self):
        return json.dumps(self.movie)

    """
        Saves movie data to json
    """
    def save_movie_data_json(self):
        with open('movie.json', 'w') as movie_data:
            return json.dumps(self.movie, movie_data)

    """
        :return the soup object if the crawler already has stored the object before. Otherwise return None
    """

    def get_cached_soup_object(self, url):
        if url in self.soup_object:
            return self.soup_object[url]
        return None

    """
        Given a website url, this function returns data from the page.
        :return website data from the page
    """

    def acquire_data(self, website: 'string'):
        if website in self.soup_object:
            return None
        try:
            r = urllib.request.urlopen(website).read()
            soup = BeautifulSoup(r, "html5lib")
            self.soup_object[website] = soup
            title = self.get_title(soup)
            if self.is_movie(soup):
                data = self.parse_movie(soup)
                self.movie[title] = data
                return data
            elif self.is_actor(soup):
                data = self.parse_actor(soup)
                self.actor[title] = data
                return data
        except Exception as error:
            logging.warning('Unexpected error occured while parsing ' + website + ' Error message: ' + error)
            return None
        logging.debug('Website ' + ' is neither a movie page nor an actor page')
        return None

    """
        :param soup_object - beautifulSoup object
        :return title of the website
    """

    def get_title(self, soup_object: BeautifulSoup):
        if not isinstance(soup_object, BeautifulSoup):
            return None
        return soup_object.title.string.replace(' - Wikipedia', '')

    """
        :param soup_object - beautifulSoup object
        :return true if the soup_object refers to a movie's website
    """

    def is_movie(self, soup_object: BeautifulSoup) -> bool:
        try:
            # get table row html
            side_table_content = soup_object.body.find('div', id='content') \
                .find('div', id='bodyContent') \
                .find('div', id='mw-content-text') \
                .find_all('table')
            for table in side_table_content:
                table_header_list = table.find_all('th', text='Directed by')
                if len(table_header_list) != 0:
                    return True
            return False
        except Exception as error:
            return False

    """
        :param soup_object - beautifulSoup object
        :return true if the soup_object refers to an actor's website
    """

    def is_actor(self, soup_object: BeautifulSoup):
        try:
            # get table row html
            side_table_content = soup_object.body.find('div', id='content') \
                .find('div', id='bodyContent') \
                .find('div', id='mw-content-text') \
                .find_all('table')
            for table in side_table_content:
                table_header_list = table.find_all('th', text='Born')
                if len(table_header_list) != 0:
                    return True
            return False
        except Exception as error:
            return False

    """
        :param soup_object for an actor
        :return parsed information from the soup_object
    """
    def parse_actor(self, actor_soup_object: BeautifulSoup) -> dict:
        result = {}
        side_table_content = actor_soup_object.body.find('div', id='content') \
            .find('div', id='bodyContent') \
            .find('div', id='mw-content-text') \
            .find_all('table', class_='infobox biography vcard')
        result['birth_day'] = self.get_actor_birth_day(side_table_content)
        result['movies'] = self.get_actor_filmography(actor_soup_object)
        result['gross_value'] = self.get_actor_gross_value(actor_soup_object)
        return result

    """
        :return an estimate of the gross value. Since it is difficult to find the actual gross value
        by parsing the website, the value returns the max gross value
    """
    def get_actor_gross_value(self, actor_soup_object: BeautifulSoup):
        gross_value = 0
        try:
            body_content = actor_soup_object.body.find('div', id='content') \
                            .find('div', id='bodyContent')\
                            .find('div', id='mw-content-text')
            possible_gross_values = body_content \
                            .find_all(text=re.compile('[g|G]ross'), recursive=True)
            for gross in possible_gross_values:
                gross_value = max(self.get_max_gross_value(gross.string), gross_value)
            return gross_value
        except Exception as error:
            logging.debug('Unable to obtain accurate gross value. Error message: ' + error)
            return gross_value

    """
        :return max gross value found on the website
    """
    def get_max_gross_value(self, gross_string: str) -> int:
        split_string = gross_string.split()
        result = 0
        for idx in range(len(split_string)):
            try:
                if '$' in split_string[idx]:
                    value = float(split_string[idx][1:])
                    if idx < len(split_string)-1:
                        if 'million' in split_string[idx+1]:
                            value*= 10**6
                        elif 'billion' in split_string[idx+1]:
                            value*= 10**9
                    result = max(result, value)
            except:
                continue
        return result


    """
        :side_table_content - beautiful soup object referencing the side table in the actor's page
        :return a string of the actor's birthday
    """
    def get_actor_birth_day(self, side_table_content):
        try:
            for table in side_table_content:
                born_string = table.find(string='Born')
                parent = born_string.find_parent('tr')
                birth_day = parent.find('span', text=re.compile('.-[0-9][0-9]-.'))
                if not birth_day is None:
                    return birth_day.string
        except Exception as error:
            logging.debug('Unable to obtain accurate birthday string. Error message: ' + error)
            return '0000-00-00'
        return '0000-00-00'

    """
        :param actor_soup_object - actor's Beautiful soup object to parse
        :return a list of string of the actor's filmography
    """
    def get_actor_filmography(self, actor_soup_object: BeautifulSoup) -> list:
        try:
            body_content = actor_soup_object.body.find('div', id='content') \
                            .find('div', id='bodyContent')\
                            .find('div', id='mw-content-text')
            possible_filmography_list = body_content\
                            .find_all('span', text=re.compile('[fF]ilmography'), recursive=True)
            for filmography_area in possible_filmography_list:
                try:
                    h2_filmography_parent = filmography_area.find_parent('h2')
                    movie_list = self.parse_movie_div(h2_filmography_parent)
                    if len(movie_list) != 0:
                        return movie_list
                    movie_list = self.parse_movie_table(h2_filmography_parent)
                    if len(movie_list) != 0:
                        return movie_list
                except Exception as error:
                    continue
        except Exception as error:
            logging.debug('Unable to obtain actor filmography due to an error. Error message: ' + error)
            return []
        logging.warning('Unable to obtain actor filmography because filmography section is not found')
        return []

    """
        Helper function to parse the filmography in a div tag
        :return a list of the movies the actor has been involved in
    """
    def parse_movie_div(self, h2_filmography_parent):
        movie_list = []
        try:
            siblings = h2_filmography_parent.find_next_siblings('div', limit=2)
            for div in siblings:
                if 'navbox' in div.attrs['class']:
                    continue
                ul_list = div.find('ul')
                if ul_list is None:
                    continue
                for list_item in ul_list.children:
                    title = list_item.find('a')
                    if title == -1:
                        continue
                    movie_list.append(title.string)
                    if not self.movie_queue.full():
                        self.movie_queue.put_nowait(title.attrs['href'])
                if len(movie_list) != 0:
                    return movie_list
        except Exception as error:
            logging.debug('Unable to obtain filmography in a div tag. Error message: ' + error)
            return []
        return movie_list

    """
        Helper function to parse the filmography in a table tag
        :return a list of the movies the actor has been involved in
    """
    def parse_movie_table(self, h2_filmography_parent):
        movie_list = []
        try:
            table = h2_filmography_parent.find_next_sibling('table')
            film_table_header = table.find('th', text=re.compile('[Ff]ilm'))
            title_table_header = table.find('th', text=re.compile('[Tt]itle'))
            if film_table_header is None and title_table_header is None:
                return []
            table_body = table.find('tbody', recursive=True)
            if table_body is None:
                return []
            for table_row in table_body:
                try:
                    title = table_row.find('i').find('a')
                    movie_list.append(title.string)
                    if not self.movie_queue.full():
                        self.movie_queue.put_nowait(title.attrs['href'])
                except Exception as error:
                    continue
            return movie_list
        except Exception as error:
            logging.debug('Unable to obtain filmography in a table. Error message: ' + error)
            return []


    """
        :param movie_soup_object - BeautifulSoup object for a movie wikipedia website
        :return a dictionary with information about the movie
    """

    def parse_movie(self, movie_soup_object: BeautifulSoup) -> dict:
        result = {}
        side_table_content = movie_soup_object.body.find('div', id='content') \
            .find('div', id='bodyContent') \
            .find('div', id='mw-content-text') \
            .find_all('table', class_='infobox vevent')
        result['gross_value'] = self.get_box_office(side_table_content)
        result['release_date'] = self.get_release_date(side_table_content)
        result['actors'] = self.get_movie_actors(side_table_content)
        return result

    """
        :param a list of table tags that the movie side information box is included in the list
        :return movie box office value. 0 if it could not find anything
    """

    def get_box_office(self, side_table_content: list):
        try:
            for table in side_table_content:
                row = table.find('th', text='Box office')
                parent = row.find_parent('tr')
                box_office = parent.find(text=re.compile('\$.')).string
                box_office_list = box_office.split()
                value = float(box_office_list[0][1:])
                if box_office_list[1] == 'million':
                    value *= 10**6
                elif box_office_list[1] == 'billion':
                    value *= 10**9
                return value
            return 0
        except Exception as error:
            logging.debug('Unable to obtain the box office value. Error message: ' + error)
            return 0

    """
        :param a list of table tags that the movie side information box is included in the list
        :return a string containing the movie's first listed release date. '' if it could not find anything
    """

    def get_release_date(self, side_table_content: list):
        try:
            for table in side_table_content:
                date_string_list = table.find_all(string='Release date')  # find string 'Release date'
                for date_string in date_string_list:
                    parents = date_string.find_parent('tr')  # find tag tr parent of the string
                    date = parents.find(text=re.compile('.-[0-9][0-9]-.'))
                    return date.string
            return '0000-00-00'
        except Exception as error:
            logging.debug('Unable to obtain release date of the movie. Error message: ' + error)
            return '0000-00-00'

    """
        :param a list of table tags that the movie side information box is included in the list
        :return a list of string of the cast's name. [] if unable to find any information
    """

    def get_movie_actors(self, side_table_content: list):
        try:
            actors = []
            for table in side_table_content:
                starring_string_list = table.find_all(string='Starring')  # find string 'Starring'
                for starring_string in starring_string_list:
                    parents = starring_string.find_parent('tr')  # find tag tr parent of the string
                    actor_li_list = parents.find('ul')
                    for actor_li in actor_li_list.children:  # iterate the children's list item
                        if not actor_li.name == 'li':
                            continue
                        actor_href = actor_li.find('a')
                        actors.append(actor_href.string)
                        if not self.movie_queue.full():
                            self.actor_queue.put_nowait(actor_href.attrs['href'])
                    if len(actors) != 0:
                        return actors
        except Exception as error:
            logging.debug('Unable to obtain a list of the actors involved in the movie. Error message: ' +error)
            return []
        logging.warning('Unable to find the cast of the movie because the Starring string was not found')
        return []

if __name__ == '__main__':
    crawler = WikipediaMovieCrawler()
    crawler.run()