function admin_init(){
    psk = window.prompt('hey buddy. im gonna need to see some identification for you to proceed:');

    var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://hdhs.live/auth");

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.responseText == 'true'){
                    //create table for main
                    admincontent = document.getElementById('admincontent');
                    //admincontent.innerHTML += '<p>(new,old,pop) Sorting:</p><input id="sortval" type="text"/><button type="button">Submit</button>';

                    //admin_querydb("new");
                    //admin_querydb(document.getElementById('sortval').value);
                    admin_querydb("numreps");
                }
                else {
                    window.location.replace("https://www.youtube.com/watch?v=vOtqPictUUQ&list=PLRfJd4ggmHhS_pBNUwayGWLVMZLUppgtH&index=21");
                }
            }
        }
        var data = {
            "psk": String(psk)
        };
        xhr.send(JSON.stringify(data))
}

function admin_querydb(value){
    //load all posts from main
    fetch("http://hdhs.live/fetch" + value)
        .then(response => {
        return response.json();
        }).then(cs => {  
            console.log(cs);
            if (cs)
        {
            if (document.getElementById('maintable')){
                document.getElementById('maintable').remove();
            }
            
            if(value == "new" || value=="old" || value=="pop") {
                admincontent.innerHTML += '<table border="1" id="maintable" style="width:700px;"><tr><th>id</th><th>user</th><th>content</th><th>comments</th><th>likes</th><th>stamp</th><th>deleted</th><th>delete</th><th>set_no_render</th></tr></table>';
                for (i=0; i < cs.length; i++){
                    //header = '<div class="post" id="'+cs[i][0]+'"><div class="p_header"><img class="icon spaced" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/user.png?raw=true"/><p>'+cs[i][1]+'</p><p class="ID">'+'#'+cs[i][0]+'</p><p class="ID">'+cs[i][5]+'</p></div><p class="spaced">'+cs[i][2]+'</p><div class="p_footer"><p id="liketext" class="spaced laughtxt">'+cs[i][4]+'  Laughs'+'</p><div onclick="laugh('+cs[i][0]+');" class="combtn laughbtn"><p>Laugh</p><img class="joy" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/joy.png?raw=true"/></div><p class="spaced combtn" id="comclick" onclick="loadcomments('+cs[i][0]+')"><b>View Comments</b></p></div></div>'
                    //document.getElementById("container").innerHTML += header;
                    document.getElementById('maintable').innerHTML += '<tr id="'+cs[i][0]+'"><th>'+cs[i][0]+'</th><th>'+cs[i][1]+'</th><th>'+cs[i][2]+'</th><th>'+cs[i][3]+'</th><th>'+cs[i][4]+'</th><th>'+cs[i][5]+'</th><th>'+cs[i][6]+'</th><th><button type="button" onclick="moderate(\'' + cs[i][0] + '\',\'' + 'post_no_rep' + '\',\'' + 'delete_norep' + '\')">Delete</button></th><th><button type="button" onclick="moderate(\'' + cs[i][0] + '\',\'' + 'post_no_rep' + '\',\'' + 'no_render_norep' + '\')">set_no_render</button></th></tr>'
                }
            }
            else if (value=="reports"){
                admincontent.innerHTML += '<table border="1" id="maintable" style="width:700px;"><tr><th>id</th><th>reason</th><th>content</th><th>type</th><th>content_id</th><th>delete</th><th>dismiss</th><th>set_no_render</th></tr></table>';
                for (i=0; i < cs.length; i++){
                    //header = '<div class="post" id="'+cs[i][0]+'"><div class="p_header"><img class="icon spaced" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/user.png?raw=true"/><p>'+cs[i][1]+'</p><p class="ID">'+'#'+cs[i][0]+'</p><p class="ID">'+cs[i][5]+'</p></div><p class="spaced">'+cs[i][2]+'</p><div class="p_footer"><p id="liketext" class="spaced laughtxt">'+cs[i][4]+'  Laughs'+'</p><div onclick="laugh('+cs[i][0]+');" class="combtn laughbtn"><p>Laugh</p><img class="joy" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/joy.png?raw=true"/></div><p class="spaced combtn" id="comclick" onclick="loadcomments('+cs[i][0]+')"><b>View Comments</b></p></div></div>'
                    //document.getElementById("container").innerHTML += header;
                    document.getElementById('maintable').innerHTML += '<tr id="'+cs[i][0]+'"><th>'+cs[i][0]+'</th><th>'+cs[i][1]+'</th><th>'+cs[i][2]+'</th><th>'+cs[i][3]+'</th><th>'+cs[i][4]+'</th></th><th><button type="button" onclick="moderate(\'' + cs[i][0] + '\',\'' + cs[i][3] + '\',\'' + 'delete' + '\')">Delete</button></th><th><button type="button" onclick="moderate(\'' + cs[i][0] + '\',\'' + cs[i][3] + '\',\'' + 'dismiss' + '\')">Dismiss</button></th><th><button type="button" onclick="moderate(\'' + cs[i][0] + '\',\'' + cs[i][3] + '\',\'' + 'no_render' + '\')">set_no_render</button></th></tr>'
                }
            }
            else if (value=="allcomments"){
                admincontent.innerHTML += '<table border="1" id="maintable" style="width:700px;"><tr><th>id</th><th>post</th><th>content</th><th>likes</th><th>stamp</th><th>user</th><th>deleted</th><th>delete</th><th>set_no_render</th></tr></table>';
                for (i=0; i < cs.length; i++){
                    //header = '<div class="post" id="'+cs[i][0]+'"><div class="p_header"><img class="icon spaced" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/user.png?raw=true"/><p>'+cs[i][1]+'</p><p class="ID">'+'#'+cs[i][0]+'</p><p class="ID">'+cs[i][5]+'</p></div><p class="spaced">'+cs[i][2]+'</p><div class="p_footer"><p id="liketext" class="spaced laughtxt">'+cs[i][4]+'  Laughs'+'</p><div onclick="laugh('+cs[i][0]+');" class="combtn laughbtn"><p>Laugh</p><img class="joy" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/joy.png?raw=true"/></div><p class="spaced combtn" id="comclick" onclick="loadcomments('+cs[i][0]+')"><b>View Comments</b></p></div></div>'
                    //document.getElementById("container").innerHTML += header;
                    document.getElementById('maintable').innerHTML += '<tr id="'+cs[i][0]+'"><th>'+cs[i][0]+'</th><th>'+cs[i][1]+'</th><th>'+cs[i][2]+'</th><th>'+cs[i][3]+'</th><th>'+cs[i][4]+'</th><th>'+cs[i][5]+'</th></th><th>'+cs[i][6]+'</th><th><button type="button" onclick="moderate(\'' + cs[i][0] + '\',\'' + 'comment_no_rep' + '\',\'' + 'delete_norep' + '\')">Delete</button></th><th><button type="button" onclick="moderate(\'' + cs[i][0] + '\',\'' + 'comment_no_rep' + '\',\'' + 'no_render_norep' + '\')">set_no_render</button></th></tr>'
                }
            }
            else if (value=="numreps"){
                document.getElementById('reportcnt').innerHTML = '<h1 style="color:red;"><b>'+cs+' Pending Reports Need Action</b></ht>';
            }
        }
        });
}

function moderate(id,type,action){
    console.log(id,type,action)
    var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://hdhs.live/moderate");

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                document.getElementById(id).remove();
                admin_querydb("numreps");
            }
        }
        var data = {
            "id": String(id),
            "type": String(type),
            "action": String(action)
        };
        xhr.send(JSON.stringify(data))
}