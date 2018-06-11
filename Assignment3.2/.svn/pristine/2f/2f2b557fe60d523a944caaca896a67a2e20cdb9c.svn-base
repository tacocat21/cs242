from src.controller.svn_parser.parse_list import ParseList
from src.controller.svn_parser.parse_log import ParseLog
import os

def join_data(svn_log_data, svn_list_data):
    for commit in svn_log_data:
        for path in commit['paths']:
            corresponding_dict = get_corresponding_dict(svn_list_data, path['path'])
            if corresponding_dict is None:
                continue
            if 'summary' in corresponding_dict and corresponding_dict['summary'] is None:
                corresponding_dict['summary'] = commit['msg']
            if 'revision' not in corresponding_dict:
                corresponding_dict['revision'] = []
            corresponding_dict['revision'].append({'author':commit['author'],
                                                   'date':commit['date'],
                                                   'message':commit['msg'],
                                                   'revision_id':commit['revision_id']})

    return svn_list_data


def get_corresponding_dict(svn_list_data, path):
    try:
        path_list = path.replace('/tyamamo2', '', 1).split('/')
        path_list.remove('')
        if len(path_list) == 1:
            if 'summary' not in svn_list_data[path_list[0]]:
                svn_list_data[path_list[0]]['summary'] = None
            return svn_list_data[path_list[0]]
        corresponding_dict = svn_list_data[path_list[0]]
        for idx in range(1, len(path_list)-1):
            corresponding_dict = corresponding_dict['subdir'][path_list[idx]]
        if path_list[-1] in corresponding_dict['subdir']:
            return corresponding_dict['subdir'][path_list[-1]]
        return corresponding_dict['files'][path_list[-1]]
    except:
        return None

if __name__=="__main__":

    parse_list = ParseList(os.getcwd() + '/../data/svn_list.xml')
    parse_log = ParseLog(os.getcwd() + '/../data/svn_log.xml')
    join_result = join_data(parse_log.parse(), parse_list.parse())
    print(join_result)


