from unittest import TestCase
import src.constants as constants
from src.polling.poll import Poll


class TestPoll(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.poll = Poll('poll_id1',
                        constants.MC_POLL_TYPE,
                        'question 1',
                        'a',
                        ['a', 'b','c','d'])
        cls.student1_response = {'student_id':'student_id1',
                                 'school_id':1,
                                 'name':'student1',
                                 'response':'a'}
        cls.student2_response = {'student_id':'student_id2',
                                 'school_id':2,
                                 'name':'student2',
                                 'response':'b'}

    def test_add_poll_result_from_student(self):
        self.poll.add_poll_result_from_student(self.student1_response)
        self.poll.add_poll_result_from_student(self.student2_response)
        result = self.poll.get_poll_dict()
        self.assertEqual(result['student_responses'], self.poll.get_student_responses())
        self.assertEqual(result['question'], 'question 1')
        self.assertEqual(result['answer'], 'a')
        self.assertEqual(result['student_responses']['student_id1']['response'], 'a')
        self.assertEqual(result['student_responses']['student_id1']['name'], 'student1')
        self.assertEqual(result['student_responses']['student_id1']['school_id'], 1)
        self.assertEqual(result['student_responses']['student_id1']['_id'], 'student_id1')
        self.assertEqual(result['student_responses']['student_id1']['is_correct'], True)
        self.assertEqual(result['student_responses']['student_id2']['response'], 'b')
        self.assertEqual(result['student_responses']['student_id2']['name'], 'student2')
        self.assertEqual(result['student_responses']['student_id2']['school_id'], 2)
        self.assertEqual(result['student_responses']['student_id2']['_id'], 'student_id2')
        self.assertEqual(result['student_responses']['student_id2']['is_correct'], False)

    def test_get_id(self):
        self.assertEqual(self.poll.get_id(), 'poll_id1')

