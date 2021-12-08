//what actual refactored code does to an mf:

//posting pop up box
function postingpopup(){
    var popup = document.getElementById("popup");
    popup.classList.remove("hide"); //show popup
    document.getElementById('toplevel').style.overflow = 'hidden'; //disable scrolling
}

//state variables
var currentlyPosting = false;

//function to post a post along with optional image attached
function posst(){
    //make sure we arent already processing a request
    if(currentlyPosting){
        return;
    }
    //update state variable
    currentlyPosting = true;

    //get our post text from the field
    var posttext = document.getElementById("field").value;
    //get value of box containing choose file
    file = document.getElementById('selector').files[0];
    //get the users desired name
    var name = document.getElementById('name').value;
    if (name == ""){
        name = "Anonymous";
    }

    //make sure our post text is not 0 and less than 250
    if((posttext.length <= 250 && posttext.length > 0) || file != null){
        postingpopup();
        //if we have a file selected
        if(file){

            //get file type
            type = file.type.split('/')[1]

            //check extensions
            if(!['png','jpg','gif','jpeg','mp4','quicktime','mov'].includes(type)){
                //if not approved extension tell the user
                alert('Invalid Image Format! You can only submit png jpg or gifs, not "'+String(type)+'"!')
                return;
            }

            //check file size
            if (file.size > 10000000) {
                //if the file is more than 10 mb
                alert('Your image is way too big! Please keep the size under 10mb. Google "image compressor" to make it smaller.')
                return; //break the post function
            }

            var data = {
                "USER": String(name),
                "CONTENT": String(posttext),
                "attachment": String(file['name']).replace(/[.](?=.*[.])/g, ""),
            };

            //send a xhr request using our async function we wrote and act based on the result
            filexhr(file,data).then(function (response) {
                location.reload();
            })
        }
        //if we are doing a normal text post
        else{
            //set defualts with the text data user has entered
            var data = {
                "USER": String(name),
                "CONTENT": String(posttext),
                "attachment": 'none',
            };
            //send a xhr request using our async function we wrote and act based on the result
            basicxhr('post', data).then(function (response) {
                //this is what we do when the post is done uploading
                location.reload();
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
    //reset our state variable
    currentlyPosting = false;
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