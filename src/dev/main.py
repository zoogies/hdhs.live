import os
import sqlite3
import json
from flask import Flask, render_template
from flask import g, request

DATABASE = 'danarchy.db'
whitelist = ['192.168.50.1']
#whitelist = []

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db



def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

#RESTRICT ACCESS CODE:
def verifyip(ip):
    if ip[0:7] == "174.207":
        return True
    else:
        if ip in whitelist:
            return True
        else:
            return False


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    # a simple page that says hello
    @app.route('/')
    def main():
        cur = get_db().cursor()
        if verifyip(request.remote_addr):
            return render_template('index.html') #https://realpython.com/primer-on-jinja-templating/
        else:
            return render_template('denied.html')
    @app.teardown_appcontext
    def close_connection(exception):
        db = getattr(g, '_database', None)
        if db is not None:
            db.close()
    @app.route('/dbprev')
    def db():
        return str(query_db('select * from main'))
    @app.route('/fetchnew')
    def new():
        #print(json.dumps(query_db('select * from main')))
        #print(type(query_db('select * from main')))
        return json.dumps(query_db('select * from main'))
    return app
