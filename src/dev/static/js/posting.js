//what actual refactored code does to an mf:

//function to post a post along with optional image attached
function posst(){
    //get our post text from the field
    var posttext = document.getElementById("field").value;
    //get value of box containing choose file
    file = document.getElementById('selector').files[0];

    //make sure our post text is not 0 and less than 250
    if((posttext.length <= 250 && posttext.length > 0) || file != null){
        
        //get file type
        type = file.type.split('/')[1]
        //check extensions
        if(!['png','jpg','gif','jpeg'].includes(type)){
            //if not approved extension tell the user
            alert('Invalid Image Format! You can only submit png jpg or gifs!')
            return;
        }

        //check file size
        if (file.size > 6000000) {
            //if the file is more than 6 mb
            alert('Your image is way too big! Please keep the size under 6mb. Google "image compressor" to make it smaller.')
            return; //break the post function
        }

        //if we have a file selected
        if(file){
            var data = {
                "USER": "Anonymous",
                "CONTENT": String(posttext),
                "attachment": String(file['name']),
            };
            //send a xhr request using our async function we wrote and act based on the result
            filexhr(file,data)
            setTimeout(() => {  location.reload(); }, 500); 
        }
        //if we are doing a normal text post
        else{
            //set defualts with the text data user has entered
            var data = {
                "USER": "Anonymous",
                "CONTENT": String(posttext),
                "attachment": 'none',
            };
            //send a xhr request using our async function we wrote and act based on the result
            basicxhr('post', data)
            .then(function (response) {
                //this is what we do when the post is done uploading
                setTimeout(() => {  location.reload(); }, 500); 
            })
            .catch(function (err) {
                console.error('An error occured!', err.statusText);
            });
        }
    }
    //if our post fails the min max criteria
    else{
        alert('Your post needs to be more than 0 and less than 250 characters or contain an image')
    }
}

//function to comment under a post
function leavecomment(id){
    //gather our comment box text so we can post it
    var posttext = document.getElementById("commentbox").value

    //check that our post is below the max and above 0
    if(posttext.length <= 250 && posttext.length > 0){
        //set our header data with our variables
        var data = {
            "POST": String(id),
            "CONTENT": String(posttext),
            "USER": "Anonymous"
        };

        //send a xhr request using our async function we wrote and act based on the result
        basicxhr('comment', data)
        .then(function (response) {
            //call our waterfall of frontend functions to refresh the comment content without a hard refresh
            setTimeout(() => {refreshcomments(id);}, 1); //first time unloads box
            setTimeout(() => {refreshcomments(id);}, 50); //second time reloads box
        })
        .catch(function (err) {
            console.error('An error occured!', err.statusText);
        });
    }
    //if comment fails min max criteria
    else{
        alert('Your comment needs to be more than 0 and less than 250 characters')
    }
}