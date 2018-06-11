from bson import ObjectId

import src.constants as constants


class StudentDB:
    def __init__(self, client, testing=False):
        """
        Stores data from all of the students
        :param client: Pymongo client
        :param testing: if set to True, it uses a different databses
        """
        if not testing:
            self.db_post = client.student_db.posts
        else:
            client.drop_database('test_student_db')
            self.db_post = client.test_student_db.posts

    def create_student(self, name: str, password: str, year: str, email: str, school_id: str) -> dict:
        """
        
        :param name: name of the student
        :param password: password of the student
        :param year: year of the student
        :param email: email of the student
        :param school_id: school_id of the student
        :return: the new _id of the student
        """
        student_entry = {'type': constants.STUDENT_TYPE,
                         'name': name,
                         'password': password,
                         'year': year,
                         'email': email,
                         'school_id': school_id,
                         'current_courses': [],
                         'previous_courses': []
                         }
        result = self.db_post.insert_one(student_entry).inserted_id
        return result

    def add_course(self,
                   student_id,
                   course_id,
                   course_name,
                   course_code,
                   teacher_name):
        """
        
        :param teacher_name: name of the teacher
        :param course_code: code of the course
        :param course_name: name of the course
        :param student_id: id of the student
        :param course_id: id of the course
        :return: the new dictionary
        """
        if isinstance(student_id, str):
            student_id = ObjectId(student_id)
        result = self.db_post.update_one({'_id': student_id},
                                         {'$addToSet': {
                                             'current_courses': {'course_id': str(course_id),
                                                                 'course_name': course_name,
                                                                 'course_code': course_code,
                                                                 'teacher_name': teacher_name}
                                         }})
        return result

    def remove_course(self,
                      student_id,
                      course_id):
        """
        
        :param student_id: 
        :param course_id: 
        :return: 
        """
        if isinstance(student_id, str):
            student_id = ObjectId(student_id)
        if isinstance(course_id, ObjectId):
            course_id = str(course_id)
        result = self.db_post.update_one({'_id': student_id},
                                         {'$pull': {
                                             'current_courses': {'course_id': course_id}
                                         }})
        return result

    def get_student_by_id(self, student_id, filter_dict=None):
        try:
            if isinstance(student_id, str):
                student_id = ObjectId(student_id)
            if filter_dict is None:
                return self.db_post.find_one({'_id': student_id})
            return self.db_post.find_one({'_id': student_id}, filter_dict)
        except:
            return None

    def get_login(self, student_email, password):
        """
        
        :param student_email: 
        :param password: 
        :return: The dictionary if the password matches 
        """
        try:
            student_json = self.db_post.find_one({'email': student_email})
            if student_json['password'] == password:
                return student_json
            return None
        except:
            return None

    def email_exist(self, student_email):
        """
        
        :param student_email: 
        :return: True if the student email exists in the database
        """
        student_json = self.db_post.find_one({'email': student_email})
        return student_json is not None
