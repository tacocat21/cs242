import bs4
import iso8601

class ParseLog:
    def __init__(self, file_name):
        self.file_name = file_name
        with open(file_name, 'r') as svn_list:
            try:
                self.soup_object = bs4.BeautifulSoup(svn_list.read(), 'xml')
            except:
                raise RuntimeError('Unable to create BeautifulSoup object from ' + file_name)
        self.result = []

    def parse(self):
        log_entry_list = self.soup_object.find_all('logentry')
        for entry in log_entry_list:
            self.parse_log_entry(entry)
        return self.result

    def parse_log_entry(self, entry):
        try:
            revision_id = int(entry.attrs['revision'])
            revision_dict = {'revision_id':revision_id}
            author_tag = entry.find('author')
            if author_tag is not None:
                revision_dict['author'] = author_tag.string
            date_tag = entry.find('date')
            if date_tag is not None:
                date_obj = iso8601.parse_date(date_tag.string)
                revision_dict['date'] = str(date_obj.ctime())
            paths_tag = entry.find('paths')
            if paths_tag is not None:
                path_list = paths_tag.find_all('path')
                revision_dict['paths'] = self.get_path_list(path_list)
            msg_tag = entry.find('msg')
            if msg_tag is not None:
                revision_dict['msg'] = msg_tag.string
            self.result.append(revision_dict)
        except:
            return None

    def get_path_list(self, path_list):
        result = []
        for path in path_list:
            try:
                path_dict = {}
                path_dict['kind'] = path.attrs['kind']
                path_dict['action'] = path.attrs['action']
                path_dict['path'] = path.string
                result.append(path_dict)
            except:
                continue
        return result

if __name__=="__main__":
    p = ParseLog('../data/svn_log.xml')
    result = p.parse()
    print(result)