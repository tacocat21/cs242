from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Message(db.Model):

    id = db.Column(db.Integer, db.Sequence('user_id_seq'), primary_key=True)
    message_id = db.Column(db.Integer)
    url = db.Column(db.String(200))  # url of the comment board
    comment = db.Column(db.String(200))  # comment of the column
    parent = db.Column(db.Integer)  # parent message id in the comment thread. -1 if no parents
    child = db.Column(db.Integer)  # child message in the comment. -1 if no children
    subthread_child = db.Column(db.Integer)  # child subthread message. -1 if no subthread
    votes = db.Column(db.Integer)
    def __init__(self, message_id, url, comment, parent):
        """
            Message schema to store information about the message. The database is stored in a Nested set model
            with the child column indicating the next message and the subthread_child column indicating the next
            message for the sub-thread

        :param url: url of the message board
        :param comment: string of the message
        :param parent: parent message index

        """
        self.message_id = message_id
        self.url=url
        self.comment=comment
        self.parent=parent
        self.child=-1
        self.subthread_child=-1
        self.votes=0

    def __repr__(self):
        """

        :return: string representation of the message row
        """
        return '(messageID: ' + str(self.message_id) + \
               ', url: ' + self.url + \
               ', comment: ' + self.comment + \
               ', parent: ' + self.parent + \
               ', child: ' + self.child + \
               ', subthread_child: ' + self.subthread_child + ')'

class Message_count(db.Model):


    id = db.Column(db.Integer, db.Sequence('user_id_seq'), primary_key=True)
    url = db.Column(db.String(200))
    num_comments = db.Column(db.Integer)

    def __init__(self, url, num_comments=0):
        """

        :param url: url of the message board
        :param num_comments: number of comments on the board. Used to keep track of index f
        """
        self.url = url
        self.num_comments = num_comments

    def __repr__(self):
        return '<url: ' + self.url + ', num_comments: ' + str(self.num_comments) + '>'
