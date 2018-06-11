from src.polling.poll import Poll
import datetime
import random
import string
from geopy.distance import great_circle


class PollHandler:
    def __init__(self, class_db):
        """
        Class used to create and handle polling sessions
        :param class_db: class database object
        """
        self.available_session = {}
        self.class_db = class_db

    def create_session(self,
                       course_id,
                       location):
        """
        :param course_id - id of the course in the database
        :param course_name: name of the course
        :param course_code: code of the course
        :param location: (latitude, longitude) of the student
        :return: dictionary containing session information
        """
        if course_id in self.available_session:
            return self.available_session[course_id]
        course_dict = self.class_db.get_course_by_id(course_id)
        if course_dict is None:
            return None
        self.available_session[course_id] = {'start_time':str(datetime.datetime.now().time()),
                                             'course_name':course_dict['course_name'],
                                             'course_code':course_dict['course_code'],
                                             'location':str(location),
                                             'current_polls':[],
                                             'poll_history':[]}
        return self.available_session[course_id]

    def create_poll(self, course_id, poll_type, question, answer, possible_answers=None):
        """
        Only one poll allowed for every session
        :param course_id: id of the session
        :param poll_type: type of the poll
        :param question: question of the poll
        :param answer: answer of the poll
        :param possible_answers: possible answers in case of multiple choice
        :return: the new poll object
        """
        if course_id not in self.available_session:
            return None
        new_poll = Poll(poll_id=self.random_string(),
                        poll_type=poll_type,
                        question=question,
                        answer=answer,
                        possible_answers=possible_answers)
        self.available_session[course_id]['current_polls'].append(new_poll)
        return new_poll.get_poll_dict()

    def random_string(self, length=20):
        """
        
        :param length: length of the string
        :return: a random string on length length
        """
        return ''.join([random.choice(string.digits + string.ascii_letters) for i in range(length)])

    def get_current_polls(self, course_id):
        """
        
        :param course_id: id of the session
        :return: a list of the current polls
        """
        if course_id not in self.available_session:
            return None
        return self.available_session[course_id]['current_polls']

    def get_poll_history(self, course_id):
        """
        
        :param course_id: 
        :return: history of the polls
        """
        if course_id not in self.available_session:
            return None
        return self.available_session[course_id]['poll_history']

    def end_poll(self,
                 course_id,
                 poll_id):
        """
        :param course_id: id of the session
        :param poll_id: id of the poll
        :return: move the poll to poll_history and return the summary dictionary
        """
        if course_id not in self.available_session:
            return None
        current_polls = self.available_session[course_id]['current_polls']
        result = None
        for idx in range(len(current_polls)):
            if current_polls[idx].get_id() == poll_id:
                result = current_polls[idx]
                self.available_session[course_id]['current_polls'].pop(idx)
                self.available_session[course_id]['poll_history'].append(result)
                break
        return result.get_poll_dict()

    def end_session(self, course_id):
        """
        :param course_id: id of the session
        :return: save the session to database return None
        """
        if course_id not in self.available_session:
            return None
        for poll in self.available_session[course_id]['current_polls']:
            self.available_session[course_id]['poll_history'].append(poll)
        for poll in self.available_session[course_id]['poll_history']:
            self.class_db.add_poll_result(course_id, poll.get_poll_dict())
        del self.available_session[course_id]

    def get_poll_result(self,
                        course_id,
                        poll_id):
        """
        
        :param course_id: 
        :param poll_id: 
        :return: 
        """
        if course_id not in self.available_session:
            return None
        for poll in self.available_session[course_id]['current_polls']:
            if poll.get_id() == poll_id:
                return poll.get_poll_dict()

    def get_poll_student_view(self,
                              course_id,
                              poll_id):
        """
        
        :param course_id: 
        :param poll_id: 
        :return: 
        """
        if course_id not in self.available_session:
            return None
        for poll in self.available_session[course_id]['current_polls']:
            if poll.get_id() == poll_id:
                return poll.get_poll_student_view()
        return None

    def add_message(self,
                    course_id,
                    poll_id,
                    user_name,
                    user_type,
                    message):
        if course_id not in self.available_session:
            return None
        for poll in self.available_session[course_id]['current_polls']:
            if poll.get_id() == poll_id:
                return poll.add_new_message(user_name=user_name,
                                            user_type=user_type,
                                            message=message)
        return None

    def add_response(self,
                     course_id,
                     poll_id,
                     message_idx,
                     user_name,
                     user_type,
                     response):
        """
        
        :param course_id: 
        :param poll_id: 
        :param message_idx: 
        :param user_name: 
        :param user_type: 
        :param response: 
        :return: 
        """
        if course_id not in self.available_session:
            return None
        for poll in self.available_session[course_id]['current_polls']:
            if poll.get_id() == poll_id:
                return poll.add_message_response(message_idx=message_idx,
                                                 user_name=user_name,
                                                 user_type=user_type,
                                                 response=response)
        return None

    def process_result(self,
                       course_id,
                       poll_id,
                       student_location,
                       response_dict):
        """
        
        :param course_id: id of the session
        :param poll_id: poll_id
        :param student_location: student location in latitude+longitude 
        :param response_dict: response from the student
        :return: result of the student response
        """
        if course_id is None or poll_id is None or student_location is None or response_dict is None:
            return None
        if course_id not in self.available_session:
            return None
        class_location = self.available_session[course_id]['location']
        # handles distance
        distance = 0
        try:
            distance = great_circle(class_location, student_location).km
        except Exception as err:
            print(err)
            distance = 0.0
        if distance > 0.1:
            # outside the class
            return {'status_code':403,
                    'message':'User is too far from classroom'}
        result = None
        for poll in self.available_session[course_id]['current_polls']:
            if poll.get_id() == poll_id:
                result = poll.add_poll_result_from_student(response_dict)
        return result