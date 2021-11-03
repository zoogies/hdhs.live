import os
import sqlite3
import random
import datetime
import base64
import json
from flask import Flask, render_template
from flask import g, request
from flask import send_file

DATABASE = 'danarchy.db'
whitelist = ['192.168.50.1',"166.176.250.227","174.207.6.228","99.165.77.86","174.207.34.73","65.60.253.61","75.23.201.192","65.60.252.241,","65.186.54.121"]
#whitelist key: ryan macbook, xavier phone, ryan hotspot, adam desktop, sabbycheeks, nathan, adam other, austin, connor

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
    app = Flask(__name__, instance_relative_config=True)

    ##########################################################################

    #defualt route to server
    @app.route('/')
    def main():
        cur = get_db().cursor()
        if verifyip(request.remote_addr):
            return render_template('index.html')
        else:
            return render_template('denied.html')

    ##########################################################################

    #admin panel related sockets
    @app.route('/admin')
    def admin():
        return render_template('admin.html')

    @app.route('/auth',methods=['GET', 'POST'])
    def auth():
        with open('secretkey.txt') as f:
            serverkey = f.read()
            if serverkey == request.json['psk']:
                return "true"
            else:
                return "false"
    
    @app.route('/moderate',methods=['GET', 'POST'])
    def moderate():
        mod_type = request.json['type']
        mod_action = request.json['action']

        if mod_action == 'no_render_norep' or mod_action == 'delete_norep':
            mod_id = request.json['id']
        else:
            mod_id = str(query_db('select content_id from reports where id="'+request.json['id']+'"')[0][0])
            
        try:
            if mod_action == 'delete':
                try:
                    if mod_type == 'post':
                        execute_db('update main set deleted="1" where id="'+mod_id+'"')
                    elif mod_type == 'comment':
                        execute_db('update comments set deleted="1" where id="'+mod_id+'"')
                    execute_db('DELETE FROM reports WHERE content_id="'+mod_id+'"')
                    return 'ok'
                except Exception as e:
                    print(e)
                    return 'bad'
            elif mod_action == 'dismiss':
                try:
                    execute_db('DELETE FROM reports WHERE content_id="'+mod_id+'"')
                    return 'ok'
                except Exception as e:
                    print(e)
                    return 'bad'
            elif mod_action == 'no_render':
                try:
                    if mod_type == 'post':
                        execute_db('update main set deleted="2" where id="'+mod_id+'"')
                    elif mod_type == 'comment':
                        execute_db('update comments set deleted="2" where id="'+mod_id+'"')
                    execute_db('DELETE FROM reports WHERE content_id="'+mod_id+'"')
                    return 'ok'
                except:
                    return 'bad'
        except Exception as e:
            print(e)
            return 'bad'
        return 'wtf'

    ##########################################################################

    #report related endpoints
    @app.route('/fetchreports')
    def fetchreports():
        return json.dumps(query_db('select * from reports'))

    @app.route('/report',methods=['GET', 'POST'])
    def report():
        try:
            if request.json['type'] == 'post':
                execute_db('insert into reports (content_id,reason,content,type) values ('+request.json['id']+',"'+request.json['reason']+'","'+query_db('select content from main where id="'+request.json['id']+'"')[0][0]+'","'+request.json['type']+'")')
                return json.dumps('ok')
            elif request.json['type'] == 'comment':
                execute_db('insert into reports (content_id,reason,content,type) values ('+request.json['id']+',"'+request.json['reason']+'","'+query_db('select content from comments where id="'+request.json['id']+'"')[0][0]+'","'+request.json['type']+'")')
                return json.dumps('ok')
            else:
                return json.dumps('bad')
        except:
            return json.dumps('bad')

    @app.route('/fetchnumreps')
    def fetchnumreps():
        return json.dumps(query_db('SELECT COUNT(*) FROM reports')[0][0])

    ##########################################################################
    
    #on server close execute these commands
    @app.teardown_appcontext
    def close_connection(exception):
        db = getattr(g, '_database', None)
        if db is not None:
            db.close()

    ##########################################################################

    #endpoints for post fetching:
    @app.route('/fetchold')
    def old():
        return json.dumps(query_db('select * from main'))
    
    @app.route('/fetchnew')
    def new():
        return json.dumps(query_db('select * from main order by ID desc'))
    
    @app.route('/fetchpop')
    def pop():
        return json.dumps(query_db('select * from main order by likes desc'))

    ##########################################################################

    #endpoints for comments:
    @app.route('/commentsnew',methods=['GET', 'POST'])
    def comments():
        return json.dumps(query_db('select * from comments where post="'+request.json['id']+'"'))
    
    @app.route('/fetchallcomments',methods=['GET', 'POST'])
    def allcomments():
        return json.dumps(query_db('select * from comments'))

    @app.route('/comment',methods=['GET', 'POST'])
    def leavecomment():
        req = request.json
        execute_db('insert into comments (id,post,content,likes,stamp,user,deleted) values ('+str(query_db('SELECT Count(*) FROM comments')[0][0])+',"'+req["POST"]+'","'+req["CONTENT"]+'",0,"'+str(datetime.datetime.now())[0:19]+'","'+req["USER"]+'",false)')
        return "commented"

    ##########################################################################

    #endpoints for laughing:
    @app.route('/laugh',methods=['GET', 'POST'])
    def laugh():
        val = json.dumps(query_db('select likes from main where id="'+request.json['id']+'"')[0][0])
        execute_db('update main set likes=('+str( int(val) + 1)+') where id="'+request.json['id']+'"')
        return str(int(val)+1)
    
    @app.route('/comlaugh',methods=['GET', 'POST'])
    def comlaugh():
        val = json.dumps(query_db('select likes from comments where id="'+request.json['id']+'"')[0][0])
        execute_db('update comments set likes=('+str( int(val) + 1)+') where id="'+request.json['id']+'"')
        return str(int(val)+1)
    
    ##########################################################################

    #endpoints for posting:
    @app.route('/post',methods=['GET', 'POST'])
    def post():
        req = request.json
        postid = str(query_db('SELECT Count(*) FROM main')[0][0])
        execute_db('insert into main (ID,USER,CONTENT,LIKES,STAMP,deleted) values ('+postid+',"'+req['USER']+'","'+req['CONTENT']+'",'+ str(0)+',"'+str(datetime.datetime.now())[0:19]+'",0)')
        if req['attachment'] != 'none':
            attachmentid = str(query_db('SELECT Count(*) FROM attachments')[0][0])
            newfilename =  attachmentid + '.' + req['attachment'].split('.')[1]
            with open("static/attachments/"+newfilename,"wb") as fh:
                print(req)
                print(str(req['bytes']))
                print(base64.b64decode(req['bytes']))
                fh.write(base64.b64decode(req['bytes']))
            execute_db('insert into attachments (postid,name) values ('+postid+',"'+newfilename+'")')
            execute_db('update main set attachmentid=("'+attachmentid+'") where id="'+postid+'"')
        return "done"

    ##########################################################################

    #endpoints for attachments:
    @app.route('/getattachment',methods=['GET', 'POST'])
    def getattachment():
        req = request.json
        return 'http://76.181.32.163:5000/static/attachments/'+query_db('select name from attachments where id="'+req['id']+'"')[0][0]

    ##########################################################################
    
    return app