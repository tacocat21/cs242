from flask import Flask, send_from_directory, render_template, request
import os
import json
from src.controller.svn_parser.parse_log import ParseLog
from src.controller.svn_parser.parse_list import ParseList
from src.controller.svn_parser.join_data import join_data
from src.controller.commenting.comment import Comment, db
import base64


app = Flask(__name__, static_url_path='/templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../model/comments.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.app=app
db.init_app(app)
parse_list = ParseList(os.path.dirname(__file__) + '/../controller/data/svn_list.xml')
list = parse_list.parse()
parse_log = ParseLog(os.path.dirname(__file__) + '/../controller/data/svn_log.xml')
log = parse_log.parse()
joined_data = join_data(log, list)
comment_obj = Comment(db)


@app.route('/')
def get_page():
    """

    :return: a rendered template of the home page
    """
    return render_template("index.html", assignments=joined_data, json_data=joined_data)


@app.route('/directory/<path:dir_name>')
def get_directory_page(dir_name):
    """

    :param dir_name: path to the directory
    :return: rendered HTML template of the directory
    """
    dir_list = dir_name.split('/')
    corresponding_dict = list[dir_list[0]]
    for idx in range(1, len(dir_list)):
        corresponding_dict = corresponding_dict['subdir'][dir_list[idx]]
    message_obj = comment_obj.get_message(dir_name, True)
    print(message_obj)
    return render_template("directory_page.html",
                            json_data=corresponding_dict,
                            message_json=message_obj)


@app.route('/comment/<path:url_path>', methods=['POST'])
def post_comment(url_path):
    """

    :param url_path: url_path of the message board
    :return: status of the message
    """
    incoming_data = request.form.to_dict()
    if incoming_data['new_subthread'] == 'True':
        incoming_data['new_subthread'] = True
    else:
        incoming_data['new_subthread'] = False
    dir_list = url_path.split('/')
    if len(dir_list) == 1:
        corresponding_dict = list[dir_list[0]]
    else:
        corresponding_dict = list[dir_list[0]]
        for idx in range(1, len(dir_list)-1):
            corresponding_dict = corresponding_dict['subdir'][dir_list[idx]]
        if dir_list[-1] in corresponding_dict['subdir']:
            corresponding_dict = corresponding_dict['subdir'][dir_list[-1]]
        else:
            corresponding_dict = corresponding_dict['files'][dir_list[-1]]
    print(incoming_data)
    comment_obj.post_message(url_path,
                             incoming_data['comment'],
                             int(incoming_data['parent_message_id']),
                             incoming_data['new_subthread'])
    return render_template("comment.html", json_data=corresponding_dict, message_json=comment_obj.get_message(url_path, True))

@app.route('/comment/upvote/<int:message_id>/<path:url_path>', methods=['PUT'])
def upvote(message_id, url_path):
    """
    Increment the number of votes of message_id
    :param message_id: id of the message
    :param url_path: url of the message board
    :return: rendered html file of the message board
    """
    comment_obj.increment_message_votes(url_path, message_id)
    dir_list = url_path.split('/')
    if len(dir_list) == 1:
        corresponding_dict = list[dir_list[0]]
    else:
        corresponding_dict = list[dir_list[0]]
        for idx in range(1, len(dir_list)-1):
            corresponding_dict = corresponding_dict['subdir'][dir_list[idx]]
        if dir_list[-1] in corresponding_dict['subdir']:
            corresponding_dict = corresponding_dict['subdir'][dir_list[-1]]
        else:
            corresponding_dict = corresponding_dict['files'][dir_list[-1]]
    return render_template("comment.html", json_data=corresponding_dict,
                           message_json=comment_obj.get_message(url_path, True))

@app.route('/comment/downvote/<int:message_id>/<path:url_path>', methods=['PUT'])
def downvote(message_id, url_path):
    """
    Decrement the number of votes of message_id
    :param message_id: id of the message
    :param url_path: url of the message board
    :return: rendered html file of the message board
    """
    comment_obj.decrement_message_votes(url_path, message_id)
    dir_list = url_path.split('/')
    if len(dir_list) == 1:
        corresponding_dict = list[dir_list[0]]
    else:
        corresponding_dict = list[dir_list[0]]
        for idx in range(1, len(dir_list)-1):
            corresponding_dict = corresponding_dict['subdir'][dir_list[idx]]
        if dir_list[-1] in corresponding_dict['subdir']:
            corresponding_dict = corresponding_dict['subdir'][dir_list[-1]]
        else:
            corresponding_dict = corresponding_dict['files'][dir_list[-1]]
    return render_template("comment.html", json_data=corresponding_dict,
                           message_json=comment_obj.get_message(url_path, True))



@app.route('/file/<path:file_path>')
def get_file_page(file_path):
    """

    :param file_path: path to the file
    :return: rendered HTML page of a file and its information
    """
    file_dir_list = file_path.split('/')
    corresponding_dict = list[file_dir_list[0]]
    for idx in range(1, len(file_dir_list)-1):
        corresponding_dict = corresponding_dict['subdir'][file_dir_list[idx]]
    corresponding_dict = corresponding_dict['files'][file_dir_list[-1]]
    return render_template("file_page.html",
                           json_data=corresponding_dict,
                           message_json=comment_obj.get_message(file_path))


@app.route('/api/list')
def get_list():
    """

    :return: parsed data of svn list command
    """
    return json.dumps(list)


@app.route('/api/log')
def get_log():
    """

    :return: parsed data of svn log command
    """
    return json.dumps(log)


if __name__ == "__main__()":


    app.run(debug=True)
