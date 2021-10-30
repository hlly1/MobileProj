# API



## 81.68.76.219:80/sendcode
POST:
{
    "email": "xinze.huang2008@gmail.com"
}

RETURN:
{
    "msg": "success",
    "status": 1
}

## 81.68.76.219:80/register
POST:
{
    "email": "test1@gmail.com",
    "password": "123456",
    "username": "hahaha",
    "validation_code": "123456"
}

RETURN:
{
    "msg": "success",
    "status": 1,
}


## 81.68.76.219:80/login
POST:
{
    "email": "test1@gmail.com",
    "password": "123456"
}

RETURN:
{
    "msg": "success",
    "status": 1,
    "msg": "test"
}

## 81.68.76.219:80/get_info_by_email
POST:
{   
    "email":"test2@gmail.com"
}

RETURN:
{
    "icon_data": Byte64string
    "mark_id": [
        3,
        4
    ],
    "post_id": [
        1,
        4
    ],
    "status": 1,
    "username": "user_45096823",
    "msg": "test"
}

## 81.68.76.219:80/subjectlist
POST:
{
“major_name”: “Information Technology”
}
RETURN:
{
    "data": [
        {
            "book_count": 2,
            "subject_code": "COMP90042",
            "subject_major": "Information Technology",
            "subject_name": "Natural Language Processing"
        },
        {
            "book_count": 2,
            "subject_code": "COMP90054",
            "subject_major": "Information Technology",
            "subject_name": "Artificial Intelligence"
        }
    ],
    "status": 1,
    "msg": "test"
}


## 81.68.76.219:80/postlist
POST:
{   
    "subject_code":"COMP90042"
}

RETURN:
{
    "data": [
        {
            "ISBN": "1-123-456-789",
            "audio_id": "1",
            "book_description": "Drop your fucking phone and go to the fucking library!",
            "book_name": "How to get 90 marks in 90042 NLP",
            "comments_id": "1 5",
            "id": 1,
            "mark_count": 1,
            "picture_name": "1.jpg",
            "post_date": "2021-10-16",
            "subject_code": "COMP90042",
            "subject_name": "AI"
        },
        {
            "ISBN": null,
            "audio_id": "4",
            "book_description": "It is www.baidu.com",
            "book_name": "I found another useful website to pass the NLP!",
            "comments_id": "4",
            "id": 4,
            "mark_count": 1,
            "picture_name": "4.jpg",
            "post_date": "2021-10-19",
            "subject_code": "COMP90042",
            "subject_name": "AI"
        }
    ],
    "status": 1,
    "msg": "test"
}

## 81.68.76.219:80/postdetails
POST:
{   
    "book_id": 1
}

RETURN:
{
    "data": {
        "audio_base64": "base64string",
        "book_description": "Drop your fucking phone and go to the fucking library!",
        "book_name": "How to get 90 marks in 90042 NLP",
        "comments_id": [
            {
                "comment_content": "1: Yeah, that is very helpful!",
                "email": "test1@gmail.com",
                "post_date": "2021-10-16"
            }
        ],
        "mark_count": 1,
        "picture_base64": base64string
        "post_date": "2021-10-16",
        "subject_code": "COMP90042"
    },
    "status": 1,
    "msg": "test"
}

## 81.68.76.219:80/add/comment
POST:
{   
    "book_id": 1,
    "comment_content": "This is new add comment content",
    "email": "test1@gmail.com"
}

RETURN:
{
    "status": 1,
    "msg": "test"
}

## 81.68.76.219:80/add/book
POST:
{   
    "email": "test1@gmail.com",
    "book_name": "test book_name",
    "book_description": "book_description",
    "audio_base64": BASE64STRING,
    "ISBN": "test ISBN",
    "picture_base64": BASE64STRING
    "subject_code": "COMP90054"
}

RETURN:
{
    "status": 1,
    "msg": "test"
}

## 81.68.76.219:80/ISBN
POST:
{   
    "ISBN":"1064215495"
}

RETURN:
{
    "picture_base64": BASE64STRING
    "title": "Steven Jobs"
    "status": 1,
    "msg": "test"
}

## 81.68.76.219:80/forget/sendcode
POST:
{   
    "email": "test1@gmail.com"
    
}
RETURN:
{
    "msg": " success",
    "status": 1
}



