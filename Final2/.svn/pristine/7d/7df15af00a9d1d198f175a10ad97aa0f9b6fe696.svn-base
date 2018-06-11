from unittest import TestCase

from pymongo import MongoClient

from src.database.course_database import CourseDB
from src.database.student_database import StudentDB
from src.database.teacherdb import TeacherDB


class TestCourseDB(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = MongoClient()
        cls.student_db = StudentDB(cls.client, testing=True)
        cls.course_db = CourseDB(cls.client, testing=True)
        cls.teacher_db = TeacherDB(cls.client, testing=True)
        cls.teacher_id = cls.teacher_db.create_teacher(name='Teacher name', password='pass', email='teacher@email.com',
                                                       school_id='0')
        cls.first_student_id = cls.student_db.create_student(name='Student name', password="pass", year='1',
                                                             email='student@email.com', school_id='0')
        cls.second_student_id = cls.student_db.create_student(name='Student name2', password="pass", year='2',
                                                              email='student2@email.com', school_id='1')
        cls.algs_class_id = cls.course_db.create_course(course_name='Algs',
                                                        course_code='CS374',
                                                        teacher_id=str(cls.teacher_id),
                                                        teacher_school_id='0',
                                                        teacher_name='Teacher name')
        cls.programming_class_id = cls.course_db.create_course(course_name='Programming Studio',
                                                               course_code='CS242',
                                                               teacher_id=str(cls.teacher_id),
                                                               teacher_school_id='0',
                                                               teacher_name='Teacher name')

    def test_create_new_course(self):
        algs_dict = self.course_db.get_course_by_id(self.algs_class_id)
        self.assertEqual(algs_dict['course_name'], 'Algs')
        self.assertEqual(algs_dict['course_code'], 'CS374')
        self.assertEqual(algs_dict['teacher_id'], str(self.teacher_id))
        self.assertEqual(algs_dict['teacher_school_id'], '0')
        self.assertEqual(algs_dict['teacher_id'], str(self.teacher_id))
        self.assertEqual(algs_dict['teacher_name'], 'Teacher name')

    def test_add_student_to_class(self):
        first_student_dict = self.student_db.get_student_by_id(self.first_student_id)
        self.course_db.add_student_to_class(self.algs_class_id,
                                            first_student_dict['name'],
                                            self.first_student_id,
                                            first_student_dict['school_id'],
                                            first_student_dict['email'])
        algs_dict = self.course_db.get_course_by_id(self.algs_class_id)
        self.assertEqual(algs_dict['student_list'][0]['name'], first_student_dict['name'])
        self.assertEqual(algs_dict['student_list'][0]['email'], first_student_dict['email'])
        self.assertEqual(algs_dict['student_list'][0]['_id'], str(self.first_student_id))
        self.assertEqual(algs_dict['student_list'][0]['school_id'], str(first_student_dict['school_id']))

    def test_remove_student(self):
        first_student_dict = self.student_db.get_student_by_id(self.first_student_id)
        self.course_db.add_student_to_class(self.programming_class_id,
                                            first_student_dict['name'],
                                            self.first_student_id,
                                            first_student_dict['school_id'],
                                            first_student_dict['email'])
        self.course_db.remove_student(self.programming_class_id, self.first_student_id)
        programming_dict = self.course_db.get_course_by_id(self.programming_class_id)
        self.assertEqual(len(programming_dict['student_list']), 0)

    def test_add_poll_result(self):
        self.course_db.add_poll_result(self.programming_class_id, {'result':'OK'})
        programming_dict = self.course_db.get_course_by_id(self.programming_class_id)
        self.assertEqual(programming_dict['poll_session'][0], {'result':'OK'})