from flask import Flask, request, abort, render_template, jsonify, send_from_directory, Blueprint
from binascii import a2b_base64, b2a_base64
from src.api_server.api_handler import APIServerHandler
import os
import src.constants as constants
from src.polling.poll_handler import PollHandler

UPLOAD_DIR = os.path.dirname(os.path.realpath(__file__)) + '/../database/image_storage/'
print(UPLOAD_DIR)
api = Blueprint('api', __name__)
api_handler = APIServerHandler()
# api_handler.clearDB()
poll_handler = PollHandler(api_handler.course_db)

@api.route('/login', methods=['POST'])
def attempt_login():
    if request.method == 'POST':
        login_result = api_handler.login(email=request.json['email'], password=request.json['password'])
        if login_result is not None:
            return jsonify(login_result)
        abort(401)


@api.route('/student/<string:student_id>', methods=['POST', 'GET'])
def process_specific_student(student_id):
    # Get student information
    if request.method == 'GET':
        try:
            filter_dict = request.args.get('filter_dict')
        except:
            print('except called')
            filter_dict = None
        print(student_id)
        result = api_handler.get_student_by_id(str(student_id),
                                               filter_dict=filter_dict)

        if result is not None:
            return jsonify(result), 200
        abort(404)


@api.route('/student', methods=['POST', 'GET'])
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


@api.route('/teacher', methods=['POST'])
def process_teacher():
    # create teacher
    if request.method == 'POST':
        return jsonify(api_handler.create_teacher(name=request.json['name'],
                                                  password=request.json['password'],
                                                  email=request.json['email'],
                                                  school_id=request.json['school_id'])), 201


@api.route('/course', methods=['GET', 'POST'])
def handle_courses():
    # create course
    if request.method == 'POST':
        incoming_data = request.json
        return jsonify(api_handler.create_course(course_name=incoming_data['course_name'],
                                                 course_code=incoming_data['course_code'],
                                                 teacher_id=incoming_data['teacher_id'],
                                                 teacher_school_id=incoming_data['teacher_school_id'],
                                                 teacher_name=incoming_data['teacher_name'])), 201
    # Get a list of all courses
    elif request.method == 'GET':
        filter_dict = request.args.get('filter_dict')
        print(filter_dict)
        result = api_handler.get_all_courses(filter_dict=filter_dict)
        print(result)
        if result is not None:
            return jsonify(result), 200
        abort(404)


@api.route('/course/<string:course_id>')
def process_specific_course(course_id):
    # return info about specific course
    if request.method == 'GET':
        filter_dict = request.args.get('filter_dict')
        result = api_handler.get_course_by_id(course_id=course_id,
                                              filter_dict=filter_dict)
        print(result)
        if result is not None:
            return jsonify(result), 200
        abort(404)


@api.route('/course/student', methods=['GET', 'POST'])
def handle_student_course_request():
    # Add student to course
    if request.method == 'POST':
        incoming_data = request.json
        result = api_handler.add_student_to_class(student_id=incoming_data['student_id'],
                                                  course_id=incoming_data['course_id'])
        if result is not None:
            return jsonify(result), 201
        abort(400)
    # Get list of students in class
    elif request.method == 'GET':
        result = api_handler.get_course_by_id(course_id=request.form['course_id'])
        if result is not None:
            return result, 200
        abort(404)


@api.route('/poll/<string:course_id>/<string:poll_id>', methods=['GET', 'POST', 'PUT'])
def handle_single_poll(course_id, poll_id):
    if request.method == 'GET':
        # get poll data
        result = poll_handler.get_poll(course_id=course_id, poll_id=poll_id)
        print(result)
        if result is not None:
            return jsonify(result), 200
        abort(404)
    if request.method == 'POST':
        # add student response
        incoming_data = request.json
        location = None
        if 'location' in incoming_data:
            location = incoming_data['location']
        print(incoming_data)
        result = poll_handler.process_result(course_id, poll_id, location, incoming_data)
        print(result)
        if result is not None:
            return jsonify(result), 201
        abort(400)

    if request.method == 'PUT':
        # end poll
        result = poll_handler.end_poll(course_id, poll_id)
        print(result)
        if result is not None:
            return jsonify(result), 200
        abort(404)


@api.route('/poll/<string:course_id>', methods=['GET', 'POST'])
def handle_poll(course_id):
    if request.method == 'POST':
        # create poll
        try:
            incoming_data = request.json
            possible_answers = []
            if 'possible_answers' in incoming_data:
                possible_answers = incoming_data['possible_answers']
            image = None
            if 'image' in incoming_data:
                image = incoming_data['image']
            location = None
            if 'location' in incoming_data:
                location = incoming_data['location']
            result = poll_handler.create_poll(course_id=course_id,
                                              poll_type=incoming_data['poll_type'],
                                              question=incoming_data['question'],
                                              answer=incoming_data['answer'],
                                              possible_answers=possible_answers,
                                              location=location,
                                              image=image)
            print(result)
            if result is not None:
                return jsonify(result), 201
            abort(400)
        except Exception as err:
            print(err)
    elif request.method == 'GET':
        result = poll_handler.get_current_polls_dict(course_id)
        print(result)
        if result is not None:
            return jsonify(result), 200
        abort(404)


@api.route('/teacher/poll/message', methods=['POST'])
def process_teacher_poll():
    if request.method == 'POST':
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


@api.route('/student/poll/message', methods=['POST', 'GET'])
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


@api.route('/image', methods=['POST'])
def handle_images():
    if request.method == 'POST':
        incoming_data = request.json
        print(incoming_data['data_uri'])
        data = incoming_data['data_uri'].split(",")[-1]
        print(data)
        binary_data = a2b_base64(data)

        fd = open(UPLOAD_DIR + incoming_data['fileName'], 'wb')
        fd.write(binary_data)
        fd.close()
        return jsonify({'status':'OK'}), 201


@api.route('/image/<string:image_name>', methods=['GET'])
def get_image(image_name):
    if request.method == 'GET':
        try:
            with open(UPLOAD_DIR + image_name, "rb") as image_file:
                encoded_string = "data:image/png;base64," + b2a_base64(image_file.read()).decode().strip()
                return jsonify({"image":str(encoded_string)})
        except Exception as err:
            print(err)
            print('exception called')
            abort(404)
        abort(404)

