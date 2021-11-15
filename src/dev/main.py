#imports
import os
import sqlite3
import random
import datetime
import base64
import json
import requests
from requests.structures import CaseInsensitiveDict
from flask import Flask, render_template
from flask import g, request
from flask import send_file

#global variables
DATABASE = 'danarchy.db'
headers = CaseInsensitiveDict()
headers["User-Agent"] = "curl/7.68.0"
headers["Authorization"] = "Bearer f3213625c42436"
#file handling
UPLOAD_FOLDER = '/static/attachments'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'heic'}

#connecting to our db
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

#executing a db change
def execute_db(cmd):
    con = sqlite3.connect(DATABASE)
    c = con.cursor()
    c.execute(cmd)
    con.commit()

#probing db for data
def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

#check for if a file is allowed
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#take string possibly dirty with quotes and clean them
def clean(string):
    return string.replace('"','"+"""+"')
print(clean('"'))
#main flask top level function
def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    ##########################################################################

    #defualt route to server
    @app.route('/')
    def main(): 
        #when developing from home it only routes through local addr so break the validation loop
        #if str(request.remote_addr) == "192.168.50.1":
        #    return render_template('index.html')

        #create cursor to probe db with
        cur = get_db().cursor()

        #set url and header data so we can detect users location
        #url = "https://ipinfo.io/"+str(request.remote_addr)
        #resp = requests.get(url, headers=headers)

        #if the response comes from ohio give them the main page
        #if resp.json()['region'] == 'Ohio':
        #    return render_template('index.html')
        #else shoot them down
        #else:
        #    return render_template('denied.html')
        return render_template('index.html')

    ##########################################################################

    #admin panel related sockets
    @app.route('/admin')
    def admin():
        return render_template('admin.html')

    #authenticate incoming request key with the servers local key
    @app.route('/auth',methods=['GET', 'POST'])
    def auth():
        with open('secretkey.txt') as f:
            serverkey = f.read()
            if serverkey == request.json['psk']:
                return "true"
            else:
                return "false"
    
    #admin side handling function to modify content and manage reports
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
    
    #test http requests
    @app.route('/test',methods=['GET', 'POST'])
    def test():
        return 'recieved'

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

    #grab the number of open reports
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
    @app.route('/fetchposts',methods=['GET', 'POST'])
    def fetchposts():
        order = request.json['order']
        start = request.json['start']
        numloaded = int(request.json['numloaded'])

        #if we are doing a first load or type change do the standard procedure
        if start == 'fresh':
            if order == 'old':
                return json.dumps(query_db('select * from main where deleted != 3 order by ID asc LIMIT 15'))
            elif order == 'new':
                return json.dumps(query_db('select * from main where deleted != 3 order by ID desc LIMIT 15'))
            elif order == 'pop':
                return json.dumps(query_db('select * from main where deleted != 3 order by likes desc LIMIT 15'))
            else:
                return 'bad request'
        else:
            start = int(start)
            if order == 'old':
                print((('select * from main where deleted != 3 AND id BETWEEN '+str(start + 1)+' AND '+str(start + 16)+' LIMIT 15')))
                return json.dumps(query_db('select * from main where deleted != 3 AND id BETWEEN '+str(start + 1)+' AND '+str(start + 16)+' LIMIT 15'))
            elif order == 'new':
                #for some reason 24 is the ceiling final request for the bottom of the content
                if start == 24:
                    print('balls')
                    return json.dumps(query_db('select * from main where deleted != 3 AND id BETWEEN 0 AND 23 order by ID desc'))
                else:
                    return json.dumps(query_db('select * from main where deleted != 3 AND id BETWEEN '+str(start - 16)+' AND '+str(start - 1)+' order by ID desc LIMIT 15'))
            elif order == 'pop':
                #grab all posts in desc order of popular
                result = query_db('select * from main where deleted != 3 order by likes desc')
                final = [] #create blank list
                #run loop 15 times
                for i in range(15):
                    final.append(result[i + numloaded]) #add 15 next posts in the correct order
                return json.dumps(final)
            else:
                return 'bad request'


    ##########################################################################

    #endpoints for comments:
    @app.route('/commentsnew',methods=['GET', 'POST'])
    def comments():
        return json.dumps(query_db('select * from comments where post="'+request.json['id']+'"'))
    
    #this is an admin side function to view every comment on the site
    @app.route('/fetchallcomments',methods=['GET', 'POST'])
    def allcomments():
        return json.dumps(query_db('select * from comments'))

    @app.route('/numcomments',methods=['GET', 'POST'])
    def numcomments():
        return str(query_db('select comment_count from main where id="'+request.json['id']+'"')[0][0])

    @app.route('/comment',methods=['GET', 'POST'])
    def leavecomment():
        req = request.json
        #execute the comment to the comment table
        execute_db('insert into comments (id,post,content,likes,stamp,user,deleted) values ('+str(query_db('SELECT Count(*) FROM comments')[0][0])+',"'+req["POST"]+'","'+req["CONTENT"]+'",0,"'+str(datetime.datetime.now())[0:19]+'","'+req["USER"]+'",false)')
        #update main table comment amount to reflect new comment count
        execute_db('update main set comment_count=('+str((query_db('select comment_count from main where id="'+req['POST']+'"')[0][0])+1)+') where id="'+req['POST']+'"')
        return "commented"

    ##########################################################################

    #endpoints for laughing:
    @app.route('/laugh',methods=['GET', 'POST'])
    def laugh():
        if request.json['type'] == 'post':
            val = json.dumps(query_db('select likes from main where id="'+request.json['id']+'"')[0][0])
            execute_db('update main set likes=('+str( int(val) + 1)+') where id="'+request.json['id']+'"')
            return str(int(val)+1)
        elif request.json['type'] == 'comment':
            val = json.dumps(query_db('select likes from comments where id="'+request.json['id']+'"')[0][0])
            execute_db('update comments set likes=('+str( int(val) + 1)+') where id="'+request.json['id']+'"')
            return str(int(val)+1)
        else:
            return 'ERROR SOME SHIT GOIN ON IN THE SERVER' 
    
    ##########################################################################

    #endpoints for posting:
    @app.route('/post',methods=['GET', 'POST'])
    def post():
        req = request.json
        postid = str(query_db('SELECT Count(*) FROM main')[0][0])
        execute_db('insert into main (ID,USER,CONTENT,LIKES,STAMP,deleted,comment_count) values ('+postid+',"'+req['USER']+'","'+ req['CONTENT'].replace('"','“') +'",'+ str(0)+',"'+str(datetime.datetime.now())[0:19]+'",0,0)')
        return "done"

    @app.route('/postimage',methods=['POST'])
    def postimg():
        #detect if theres a file in the request
        if request.files['file']:
            #nab the file from the request
            uploaded_file = request.files['file']
        
        #generate post id and insert our post to the main table
        postid = str(query_db('SELECT Count(*) FROM main')[0][0])
        execute_db('insert into main (ID,USER,CONTENT,LIKES,STAMP,deleted,comment_count) values ('+postid+',"'+request.form['USER']+'","'+request.form['text'].replace('"','“')+'",'+ str(0)+',"'+str(datetime.datetime.now())[0:19]+'",0,0)')
        
        #if the filename isnt empty
        if uploaded_file.filename != '':
            attachmentid = str(query_db('SELECT Count(*) FROM attachments')[0][0])
            newfilename =  attachmentid +'.'+ uploaded_file.filename.split('.')[1] 
            uploaded_file.save("static/attachments/"+newfilename)
            execute_db('insert into attachments (postid,name) values ('+postid+',"'+newfilename+'")')
            execute_db('update main set attachmentid=("'+attachmentid+'") where id="'+postid+'"')
        return render_template('index.html')

    ##########################################################################

    #endpoints for attachments:
    @app.route('/getattachment',methods=['GET', 'POST'])
    def getattachment():
        return json.dumps(query_db('select * from attachments'))
    ##########################################################################
    
    return app