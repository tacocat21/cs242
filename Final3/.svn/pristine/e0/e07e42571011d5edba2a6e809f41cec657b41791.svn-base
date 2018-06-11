import datetime
import src.constants as constants

class Poll:
    def __init__(self,
                 poll_id: str,
                 poll_type:str,
                 question: str,
                 answer,
                 possible_answers=None,
                 image=None):
        """
        
        :param poll_id: _id of the poll
        :param poll_type: type of poll
        :param question: question of the poll
        :param answer: answer to the poll
        :param possible_answers: possible multiple choice answers
        """
        self.question = question
        self.poll_type = poll_type
        self.answer = str(answer)
        self.id = poll_id
        self.possible_answers = possible_answers
        self.student_result = {}
        self.num_correct = 0
        self.num_response = 0
        self.messages = []
        self.message_idx = 0
        self.image = image
        self.count = {}

    def add_poll_result_from_student(self, response_dict):
        """
        Add result to cache
        :param response_dict: student response dictionary 
        :return: the updated response_dict or None if an error occurs
        """

        try:
            student_id = response_dict['student_id']
            student_school_id = response_dict['school_id']
            student_name = response_dict['name']
            student_response = response_dict['response']
        except Exception as err:
            print(err)
            return None
        if student_id in self.student_result:
            return self.student_result[student_id]
        is_correct = True
        if self.poll_type == constants.MC_POLL_TYPE or self.poll_type == constants.INT_POLL_TYPE:
            is_correct = student_response == self.answer
            if student_response in self.count:
                self.count[student_response] += 1
            else:
                self.count[student_response] = 1
        if is_correct is True:
            self.num_correct += 1
        self.num_response += 1
        result = {'time': str(datetime.datetime.now().time()),
                  'response': student_response,
                  '_id': student_id,
                  'school_id':student_school_id,
                  'name': student_name,
                  'is_correct': is_correct
                  }
        self.student_result[student_id] = result
        return result

    def get_id(self):
        """
        
        :return: id of the poll
        """
        return self.id

    def get_poll_dict(self):
        """
        
        :return: dictionary summary of the poll
        """
        stats = self.get_statistics()
        result_dict = {'poll_id':self.get_id(),
                       'question':self.question,
                       'poll_type':self.poll_type,
                       'answer':self.answer,
                       'student_responses':self.student_result,
                       'messages':self.messages,
                       'answer_list':stats['answer_list'],
                       'num_count_list':stats['num_count_list']}
        if self.possible_answers is not None:
            result_dict['possible_answers'] = self.possible_answers
        if self.image is not None:
            result_dict['image'] = self.image
        return result_dict

    def get_poll_student_view(self):
        result_dict = {'poll_id':self.get_id(),
                       'question': self.question,
                       'poll_type': self.poll_type,
                       'messages': self.messages}
        if self.possible_answers is not None:
            result_dict['possible_answers'] = self.possible_answers
        if self.image is not None:
            result_dict['image'] = self.image
        return result_dict

    def get_student_responses(self):
        """
        
        :return: dictionary containing student responses
        """
        return self.student_result

    def add_new_message(self, user_name:str, user_type:str, message:str, image:str = None):
        """
        
        :param user_name: 
        :param user_type: 
        :param message: 
        :return: new message dictionary
        """
        new_message_dict = {'message_id': self.message_idx,
                            'user': user_name,
                            'user_type':user_type,
                            'message':message,
                            'response':[]}
        if image is not None:
            new_message_dict['image'] = image
        self.message_idx += 1
        self.messages.append(new_message_dict)
        return self.get_poll_dict()

    def add_message_response(self, message_idx, user_name, user_type, response):
        """
        
        :param message_idx: 
        :param user_name: 
        :param user_type: 
        :param response: 
        :return: 
        """
        response_dict = {'response':response,
                         'user_type':user_type,
                         'user':user_name}
        try:
            self.messages[message_idx]['response'].append(response_dict)
        except:
            return None
        return response_dict

    def get_statistics(self):
        x_axis = []
        y_axis = []
        for key in sorted(self.count):
            x_axis.append(str(key))
            y_axis.append(self.count[key])
        return {'answer_list': x_axis,
                'num_count_list': y_axis}
