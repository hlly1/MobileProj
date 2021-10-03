from flask import Flask
from flask import render_template
from flask import jsonify
from flask import request

app = Flask(__name__)
app.config['DEBUG'] = True
# app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)


@app.route('/', methods=['POST'])
def hello_world():
    print('6666666666666')

# app.run(debug=True, threaded=True, port=5001, host='127.0.0.1')
if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000)