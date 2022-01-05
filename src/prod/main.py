# imports
import sqlite3
import datetime
import os
import re
import json
from requests.structures import CaseInsensitiveDict
from flask import Flask, render_template
from flask import g, request

# import custom logging class
from logs import logmaker

# log a server restart
logmaker("daily").log("server reset", "INTERNAL")

# global variables
DATABASE = "danarchy.db"
headers = CaseInsensitiveDict()
headers["User-Agent"] = "curl/7.68.0"
headers["Authorization"] = "Bearer f3213625c42436"

# connecting to our db
def get_db():
    try:
        logmaker("daily").log("database connect", "INTERNAL")
        db = getattr(g, "_database", None)
        if db is None:
            db = g._database = sqlite3.connect(DATABASE)
        return db
    except Exception as e:
        logmaker("daily").log("failure - " + str(e), "INTERNAL")
        return "bad"


# executing a db change
def execute_db(cmd):
    try:
        logmaker("daily").log("database execute", "INTERNAL")
        con = sqlite3.connect(DATABASE)
        c = con.cursor()
        c.execute(cmd)
        con.commit()
    except Exception as e:
        logmaker("daily").log("failure - " + str(e), "INTERNAL")
        return "bad"


# probing db for data
def query_db(query, args=(), one=False):
    try:
        logmaker("daily").log("database query", "INTERNAL")
        cur = get_db().execute(query, args)
        rv = cur.fetchall()
        cur.close()
        return (rv[0] if rv else None) if one else rv
    except Exception as e:
        logmaker("daily").log("failure - " + str(e), "INTERNAL")
        return "bad"


# main flask top level function
app = Flask(__name__, instance_relative_config=True)

##########################################################################

# defualt route to server
@app.route("/")
def main():
    try:
        logmaker("daily").log("route main", request.remote_addr)

        # create cursor to probe db with
        cur = get_db().cursor()

        return render_template("index.html")
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return "bad"


##########################################################################

# admin panel related sockets
@app.route("/admin")
def admin():
    try:
        logmaker("daily").log("route admin", request.remote_addr)
        return render_template("admin.html")
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return "bad"


# authenticate incoming request key with the servers local key
@app.route("/auth", methods=["GET", "POST"])
def auth():
    try:
        with open("secretkey.txt") as f:
            serverkey = f.read()
            if serverkey == request.json["psk"]:
                logmaker("daily").log("auth pass", request.remote_addr)
                return "true"
            else:
                logmaker("daily").log("auth fail", request.remote_addr)
                return "false"
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return "bad"


# admin side handling function to modify content and manage reports
@app.route("/moderate", methods=["GET", "POST"])
def moderate():
    try:
        mod_type = request.json["type"]
        mod_action = request.json["action"]

        if mod_action == "no_render_norep" or mod_action == "delete_norep":
            mod_id = request.json["id"]
        else:
            mod_id = str(
                query_db(
                    'select content_id from reports where id="'
                    + request.json["id"]
                    + '"'
                )[0][0]
            )

        try:
            if mod_action == "delete":
                try:
                    logmaker("daily").log("report delete", request.remote_addr)
                    if mod_type == "post":
                        execute_db(
                            'update main set deleted="1" where id="' + mod_id + '"'
                        )
                    elif mod_type == "comment":
                        execute_db(
                            'update comments set deleted="1" where id="' + mod_id + '"'
                        )
                    execute_db('DELETE FROM reports WHERE content_id="' + mod_id + '"')
                    return "ok"
                except Exception as e:
                    print(e)
                    return "bad"
            elif mod_action == "dismiss":
                try:
                    logmaker("daily").log("report dismiss", request.remote_addr)
                    execute_db('DELETE FROM reports WHERE content_id="' + mod_id + '"')
                    return "ok"
                except:
                    return "bad"
            elif mod_action == "no_render":
                try:
                    logmaker("daily").log("report invisible", request.remote_addr)
                    if mod_type == "post":
                        execute_db(
                            'update main set deleted="2" where id="' + mod_id + '"'
                        )
                    elif mod_type == "comment":
                        execute_db(
                            'update comments set deleted="2" where id="' + mod_id + '"'
                        )
                        parent_id = query_db(
                            'select post from comments where id="' + mod_id + '"'
                        )[0][0]
                        execute_db(
                            'update main set comment_count="'
                            + str(
                                int(
                                    (
                                        query_db(
                                            'select comment_count from main where id="'
                                            + str(parent_id)
                                            + '"'
                                        )[0][0]
                                    )
                                )
                                - 1
                            )
                            + '" where id="'
                            + str(parent_id)
                            + '"'
                        )

                    execute_db('DELETE FROM reports WHERE content_id="' + mod_id + '"')
                    return "ok"
                except:
                    logmaker("daily").log("failure bad_request", request.remote_addr)
                    return "bad"
        except Exception as e:
            print(e)
            return "bad"

    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return "bad"
    return "wtf"


##########################################################################

# report related endpoints
@app.route("/fetchreports")
def fetchreports():
    try:
        logmaker("daily").log("fetch reports", request.remote_addr)
        return json.dumps(query_db("select * from reports"))
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return "bad"


@app.route("/report", methods=["GET", "POST"])
def report():
    try:
        if request.json["type"] == "post":
            logmaker("daily").log("report post", request.remote_addr)
            execute_db(
                "insert into reports (content_id,reason,content,type) values ("
                + request.json["id"]
                + ',"'
                + request.json["reason"]
                + '","'
                + query_db(
                    'select content from main where id="' + request.json["id"] + '"'
                )[0][0]
                + '","'
                + request.json["type"]
                + '")'
            )
            return json.dumps("ok")
        elif request.json["type"] == "comment":
            logmaker("daily").log("report comment", request.remote_addr)
            execute_db(
                "insert into reports (content_id,reason,content,type) values ("
                + request.json["id"]
                + ',"'
                + request.json["reason"]
                + '","'
                + query_db(
                    'select content from comments where id="' + request.json["id"] + '"'
                )[0][0]
                + '","'
                + request.json["type"]
                + '")'
            )
            return json.dumps("ok")
        else:
            logmaker("daily").log("failure bad_request", request.remote_addr)
            return json.dumps("bad")
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return json.dumps("bad")


# grab the number of open reports
@app.route("/fetchnumreps")
def fetchnumreps():
    try:
        logmaker("daily").log("fetch num_reports", request.remote_addr)
        return json.dumps(query_db("SELECT COUNT(*) FROM reports")[0][0])
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return json.dumps("bad")


##########################################################################

# on server close execute these commands
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


##########################################################################

# endpoints for post fetching:
@app.route("/fetchposts", methods=["GET", "POST"])
def fetchposts():
    try:
        order = request.json["order"]
        start = request.json["start"]
        numloaded = int(request.json["numloaded"])
        if order == "search":
            logmaker("daily").log("search - " + str(start), request.remote_addr)
            results = query_db(
                "SELECT * FROM MAIN WHERE CONTENT LIKE "
                + "'%"
                + str(start)
                + "%' OR ID LIKE '%"
                + str(start)
                + "%' OR USER LIKE '%"
                + str(start)
                + "%' AND DELETED=0"
            )
            if len(results) == 0:
                return json.dumps("search 0 results")
            return json.dumps(results)
        else:
            # if we are doing a first load or type change do the standard procedure
            if start == "fresh":
                if order == "old":
                    logmaker("daily").log("fetch old", request.remote_addr)
                    return json.dumps(
                        query_db(
                            "select * from main where deleted != 2 order by ID asc LIMIT 15"
                        )
                    )
                elif order == "new":
                    logmaker("daily").log("fetch new", request.remote_addr)
                    return json.dumps(
                        query_db(
                            "select * from main where deleted != 2 order by ID desc LIMIT 15"
                        )
                    )
                elif order == "pop":
                    logmaker("daily").log("fetch pop", request.remote_addr)
                    return json.dumps(
                        query_db(
                            "select * from main where deleted != 2 order by likes desc LIMIT 15"
                        )
                    )
                else:
                    logmaker("daily").log("failure bad_request", request.remote_addr)
                    return "bad request"
            else:
                start = int(start)
                if order == "old":
                    logmaker("daily").log("fetch old", request.remote_addr)

                    value = query_db(
                        "select * from main where deleted != 2 AND id >= "
                        + str(start + 1)
                        + " LIMIT 15"
                    )

                    if len(value) < 15:
                        value.append(["end"])

                    return json.dumps(value)
                elif order == "new":
                    logmaker("daily").log("fetch new", request.remote_addr)

                    value = query_db(
                        "select * from main where deleted != 2 and id<= "
                        + str(start - 1)
                        + " order by ID desc LIMIT 15"
                    )
                    if len(value) < 15:
                        value.append(["end"])

                    # if numloaded == value[len(value) - 1][0]: #if the users cached count of the db for that tab is equal

                    return json.dumps(value)
                elif order == "pop":
                    logmaker("daily").log("fetch pop", request.remote_addr)
                    # grab all posts in desc order of popular
                    result = query_db(
                        "select * from main where deleted != 2 order by likes desc"
                    )
                    final = []  # create blank list
                    # run loop 15 times
                    for i in range(15):
                        try:
                            final.append(
                                result[i + numloaded]
                            )  # add 15 next posts in the correct order
                        except:
                            final.append(["end"])
                            break
                    print(len(final))
                    return json.dumps(final)
                else:
                    logmaker("daily").log("failure bad_request", request.remote_addr)
                    return "bad request"
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return json.dumps("bad")


##########################################################################

# endpoints for comments:
@app.route("/commentsnew", methods=["GET", "POST"])
def comments():
    try:
        logmaker("daily").log("fetch new_comments", request.remote_addr)
        return json.dumps(
            query_db('select * from comments where post="' + request.json["id"] + '"')
        )
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return json.dumps("bad")


# this is an admin side function to view every comment on the site
@app.route("/fetchallcomments", methods=["GET", "POST"])
def allcomments():
    try:
        logmaker("daily").log("fetch all_comments", request.remote_addr)
        return json.dumps(query_db("select * from comments"))
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return json.dumps("bad")


@app.route("/numcomments", methods=["GET", "POST"])
def numcomments():
    try:
        logmaker("daily").log("fetch num_comments", request.remote_addr)
        return str(
            query_db(
                'select comment_count from main where id="' + request.json["id"] + '"'
            )[0][0]
        )
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return json.dumps("bad")


@app.route("/comment", methods=["GET", "POST"])
def leavecomment():
    try:
        logmaker("daily").log("post comment", request.remote_addr)
        req = request.json
        # execute the comment to the comment table
        execute_db(
            "insert into comments (id,post,content,likes,stamp,user,deleted) values ("
            + str(query_db("SELECT Count(*) FROM comments")[0][0])
            + ',"'
            + req["POST"]
            + '","'
            + req["CONTENT"]
            + '",0,"'
            + str(datetime.datetime.now())[0:19]
            + '","'
            + req["USER"]
            + '",false)'
        )
        # update main table comment amount to reflect new comment count
        execute_db(
            "update main set comment_count=("
            + str(
                (
                    query_db(
                        'select comment_count from main where id="' + req["POST"] + '"'
                    )[0][0]
                )
                + 1
            )
            + ') where id="'
            + req["POST"]
            + '"'
        )
        return "commented"
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return json.dumps("bad")


##########################################################################

# endpoints for laughing:
@app.route("/laugh", methods=["GET", "POST"])
def laugh():
    try:
        if request.json["type"] == "post":
            logmaker("daily").log("laugh post", request.remote_addr)
            val = json.dumps(
                query_db(
                    'select likes from main where id="' + request.json["id"] + '"'
                )[0][0]
            )
            execute_db(
                "update main set likes=("
                + str(int(val) + int(request.json["amount"]))
                + ') where id="'
                + request.json["id"]
                + '"'
            )
            return "done"  # str(int(val) + 1)
        elif request.json["type"] == "comment":
            logmaker("daily").log("laugh comment", request.remote_addr)
            val = json.dumps(
                query_db(
                    'select likes from comments where id="' + request.json["id"] + '"'
                )[0][0]
            )
            execute_db(
                "update comments set likes=("
                + str(int(val) + int(request.json["amount"]))
                + ') where id="'
                + request.json["id"]
                + '"'
            )
            return "done"  # str(int(val) + int(request.json["amount"]))
        else:
            logmaker("daily").log("failure bad_request", request.remote_addr)
            return "ERROR SOME SHIT GOIN ON IN THE SERVER"
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return json.dumps("bad")


##########################################################################

# endpoints for posting:
@app.route("/post", methods=["GET", "POST"])
def post():
    try:
        logmaker("daily").log("post text", request.remote_addr)
        req = request.json
        postid = str(query_db("SELECT Count(*) FROM main")[0][0])
        execute_db(
            "insert into main (ID,USER,CONTENT,LIKES,STAMP,deleted,comment_count) values ("
            + postid
            + ',"'
            + req["USER"]
            + '","'
            + req["CONTENT"].replace('"', "“")
            + '",'
            + str(0)
            + ',"'
            + str(datetime.datetime.now())[0:19]
            + '",0,0)'
        )
        return "done"
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return json.dumps("bad")


@app.route("/postimage", methods=["POST"])
def postimg():
    try:
        logmaker("daily").log("post image", request.remote_addr)
        # detect if theres a file in the request
        if request.files["file"]:
            # nab the file from the request
            uploaded_file = request.files["file"]

        # generate post id and insert our post to the main table
        postid = str(query_db("SELECT Count(*) FROM main")[0][0])
        execute_db(
            "insert into main (ID,USER,CONTENT,LIKES,STAMP,deleted,comment_count) values ("
            + postid
            + ',"'
            + request.form["USER"]
            + '","'
            + request.form["text"].replace('"', "“")
            + '",'
            + str(0)
            + ',"'
            + str(datetime.datetime.now())[0:19]
            + '",0,0)'
        )

        # if the filename isnt empty
        if uploaded_file.filename != "":
            attachmentid = str(query_db("SELECT Count(*) FROM attachments")[0][0])
            newfilename = uploaded_file.filename
            newfilename = (
                attachmentid
                + "."
                + re.sub(r"\.(?![^.]*$)", "", newfilename).split(".")[1]
            )
            newfilename = newfilename.lower()

            uploaded_file.save("static/attachments/" + newfilename)
            execute_db(
                "insert into attachments (postid,name) values ("
                + postid
                + ',"'
                + newfilename
                + '")'
            )
            execute_db(
                'update main set attachmentid=("'
                + attachmentid
                + '") where id="'
                + postid
                + '"'
            )

            # idk why i felt the need to use a python module when the command line argunments are so much easier
            os.system(
                "ffmpeg -i static/attachments/"
                + str(newfilename)
                + " -vframes 1 static/attachments/previews/"
                + str(attachmentid)
                + ".jpg"
            )

        return render_template("index.html")
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return json.dumps("bad")


##########################################################################

# endpoints for attachments:
@app.route("/getattachment", methods=["GET", "POST"])
def getattachment():
    try:
        logmaker("daily").log("fetch attachment_table", request.remote_addr)
        return json.dumps(query_db("select * from attachments"))
    except Exception as e:
        logmaker("daily").log("failure - " + str(e) + " - ", "INTERNAL")
        return json.dumps("bad")


##########################################################################

if __name__ == "__main__":
    app.run(host="192.168.50.213", port=443, debug=True)
