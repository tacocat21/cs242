from flask import Flask, request, abort, render_template, jsonify, send_from_directory, Blueprint
view = Blueprint('view', __name__)


@view.route('/')
def get_login_page():
    return render_template('login/login.html')


@view.route('/intro')
def get_intro_page():
    return render_template('userIntro/userIntro.html')


@view.route('/message')
def get_message_page():
    return render_template('message/message.html')


@view.route('/course/view/<string:course_id>')
def get_course_page(course_id):
    return render_template('courseView/courseView.html')

@view.route('/poll/view/<string:course_id>/<string:poll_id>')
def get_poll_page(course_id, poll_id):
    return render_template('pollView/pollView.html')

@view.route('/poll/result/<string:course_id>/<string:poll_id>')
def get_poll_result_page(course_id, poll_id):
    return render_template('pollResult/pollResult.html')


@view.route('/course/list')
def get_list_course_page():
    return render_template('courseListing/courseListing.html')

@view.route('/course/create')
def get_create_course_page():
    return render_template('createCourse/createCourse.html')


@view.route('/poll/create/<string:course_id>')
def get_create_poll_page(course_id):
    return render_template('createPoll/createPoll.html')

