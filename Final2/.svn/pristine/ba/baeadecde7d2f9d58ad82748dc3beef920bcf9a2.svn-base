from flask import Flask, request, abort, render_template, jsonify, send_from_directory
from werkzeug.utils import secure_filename

from src.api_server.api_handler import APIServerHandler
import os
import src.constants as constants

from src.polling.poll_handler import PollHandler

UPLOAD_DIR = os.path.dirname(os.path.realpath(__file__)) + '../database/image_storage/'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
TEMPLATE_DIR = os.path.abspath('../web_frontend/')
STATIC_DIR = os.path.abspath('../web_frontend/static/')
app = Flask(__name__, static_folder=STATIC_DIR, template_folder=TEMPLATE_DIR)
app.config['UPLOAD_FOLDER'] = UPLOAD_DIR
api_handler = APIServerHandler()
poll_handler = PollHandler(api_handler.course_db)


@app.route('/')
def get_login_page():
    return render_template('templates/login.html')


@app.route('/api/login', methods=['POST'])
def attempt_login():
    if request.method == 'POST':
        login_result = api_handler.login(email=request.json['email'], password=request.json['password'])
        if login_result is not None:
            return jsonify(login_result)
        abort(401)


@app.route('/api/student/<string:student_id>', methods=['POST', 'GET'])
def process_specific_student(student_id):
    # Get student information
    if request.method == 'GET':
        filter_dict = None
        if 'filter_dict' in request.form:
            filter_dict = request.form['filter_dict']
        result = api_handler.get_student_by_id(str(student_id),
                                               filter_dict=filter_dict)
        if result is not None:
            return result, 200
        abort(404)


@app.route('/api/student/poll', methods=['POST', 'GET'])
def process_student_poll():
    if request.method == 'GET':
        incoming_data = request.json
        result = poll_handler.get_poll_student_view(course_id=incoming_data['course_id'],
                                                    poll_id=incoming_data['poll_id'])
        return jsonify(result)
    elif request.method == 'POST':
        incoming_data = request.json
        result = None
        if incoming_data['message_post_type'] == 'message':
            result = poll_handler.add_message(course_id=incoming_data['course_id'],
                                              poll_id=incoming_data['poll_id'],
                                              user_name=incoming_data['user_name'],
                                              user_type=constants.STUDENT_TYPE,
                                              message=incoming_data['message'])
        elif incoming_data['message_post_type'] == 'response':
            result = poll_handler.add_response(course_id=incoming_data['course_id'],
                                               poll_id=incoming_data['poll_id'],
                                               message_idx=incoming_data['message_idx'],
                                               user_name=incoming_data['user_name'],
                                               user_type=constants.STUDENT_TYPE,
                                               response=incoming_data['response'])
        return jsonify(result), 201


@app.route('/api/teacher/poll', methods=['POST', 'GET'])
def process_student_poll():
    if request.method == 'GET':
        incoming_data = request.json
        result = poll_handler.get_poll_result(course_id=incoming_data['course_id'],
                                              poll_id=incoming_data['poll_id'])
        return jsonify(result)
    elif request.method == 'POST':
        incoming_data = request.json
        result = None
        if incoming_data['message_post_type'] == 'message':
            result = poll_handler.add_message(course_id=incoming_data['course_id'],
                                              poll_id=incoming_data['poll_id'],
                                              user_name=incoming_data['user_name'],
                                              user_type=constants.TEACHER_TYPE,
                                              message=incoming_data['message'])
        elif incoming_data['message_post_type'] == 'response':
            result = poll_handler.add_response(course_id=incoming_data['course_id'],
                                               poll_id=incoming_data['poll_id'],
                                               message_idx=incoming_data['message_idx'],
                                               user_name=incoming_data['user_name'],
                                               user_type=constants.TEACHER_TYPE,
                                               response=incoming_data['response'])
        return jsonify(result), 201


@app.route('/api/student', methods=['POST', 'GET'])
def process_students():
    # create new student
    if request.method == 'POST':
        incoming_data = request.json
        result = api_handler.create_student(name=incoming_data['name'],
                                            password=incoming_data['password'],
                                            year=incoming_data['year'],
                                            email=incoming_data['email'],
                                            school_id=incoming_data['school_id'])
        return jsonify(result), 201
    # get student list
    elif request.method == 'GET':
        pass


@app.route('/api/teacher/<string:teacher_id>')
def process_specific_teacher(teacher_id):
    # Get teacher with _id:teacher_id
    if request.method == 'GET':
        filter_dict = None
        if 'filter_dict' in request.form:
            filter_dict = request.form['filter_dict']
        result = api_handler.get_teacher_by_id(teacher_id=str(teacher_id),
                                               filter_dict=filter_dict)
        if result is not None:
            return result, 200
        abort(404)


@app.route('/api/teacher', methods=['POST'])
def process_teacher():
    # create teacher
    if request.method == 'POST':
        return jsonify(api_handler.create_teacher(name=request.json['name'],
                                                  password=request.json['password'],
                                                  email=request.json['email'],
                                                  school_id=request.json['school_id'])), 201


@app.route('/api/course', methods=['GET', 'POST'])
def handle_courses():
    # create course
    if request.method == 'POST':
        return jsonify(api_handler.create_course(course_name=request.form['course_name'],
                                                 course_code=request.form['course_code'],
                                                 teacher_id=request.form['teacher_id'],
                                                 teacher_school_id=request.form['teacher_school_id'],
                                                 teacher_name=request.form['teacher_name'])), 201
    # Get a list of all courses
    elif request.method == 'GET':
        filter_dict = None
        if 'filter_dict' in request.form:
            filter_dict = request.form['filter_dict']
        result = api_handler.get_all_courses(filter_dict=filter_dict)
        if result is not None:
            return result, 302
        abort(404)


@app.route('/api/course/<string:course_id>')
def process_specific_course(course_id):
    # return info about specific course
    if request.method == 'GET':
        filter_dict = None
        if 'filter_dict' in request.form:
            filter_dict = request.form['filter_dict']
        result = api_handler.get_course_by_id(course_id=course_id,
                                              filter_dict=filter_dict)
        if result is not None:
            return result, 200
        abort(404)


@app.route('/api/course/student', methods=['GET', 'POST'])
def handle_student_course_request():
    # Add student to course
    if request.method == 'POST':
        api_handler.add_student_to_class()
    # Get list of students in class
    elif request.method == 'GET':
        result = api_handler.get_course_by_id(course_id=request.form['course_id'])
        if result is not None:
            return result, 200
        abort(404)


@app.route('/api/session/', methods=['GET', 'POST'])
def handle_session():
    pass

@app.route('/api/image', methods=['GET', 'POST'])
def handle_images():
    if request.method == 'POST':
        if 'file' not in request.files:
            abort(400)
        file = request.files['file']
        if file.filename == '':
            abort(400)
        elif file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return 'OK', 201
    elif request.method == 'GET':
        incoming_data = request.json
        return send_from_directory(app.config['UPLOAD_FOLDER'],
                                   incoming_data['filename'])


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == "__main__":
    app.run()
