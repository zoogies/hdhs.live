function reportmistake(){
    alert('LMAO i didnt program this yet so tough luck i guess. find out who i am and let me know.');
    //TODO
}
//todo loading symbol until posts are loaded
function init(){
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
                
                console.log(header)
            }
        }
        });
    }
}