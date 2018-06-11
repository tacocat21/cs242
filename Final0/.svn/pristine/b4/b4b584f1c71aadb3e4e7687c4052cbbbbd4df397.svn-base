from unittest import TestCase

from pymongo import MongoClient

from src.database.course_database import CourseDB
from src.database.student_database import StudentDB
from src.database.teacherdb import TeacherDB


class TestStudentDatabase(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = MongoClient()
        cls.student_db = StudentDB(cls.client, testing=True)
        cls.course_db = CourseDB(cls.client, testing=True)
        cls.teacher_db = TeacherDB(cls.client, testing=True)
        cls.teacher_id = cls.teacher_db.create_teacher(name='Teacher name', password="pass", email='teacher@email.com',
                                                       school_id='0')
        cls.first_student_id = cls.student_db.create_student(name='Student name', password="pass", year='Junior',
                                                             email='student@email.com', school_id='0')
        cls.second_student_id = cls.student_db.create_student(name='Student name2', password="pass", year='Senior',
                                                              email='student2@email.com', school_id='1')

    def test_create_student(self):
        first_student_dict = self.student_db.get_student_by_id(self.first_student_id)
        second_student_dict = self.student_db.get_student_by_id(str(self.second_student_id))
        print(first_student_dict)
        print(second_student_dict)
        self.assertEqual(first_student_dict['name'], 'Student name')
        self.assertEqual(first_student_dict['email'], 'student@email.com')
        self.assertEqual(first_student_dict['school_id'], '0')
        self.assertEqual(first_student_dict['_id'], self.first_student_id)
        self.assertEqual(second_student_dict['name'], 'Student name2')
        self.assertEqual(second_student_dict['email'], 'student2@email.com')
        self.assertEqual(second_student_dict['school_id'], '1')
        filter_first_student_dict = self.student_db.get_student_by_id(self.first_student_id, {'_id':True})
        self.assertEqual(filter_first_student_dict, {'_id': self.first_student_id})
        filter_second_student_dict = self.student_db.get_student_by_id(str(self.second_student_id), {'name':True})
        self.assertEqual(filter_second_student_dict, {'name': 'Student name2', '_id':self.second_student_id})

    def test_add_course_to_student(self):
        new_class_id = self.course_db.create_course(course_name='Programming Studio',
                                                    course_code='CS242',
                                                    teacher_id=self.teacher_id,
                                                    teacher_school_id='0',
                                                    teacher_name='Teacher name')
        self.student_db.add_course(student_id=self.first_student_id,
                                   course_id=new_class_id,
                                   course_name='Programming Studio',
                                   course_code='CS242',
                                   teacher_name='Teacher name')
        self.student_db.add_course(student_id=self.first_student_id,
                                   course_id=new_class_id,
                                   course_name='Programming Studio',
                                   course_code='CS242',
                                   teacher_name='Teacher name')
        first_student_dict = self.student_db.get_student_by_id(self.first_student_id)
        self.assertEqual(first_student_dict['current_courses'][0]['course_code'], 'CS242')
        self.assertEqual(first_student_dict['current_courses'][0]['course_id'], str(new_class_id))
        self.assertEqual(first_student_dict['current_courses'][0]['course_name'], 'Programming Studio')
        self.assertEqual(len(first_student_dict['current_courses']), 1)
        algs_class_id = self.course_db.create_course(course_name='Algs',
                                                     course_code='CS374',
                                                     teacher_id=self.teacher_id,
                                                     teacher_school_id='0',
                                                     teacher_name='Teacher name')
        result = self.student_db.add_course(student_id=self.first_student_id,
                                            course_id=algs_class_id,
                                            course_name='Algs',
                                            course_code='CS374',
                                            teacher_name='Teacher')
        self.assertTrue(result.acknowledged)
        first_student_dict = self.student_db.get_student_by_id(self.first_student_id)
        self.assertEqual(first_student_dict['current_courses'][1]['course_code'], 'CS374')
        self.assertEqual(first_student_dict['current_courses'][1]['course_id'], str(algs_class_id))
        self.assertEqual(first_student_dict['current_courses'][1]['course_name'], 'Algs')
        self.assertEqual(len(first_student_dict['current_courses']), 2)
        print(first_student_dict)


    def test_remove_course_from_student(self):
        new_class_id = self.course_db.create_course(course_name='Programming Studio',
                                                    course_code='CS242',
                                                    teacher_id=self.teacher_id,
                                                    teacher_school_id='0',
                                                    teacher_name='Teacher name')
        self.student_db.add_course(student_id=self.second_student_id,
                                   course_id=new_class_id,
                                   course_name='Programming Studio',
                                   course_code='CS242',
                                   teacher_name='Teacher name')
        second_student_dict = self.student_db.get_student_by_id(self.second_student_id)
        self.assertEqual(len(second_student_dict['current_courses']), 1)
        self.student_db.remove_course(self.second_student_id, new_class_id)
        second_student_dict = self.student_db.get_student_by_id(self.second_student_id)
        self.assertEqual(len(second_student_dict['current_courses']), 0)

    def test_login(self):
        self.assertTrue(self.student_db.email_exist('student@email.com'))
        self.assertFalse(self.student_db.email_exist('studentDNE@email.com'))
        self.assertNotEqual(self.student_db.get_login('student@email.com', 'pass'), None)
        self.assertEqual(self.student_db.get_login('studentDNE@email.com', 'pass'), None)
