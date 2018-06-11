import os
from unittest import TestCase

from src.controller.svn_parser.parse_log import ParseLog


class TestParseLog(TestCase):
    def setUp(self):
        curr_dir = os.path.dirname(__file__)
        self.parser = ParseLog(curr_dir + '/test_log.xml')
        self.log_entry_list = self.parser.soup_object.find_all('logentry')

    def test_get_path_list(self):
        entry_0_path = self.log_entry_list[0].find_all('path')
        entry_1_path = self.log_entry_list[1].find_all('path')
        entry_2_path = self.log_entry_list[2].find_all('path')
        self.assertEqual(self.parser.get_path_list(entry_0_path), [])
        self.assertEqual(self.parser.get_path_list(entry_1_path), [{'kind': 'dir', 'action': 'A', 'path': '/tyamamo2'}])
        self.assertEqual(self.parser.get_path_list(entry_2_path),
                         [{'kind': 'dir', 'action': 'A', 'path': '/tyamamo2/grocery'},
                          {'kind': 'file', 'action': 'A', 'path': '/tyamamo2/grocery/list1.txt'},
                          {'kind': 'file', 'action': 'M', 'path': '/tyamamo2/grocery/list2.txt'}])

    def test_parse(self):
        result = self.parser.parse()
        self.assertEqual(result, {0: {'author': 'empty',
                                      'date': '2017-03-12T21:13:40.946460Z',
                                      'paths': [],
                                      'msg': None},
                                  169: {'author': 'root',
                                        'date': '2017-01-24T19:28:06.057555Z',
                                        'paths': [{'kind': 'dir', 'action': 'A', 'path': '/tyamamo2'}],
                                        'msg': 'created directory tyamamo2'},
                                  1081: {'author': 'author3',
                                         'date': '2017-01-27T19:07:37.487210Z',
                                         'paths': [{'kind': 'dir', 'action': 'A', 'path': '/tyamamo2/grocery'},
                                                   {'kind': 'file', 'action': 'A',
                                                    'path': '/tyamamo2/grocery/list1.txt'},
                                                   {'kind': 'file', 'action': 'M',
                                                    'path': '/tyamamo2/grocery/list2.txt'}],
                                         'msg': 'importing grocery project'}})
