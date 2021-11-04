//what actual refactored code does to an mf:

//function to post a post along with optional image attached
function post_post(){
    //get our post text from the field
    var posttext = document.getElementById("field").value;

    //make sure our post text is not 0 and less than 250
    if(posttext.length <= 250 && posttext.length > 0){
        //get value of box containing choose file
        file = document.getElementById('selector').files[0];

        //if we have a file selected
        if(file){
            //get the base64 string of our attachment
            getBase64(file).then(bytes => {
                //set our headers with the defualts and base64 of attachment
                var data = {
                    "USER": "Anonymous",
                    "CONTENT": String(posttext),
                    "attachment": String(file['name']),
                    "bytes": String(bytes),
                };
                //send a xhr request using our async function we wrote and act based on the result
                basicxhr('post', data)
                .then(function (response) {
                    //this is what we do when the post is done uploading
                    alert(response)
                    setTimeout(() => {  location.reload(); }, 500); 
                })
                .catch(function (err) {
                    console.error('An error occured!', err.statusText);
                });
            })
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
        alert('Your post needs to be more than 0 and less than 250 characters')
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
            setTimeout(() => {refreshcomments(id);}, 500); //first time unloads box
            setTimeout(() => {refreshcomments(id);}, 500); //second time reloads box
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

//function that asyc finds the base64 of an image regexed out of its dataurl
function getBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader(); //make new file reader
        reader.readAsDataURL(file); //put our image into a dataurl
        reader.onloadend = () => {
            resolve(reader.result.replace(/^data:image\/(png|jpg);base64,/, "")); //resolve the dataurl as base64 data with the dataurl headers regexed out
        };
    });
}