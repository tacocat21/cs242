from unittest import TestCase
from pymongo import MongoClient
from src.database.teacherdb import TeacherDB
from src.database.course_database import CourseDB


class TestTeacherDatabase(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = MongoClient()
        cls.teacher_db = TeacherDB(cls.client, testing=True)
        cls.course_db = CourseDB(cls.client, testing=True)
        cls.first_teacher_id = cls.teacher_db.create_teacher(name='Teacher name', password="pass",
                                                             email='teacher@email.com', school_id='0')
        cls.second_teacher_id = cls.teacher_db.create_teacher(name='Teacher name2', password="pass",
                                                              email='teacher2@email.com', school_id='1')

    def test_create_teacher(self):
        first_teacher_dict = self.teacher_db.get_teacher_by_id(self.first_teacher_id)
        second_teacher_dict = self.teacher_db.get_teacher_by_id(str(self.second_teacher_id))
        self.assertEqual(first_teacher_dict['name'], 'Teacher name')
        self.assertEqual(first_teacher_dict['email'], 'teacher@email.com')
        self.assertEqual(first_teacher_dict['school_id'], '0')
        self.assertEqual(second_teacher_dict['name'], 'Teacher name2')
        self.assertEqual(second_teacher_dict['email'], 'teacher2@email.com')
        self.assertEqual(second_teacher_dict['school_id'], '1')
        self.assertEqual(self.teacher_db.get_teacher_by_id(self.first_teacher_id), self.teacher_db.get_teacher_by_id(self.first_teacher_id), {})

    def test_add_course(self):
        new_class_id = self.course_db.create_course(course_name='Programming Studio',
                                                    course_code='CS242',
                                                    teacher_id=self.first_teacher_id,
                                                    teacher_school_id='0',
                                                    teacher_name='Teacher name')
        self.teacher_db.add_course(teacher_id=self.first_teacher_id,
                                   course_id=new_class_id,
                                   course_name='Programming Studio',
                                   course_code='CS242')
        self.teacher_db.add_course(teacher_id=self.first_teacher_id,
                                   course_id=new_class_id,
                                   course_name='Programming Studio',
                                   course_code='CS242')
        first_teacher_dict = self.teacher_db.get_teacher_by_id(self.first_teacher_id)
        self.assertEqual(first_teacher_dict['current_courses'][0]['course_code'], 'CS242')
        self.assertEqual(first_teacher_dict['current_courses'][0]['course_id'], str(new_class_id))
        self.assertEqual(first_teacher_dict['current_courses'][0]['course_name'], 'Programming Studio')
        self.assertEqual(len(first_teacher_dict['current_courses']), 1)
        algs_class_id = self.course_db.create_course(course_name='Algs',
                                                     course_code='CS374',
                                                     teacher_id=self.first_teacher_id,
                                                     teacher_school_id='0',
                                                     teacher_name='Teacher name')
        result = self.teacher_db.add_course(teacher_id=self.first_teacher_id,
                                            course_id=algs_class_id,
                                            course_name='Algs',
                                            course_code='CS374')
        self.assertTrue(result.acknowledged)
        first_teacher_dict = self.teacher_db.get_teacher_by_id(self.first_teacher_id)
        self.assertEqual(first_teacher_dict['current_courses'][1]['course_code'], 'CS374')
        self.assertEqual(first_teacher_dict['current_courses'][1]['course_id'], str(algs_class_id))
        self.assertEqual(first_teacher_dict['current_courses'][1]['course_name'], 'Algs')
        self.assertEqual(len(first_teacher_dict['current_courses']), 2)
        print(first_teacher_dict)

    def test_remove_course(self):
        new_class_id = self.course_db.create_course(course_name='Programming Studio',
                                                    course_code='CS242',
                                                    teacher_id=self.first_teacher_id,
                                                    teacher_school_id='0',
                                                    teacher_name='Teacher name')
        self.teacher_db.add_course(teacher_id=self.second_teacher_id,
                                   course_id=new_class_id,
                                   course_name='Programming Studio',
                                   course_code='CS242')
        second_teacher_dict = self.teacher_db.get_teacher_by_id(self.second_teacher_id)
        self.assertEqual(len(second_teacher_dict['current_courses']), 1)
        self.teacher_db.remove_course(self.second_teacher_id, new_class_id)
        second_teacher_dict = self.teacher_db.get_teacher_by_id(self.second_teacher_id)
        self.assertEqual(len(second_teacher_dict['current_courses']), 0)
