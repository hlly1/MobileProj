# -*- coding:UTF-8 -*-

import time

from flask import Flask, render_template, request, flash, redirect, url_for, make_response, Response, jsonify

import os
import base64
import string
import random
import datetime
import urllib.parse
import urllib.request
import json
# wtf
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_mail import Mail, Message


# mysql
from flask_sqlalchemy import SQLAlchemy


def get32():
    return ''.join(random.sample(string.ascii_letters + string.digits, 32))

def get16():
    return ''.join(random.sample(string.ascii_letters + string.digits, 16))

def get6():
    return ''.join(random.sample(string.digits, 6))

def get8():
    return ''.join(random.sample(string.digits, 8))
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

app.config["SECRET_KEY"] = '123456'

# mail config
app.config['MAIL_SERVER'] = 'smtp.office365.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'no-reply443@outlook.com'
app.config['MAIL_PASSWORD'] = 'weakpwd123'

# database

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Hxz960722@127.0.0.1/textblocks'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SQLALCHEMY_COMMIT_ON_TEARDOWN"] = True
# tables

app.config['SQLALCHEMY_POOL_SIZE'] = 200
app.config['SQLALCHEMY_POOL_RECYCLE'] = 36

db = SQLAlchemy(use_native_unicode='utf8')
db.app = app
db.init_app(app)

def get_list(a):
    if a:
        result = []
        for i in a.strip().split(" "):
            result.append(int(i))
        return result
    else:
        return []

def get_list_str(a):
    if a:
        result = []
        for i in a.strip().split(" "):
            result.append((i))
        return result
    else:
        return []



class User(db.Model):
    # table name
    __tablename__ = 'User'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    # fields
    email = db.Column(db.String(500), primary_key=True)
    password = db.Column(db.String(500))

    username = db.Column(db.String(500))
    validation_code = db.Column(db.String(500))
    icon_name = db.Column(db.String(500))
    mark_id = db.Column(db.String(500))
    post_id = db.Column(db.String(500))
    subscribe_code = db.Column(db.String(500))


class Subject(db.Model):
    # table name
    __tablename__ = 'Subject'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    # fields
    subject_code = db.Column(db.String(500), primary_key=True)
    subject_name = db.Column(db.String(500))
    subject_major = db.Column(db.String(500))
    imgUrl = db.Column(db.String(500))

class Major(db.Model):
    # table name
    __tablename__ = 'Major'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    # fields
    major_name = db.Column(db.String(500), primary_key=True)
    imgUrl = db.Column(db.String(500))


class Post_book(db.Model):
    # table name
    __tablename__ = 'Post_book'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    # fields
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(500))
    book_name = db.Column(db.String(500))
    book_description = db.Column(db.String(500))
    audio_name = db.Column(db.String(500))
    comments_id = db.Column(db.String(500))
    mark_count = db.Column(db.Integer)
    ISBN = db.Column(db.String(500))
    picture_name = db.Column(db.String(500))
    post_date = db.Column(db.String(500))
    subject_code = db.Column(db.String(500))
    email = db.Column(db.String(500))


class Comment(db.Model):
    # table name
    __tablename__ = 'Comment'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    # fields
    id = db.Column(db.Integer, primary_key=True)

    comment_content = db.Column(db.String(500))
    email = db.Column(db.String(500))
    post_date = db.Column(db.String(500))




# create db
db.drop_all()
db.create_all()
ini_block1 = Blocks(id=1, text='initial empty', time=datetime.datetime.now())
ini_block2 = Blocks(id=2, text='initial empty', time=datetime.datetime.now())
ini_block3 = Blocks(id=3, text='initial empty', time=datetime.datetime.now())
db.session.add_all([ini_block1, ini_block2, ini_block3])
db.session.commit()

@app.route('/')
def index():
    return render_template('index.html')


# upload ============================================================================================================ #
UPLOAD_FOLDER = 'static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER  # 设置文件上传的目标文件夹
basedir = os.path.abspath(os.path.dirname(__file__))  # 获取当前项目的绝对路径



# 具有上传功能的页面
@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/api/upload', methods=['POST'], strict_slashes=False)
def api_upload():
    file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])  # 拼接成合法文件夹地址
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)  # 文件夹不存在就创建
    f = request.files['myfile']  # 从表单的file字段获取文件，myfile为该表单的name值
    filename = f.filename
    ext = filename.rsplit('.', 1)[1]  # 获取文件后缀
    filename_pre = filename.rsplit('.', 1)[0]  # 获取文件后缀

    if  os.path.exists(os.path.join(file_dir, filename)):
        unix_time = int(time.time())
        new_filename = str(filename_pre) + str(unix_time) + '.' + ext  # 修改文件名

        f.save(os.path.join(file_dir, new_filename))  #保存文件到upload目录
        flash("成功上传至: "+str("http://81.68.76.219/static/" + new_filename))
        return redirect(url_for("display"))
    else:
        f.save(os.path.join(file_dir, filename))  #保存文件到upload目录
        flash("成功上传至: "+str("http://81.68.76.219/static/" + filename))
        return redirect(url_for("display"))

# end upload =========================================================================================================#

def TimeStampToTime(timestamp):
    timeStruct = time.localtime(timestamp)
    return time.strftime('%Y-%m-%d %H:%M:%S', timeStruct)

# list all the file names
@app.route('/display')
def display():
    dir_list = os.listdir(os.path.join(basedir, "static"))
    files = sorted(dir_list,key=lambda x: os.path.getmtime(os.path.join(os.path.join(basedir, "static"), x)))
    files_time = []
    files_size = []
    for file in files:
        files_time.append(TimeStampToTime(os.path.getctime(os.path.join("static", file))))
        files_size.append(str(round(os.stat(os.path.join("static", file)).st_size/(1024*1024), 2))+"Mb")
    return render_template('files.html', files=files, files_time=files_time, files_size=files_size)

# delete file
@app.route('/delete/<filename>')
def delete_file(filename):
    print(basedir)
    deletedir = os.path.join(basedir, "static", filename)
    print(deletedir)
    os.remove(deletedir)
    flash("已删除：" + filename)
    return redirect(url_for('display'))

# text blocks
@app.route('/textshare', methods=['GET'])
def textblock():
    firstInstance = Blocks.query.filter_by(id=1).first()
    secondInstance = Blocks.query.filter_by(id=2).first()
    thirdInstance = Blocks.query.filter_by(id=3).first()
    textDict = {firstInstance.id: firstInstance.text,
                secondInstance.id: secondInstance.text,
                thirdInstance.id: thirdInstance.text}
    timeDict = {firstInstance.id: firstInstance.time,
                secondInstance.id: secondInstance.time,
                thirdInstance.id: thirdInstance.time}
    print("firstInstance.id")
    print(firstInstance.id)
    return render_template('textblocks.html',  textDict=textDict, timeDict=timeDict)


# text blocks post
@app.route('/textshare/update', methods=['POST'])
def textBlockUpdate():
    text = request.form.get('text')
    id = request.form.get('id')
    textInstance = Blocks.query.filter_by(id=id).first()
    textInstance.text = text
    textInstance.time = datetime.datetime.now()

    db.session.commit()
    flash("成功提交 success upload，框框已经更新 small blockblock updated\n")
    return redirect(url_for("textblock"))


@app.route('/joke', methods=['GET'])
def joke():
    return render_template("joke.html")

@app.route('/log', methods=['GET'])
def log():
    with open('./Logs/uwsgi.log', 'r') as f:
        content = f.readlines()
    return Response(content, mimetype='text/plain')

@app.route('/login', methods=['POST'])
def login():
    try:
        # email = request.form.get('email')
        # password = request.form.get('password')
        email = request.json["email"]
        password = request.json["password"]
        userInstance = User.query.filter_by(email=email).first()
        if userInstance:
            # match
            if userInstance.password == password:
                return jsonify(status=1,
                               msg="login success")
            # not match
            else:
                return jsonify(status=-1,
                               msg="password and email not match")
        else:
            return jsonify(status=-1,
                           msg="the requested email does not exist")

    except Exception as e:
        return jsonify(status=-1,
                       msg=e)

@app.route('/sendcode', methods=['POST'])
def sendcode():
    try:
        validation_code = get6()
        # email = request.form.get('email')
        email = request.json["email"]

        print("email is:")
        print(email)
        userInstance = User.query.filter_by(email=email).first()
        if not userInstance:
            user1 = User(email=email, password=str(get32()), username='user_' + str(get8()), validation_code=validation_code,
                         mark_id="", post_id="", subscribe_code="")

            db.session.add_all([user1])
        else:
            userInstance.validation_code = validation_code

        db.session.commit()

        mail = Mail(app)

        msg = Message('[validation code]', sender='no-reply443@outlook.com', recipients=[str(email)])
        msg.body = 'Your validation code is: ' + str(validation_code)
        with app.app_context():
            mail.send(msg)
        return jsonify(status=1,
                       msg="success")
    except Exception as e:
        return jsonify(status=-1,
                       msg=e)


@app.route('/register', methods=['POST'])
def register():
    try:
        # email = request.form.get('email')
        # password = request.form.get('password')
        # validation_code = request.form.get('validation_code')

        email = request.json["email"]
        password = request.json["password"]
        username = request.json["username"]
        validation_code = request.json["validation_code"]


        userInstance = User.query.filter_by(email=email).first()
        if userInstance:
            if userInstance.validation_code == validation_code:
                userInstance.password = password
                userInstance.username = username
            else:
                return jsonify(status=-1,
                               msg="The validation code is incorrect.")
        else:
            return jsonify(status=-1,
                           msg="The email dose not exist.")

        db.session.commit()

        return jsonify(status=1,
                       msg="success")
    except Exception as e:
        return jsonify(status=-1,
                       msg=e)


@app.route('/get_info_by_email', methods=['POST'])
def get_info_by_email():
    try:
        # email = request.form.get('email')
        # password = request.form.get('password')
        # validation_code = request.form.get('validation_code')

        email = request.json["email"]

        userInstance = User.query.filter_by(email=email).first()

        mark_result = []
        post_result = []
        subscribe_result = []

        # fill mark result
        for i in get_list(userInstance.mark_id):
            bookInstance = Post_book.query.filter_by(id=i).first()
            subjectInstance = Subject.query.filter_by(subject_code=bookInstance.subject_code).first()

            mark_result.append({
                "book_id":bookInstance.id,
                "topic": bookInstance.topic,
                "book_name": bookInstance.book_name,
                "date": bookInstance.post_date,
                "subject_code": subjectInstance.subject_code,
                "subject_name": subjectInstance.subject_name,
                "subject_major": subjectInstance.subject_major,
            })
        # fill post_result
        for i in get_list(userInstance.post_id):
            bookInstance = Post_book.query.filter_by(id=i).first()
            post_result.append({
                "book_id": bookInstance.id,
                "topic": bookInstance.topic,
                "book_name": bookInstance.book_name,
                "date": bookInstance.post_date,
                "subject_code": subjectInstance.subject_code,
                "subject_name": subjectInstance.subject_name,
                "subject_major": subjectInstance.subject_major,
            })
        # fill subscribe_result
        for i in get_list_str(userInstance.subscribe_code):
            subjectInstance = Subject.query.filter_by(subject_code=i).first()
            subscribe_result.append({
                "subject_code": subjectInstance.subject_code,
                "subject_name": subjectInstance.subject_name,
                "subject_major": subjectInstance.subject_major
            })
        file_name = userInstance.icon_name
        if file_name:
            with open(os.path.join("./static/", file_name), 'rb') as f:
                base64_data = base64.b64encode(f.read())
                # print(base64.b64decode(base64_data))

            return jsonify(status=1,
                           username=userInstance.username,
                           mark_id=get_list(userInstance.mark_id),
                           post_id=get_list(userInstance.post_id),
                           subscribe_code=get_list_str(userInstance.subscribe_code),
                           post_info=post_result,
                           mark_info=mark_result,
                           subscribe_info=subscribe_result,
                           icon_data=base64_data.decode('utf8'),
                           msg="success")
        else:
            return jsonify(status=1,
                           username=userInstance.username,
                           mark_id=get_list(userInstance.mark_id),
                           post_id=get_list(userInstance.post_id),
                           subscribe_code=get_list_str(userInstance.subscribe_code),
                           post_info=post_result,
                           mark_info=mark_result,
                           subscribe_info=subscribe_result,
                           icon_data=None,
                           msg="success")
    except Exception as e:
        return jsonify(status=-1,
                       msg=e)


@app.route('/upload/icon', methods=['POST'])
def upload_icon():
    try:
        email = request.json["email"]
        userInstance = User.query.filter_by(email=email).first()
        icon_b64 = request.json["icon"]
        icon_name = get32() + '.jpg'
        full_path = os.path.join("./static/", icon_name)
        file = open(full_path, 'wb')
        file.write(base64.b64decode(icon_b64.encode('utf-8')))
        file.close()

        userInstance.icon_name = icon_name
        db.session.commit()

        return jsonify(status=1,
                       msg="success")
    except Exception as e:
        return jsonify(status=-1,
                       msg=e)



@app.route('/ISBN', methods=['POST'])
def ISBN_query():
    try:
        ISBN = request.json["ISBN"]
        print(type(ISBN))
        # data = {}
        # data["appkey"] = "2438c9d38e381792"
        # # data["isbn"] = "1451648537"
        # data["isbn"] = "1402894627"
        #
        # data = urllib.parse.urlencode(data).encode('utf-8')
        # url = "https://api.jisuapi.com/isbn/query"
        # result = urllib.request.urlopen(url, data)
        # jsonarr = json.loads(result.read())
        #
        # if jsonarr["status"] != 0:
        #     print(jsonarr["msg"])
        #     exit()
        # result = jsonarr["result"]
        # print(result["title"], result["pic"])
        with open(os.path.join("./static/", "stevenjobs.jpg"), 'rb') as f:
            base64_data = base64.b64encode(f.read())

        return jsonify(title="Steven Jobs",
                       pic=[base64_data.decode('utf-8')],
                       status=1,
                       ISBN=ISBN,
                       msg="success")

    except Exception as e:
        return jsonify(status=-1,
                       msg=e)


@app.route('/subjectlist', methods=['POST'])
def subjectlist_query():
    try:
        subject_major = request.json["major_name"]
        result = []
        for subject in Subject.query.filter_by(subject_major=subject_major).all():
            count = 0
            for book in Post_book.query.all():
                if book.subject_code == subject.subject_code:
                    count += 1
            result.append({
                "subject_code": subject.subject_code,
                "subject_name": subject.subject_name,
                "subject_major": subject.subject_major,
                "imgUrl": subject.imgUrl,
                "book_count": count
            })
        result = sorted(result, key=lambda x: x["book_count"], reverse=True)

        return jsonify(status=1,
                       msg="success",
                       data=result)

    except Exception as e:
        return jsonify(status=-1,
                       msg=e)


@app.route('/majorlist', methods=['GET'])
def majorlist_query():
    try:
        result1 = []
        for major in Major.query.all():
            major_bookcount = 0
            for subject in Subject.query.all():
                count = 0
                for book in Post_book.query.all():
                    if book.subject_code == subject.subject_code:
                        count += 1
                if subject.subject_major==major.major_name:
                    major_bookcount += count
            result1.append({
                "major_name": major.major_name,
                "imgUrl": major.imgUrl,
                "book_count": major_bookcount
            })
        result = sorted(result1, key=lambda x: x["book_count"], reverse=True)
        return jsonify(status=1,
                       msg="success",
                       data=result)

    except Exception as e:
        return jsonify(status=-1,
                       msg=e)


@app.route('/postlist', methods=['POST'])
def postlist_query():
    try:
        subject_code = request.json["subject_code"]

        result = []
        for bookInstance in Post_book.query.filter_by(subject_code=subject_code).all():
            subject_name = Subject.query.filter_by(subject_code=bookInstance.subject_code).first().subject_name
            userInstance = User.query.filter_by(email=bookInstance.email).first()

            file_name = userInstance.icon_name
            base64_data = ""
            if file_name:
                with open(os.path.join("./static/", file_name), 'rb') as f:
                    base64_data = base64.b64encode(f.read())

            result.append({
                "id": bookInstance.id,
                "topic": bookInstance.topic,
                "book_name": bookInstance.book_name,
                "book_description": bookInstance.book_description,
                "comments_id": bookInstance.comments_id,
                "mark_count": bookInstance.mark_count,
                "ISBN": bookInstance.ISBN,
                "picture_name": bookInstance.picture_name,
                "post_date": bookInstance.post_date,
                "subject_code": bookInstance.subject_code,
                "subject_name": subject_name,
                "email": bookInstance.email,
                "username": userInstance.username,
                "icon_data": base64_data.decode('utf8')
            })

        return jsonify(status=1,
                       msg="success",
                       data=result)
    except Exception as e:
        return jsonify(status=-1,
                       msg=e)



@app.route('/mark', methods=['POST'])
def mark():
    try:
        email = request.json["email"]
        book_id = request.json["book_id"]
        bookInstance = Post_book.query.filter_by(id=book_id).first()
        userInstance = User.query.filter_by(email=email).first()
        if str(book_id) in str(userInstance.mark_id):
            return jsonify(status=-1,
                           msg="Failed, book_id already be marked")
        userInstance.mark_id = userInstance.mark_id + " " + str(book_id)
        bookInstance.mark_count = bookInstance.mark_count + 1

        db.session.commit()

        return jsonify(status=1,
                       msg="success")
    except Exception as e:
        return jsonify(status=-1,
                       msg=e)


@app.route('/unmark', methods=['POST'])
def unmark():
    try:
        email = request.json["email"]
        book_id = request.json["book_id"]
        bookInstance = Post_book.query.filter_by(id=book_id).first()
        userInstance = User.query.filter_by(email=email).first()

        if userInstance.mark_id:
            new_mark_code = ""
            if str(book_id) in str(userInstance.mark_id):
                temp_list = get_list_str(str(userInstance.mark_id))
                temp_list.remove(str(book_id))
                for item in temp_list:
                    new_mark_code += (" " + str(item))
                userInstance.mark_id = new_mark_code

                bookInstance.mark_count -= 1
                db.session.commit()
                return jsonify(status=1,
                               msg="success")
            else:
                return jsonify(status=-1,
                               msg="The user did not mark the one you request")
        else:
            return jsonify(status=-1,
                           msg="Nothing to unmark")
    except Exception as e:
        return jsonify(status=-1,
                       msg=e)


@app.route('/postdetails', methods=['POST'])
def postdetails():
    try:
        book_id = request.json["book_id"]
        bookInstance = Post_book.query.filter_by(id=book_id).first()
        if bookInstance:
            # get comment
            comment_result = []
            comments_id = bookInstance.comments_id
            if comments_id:
                for i in comments_id.strip().split(" "):
                    comment_instance= Comment.query.filter_by(id=int(i)).first()
                    comment_result.append({
                        "comment_content": comment_instance.comment_content,
                        "email": comment_instance.email,
                        "post_date": comment_instance.post_date
                    })

            file_name_pic = bookInstance.picture_name
            pic_b64_list = []
            for file_name_pic1 in get_list_str(file_name_pic):
                if file_name_pic1:
                    with open(os.path.join("./static/", file_name_pic1), 'rb') as f:
                        base64_data = base64.b64encode(f.read())
                        pic_b64 = base64_data.decode('utf8')
                        pic_b64_list.append(pic_b64)
                        # print(base64.b64decode(base64_data))
            file_name_audio = bookInstance.audio_name
            if file_name_audio:
                with open(os.path.join("./static/", file_name_audio), 'rb') as f:
                    base64_data = base64.b64encode(f.read())
                    audio_base64 = base64_data.decode('utf8')
                    # print(base64.b64decode(base64_data))
            result = {
                "topic": bookInstance.topic,
                "book_name": bookInstance.book_name,
                "book_description": bookInstance.book_description,
                "audio_base64": audio_base64,
                "comments_id": comment_result,
                "mark_count": bookInstance.mark_count,
                "picture_base64": pic_b64_list,
                "post_date": bookInstance.post_date,
                "subject_code": bookInstance.subject_code,
                "ISBN": bookInstance.ISBN
            }


            db.session.commit()

            return jsonify(status=1,
                           msg="success",
                           data=result)
        else:
            return jsonify(status=-1,
                           msg="Book not exist")
    except Exception as e:
        return jsonify(status=-1,
                       msg=e)


@app.route('/add/comment', methods=['POST'])
def addcomment():
    try:
        email = request.json["email"]
        book_id = request.json["book_id"]
        comment_content = request.json["comment_content"]
        comment_temp = Comment(comment_content=comment_content,
                           email=email,
                           post_date=time.strftime('%Y-%m-%d %H:%M:%S'))
        db.session.add(comment_temp)
        db.session.commit()

        bookInstance = Post_book.query.filter_by(id=book_id).first()
        bookInstance.comments_id = bookInstance.comments_id + " " + str(comment_temp.id)

        db.session.commit()

        return jsonify(status=1,
                       msg="success")

    except Exception as e:
        return jsonify(status=-1,
                       msg=e)



@app.route('/add/book', methods=['POST'])
def addbook():
    try:
        email = request.json["email"]
        topic = request.json["topic"]
        book_name = request.json["book_name"]
        book_description = request.json["book_description"]
        audio_b64 = request.json["audio_base64"]
        ISBN = request.json["ISBN"]
        picture_b64 = request.json["picture_base64"]
        subject_code = request.json["subject_code"]

        audio_name = get32() + '.mp3'
        full_path = os.path.join("./static/", audio_name)
        file = open(full_path, 'wb')
        file.write(base64.b64decode(audio_b64.encode('utf-8')))
        file.close()

        picture_name_concate = ""
        for i in picture_b64:
            picture_name = get32() + '.jpg'
            # picture_name = get32() + '.png'
            full_path = os.path.join("./static/", picture_name)
            file = open(full_path, 'wb')
            file.write(base64.b64decode(i.encode('utf-8')))
            file.close()
            picture_name_concate += (" " + str(picture_name))

        post_book1 = Post_book(topic=topic,
                               book_name=book_name,
                               book_description=book_description,
                               audio_name=audio_name,
                               comments_id="",
                               mark_count=0,
                               ISBN=ISBN,
                               picture_name=picture_name_concate,
                               post_date=time.strftime('%Y-%m-%d %H:%M:%S'),
                               subject_code=subject_code,
                               email=email
                               )

        db.session.add(post_book1)
        db.session.commit()

        userInstance = User.query.filter_by(email=email).first()
        userInstance.post_id = userInstance.post_id + " " + str(post_book1.id)

        db.session.commit()

        return jsonify(status=1,
                       msg="success")
    except Exception as e:
        return jsonify(status=-1,
                       msg=e)

@app.route('/subscribe', methods=['POST'])
def subscribe():
    try:
        email = request.json["email"]
        subject_code = request.json["subject_code"]
        userInstance = User.query.filter_by(email=email).first()
        if userInstance.subscribe_code:
            if str(subject_code) in str(userInstance.subscribe_code):
                return jsonify(status=-1,
                               msg="subject is already being subscribed")
            userInstance.subscribe_code = userInstance.subscribe_code + " " + str(subject_code)
            db.session.commit()
            return jsonify(status=1,
                           msg="success")
        else:
            userInstance.subscribe_code = str(subject_code)
            db.session.commit()
            return jsonify(status=1,
                           msg="success")

    except Exception as e:
        return jsonify(status=-1,
                       msg=e)

@app.route('/unsubscribe', methods=['POST'])
def unsubscribe():
    try:
        email = request.json["email"]
        subject_code = request.json["subject_code"]
        userInstance = User.query.filter_by(email=email).first()
        if userInstance.subscribe_code:
            new_subscribe_code = ""
            if str(subject_code) in str(userInstance.subscribe_code):
                temp_list = get_list_str(str(userInstance.subscribe_code))
                temp_list.remove(str(subject_code))
                for item in temp_list:
                    new_subscribe_code += (" " + str(item))
                userInstance.subscribe_code = new_subscribe_code

                db.session.commit()
                return jsonify(status=1,
                               msg="success")
            else:
                return jsonify(status=-1,
                               msg="The user did not subscribe the one you request")
        else:
            return jsonify(status=-1,
                           msg="Nothing to unsubscribe")
    except Exception as e:
        return jsonify(status=-1,
                       msg=e)


@app.route('/update/user', methods=['POST'])
def updateuser():
    try:
        email = request.json["email"]
        password = request.json["password"]
        username = request.json["username"]
        icon_b64 = request.json["icon"]
        userInstance = User.query.filter_by(email=email).first()

        if icon_b64:
            icon_name = get32() + '.jpg'
            full_path = os.path.join("./static/", icon_name)
            file = open(full_path, 'wb')
            file.write(base64.b64decode(icon_b64.encode('utf-8')))
            file.close()
            userInstance.icon_name = icon_name
        if username:
            userInstance.username = username
        if password:
            userInstance.password = password

        db.session.commit()

        return jsonify(status=1,
                       msg="update success")

    except Exception as e:
        return jsonify(status=-1,
                       msg=e)

@app.route('/validate/validation_code', methods=['POST'])
def validation_code():
    email = request.json["email"]
    validation_code = request.json["validation_code"]

    userInstance = User.query.filter_by(email=email).first()
    if userInstance:
        if userInstance.validation_code == validation_code:
            return jsonify(status=1,
                           msg="validate success")
        else:
            return jsonify(status=-1,
                           msg="validate failed, wrong validate code")

    return jsonify(status=-1,
                   msg="validate failed, email not exists")


@app.route('/forget/sendcode', methods=['POST'])
def forgetsendcode():
    email = request.json["email"]

    userInstance = User.query.filter_by(email=email).first()
    if userInstance:
        validation_code = get6()
        # email = request.form.get('email')
        print("email is:")
        print(email)

        userInstance.validation_code = validation_code
        db.session.commit()

        mail = Mail(app)

        msg = Message('[validation code]', sender='no-reply443@outlook.com', recipients=[str(email)])
        msg.body = 'Your validation code is: ' + str(validation_code)
        with app.app_context():
            mail.send(msg)
        return jsonify(status=1,
                       msg="success")
    else:
        return jsonify(status=-1,
                       msg="validate failed, email not exists")


@app.route('/hot/subject', methods=['GET'])
def hotsubject():

    try:
        result1 = []
        for subject in Subject.query.all():
            count = 0
            for book in Post_book.query.all():
                if book.subject_code == subject.subject_code:
                    count += 1
            result1.append({
                "subject_code": subject.subject_code,
                "subject_name": subject.subject_name,
                "subject_major": subject.subject_major,
                "imgUrl":subject.imgUrl,
                "book_count": count
            })
        result = sorted(result1, key=lambda x: x["book_count"], reverse=True)
        return jsonify(status=1,
                       msg="success",
                       data=result)

    except Exception as e:
        return jsonify(status=-1,
                       msg=e)


def write_test_users():
    user1 = User(email="test1@gmail.com", password="123456", username='user_' + str(get8()),
                 validation_code="123456", icon_name="test1.jpg", mark_id="1 2", post_id="2 3 5 6 7 8", subscribe_code="COMP90054")
    user2 = User(email="test2@gmail.com", password="123456", username='user_' + str(get8()),
                 validation_code="123456", icon_name="test1.jpg", mark_id="3 4", post_id="1 4", subscribe_code="COMP90042")

    subject1 = Subject(subject_code="COMP90042", subject_name="Natural Language Processing",
                       subject_major="Information Technology", imgUrl="http://81.68.76.219/static/nlp.jpeg")
    subject2 = Subject(subject_code="COMP90054", subject_name="AI Planning for Autonomy",
                       subject_major="Information Technology", imgUrl="http://81.68.76.219/static/ai.jpeg")
    subject3 = Subject(subject_code="COMP90038", subject_name="Algorithms and Complexity",
                       subject_major="Information Technology", imgUrl="http://81.68.76.219/static/algorithm.jpeg")
    subject4 = Subject(subject_code="COMP90007", subject_name="Internet Technologies",
                       subject_major="Information Technology", imgUrl="http://81.68.76.219/static/internet.jpeg")
    subject5 = Subject(subject_code="INFO90002", subject_name="Database System & Information Modelling",
                       subject_major="Information Technology", imgUrl="http://81.68.76.219/static/database.jpeg")
    subject6 = Subject(subject_code="COMP90051", subject_name="Statistical Machine Learning",
                       subject_major="Information Technology", imgUrl="http://81.68.76.219/static/sml.jpeg")
    subject7 = Subject(subject_code="GEOM90007", subject_name="Information Visualisation",
                       subject_major="Information Technology", imgUrl="http://81.68.76.219/static/iv.jpeg")
    subject8 = Subject(subject_code="COMP90074", subject_name="Web Security",
                       subject_major="Information Technology", imgUrl="http://81.68.76.219/static/web_security.jpeg")
    subject9 = Subject(subject_code="ELEN90055", subject_name="Control Systems",
                       subject_major="Mechanical Engineering", imgUrl="http://81.68.76.219/static/control_system.jpeg")
    subject10 = Subject(subject_code="MCEN90028", subject_name="Robotics Systems",
                        subject_major="Mechanical Engineering", imgUrl="http://81.68.76.219/static/robots.jpeg")
    # subject11 = Subject(subject_code="MAN90020", subject_name="Business Law",
    #                     subject_major="Accounting")
    # subject12 = Subject(subject_code="MAN90021", subject_name="Management Accounting",
    #                     subject_major="Accounting")

    major1 = Major(major_name="Information Technology", imgUrl="http://81.68.76.219/static/information.jpeg")
    major2 = Major(major_name="Business", imgUrl="http://81.68.76.219/static/business.jpeg")
    major3 = Major(major_name="Language", imgUrl="http://81.68.76.219/static/language.jpeg")
    major4 = Major(major_name="Mechanical Engineering", imgUrl="http://81.68.76.219/static/mechanical.jpeg")
    major5 = Major(major_name="Chemical Engineering", imgUrl="http://81.68.76.219/static/chemical.jpeg")
    major6 = Major(major_name="Education", imgUrl="http://81.68.76.219/static/education.jpeg")

    post_book1 = Post_book(id=1,
                           topic="How to get 90 marks in 90042 NLP",
                           book_name="Introduction to NLP",
                           book_description="Drop your fucking phone and go to the fucking library!",
                           audio_name="1.mp3",
                           comments_id=1,
                           mark_count=1,
                           ISBN="1-123-456-789",
                           picture_name="1.jpg 2.jpg",
                           post_date=time.strftime('%Y-%m-%d %H:%M:%S'),
                           subject_code="COMP90042",
                           email="test2@gmail.com"
                           )

    post_book2 = Post_book(id=2,
                           topic="What is AI and how we gonna make use of it.",
                           book_name="Introduction to AI",
                           book_description="STFW+RTFM! Search the fucking web and read the fucking manual!",
                           audio_name="1.mp3",
                           comments_id=2,
                           mark_count=1,
                           ISBN="2-123-456-789",
                           picture_name="2.jpg 3.jpg",
                           post_date=time.strftime('%Y-%m-%d %H:%M:%S'),
                           subject_code="COMP90054",
                           email="test1@gmail.com"

                           )

    post_book3 = Post_book(id=3,
                           topic="I found a useful URL to pass the AI course!",
                           book_name=None,
                           book_description="it is www.google.com",
                           audio_name="1.mp3",
                           comments_id=3,
                           ISBN=None,
                           mark_count=1,
                           picture_name="3.jpg 2.jpg",
                           post_date=time.strftime('%Y-%m-%d %H:%M:%S'),
                           subject_code="COMP90054",
                           email="test1@gmail.com"
                           )

    post_book4 = Post_book(id=4,
                           topic="I found another useful website to pass the NLP!",
                           book_name=None,
                           book_description="It is www.baidu.com",
                           audio_name="1.mp3",
                           comments_id=4,
                           ISBN=None,
                           mark_count=1,
                           picture_name="4.jpg 2.jpg",
                           post_date=time.strftime('%Y-%m-%d %H:%M:%S'),
                           subject_code="COMP90042",
                           email="test2@gmail.com"
                           )

    post_book5 = Post_book(id=5,
                           topic="This is tiezi 5",
                           book_name=None,
                           book_description="desccription 5",
                           audio_name="1.mp3",
                           comments_id=None,
                           ISBN=None,
                           mark_count=0,
                           picture_name="4.jpg 2.jpg",
                           post_date=time.strftime('%Y-%m-%d %H:%M:%S'),
                           subject_code="COMP90051",
                           email="test1@gmail.com"
                           )
    post_book6 = Post_book(id=6,
                           topic="This is tiezi6",
                           book_name=None,
                           book_description="desccription 6",
                           audio_name="1.mp3",
                           comments_id=None,
                           ISBN=None,
                           mark_count=0,
                           picture_name="4.jpg 2.jpg",
                           post_date=time.strftime('%Y-%m-%d %H:%M:%S'),
                           subject_code="COMP90051",
                           email="test1@gmail.com"
                           )
    post_book7 = Post_book(id=7,
                           topic="This is tiezi 7",
                           book_name=None,
                           book_description="desccription 7",
                           audio_name="1.mp3",
                           comments_id=None,
                           ISBN=None,
                           mark_count=0,
                           picture_name="4.jpg 2.jpg",
                           post_date=time.strftime('%Y-%m-%d %H:%M:%S'),
                           subject_code="COMP90051",
                           email="test1@gmail.com"
                           )
    post_book8 = Post_book(id=8,
                           topic="This is tiezi 8",
                           book_name=None,
                           book_description="desccription 8",
                           audio_name="1.mp3",
                           comments_id=None,
                           ISBN=None,
                           mark_count=0,
                           picture_name="4.jpg 2.jpg",
                           post_date=time.strftime('%Y-%m-%d %H:%M:%S'),
                           subject_code="COMP90051",
                           email="test1@gmail.com"
                           )

    post_book9 = Post_book(id=9,
                           topic="This is tiezi 9",
                           book_name=None,
                           book_description="desccription 9",
                           audio_name="1.mp3",
                           comments_id=None,
                           ISBN=None,
                           mark_count=0,
                           picture_name="4.jpg 2.jpg",
                           post_date=time.strftime('%Y-%m-%d %H:%M:%S'),
                           subject_code="MCEN90028",
                           email="test1@gmail.com"
                           )



    comment1 = Comment(id=1,
                       comment_content="1: Yeah, that is very helpful!",
                       email="test1@gmail.com",
                       post_date=time.strftime('%Y-%m-%d %H:%M:%S'))
    comment2 = Comment(id=2,
                       comment_content="2: Yeah, that is very helpful!",
                       email="test1@gmail.com",
                       post_date=time.strftime('%Y-%m-%d %H:%M:%S'))
    comment3 = Comment(id=3,
                       comment_content="3: Yeah, that is very helpful!",
                       email="test1@gmail.com",
                       post_date=time.strftime('%Y-%m-%d %H:%M:%S'))
    comment4 = Comment(id=4,
                       comment_content="4: Yeah, that is very helpful!",
                       email="test1@gmail.com",
                       post_date=time.strftime('%Y-%m-%d %H:%M:%S'))


    db.session.add_all([user1, user2,
                        major1, major2, major3, major4, major5, major6,
                        subject1, subject2, subject3, subject4,
                        subject5, subject6, subject7, subject8,
                        subject9, subject10,
                        post_book1, post_book2, post_book3, post_book4,
                        post_book5, post_book6, post_book7, post_book8, post_book9,
                        comment1, comment2, comment3, comment4])
    db.session.commit()

write_test_users()


# if __name__ == '__main__':
#     db.drop_all()
#     db.create_all()
#
#     app.run(debug=True, threaded=True, port=5001, host='127.0.0.1')
