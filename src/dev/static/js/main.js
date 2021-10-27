function reportmistake(){
    alert('LMAO i didnt program this yet so tough luck i guess. find out who i am and let me know.');
    //TODO
}

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
                header = document.createElement("div");
                header.textContent = cs[i][2];
                //TODO header.setAttribute('onclick','selectAvailable(this)');
                header.setAttribute('class','p_header')
                //console.log(el);
                //container.appendChild(el);
                console.log(header)
            }
        }
        });
    }
}