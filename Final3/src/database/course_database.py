import pymongo
from bson import ObjectId

import src.constants as constants


class CourseDB:
    def __init__(self, client, testing=False):
        """
        
        :param client: Pymongo client
        :param testing: if set to True, it uses a different databses
        """
        self.client = client
        if not testing:
            self.db_post = client.course_db.posts
        else:
            client.drop_database('test_course_db')
            self.db_post = client.test_course_db.posts

    def cleanDB(self):
        self.client.drop_database('course_db')

    def create_course(self,
                      course_name: str,
                      course_code: str,
                      teacher_id,
                      teacher_school_id: str,
                      teacher_name: str) -> ObjectId:
        """
        
        :param course_name: name of the course
        :param course_code: code of the course
        :param teacher_id: _id of the teacher
        :param teacher_school_id: school_id of the teacher
        :param teacher_name: name of the teacher
        :return: _id of the new course
        """
        if isinstance(teacher_id, ObjectId):
            teacher_id = str(teacher_id)
        course_entry = {'type': constants.CLASS_TYPE,
                       'course_name': str(course_name),
                       'course_code': str(course_code),
                       'teacher_id': str(teacher_id),
                       'teacher_school_id': str(teacher_school_id),
                       'teacher_name': str(teacher_name),
                       'teacher_assistant_list': [],
                       'student_list': [],
                       'poll_session': []
                       }
        result = self.db_post.insert_one(course_entry).inserted_id
        return result

    def get_course_by_id(self,
                         course_id,
                         filter_dict=None):
        """
        
        :param course_id: _id of the course
        :param filter_dict: filter dictionary to choose which parameters to return
        :return: dictionary containing information about the course or None if None was found
        """
        try:
            if isinstance(course_id, str):
                course_id = ObjectId(course_id)
            if filter_dict is None:
                return self.db_post.find_one({'_id': course_id})
            return self.db_post.find_one({'_id': course_id}, filter_dict)
        except:
            return None


    def add_student_to_class(self,
                             course_id,
                             student_name,
                             student_id,
                             student_school_id,
                             student_email):
        """
        
        :param course_id: _id of the course
        :param student_name: name of the student
        :param student_id: _id of the student
        :param student_school_id: school_id of the student
        :param student_email: email of the student 
        :return: WriteResult object containing information about the update
        """
        if isinstance(course_id, str):
            course_id = ObjectId(course_id)
        result = self.db_post.update({'_id': course_id},
                                     {'$addToSet': {
                                         'student_list': {'_id': str(student_id),
                                                          'name': str(student_name),
                                                          'email': str(student_email),
                                                          'school_id': str(student_school_id)}
                                     }})
        return result

    def remove_student(self,
                       class_id,
                       student_id):
        """
        
        :param class_id: _id of the course to remove student
        :param student_id: _id of the student
        :return: WriteResult object containing information about the update
        """
        if isinstance(class_id, str):
            class_id = ObjectId(class_id)
        student_id = str(student_id)
        result = self.db_post.update({'_id': class_id},
                                     {'$pull': {
                                         'student_list': {'_id': student_id}
                                     }})
        return result

    def add_poll_result(self, class_id, poll_dict):
        """
        
        :param class_id: _id of the course
        :param poll_dict: result dictionary of the poll
        :return: WriteResult object containing information about the update
        """
        print(poll_dict)
        if isinstance(class_id, str):
            class_id = ObjectId(class_id)
        result = self.db_post.update({'_id': class_id},
                                     {'$addToSet': {
                                         'poll_session': poll_dict
                                     }})
        # {'poll_id': poll_dict['poll_id'],
        #  'question': poll_dict['question'],
        #  'answer': poll_dict['answer'],
        #  'student_responses': poll_dict['student_responses'],
        #  'poll_type': poll_dict['poll_type'],
        #  'messages': poll_dict['messages'],
        #  'possible_answers': poll_dict['possible_answers'],
        #  'image': poll_dict['image']
        #  }
        print(result)
        return result

    def get_all_courses(self, filter_dict=None):
        """
        
        :param filter_dict: dictionary to filter which values to return
        :return: a list of all courses containing only values filtered by the filter_dict
        """

        if filter_dict is None:
            return self.db_post.find({})
        return self.db_post.find({}, filter_dict)
