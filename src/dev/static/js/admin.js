function admin_init(){
    //create table for main
    admincontent = document.getElementById('admincontent');
    admincontent.innerHTML += '<p>(new,old,pop) Sorting:</p><input id="sortval" type="text"/><button type="button">Submit</button>';
    admincontent.innerHTML += '<table border="1" id="maintable"><tr><th>id</th><th>user</th><th>content</th><th>comments</th><th>likes</th><th>stamp</th><th>delete</th></tr></table>';

    admin_querydb("new");
    //admin_querydb(document.getElementById('sortval').value);
    
}

function admin_querydb(value){
    //load all posts from main
    fetch("http://76.181.32.163:5000/fetch" + value)
        .then(response => {
        return response.json();
        }).then(cs => {  
            console.log(cs);
            if (cs.length >= 1)
        {
            for (i=0; i < cs.length; i++){
                //header = '<div class="post" id="'+cs[i][0]+'"><div class="p_header"><img class="icon spaced" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/user.png?raw=true"/><p>'+cs[i][1]+'</p><p class="ID">'+'#'+cs[i][0]+'</p><p class="ID">'+cs[i][5]+'</p></div><p class="spaced">'+cs[i][2]+'</p><div class="p_footer"><p id="liketext" class="spaced laughtxt">'+cs[i][4]+'  Laughs'+'</p><div onclick="laugh('+cs[i][0]+');" class="combtn laughbtn"><p>Laugh</p><img class="joy" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/joy.png?raw=true"/></div><p class="spaced combtn" id="comclick" onclick="loadcomments('+cs[i][0]+')"><b>View Comments</b></p></div></div>'
                //document.getElementById("container").innerHTML += header;
                document.getElementById('maintable').innerHTML += '<tr><th>'+cs[i][0]+'</th><th>'+cs[i][1]+'</th><th>'+cs[i][2]+'</th><th>'+cs[i][3]+'</th><th>'+cs[i][4]+'</th><th>'+cs[i][5]+'</th><th><button type="button" onclick="admin_delete('+cs[i][0]+')">Delete</button></th></tr>'
            }
        }
        });
}

function admin_delete(id){
    //TODO THIS NEEDS TO BE DONE WELL SO ITS SECURE. DB FILE GETS UPLOADED TO GITHUB ANYWAYS MAYBE LOCAL FILE TO SERVER WITH GITIGNORE
}