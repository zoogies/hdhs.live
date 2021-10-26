import os
import sqlite3
from flask import Flask, render_template
from flask import g

DATABASE = 'danarchy.db'

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

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    # a simple page that says hello
    @app.route('/')
    def main():
        cur = get_db().cursor()
        return render_template('index.html') #https://realpython.com/primer-on-jinja-templating/
    @app.teardown_appcontext
    def close_connection(exception):
        db = getattr(g, '_database', None)
        if db is not None:
            db.close()
    @app.route('/db')
    def db():
        return query_db('select * from main')
    return app
