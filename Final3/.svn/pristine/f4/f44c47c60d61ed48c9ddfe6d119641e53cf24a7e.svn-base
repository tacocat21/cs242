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
        self.teacher_id = self.teacher_db.create_teacher(name='Teacher name',
                                                         password='pass',
                                                         email='teacher@email.com',
                                                         school_id='teacher_id')
        self.algs_class_id = self.course_db.create_course(course_name='Algs',
                                                        course_code='CS374',
                                                        teacher_id=self.teacher_id,
                                                        teacher_school_id='teacher_id',
                                                        teacher_name='Teacher name')
        self.empty_class_id = self.course_db.create_course(course_name='Empty',
                                                          course_code='empty code',
                                                          teacher_id=self.teacher_id,
                                                          teacher_school_id='teacher_id',
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
        self.poll = self.poll_handler.create_poll(course_id=self.algs_class_id,
                                                  location=self.siebel_location,
                                                  poll_type=constants.MC_POLL_TYPE,
                                                  question='question',
                                                  answer='a',
                                                  possible_answers=['a', 'b', 'c', 'd'])

    def test_polling(self):
        self.assertEqual(self.poll_handler.create_poll('unavailable id',
                                                       None,
                                                       None,
                                                       None), None)
        self.assertEqual(self.poll_handler.process_result(course_id=self.algs_class_id,
                                                          poll_id='unavailable id',
                                                          student_location=self.siebel_location,
                                                          response_dict=self.student1_response), None)
        # out of range
        self.assertEqual(self.poll_handler.process_result(course_id=self.algs_class_id,
                                                          poll_id=self.poll['poll_id'],
                                                          student_location=self.grainger_location,
                                                          response_dict=self.student1_response),
                         {'status_code': 403,
                          'message': 'User is too far from classroom'})
        response = self.poll_handler.process_result(course_id=self.algs_class_id,
                                                    poll_id=self.poll['poll_id'],
                                                    student_location=self.siebel_location,
                                                    response_dict=self.student1_response)
        self.assertEqual(response['response'], 'a')
        self.assertEqual(response['_id'], 'student_id1')
        self.assertEqual(response['school_id'], 1)
        self.assertEqual(response['name'], 'student1')
        self.assertEqual(response['is_correct'], True)

    def test_poll_2(self):
        poll1 = self.poll_handler.create_poll(course_id=self.empty_class_id,
                                                 poll_type=constants.TEXT_POLL_TYPE,
                                                 question="question1",
                                                 answer="answer1",
                                                 location=self.siebel_location)
        poll2 = self.poll_handler.create_poll(course_id=self.empty_class_id,
                                                 poll_type=constants.INT_POLL_TYPE,
                                                 question="question2",
                                                 answer=0,
                                                 location=self.siebel_location)
        student1_response = {'student_id': 'student_id1',
                             'school_id': 1,
                             'name': 'student1',
                             'response': 'answer1'}
        student2_response = {'student_id': 'student_id2',
                             'school_id': 2,
                             'name': 'student2',
                             'response': 'wrong'}
        current_polls = self.poll_handler.get_current_polls(self.empty_class_id)
        current_poll_dict = []
        for poll in current_polls:
            current_poll_dict.append(poll.get_poll_dict())
        self.assertTrue(poll1 in current_poll_dict)
        self.assertTrue(poll2 in current_poll_dict)
        process1 = self.poll_handler.process_result(course_id=self.empty_class_id,
                                         poll_id=poll1['poll_id'],
                                         student_location=self.siebel_location,
                                         response_dict=student1_response)
        process2 = self.poll_handler.process_result(course_id=self.empty_class_id,
                                         poll_id=poll1['poll_id'],
                                         student_location=self.siebel_location,
                                         response_dict=student2_response)
        self.poll_handler.add_message(course_id=self.empty_class_id,
                                      poll_id=poll1['poll_id'],
                                      user_name=student1_response['name'],
                                      user_type=constants.STUDENT_TYPE,
                                      message='message1')
        self.poll_handler.add_message(course_id=self.empty_class_id,
                                      poll_id=poll1['poll_id'],
                                      user_name=student1_response['name'],
                                      user_type=constants.STUDENT_TYPE,
                                      message='message2',
                                      image='image')
        poll1 = self.poll_handler.get_poll(self.empty_class_id, poll1['poll_id'])
        self.assertTrue('student_id1' in poll1['student_responses'])
        self.assertEqual(poll1['student_responses']['student_id1'], process1)
        self.assertEqual(poll1['student_responses']['student_id2'], process2)
        self.assertEqual(poll1['messages'][0]['message'], 'message1')
        self.assertTrue('image' not in poll1['messages'][0])
        self.assertEqual(poll1['messages'][1]['message'], 'message2')
        self.assertEqual(poll1['messages'][1]['image'], 'image')
        self.poll_handler.end_poll(course_id=self.empty_class_id,
                                   poll_id=poll1['poll_id'])
        poll_hist = self.poll_handler.get_poll_history(self.empty_class_id)
        self.assertEqual(poll_hist, [poll1])
        self.assertEqual(self.poll_handler.get_poll_history('none'), None)


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
        result = self.poll_handler.end_poll(self.algs_class_id, self.poll['poll_id'])
        self.assertEqual(result, self.poll_handler.get_poll_history(self.algs_class_id)[0])
        self.assertEqual([], self.poll_handler.get_current_polls(self.algs_class_id))

