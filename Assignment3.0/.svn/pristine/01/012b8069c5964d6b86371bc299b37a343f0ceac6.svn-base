import bs4
import time

"""
    Class to parse the result of "svn list --xml --recursive" XML file
"""


class ParseList:
    def __init__(self, file_name):
        self.file_name = file_name
        with open(file_name, 'r') as svn_list:
            try:
                self.soup_object = bs4.BeautifulSoup(svn_list.read(), 'xml')
            except:
                raise RuntimeError('Unable to create BeautifulSoup object from ' + file_name)
        self.result = {}

    def parse(self):
        """

        :return:
        """
        if len(self.result) != 0:
            return self.result
        list_tag = self.soup_object.find('list')
        base_path = list_tag['path']
        if base_path is not None:
            self.result['base_path'] = base_path
        entry_list = list_tag.find_all('entry')
        self.parse_entries(entry_list)
        return self.result

    def parse_entries(self, entry_list):
        for entry in entry_list:
            kind = entry.attrs['kind']
            if kind == 'file':
                self.parse_file_entry(entry)
            elif kind == 'dir':
                self.parse_dir_entry(entry)

    def parse_file_entry(self, entry):
        try:
            name_tag_list = self.get_entry_name(entry).split('/')
            file_name = name_tag_list[-1]
            corresponding_dict = self.result[name_tag_list[0]]
            for idx in range(1, len(name_tag_list) - 1):
                corresponding_dict = corresponding_dict['subdir'][name_tag_list[idx]]
            corresponding_dict['files'][file_name] = {'url':self.get_entry_name(entry),
                                                      'type':'file',
                                                      'size':-1,
                                                      'commit':{}}
            file_dict = corresponding_dict['files'][file_name]
            self.get_commit_info(file_dict, entry)
            size_tag = entry.find('size')
            if size_tag is not None:
                file_dict['size'] = int(size_tag.string)
        except:
            print('Unable to parse file entry ' + str(entry))

    def parse_dir_entry(self, entry):
        try:
            name_tag_list = self.get_entry_name(entry).split('/')
            if len(name_tag_list) == 1:
                self.result[name_tag_list[0]] = {'url':self.get_entry_name(entry),
                                                 'type': 'dir',
                                                 'subdir': {},
                                                 'files': {},
                                                 'commit': {}}
                corresponding_dict = self.result[name_tag_list[0]]
                self.get_commit_info(corresponding_dict, entry)
            else:
                corresponding_dict = self.result[name_tag_list[0]]
                for idx in range(1, len(name_tag_list)-1):
                    corresponding_dict = corresponding_dict['subdir'][name_tag_list[idx]]
                corresponding_dict['subdir'][name_tag_list[-1]] = {'url': self.get_entry_name(entry),
                                                                   'type': 'dir',
                                                                   'subdir': {},
                                                                   'files': {},
                                                                   'commit': {}}
                self.get_commit_info(corresponding_dict['subdir'][name_tag_list[-1]], entry)
        except:
            print('Unable to parse dir entry ' + str(entry))


    def get_entry_name(self, entry):
        return entry.find('name').string

    def get_commit_info(self, corresponding_dict, entry):
        commit_tag = entry.find('commit')
        if commit_tag is None:
            return
        corresponding_dict['commit']['revision_number'] = int(commit_tag.attrs['revision'])
        author_tag = commit_tag.find('author')
        if author_tag is not None:
            corresponding_dict['commit']['author'] = author_tag.string
        date_tag = commit_tag.find('date')
        if date_tag is not None:
            corresponding_dict['commit']['date'] = date_tag.string


if __name__=="__main__":
    begin_time = time.time()
    parse_list = ParseList('../data/svn_list.xml')
    result = parse_list.parse()
    end_time = time.time()
    print(result)
    print('finished in ' + str(end_time - begin_time))