from unittest import TestCase

from pymongo import MongoClient
import src.constants as constants
from src.database.course_database import CourseDB
from src.database.teacherdb import TeacherDB
from src.polling.poll_handler import PollHandler


class TestPollHandler(TestCase):
    def setUp(self):
        self.client = MongoClient()
        self.course_db = CourseDB(self.client, testing=True)
        self.teacher_db = TeacherDB(self.client, testing=True)
        self.teacher_id = self.teacher_db.create_teacher(name='Teacher name', password=str, email='teacher@email.com',
                                                         school_id=0)
        self.algs_class_id = self.course_db.create_course(course_name='Algs',
                                                        course_code='CS374',
                                                        teacher_id=self.teacher_id,
                                                        teacher_school_id=0,
                                                        teacher_name='Teacher name')
        self.poll_handler = PollHandler(self.course_db)
        self.siebel_location = (40.113803, -88.224905)
        self.grainger_location = (40.1125, -88.226917)
        self.student1_response = {'student_id': 'student_id1',
                                 'school_id': 1,
                                 'name': 'student1',
                                 'response': 'a'}
        self.student2_response = {'student_id': 'student_id2',
                                 'school_id': 2,
                                 'name': 'student2',
                                 'response': 'b'}
        self.poll_handler.create_session(self.algs_class_id,
                                         'course_nameA',
                                         'codeA',
                                         self.siebel_location)
        self.poll = self.poll_handler.create_poll(session_id=self.algs_class_id,
                                                  poll_type=constants.MC_POLL_TYPE,
                                                  question='question',
                                                  answer='a',
                                                  possible_answers=['a', 'b', 'c', 'd'])

    def test_polling(self):
        self.assertEqual(self.poll_handler.create_poll('unavailable id',
                                                       None,
                                                       None,
                                                       None), None)
        self.assertEqual(self.poll_handler.process_result(session_id=self.algs_class_id,
                                                          poll_id='unavailable id',
                                                          student_location=self.siebel_location,
                                                          response_dict=self.student1_response), None)
        # out of range
        self.assertEqual(self.poll_handler.process_result(session_id=self.algs_class_id,
                                                          poll_id=self.poll.get_id(),
                                                          student_location=self.grainger_location,
                                                          response_dict=self.student1_response),
                         {'status_code': 403,
                          'message': 'User is too far from classroom'})
        response = self.poll_handler.process_result(session_id=self.algs_class_id,
                                                    poll_id=self.poll.get_id(),
                                                    student_location=self.siebel_location,
                                                    response_dict=self.student1_response)
        self.assertEqual(response['response'], 'a')
        self.assertEqual(response['_id'], 'student_id1')
        self.assertEqual(response['school_id'], 1)
        self.assertEqual(response['name'], 'student1')
        self.assertEqual(response['is_correct'], True)

    def test_random_string(self):
        self.assertEqual(len(self.poll_handler.random_string(20)), 20)
        self.assertNotEqual(self.poll_handler.random_string(20), self.poll_handler.random_string(20))
        self.assertNotEqual(self.poll_handler.random_string(20), self.poll_handler.random_string(20))
        self.assertNotEqual(self.poll_handler.random_string(20), self.poll_handler.random_string(20))
        self.assertNotEqual(self.poll_handler.random_string(20), self.poll_handler.random_string(20))
        self.assertNotEqual(self.poll_handler.random_string(20), self.poll_handler.random_string(20))
        self.assertNotEqual(self.poll_handler.random_string(20), self.poll_handler.random_string(20))

    def test_end_poll(self):
        self.assertEqual(self.poll_handler.end_poll('unavailable id', None), None)
        result = self.poll_handler.end_poll(self.algs_class_id, self.poll.get_id())
        self.assertEqual(result, self.poll_handler.get_poll_history(self.algs_class_id)[0].get_poll_dict())
        self.assertEqual([], self.poll_handler.get_current_polls(self.algs_class_id))

    def test_end_session(self):
        self.assertEqual(self.poll_handler.end_session('unavailable id'), None)
        pre_end_session_dict = self.course_db.get_course_by_id(self.algs_class_id)
        print(pre_end_session_dict)
        self.poll_handler.end_session(self.algs_class_id)
        post_end_session_dict = self.course_db.get_course_by_id(self.algs_class_id)
        print(post_end_session_dict)
        self.assertEqual(len(pre_end_session_dict['poll_session']), len(post_end_session_dict['poll_session'])-1)
        self.assertTrue(self.algs_class_id not in self.poll_handler.available_session)


