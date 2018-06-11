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

    def create_poll(self, course_id, poll_type, question, answer, possible_answers=None, location=None, image=None):
        """
        Only one poll allowed for every session
        :param course_id: id of the session
        :param poll_type: type of the poll
        :param question: question of the poll
        :param answer: answer of the poll
        :param possible_answers: possible answers in case of multiple choice
        :return: the new poll object
        """
        try:
            course_dict = self.class_db.get_course_by_id(course_id)
            if course_dict is None:
                return None
            if course_id not in self.available_session:
                self.available_session[course_id] = {'start_time':str(datetime.datetime.now().time()),
                                                     'course_name':course_dict['course_name'],
                                                     'course_code':course_dict['course_code'],
                                                     'current_polls':[]}
            if location is not None:
                self.available_session[course_id]['location'] = location
            if possible_answers is None:
                possible_answers = []
            new_poll = Poll(poll_id=self.random_string(),
                            poll_type=poll_type,
                            question=question,
                            answer=answer,
                            possible_answers=possible_answers,
                            image=image)
            self.available_session[course_id]['current_polls'].append(new_poll)
            return new_poll.get_poll_dict()
        except Exception as err:
            print(err)
            return None

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
            return []
        return self.available_session[course_id]['current_polls']

    def get_current_polls_dict(self, course_id):
        if course_id not in self.available_session:
            return []
        result = self.available_session[course_id]['current_polls']
        result_dict = []
        for poll in result:
            result_dict.append(poll.get_poll_dict())
        return result_dict

    def get_poll_history(self, course_id):
        """
        
        :param course_id: 
        :return: history of the polls
        """
        course_dict = self.class_db.get_course_by_id(course_id)
        if course_dict is None:
            return None
        return course_dict['poll_session']

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
                result = current_polls[idx].get_poll_dict()
                self.available_session[course_id]['current_polls'].pop(idx)
                print("adding to db")
                print(result)
                self.class_db.add_poll_result(class_id=course_id, poll_dict=result)
                break
        course_dict = self.class_db.get_course_by_id(course_id)
        print(course_dict)
        return result

    def get_poll(self,
                 course_id,
                 poll_id):
        """
        
        :param course_id: 
        :param poll_id: 
        :return: 
        """
        if course_id in self.available_session:
            for poll in self.available_session[course_id]['current_polls']:
                if poll.get_id() == poll_id:
                    result = poll.get_poll_dict()
                    result['end_status'] = False
                    return result
        course_dict = self.class_db.get_course_by_id(course_id)
        print(course_dict)
        for poll in course_dict['poll_session']:
            if poll['poll_id'] == poll_id:
                result = poll
                result['end_status'] = True
                return result

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
                    message,
                    image=None):
        if course_id not in self.available_session:
            return None
        for poll in self.available_session[course_id]['current_polls']:
            if poll.get_id() == poll_id:
                return poll.add_new_message(user_name=user_name,
                                            user_type=user_type,
                                            message=message,
                                            image=image)
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
        if course_id not in self.available_session:
            return None
        # handles distance
        try:
            class_location = self.available_session[course_id]['location']
            distance = great_circle(class_location, student_location).km
        except Exception as err:
            print(err)
            distance = 0.0
        if distance > 0.1:
            # outside the class
            return {'status_code':403,
                    'message':'User is too far from classroom'}
        result = None
        print('not in distance')
        for poll in self.available_session[course_id]['current_polls']:
            if poll.get_id() == poll_id:
                print('found poll')
                result = poll.add_poll_result_from_student(response_dict)
        return result

