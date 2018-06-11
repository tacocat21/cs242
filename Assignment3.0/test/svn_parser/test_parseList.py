import os
from unittest import TestCase

from src.controller.svn_parser.parse_list import ParseList


class TestParseList(TestCase):
    def setUp(self):
        curr_dir = os.path.dirname(__file__)
        self.parser_test_file1 = ParseList(curr_dir + '/test_list.xml')
        self.result_test_file1 = self.parser_test_file1.parse()

        self.parser_test_file2 = ParseList(curr_dir +'/test_file_list.xml')

    def test_parse(self):
        self.assertEqual(self.result_test_file1['base_path'],
                         'https://subversion.ews.illinois.edu/svn/sp17-cs242/tyamamo2')
        self.assertTrue('Assignment1.0' in self.result_test_file1)
        self.assertTrue('Assignment2.0' in self.result_test_file1)
        self.assertTrue('Assignment3.0' in self.result_test_file1)

    def test_parse_helpers(self):
        entry_list = self.parser_test_file2.soup_object.find_all('entry')
        self.parser_test_file2.parse_dir_entry(entry_list[0])
        self.parser_test_file2.parse_dir_entry(entry_list[1])
        self.parser_test_file2.parse_dir_entry(entry_list[2])
        self.parser_test_file2.parse_file_entry(entry_list[3])
        self.assertEqual(self.parser_test_file2.result['Assignment2.0']['files']['test'], {'type': 'file',
                                                                                          'size': 522,
                                                                                          'commit': {'revision_number':5967,
                                                                                                     'author':'author4',
                                                                                                     'date':'2017-02-28T19:28:00.653785Z'},
                                                                                          'url': 'Assignment2.0/test'})
        self.assertEqual(self.parser_test_file2.result['Assignment2.0'], {'type': 'dir',
                                                                          'subdir': {'folder':{'type':'dir',
                                                                                               'subdir':{},
                                                                                               'files':{},
                                                                                               'commit':{'revision_number':1,
                                                                                                         'author':'author3',
                                                                                                         'date':'2017-02-28T19:28:00.653785Z'},
                                                                                               'url': 'Assignment2.0/folder'}},
                                                                          'files': {'test':{'type': 'file',
                                                                                          'size': 522,
                                                                                          'commit': {'revision_number':5967,
                                                                                                     'author':'author4',
                                                                                                     'date':'2017-02-28T19:28:00.653785Z'},
                                                                                          'url': 'Assignment2.0/test'}},
                                                                          'commit': {'revision_number':6587,
                                                                                     'author':'author2',
                                                                                     'date':'2017-03-07T18:56:45.025712Z'},
                                                                          'url': 'Assignment2.0'})
        self.assertEqual(self.parser_test_file2.result['Assignment1.0'], {'type': 'dir',
                                                                          'subdir': {},
                                                                          'files': {},
                                                                          'commit': {'revision_number':5382,
                                                                                     'author':'tyamamo2',
                                                                                     'date':'2017-02-21T19:24:04.747487Z'},
                                                                          'url': 'Assignment1.0'})

    def test_get_entry_name(self):
        entry_list = self.parser_test_file2.soup_object.find_all('entry')
        self.assertEqual(self.parser_test_file1.get_entry_name(entry_list[0]), 'Assignment1.0')
        self.assertEqual(self.parser_test_file1.get_entry_name(entry_list[1]), 'Assignment2.0')
        self.assertEqual(self.parser_test_file1.get_entry_name(entry_list[2]), 'Assignment2.0/folder')
        self.assertEqual(self.parser_test_file1.get_entry_name(entry_list[3]), 'Assignment2.0/test')

    def test_get_commit_info(self):
        entry_list = self.parser_test_file1.soup_object.find_all('entry')
        file_commit_info = {'commit':{}}
        folder_commit_info = {'commit':{}}
        self.parser_test_file1.get_commit_info(file_commit_info, entry_list[5])
        self.parser_test_file1.get_commit_info(folder_commit_info, entry_list[0])
        self.assertEqual(file_commit_info['commit'], {'revision_number':5967,
                                            'author':'tyamamo2',
                                            'date':'2017-02-28T19:28:00.653785Z'})
        self.assertEqual(folder_commit_info['commit'], {'revision_number':5382,
                                              'author':'tyamamo2',
                                              'date':'2017-02-21T19:24:04.747487Z'})

