from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from src.model.comment_database import Message, db, Message_count


# db.init_app(app)

class Comment:
    def __init__(self, database):
        """

        :param database: database to store data
        """
        self.db = database
        self.db.create_all()
        self.filter_words = set(['fuck', 'asshole', 'cunt', 'whore', 'bitch', 'niggas'])

    def clean_db(self):
        """
        Clears the database from all data
        :return: None
        """
        self.db.drop_all()

    def post_message(self, url, comment_message, parent_message_id, is_subthread=False):
        """

        :param url: url of the message
        :param comment_message: message string
        :param parent_message_id: parent message's id
        :param is_subthread: If true, then add this message as a subthread. Else, add as a child
        :return: the added message object
        """
        filtered_message=self.filter(comment_message)
        try:
            url_messages = Message.query.filter_by(url=url).order_by(Message.message_id).all()
        except:
            new_message = Message(message_id=self.increment_message_id(url), url=url, comment=filtered_message, parent=-1)
            self.db.session.add(new_message)
            self.db.session.commit()
            return new_message
        if len(url_messages)==0:
            new_message = Message(message_id=self.increment_message_id(url), url=url, comment=filtered_message, parent=-1)
            self.db.session.add(new_message)
            self.db.session.commit()
            return new_message
        parent_message = url_messages[parent_message_id]
        if is_subthread:
            parent_id = self.get_last_subthread_child_id(parent_message.message_id, url_messages)
            # invalid parent id
            if parent_id < 0:
                return
            new_message = Message(message_id=self.increment_message_id(url), url=url, comment=filtered_message, parent=parent_id)
            new_parent_message = url_messages[parent_id]
            # the parent node does not have any subthread children
            if parent_id == parent_message.message_id:
                new_parent_message.subthread_child = new_message.message_id
            else:
                new_parent_message.child = new_message.message_id
        else:
            parent_id = self.get_last_child_id(parent_message_id, url_messages)
            new_message = Message(message_id=self.increment_message_id(url), url=url, comment=filtered_message, parent=parent_id)
            new_parent_message = url_messages[parent_id]
            new_parent_message.child = new_message.message_id
        self.db.session.add(new_message)
        self.db.session.commit()
        return new_message


    def increment_message_votes(self, message_url, message_id):
        """
        Increments the message votes
        :return the number of likes for the message with message_id
        """
        if message_id < 0:
            return
        try:
            message = Message.query.filter_by(url=message_url, message_id=message_id).first()
            message.votes += 1
            self.db.session.commit()
            return message.votes
        except:
            return None

    def decrement_message_votes(self, message_url, message_id):
        """
        Decrements the message votes
        :return the number of likes for the message with message_id
        """
        if message_id < 0:
            return
        try:
            message = Message.query.filter_by(url=message_url, message_id=message_id).first()
            message.votes -= 1
            self.db.session.commit()
            return message.votes
        except:
            return None

    def get_last_subthread_child_id(self, parent_message_id, url_messages):
        """

        :param parent_message_id: id of the parent message
        :param url_messages: url of the message
        :return: the message object of the last subthread object
        """
        if parent_message_id < 0:
            return parent_message_id
        parent_message = url_messages[parent_message_id]
        if parent_message.subthread_child == -1:
            return parent_message.message_id
        subthread_child_id = parent_message.subthread_child
        return self.get_last_child_id(subthread_child_id, url_messages)

    def get_last_child_id(self, parent_message_id, url_messages):
        """

        :param parent_message_id: id of the parent message
        :param url_messages: url of the message
        :return: the message object of the last child object
        """
        # url_messages is a list
        if parent_message_id < 0:
            return -1
        else:
            parent_message = url_messages[parent_message_id]
            if parent_message.child == -1:
                return parent_message.message_id
            return self.get_last_child_id(parent_message.child, url_messages)


    def get_message(self, url, sort_by_votes=False):
        """
        
        :param url: url of the message board
        :param sort_by_votes: If true, the json is sorted by the number of votes
        :return: json representation of the message
        """
        try:
            message_list = Message.query.filter_by(url=url).order_by(Message.message_id).all()
        except:
            return {}
        head = {}
        mapping = {}
        for message in message_list:
            id = message.message_id
            mapping[id] = {'message':message.comment,
                           'id':id,
                           'subthread':None,
                           'child_message':None,
                           'votes':message.votes
                           }
            parent_message_id = message.parent
            parent_message_obj = message_list[parent_message_id]
            if parent_message_id == -1:
                head = mapping[id]
            elif parent_message_obj.child == id: # if the parent's child node ID is equal to this node's id
                parent_map_obj = mapping[parent_message_id]
                parent_map_obj['child_message'] = mapping[id]
            elif parent_message_obj.subthread_child == id: # if the parent's subthread node ID is equal to this node's id
                parent_map_obj = mapping[parent_message_id]
                parent_map_obj['subthread'] = mapping[id]

        if sort_by_votes:
            return self.sort_by_votes(head)
        return head

    def sort_by_votes(self, head_dict):
        """

        :param head_dict: head dictionary
        :return: return a sorted json object
        """
        if head_dict is None or len(head_dict)==0:
            return {}
        result = head_dict
        max_node = head_dict
        max_node_prev = None
        curr_node = head_dict
        while curr_node is not None: # find node with highest number of votes
            print(curr_node)
            if curr_node['child_message'] is not None:
                if curr_node['child_message']['votes'] > max_node['votes']:
                    max_node = curr_node['child_message']
                    max_node_prev = curr_node
            curr_node = curr_node['child_message']
        if max_node['id'] != head_dict['id']: # set max_node as the head
            max_node_prev['child_message'] = max_node['child_message']
            max_node['child_message'] = head_dict
        max_node['subthread'] = self.sort_by_votes(max_node['subthread']) # sort subthread list
        max_node['child_message'] = self.sort_by_votes(max_node['child_message']) # sort child sublist
        return max_node

    def filter(self, message):
        """
        
        :param message: message to filter 
        :return: Filters naughty words and replaces it with ****
        """
        word_list = message.split(' ')
        result = []
        for word in word_list:
            if word.lower() in self.filter_words:
                result.append(('*'*len(word)))
            else:
                result.append(word)
        return ' '.join(result)

    def increment_message_id(self, url):
        """

        :param url: url of the message board
        :return: number of counts of the message board
        """
        try:
            message_count_row = Message_count.query.filter_by(url=url).first()
        except:
            message_count_row = None
        # url not found
        if message_count_row is None:
            new_message_count = Message_count(url=url, num_comments=0)
            self.db.session.add(new_message_count)
            self.db.session.commit()
            return 0
        else:
            message_count_row.num_comments += 1
            self.db.session.commit()
            return message_count_row.num_comments

if __name__ == "__main__":
    comment = Comment()
    comment.increment_message_id('a')
    comment.increment_message_id('a')
    comment.increment_message_id('a')
    # comment.increment_message_id('a')
    # s = select([comment.message_count])
    # result = comment.session.query(comment.message_count).alll()
    result = Message_count.query.all()
    for row in result:
        print(row)
    # result.close()


