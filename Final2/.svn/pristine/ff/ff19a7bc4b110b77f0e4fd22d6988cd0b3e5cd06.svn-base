import src.constants as constants
from bson.objectid import ObjectId


class TeacherDB:
    def __init__(self, client, testing=False):
        """
            Stores data from all of the teachers
            :param client: Pymongo client
            :param testing: if set to True, it uses a different database
        """
        self.client = client
        if not testing:
            self.db_post = client.teacher_db.posts
        else:
            client.drop_database('test_teacher_db')
            self.db_post = client.test_teacher_db.posts

    def cleanDB(self):
        self.client.drop_database('teacher_db')

    def create_teacher(self, name: str, password:str, email: str, school_id: str) -> ObjectId:
        """
        
        :param name: name of the teacher
        :param password: password of the teacher
        :param email: email of the teacher
        :param school_id: school_id of the teacher
        :return: _id of the newly created teacher
        """
        teacher_entry = {'type': constants.TEACHER_TYPE,
                         'password':password,
                         'name': name,
                         'email': email,
                         'school_id': school_id,
                         'current_courses': [],
                         'previous_courses': []
                         }
        try:
            result_id = self.db_post.insert_one(teacher_entry).inserted_id
            return result_id
        except:
            return None

    def get_all_teachers(self):
        """
        
        :return: a list of all the teachers in the database
        """
        return self.db_post.find({})

    def get_teacher_by_id(self, teacher_id, filter_dict=None):
        """
            :param teacher_id: _id of the teacher
            :param filter_dict: filter dictionary to filter which values to return
            :return: the dictionary containing information of the teacher with _id=teacher_id 
            filtered out by filter_dict
        """
        try:
            if type(teacher_id) is str:
                teacher_id = ObjectId(teacher_id)
            if filter_dict is None:
                return self.db_post.find_one({'_id': teacher_id})
            return self.db_post.find_one({'_id': teacher_id}, filter_dict)
        except:
            return None

    def add_course(self,
                   teacher_id,
                   course_id,
                   course_name,
                   course_code):
        """

        :param course_code: code of the course
        :param course_name: name of the course
        :param teacher_id: id of the teacher
        :param course_id: id of the course
        :return: WriteResult object containing information about the update
        """
        if isinstance(teacher_id, str):
            teacher_id = ObjectId(teacher_id)
        if isinstance(course_id, str):
            course_id = ObjectId(teacher_id)
        result = self.db_post.update_one({'_id': teacher_id},
                                         {'$addToSet': {
                                                'current_courses': {'course_id': str(course_id),
                                                                    'course_name': course_name,
                                                                    'course_code': course_code}
                                            }})
        return result

    def remove_course(self,
                      teacher_id,
                      course_id):
        """

        :param teacher_id: _id of the teacher
        :param course_id: _id of the course
        :return: WriteResult object containing information about the update
        """
        if isinstance(teacher_id, str):
            teacher_id = ObjectId(teacher_id)
        course_id = str(course_id)
        result = self.db_post.update_one({'_id': teacher_id},
                                         {'$pull': {
                                                'current_courses': {'course_id': course_id}
                                            }})
        return result

    def get_login(self, teacher_email, password):
        """
        
        :param teacher_email: email of the teacher
        :param password: password of the teacher
        :return: the corresponding teacher dictionary of None if none exist
        """
        try:
            teacher_json = self.db_post.find_one({'email': teacher_email})
            if teacher_json['password'] == password:
                return teacher_json
            return None
        except:
            return None
