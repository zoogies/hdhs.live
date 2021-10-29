var validator = require('validator');

function reportmistake(){
    alert('LMAO i didnt program this yet so tough luck i guess. find out who i am and let me know.');
    //TODO
}

function trackchar(){
    var elem = document.getElementById("charlim");
    elem.innerText = document.getElementById("field").value.length + "/250 characters";
}

function post(){
    //TODO
    //alert();
    var posttext = document.getElementById("field").value;
    if(posttext.length <= 250 && posttext.length > 0){
        //alert(posttext);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://76.181.32.163:5000/post");

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);
        }};
        now = new Date();
        var data = {
            "USER": "Anonymous",
            "CONTENT": String(posttext),
            //"STAMP": now.getHours() + ':' + now.getMinutes() + ' ' + now.getMonth() + '/' + now.getDate() + '/' + now.getFullYear()
        };
        //alert(JSON.stringify(data))
        xhr.send(JSON.stringify(data));
        setTimeout(() => {  location.reload(); }, 500);
    }
    else{
        alert('Your post needs to be more than 0 and less than 250 characters')
    }
}

function getContent(sort){
    fetch("http://76.181.32.163:5000/" + sort) //TODO THIS CODE IS DOGSHIT AND CANNOT BE PUBLISHED.
        .then(response => {
        return response.json();
        }).then(cs => {
            //I Have an immense hatred for js and im just gonna fucking do the operations in here since thats all im allowed to do i guess   
            console.log(cs);
            if (cs.length >= 1)
        {
            for (i=0; i < cs.length; i++){
                header = '<div class="post" id="'+cs[i][0]+'"><div class="p_header"><img class="icon spaced" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"/><p>'+cs[i][1]+'</p><p class="ID">'+'#'+cs[i][0]+'</p><p class="ID">'+cs[i][5]+'</p></div><p class="spaced">'+cs[i][2]+'</p><div class="p_footer"><p id="liketext" class="spaced laughtxt">'+cs[i][4]+'  Laughs'+'</p><div onclick="laugh('+cs[i][0]+');" class="combtn laughbtn"><p>Laugh</p><img class="joy" src="http://assets.stickpng.com/images/586294223796e30ac446872f.png"/></div><p class="spaced combtn" id="comclick" onclick="loadcomments('+cs[i][0]+')"><b>View Comments</b></p></div></div>'
                document.getElementById("container").innerHTML += header;
                
                //console.log(header)
            }
        }
        });
}

function flushcontainer(){
    //flush container to load posts in
    while (container.lastChild.id !== 'save') {
        container.removeChild(container.lastChild);
    }
}

//todo loading symbol until posts are loaded
function init(){
    //detect container
    var container = !!document.getElementById("container");
    if (container) {
        //run if we are on a page with the container
        console.log('container detected');
        //query to recieve posts on first load
        getContent("fetchnew");

        var ld = document.getElementById("loading");
        ld.remove();

        var chartrack=setInterval(trackchar,100);
    }
}

//navbar shit
function fresh(){
    try{ //TODO run if contains
        document.getElementById('old').classList.remove('nav_sel');
        document.getElementById('old').classList.remove('nav_btn');
        document.getElementById('new').classList.remove('nav_sel');
        document.getElementById('new').classList.remove('nav_btn');
        document.getElementById('pop').classList.remove('nav_sel');
        document.getElementById('pop').classList.remove('nav_btn');
    }
    catch{
        alert('Something went wrong')
    }
}

function s_new(){
    try{
        //content
        flushcontainer();
        getContent("fetchnew");

        //nav
        fresh();
        document.getElementById('pop').classList.add('nav_btn');
        document.getElementById('new').classList.add('nav_sel');
        document.getElementById('old').classList.add('nav_btn');
    }
    catch{
        alert("Something went wrong :(");
    }
    
}
function s_old(){
    try{
        //content
        flushcontainer();
        getContent("fetchold");

        //nav
        fresh();
        document.getElementById('new').classList.add('nav_btn');
        document.getElementById('old').classList.add('nav_sel');
        document.getElementById('pop').classList.add('nav_btn');
    }
    catch{
        alert("Something went wrong :(");
    }
}
function s_pop(){
    try{
        //content
        flushcontainer();
        getContent("fetchpop");

        //nav
        fresh();
        document.getElementById('new').classList.add('nav_btn');
        document.getElementById('old').classList.add('nav_btn');
        document.getElementById('pop').classList.add('nav_sel');
    }
    catch{
        alert("Something went wrong :(");
    }
}

function renderComments(id,comments){
    reqpost = document.getElementById(id);
    for(comment in comments){
        var node = document.createElement("p");
        node.classList.add('comment');
        node.appendChild(document.createTextNode(comments[comment]));
        reqpost.appendChild(node);
    }
}

function querycomments(id){
    var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://76.181.32.163:5000/comments");

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                comments = (xhr.responseText).split('|');
                renderComments(id,comments);
            }
        }
        var data = {
            "id": String(id),
        };
        //alert(JSON.stringify(data))
        xhr.send(JSON.stringify(data))
}

function loadcomments(post){
    //TODO ALLOW FLAGGING OF OPEN/CLOSED STRINGS SO CLICKING WILL REVERSE
    //query for comments as single string, parse them and then append them programatically to the bottom of the post
    handler = document.getElementById(post).querySelector('#comclick');
    if (!handler.classList.contains('opened')){
        querycomments(post);
        handler.innerText = "Click To Hide Comments";
        handler.classList.add('opened');
    }
    else{
        handler.classList.remove('opened');
        post = document.getElementById(post)
        children = post.childNodes;
        var array = Array.prototype.slice.call(children);
        [].forEach.call(children, function(child) {if(child.classList.contains('comment')){child.remove()}});
        handler.innerText = "View Comments";
    }
}

function laugh(id){
    var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://76.181.32.163:5000/laugh");

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                document.getElementById(id).querySelector('#liketext').innerText = xhr.responseText + ' Laughs';
            }
        }
        var data = {
            "id": String(id),
        };
        //alert(JSON.stringify(data))
        xhr.send(JSON.stringify(data))
}