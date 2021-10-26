import os
import sqlite3
from flask import Flask, render_template
def dbop(arg: str):
    try:
        db = sqlite3.connect('danarchy.db')
        cur = db.cursor()
        return cur.execute(arg)
    except:
        db.rollback()
        print('BIG L MASSIVE ERROR')
    finally:
        db.commit()
        db.close()
        print('SQL DATABASE OPERATION COMPLETE')

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    # a simple page that says hello
    @app.route('/')
    def main():
        return render_template('index.html') #https://realpython.com/primer-on-jinja-templating/

    @app.route('/db')
    def db():
        return dbop("SELECT * FROM main")
    return app
