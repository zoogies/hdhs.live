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
            "USER": "UNKNOWN",
            "CONTENT": String(posttext),
            //"STAMP": now.getHours() + ':' + now.getMinutes() + ' ' + now.getMonth() + '/' + now.getDate() + '/' + now.getFullYear()
        };
        //alert(JSON.stringify(data))
        xhr.send(JSON.stringify(data));
        setTimeout(() => {  location.reload(); }, 50);
    }
    else{
        alert('Your post needs to be more than 0 and less than 250 characters')
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
        fetch("http://76.181.32.163:5000/fetchnew") //TODO THIS CODE IS DOGSHIT AND CANNOT BE PUBLISHED.
        .then(response => {
        return response.json();
        }).then(cs => {
            //I Have an immense hatred for js and im just gonna fucking do the operations in here since thats all im allowed to do i guess   
            console.log(cs);
            if (cs.length >= 1)
        {
            for (i=0; i < cs.length; i++){
                header = '<div class="post"><div class="p_header"><img class="icon spaced" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"/><p>'+cs[i][1]+'</p><p class="ID">'+'#'+cs[i][0]+'</p><p class="ID">'+cs[i][5]+'</p></div><p class="spaced">'+cs[i][2]+'</p><div class="p_footer"><p class="spaced">'+cs[i][4]+' Likes'+'</p><p class="spaced"><b>Click For Comments</b></p></div></div>'
                document.getElementById("container").innerHTML += header;
                
                //console.log(header)
            }
        }
        });
        var ld = document.getElementById("loading");
        ld.remove();

        var chartrack=setInterval(trackchar,100);
    }
}

//navbar shit
function fresh(){
    try{ //TODO run if contains THIS IS DOGSHIT
        Document.getElementById('old').classList.remove('nav_sel');
        Document.getElementById('old').classList.remove('nav_btn');
        Document.getElementById('new').classList.remove('nav_sel');
        Document.getElementById('new').classList.remove('nav_btn');
        Document.getElementById('pop').classList.remove('nav_sel');
        Document.getElementById('pop').classList.remove('nav_btn');
    }
    catch{
        alert('Something went wrong')
    }
    
    Document.getElementById('old')
}

function s_new(){
    fresh();
}
function s_old(){
    fresh();
}
function s_pop(){
    fresh();
}