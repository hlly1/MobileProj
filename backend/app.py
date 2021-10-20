# -*- coding:UTF-8 -*-

import time

from flask import Flask, render_template, request, flash, redirect, url_for, make_response, Response, jsonify

import os
import base64
import string
import random
import datetime
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

db = SQLAlchemy(use_native_unicode='utf8')
db.app = app
db.init_app(app)

class Blocks(db.Model):
    # table name
    __tablename__ = 'blocks'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    # fields
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(9999))
    time = db.Column(db.String(6666))

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

class Subject(db.Model):
    # table name
    __tablename__ = 'Subject'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    # fields
    subject_code = db.Column(db.String(500), primary_key=True)
    subject_name = db.Column(db.String(500))
    subject_major = db.Column(db.String(500))

class Post_book(db.Model):
    # table name
    __tablename__ = 'Post_book'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    # fields
    book_id = db.Column(db.String(500), primary_key=True)
    book_name = db.Column(db.String(500))
    book_description = db.Column(db.String(500))
    audio_id = db.Column(db.String(500))
    comments_id = db.Column(db.String(500))
    mark_count = db.Column(db.String(500))
    ISBN = db.Column(db.String(500))
    picture_id = db.Column(db.String(500))
    post_date = db.Column(db.String(500))
    subject_code = db.Column(db.String(500))

class Post_url(db.Model):
    # table name
    __tablename__ = 'Post_url'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    # fields
    url_id = db.Column(db.String(500), primary_key=True)
    url_name = db.Column(db.String(500))
    url_description = db.Column(db.String(500))
    audio_id = db.Column(db.String(500))
    comments_id = db.Column(db.String(500))
    mark_count = db.Column(db.String(500))
    picture_id = db.Column(db.String(500))
    post_date = db.Column(db.String(500))
    subject_code = db.Column(db.String(500))

class Comment(db.Model):
    # table name
    __tablename__ = 'Comment'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    # fields
    comment_id = db.Column(db.String(500), primary_key=True)
    comment_content = db.Column(db.String(500))
    email = db.Column(db.String(500))
    post_date = db.Column(db.String(500))



class BlockForm(FlaskForm):
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}
    text = StringField()
    submit = SubmitField('submit')

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


@app.route('/login', methods=['POST'])
def login():
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




@app.route('/sendcode', methods=['POST'])
def sendcode():
    validation_code = get6()
    # email = request.form.get('email')
    email = request.json["email"]

    print("email is:")
    print(email)
    userInstance = User.query.filter_by(email=email).first()
    if not userInstance:
        user1 = User(email=email, password=str(get32()), username='user_' + str(get8()), validation_code=validation_code)
        db.session.add_all([user1])
    else:
        userInstance.validation_code = validation_code

    db.session.commit()

    mail = Mail(app)

    msg = Message('[validation code]', sender='no-reply443@outlook.com', recipients=[str(email)])
    msg.body = 'Your validation code is: ' + str(validation_code)
    with app.app_context():
        mail.send(msg)
    return jsonify(status=1)

@app.route('/register', methods=['POST'])
def register():
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



@app.route('/get_info_by_email', methods=['POST'])
def get_info_by_email():
    # email = request.form.get('email')
    # password = request.form.get('password')
    # validation_code = request.form.get('validation_code')

    email = request.json["email"]
    print("the email is")
    print(email)
    userInstance = User.query.filter_by(email=email).first()
    file_name = userInstance.icon_name
    if file_name:
        with open(os.path.join("./static/", file_name), 'rb') as f:
            base64_data = base64.b64encode(f.read())
            print(base64_data)
            print(base64_data.decode('utf8'))

        return jsonify(status=1,
                       username=userInstance.username,
                       icon_data=base64_data.decode('utf8'))
    else:
        return jsonify(status=1,
                       username=userInstance.username,
                       icon_data=None)

@app.route('/upload/icon', methods=['POST'], strict_slashes=False)
def upload_icon():
    file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])  # 拼接成合法文件夹地址
    file_dir = os.path.join(file_dir, '/icon') # 拼接成合法文件夹地址
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



def write_test_users():
    user1 = User(email="test1@gmail.com", password="123456", username='user_' + str(get8()), validation_code="123456", icon_name="test1.jpg", mark_id="1")
    user2 = User(email="test2@gmail.com", password="123456", username='user_' + str(get8()), validation_code="123456", icon_name="test1.jpg", mark_id="2")
    subject1 = Subject(subject_code="COMP90042", subject_name="Natural Language Processing", subject_major="Information Technology")
    subject2 = Subject(subject_code="COMP90054", subject_name="Artificial Intelligence", subject_major="Information Technology")

    post_book1 = Post_book(book_id="1",
                           book_name="How to get 90 marks in 90042 NLP",
                           book_description="Drop your fucking phone and go to the fucking library!",
                           audio_id="1",
                           comments_id="1",
                           mark_count="1",
                           ISBN="1-123-456-789",
                           picture_id="1",
                           post_date="2021-10-16",
                           subject_code="COMP90042"
                           )

    post_book2 = Post_book(book_id="2",
                           book_name="What is AI and how we gonna make use of it.",
                           book_description="STFW+RTFM! Search the fucking web and read the fucking manual!",
                           audio_id="2",
                           comments_id="2",
                           mark_count="1",
                           ISBN="2-123-456-789",
                           picture_id="2",
                           post_date="2021-10-17",
                           subject_code="COMP90054"
                           )

    post_url1 = Post_url(url_id="1",
                         url_name="I found a useful URL to pass the AI course!",
                         url_description="www.google.com",
                         audio_id="3",
                         comments_id="3",
                         mark_count="1",
                         picture_id="3",
                         subject_code="COMP90054")

    post_url2 = Post_url(url_id="2",
                         url_name="I found another useful website to pass the NLP!",
                         url_description="www.baidu.com",
                         audio_id="4",
                         comments_id="4",
                         mark_count="1",
                         picture_id="4",
                         subject_code="COMP90042")

    comment1 = Comment(comment_id="1",
                       comment_content="1: Yeah, that is very helpful!",
                       email="test1@gmail.com",
                       post_date="2021-10-16")
    comment2 = Comment(comment_id="2",
                       comment_content="2: Yeah, that is very helpful!",
                       email="test1@gmail.com",
                       post_date="2021-10-16")
    comment3 = Comment(comment_id="3",
                       comment_content="3: Yeah, that is very helpful!",
                       email="test1@gmail.com",
                       post_date="2021-10-16")
    comment4 = Comment(comment_id="4",
                       comment_content="4: Yeah, that is very helpful!",
                       email="test1@gmail.com",
                       post_date="2021-10-16")


    db.session.add_all([user1, user2,
                        subject1, subject2,
                        post_book1, post_book2,
                        post_url1, post_url2,
                        comment1, comment2, comment3, comment4])
    db.session.commit()

write_test_users()


# if __name__ == '__main__':
#     db.drop_all()
#     db.create_all()
#
#     app.run(debug=True, threaded=True, port=5001, host='127.0.0.1')


