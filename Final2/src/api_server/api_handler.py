from pymongo import MongoClient

from src.database.course_database import CourseDB
from src.database.student_database import StudentDB
from src.database.teacherdb import TeacherDB


class APIServerHandler:
    def __init__(self):
        """
        Controller between the REST api requests and the backend
        """
        self.client = MongoClient()
        self.student_db = StudentDB(self.client)
        self.teacher_db = TeacherDB(self.client)
        self.course_db = CourseDB(self.client)

    ###########################################################
    # Students
    def get_student_by_id(self, student_id, filter_dict=None):
        """
        
        :param student_id: id of the student 
        :param filter_dict: dictionary to filter out parameters wanted
        :return: dictionary containing information about the student with _id=student_id
        """
        try:
            result = self.student_db.get_student_by_id(str(student_id), filter_dict)
            result['_id'] = str(result['_id'])
            return result
        except Exception as err:
            print(err)
            return None

    def create_student(self, name, password, year, email, school_id):
        """
        
        :param name: name of the student
        :param password: password of the student
        :param year: year of the student
        :param email: email of the student
        :param school_id: schoolID of the student
        :return: the newly created dictionary with the student's information
        """
        new_id = self.student_db.create_student(name=name,
                                                password=password,
                                                year=str(year),
                                                email=email,
                                                school_id=str(school_id))
        result = self.student_db.get_student_by_id(new_id)
        result['_id'] = str(result['_id'])
        return result

    #########################################################
    # Teachers
    def get_teacher_by_id(self, teacher_id, filter_dict=None):
        """
        
        :param teacher_id: 
        :param filter_dict: dictionary to filter out parameters wanted
        :return: dictionary containing information about the teacher with _id=teacher_id
        """
        try:
            result = self.teacher_db.get_teacher_by_id(str(teacher_id), filter_dict)
            print(result)
            result['_id'] = str(result['_id'])
            return result
        except Exception as err:
            print(err)
            return None

    def create_teacher(self, name, password, email, school_id):
        """

        :param name: name of the teacher
        :param password: password of the teacher
        :param email: email of the teacher
        :param school_id: school_id of the teacher
        :return: the newly created teacher dictionary
        """
        teacher_id = self.teacher_db.create_teacher(name=name,
                                                    password=password,
                                                    email=email,
                                                    school_id=school_id)
        result = self.teacher_db.get_teacher_by_id(teacher_id)
        result['_id'] = str(result['_id'])
        return result

    #########################################################
    # Courses
    def create_course(self,
                      course_name,
                      course_code,
                      teacher_id,
                      teacher_school_id,
                      teacher_name):
        """
        
        :param course_name: name of the course
        :param course_code: course code
        :param teacher_id: _id of the teacher document
        :param teacher_school_id: school_id of the teacher
        :param teacher_name: name of the teacher
        :return: the new dict containing information about the course
        """
        try:
            result_id = self.course_db.create_course(course_name=course_name,
                                                     course_code=course_code,
                                                     teacher_id=teacher_id,
                                                     teacher_school_id=teacher_school_id,
                                                     teacher_name=teacher_name)
            self.teacher_db.add_course(teacher_id,
                                       result_id,
                                       course_name=course_name,
                                       course_code=course_code)
            result = self.course_db.get_course_by_id(result_id)
            result['_id'] = str(result['_id'])
            return result

        except:
            return None

    def get_course_by_id(self, course_id, filter_dict=None):
        """
        
        :param course_id: _id of the course
        :param filter_dict: filter dictionary to choose which parameters the to return
        :return: return a dictionary containing information about the course
        """
        try:
            result = self.course_db.get_course_by_id(str(course_id), filter_dict)
            result['_id'] = str(result['_id'])
            return result
        except:
            return None

    def get_all_courses(self, filter_dict):
        """
        
        :param filter_dict: 
        :return: a list containing all of the available courses
        """
        course_list = self.course_db.get_all_courses(filter_dict)
        result = []
        for course in course_list:
            course['_id'] = str(course['_id'])
            result.append(course)
        return result

    def add_student_to_class(self,
                             student_id,
                             course_id):
        """
        Add student to class on both the courseDB and StudentDB
        :param student_id: _id of the student
        :param course_id: _id of the course
        :return: the dictionary of the student with the added course
        """
        try:
            student_dict = self.student_db.get_student_by_id(student_id)
            course_dict = self.course_db.get_course_by_id(course_id)
            self.course_db.add_student_to_class(course_id=course_id,
                                                student_name=student_dict['name'],
                                                student_id=student_dict['_id'],
                                                student_school_id=student_dict['school_id'],
                                                student_email=student_dict['email'])
            self.student_db.add_course(student_id=student_id,
                                       course_id=course_id,
                                       course_name=course_dict['course_name'],
                                       course_code=course_dict['course_code'],
                                       teacher_name=course_dict['teacher_name'])
            result = self.student_db.get_student_by_id(student_id, {'current_courses': True})
            result['_id'] = str(result['_id'])
            print(result)
            return result
        except Exception as err:
            return None

    def login(self, email, password):
        """
        
        :param email: email of the user
        :param password: password of the user
        :return: the respective user or None if the email/password doesn't match
        """
        student_login = self.student_db.get_login(student_email=email, password=password)
        if student_login is not None:
            student_login['_id'] = str(student_login['_id'])
            return student_login
        teacher_login = self.teacher_db.get_login(email, password)
        if teacher_login is not None:
            teacher_login['_id'] = str(teacher_login['_id'])
            return teacher_login
        return None

    def clearDB(self):
        """
        Cleans every database
        """
        self.course_db.cleanDB()
        self.teacher_db.cleanDB()
        self.student_db.cleanDB()