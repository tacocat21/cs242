import unittest
from src.controller.commenting.comment import *


class TestComment(unittest.TestCase):
    @classmethod
    def setUp(cls):
        cls.comment_obj = Comment()


    def tearDown(self):
        self.comment_obj.clean_db()

    def test_increment_message_id(self):
        self.assertEqual(increment_message_id('a'), 0)
        self.assertEqual(increment_message_id('a'), 1)
        self.assertEqual(increment_message_id('a'), 2)
        result = Message_count.query.first()
        self.assertEqual(result.num_comments, 2)

    def test_get_last_child(self):
        message_1 = Message('a', 'comment 0', -1)
        message_2 = Message('a', 'comment 1', message_1.message_id)
        message_3 = Message('a', 'comment 2', message_2.message_id)
        message_4 = Message('b', 'comment 0', -1)
        message_1.child = message_2.message_id
        message_2.child = message_3.message_id
        db.session.add(message_1)
        db.session.add(message_2)
        db.session.add(message_3)
        db.session.add(message_4)
        db.session.commit()
        url_messages_a = Message.query.filter_by(url='a').order_by(Message.message_id).all()
        url_messages_b = Message.query.filter_by(url='b').order_by(Message.message_id).all()
        self.assertEqual(self.comment_obj.get_last_child_id(-1, url_messages_a), -1)
        self.assertEqual(self.comment_obj.get_last_child_id(0, url_messages_a), message_3.message_id)
        self.assertEqual(self.comment_obj.get_last_child_id(1, url_messages_a), message_3.message_id)
        self.assertEqual(self.comment_obj.get_last_child_id(0, url_messages_b), 0)
        self.assertEqual(message_1.message_id, 0)
        self.assertEqual(message_2.message_id, 1)
        self.assertEqual(message_3.message_id, 2)
        self.assertEqual(message_4.message_id, 0)

    def test_get_last_subthread_child_id(self):
        message_1 = Message('a', 'comment 0', -1)
        message_2 = Message('a', 'comment 1', message_1.message_id)
        message_3 = Message('a', 'comment 2', message_2.message_id)
        message_4 = Message('a', 'comment 0a', message_1.message_id)
        message_5 = Message('a', 'comment 0b', message_4.message_id)
        message_6 = Message('a', 'comment 1a', message_2.message_id)
        message_1.child = message_2.message_id
        message_1.subthread_child = message_4.message_id
        message_2.subthread_child = message_6.message_id
        message_2.child = message_3.message_id
        message_4.child = message_5.message_id
        db.session.add(message_1)
        db.session.add(message_2)
        db.session.add(message_3)
        db.session.add(message_4)
        db.session.add(message_5)
        db.session.add(message_6)
        db.session.commit()
        url_messages = Message.query.order_by(Message.message_id).all()
        self.assertEqual(self.comment_obj.get_last_subthread_child_id(message_1.message_id, url_messages),
                         message_5.message_id)
        self.assertEqual(self.comment_obj.get_last_subthread_child_id(message_2.message_id, url_messages),
                         message_6.message_id)

    def test_post_message(self):
        head_message = self.comment_obj.post_message('a', 'head node', -1)
        message_1 = self.comment_obj.post_message('a', 'message a1', 0)
        message_2 = self.comment_obj.post_message('a', 'message a2', 0)
        message_3 = self.comment_obj.post_message('a', 'message a3', 0)
        sub_message_1 = self.comment_obj.post_message('a', 'message a0.1 sub', head_message.message_id,
                                                      True)  # subthread
        sub_message_2 = self.comment_obj.post_message('a', 'message a0.2 sub', head_message.message_id, True)
        sub_message_3 = self.comment_obj.post_message('a', 'message a1.1 sub', message_1.message_id, True)
        sub_message_4 = self.comment_obj.post_message('a', 'message a3.1 sub', message_3.message_id, True)
        sub_sub_message_1 = self.comment_obj.post_message('a', 'message a0.1 sub_sub thread', sub_message_1.message_id,
                                                          True)
        self.comment_obj.post_message('b', 'message b0', -1)
        a_list = Message.query.filter_by(url='a').order_by(Message.message_id).all()
        self.assertEqual(self.comment_obj.get_last_child_id(head_message.message_id, a_list), message_3.message_id)
        self.assertEqual(self.comment_obj.get_last_subthread_child_id(head_message.message_id, a_list),
                         sub_message_2.message_id)
        self.assertEqual(self.comment_obj.get_last_subthread_child_id(sub_message_1.message_id, a_list),
                         sub_sub_message_1.message_id)
        self.assertEqual(self.comment_obj.get_last_child_id(message_3.message_id, a_list), message_3.message_id)
        self.assertEqual(self.comment_obj.get_last_subthread_child_id(message_3.message_id, a_list),
                         sub_message_4.message_id)

    def test_get_message(self):
        head_message = self.comment_obj.post_message('a', 'head node', -1)
        message_1 = self.comment_obj.post_message('a', 'message a1', head_message.message_id)
        message_2 = self.comment_obj.post_message('a', 'message a2', head_message.message_id)
        sub_message_1 = self.comment_obj.post_message('a', 'message a0.1 sub', head_message.message_id,
                                                      True)  # subthread
        sub_message_2 = self.comment_obj.post_message('a', 'message a1.1 sub', message_1.message_id, True)
        sub_sub_message_1 = self.comment_obj.post_message('a', 'message a0.1 sub_sub thread', sub_message_1.message_id,
                                                          True)
        result_json = self.comment_obj.get_message('a')
        self.assertEqual(result_json,
                         {'message': 'head node', 'id': head_message.message_id, 'subthread': {
                             'message': 'message a0.1 sub', 'id': sub_message_1.message_id, 'subthread': {
                                 'message': 'message a0.1 sub_sub thread', 'id': sub_sub_message_1.message_id,
                                 'subthread': None, 'child_message': None
                             },
                             'child_message': None
                         },
                          'child_message': {'message': 'message a1', 'id': message_1.message_id, 'subthread': {
                              'message': 'message a1.1 sub', 'id': sub_message_2.message_id, 'subthread': None,
                              'child_message': None
                          },
                                            'child_message': {
                                                'message': 'message a2', 'id': message_2.message_id, 'subthread': None,
                                                'child_message': None
                                            }}})

    def test_filter(self):
        self.assertEqual(self.comment_obj.filter('Niggas in Paris'), '****** in Paris')
        self.assertEqual(self.comment_obj.filter('Fuck the police'), '**** the police')
        self.assertEqual(self.comment_obj.filter('Made the beat then murdered it, Casey Anthony'),
                         'Made the beat then murdered it, Casey Anthony')


if __name__ == '__main__':
    unittest.main()
