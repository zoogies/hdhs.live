import os
import sqlite3
import random
import datetime
import json
from flask import Flask, render_template
from flask import g, request

DATABASE = 'danarchy.db'
whitelist = ['192.168.50.1',"166.176.250.227","174.207.64.110","99.165.77.86"]

#whitelist key: ryan macbook, xavier phone, ryan hotspot, adam desktop

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def execute_db(cmd):
    con = sqlite3.connect(DATABASE)
    c = con.cursor()
    c.execute(cmd)
    con.commit()

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

#RESTRICT ACCESS CODE:
def verifyip(ip):
    if ip[0:7] == "192.149":
        return True
    else:
        if ip in whitelist:
            return True
        else:
            return False


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True,)

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

    #@app.route('/dbprev')
    #def db():
    #    return str(query_db('select * from main'))

    @app.route('/fetchold')
    def old():
        #print(json.dumps(query_db('select * from main')))
        #print(type(query_db('select * from main')))
        return json.dumps(query_db('select * from main'))
    
    @app.route('/fetchnew')
    def new():
        #print(json.dumps(query_db('select * from main')))
        #print(type(query_db('select * from main')))
        return json.dumps(query_db('select * from main order by ID desc'))
    
    @app.route('/fetchpop')
    def pop():
        return json.dumps(query_db('select * from main order by likes desc'))

    @app.route('/comments',methods=['GET', 'POST'])
    def comments():
        #print(request.json['id'])
        #print(type(request.json['id']))
        return json.dumps(query_db('select comments from main where id="'+request.json['id']+'"')[0][0])

    @app.route('/laugh',methods=['GET', 'POST'])
    def laugh():
        #TODO update value here
        val = json.dumps(query_db('select likes from main where id="'+request.json['id']+'"')[0][0])
        execute_db('update main set likes=('+str( int(val) + 1)+') where id="'+request.json['id']+'"')
        return str(int(val)+1)
    
    @app.route('/post',methods=['GET', 'POST'])
    def post():
        req = request.json
        #print('insert into main (ID,USER,CONTENT,LIKES,STAMP) values ('+str(random.randint(0,99999))+',"'+req['USER']+'","'+req['CONTENT']+'",'+ str(0)+',"'+str(datetime.datetime.now())[0:19]+'")')
        execute_db('insert into main (ID,USER,CONTENT,LIKES,STAMP) values ('+str(query_db('SELECT Count(*) FROM main')[0][0])+',"'+req['USER']+'","'+req['CONTENT']+'",'+ str(0)+',"'+str(datetime.datetime.now())[0:19]+'")')
        return "recieved"
    return app

#TODO:
#make website split to grid of columns of posts if width is high enough
#google analytics
#YOU NEED LOADING SIGNS WHEN QUERYING FOR ANYTHING SO USER HAS FEEBACK
#FIX NULL COMMENT LOADING
#ONCE YOU OPEN COMMENTS MAKE IT CLICK TO CLOSE
#TRY CATCH STATEMENTS ON EVERYTHING, NOBODY SHOULD BE ABLE TO CRASH THE SERVER
#MAYBE TEST ENDPOINTS TO MAKE SURE ALL SERVICES ARE OPERATING OK AT A GLANCE