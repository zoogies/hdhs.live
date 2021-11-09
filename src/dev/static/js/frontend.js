function getContent(sort){
    //send a xhr request using our async function we wrote and act based on the result

    //specify our sort so the db knows how to return the data in the right order
    var data = {
        "order": String(sort),
    }

    //get all the images and their post ids
    basicxhr('getattachment', data)
    .then(function (response) {
        //parse the response as a json
        var attachment_table = JSON.parse(response);

        //send xhr request to get all posts in database in order of our sort
        basicxhr('fetchposts', data)
        .then(function (response) {
            //create content variable out of json parsed response from server
            content = JSON.parse(response)
            for (p in content){
                //set current post to the row of content we are indexing from our lump json
                var post = content[p]

                //assign instance variables for each loop to concatenate easier
                post_id = post[0]
                post_user = post[1]
                post_content = post[2]
                comments = post[3]
                likes = post[4]
                stamp = post[5]
                deleted_status = post[6]
                attachment_id = post[7]
                num_comments = post[8]

                //if post completely visible
                if(deleted_status == 0){ 
                    //define a basic post without decorators
                    if(post_content != ''){
                        header = '<div class="post" id="'+post_id+'"><div class="p_header"><img class="icon spaced" src="http://76.181.32.163:5000/static/resources/user.png"/><p>'+post_user+'</p><p class="ID">'+'#'+post_id+'</p><p class="ID">'+stamp+'</p></div><p class="spaced">'+post_content+'</p>'
                    }
                    else{
                        header = '<div class="post" id="'+post_id+'"><div class="p_header"><img class="icon spaced" src="http://76.181.32.163:5000/static/resources/user.png"/><p>'+post_user+'</p><p class="ID">'+'#'+post_id+'</p><p class="ID">'+stamp+'</p></div>'
                    }
                    //append our generated post to the container
                    document.getElementById("container").innerHTML += header;

                    //set our post content presets
                    var postreportbtn = '<p onclick="report(\'' +post_id+ '\',\'' + 'post'+ '\')" class="reportbtn">Report</p>'
                    var postlaughbtn = '<div onclick="laugh(\'' +post_id+ '\',\'' + 'post'+ '\')" class="combtn laughbtn"><p>Laugh</p><img class="joy" src="http://76.181.32.163:5000/static/resources/joy.png"/></div>'
                    var footer = '<div class="p_footer"><p id="liketext" class="spaced laughtxt">'+likes+'  Laughs'+'</p>'+postlaughbtn+'<p class="spaced combtn" id="comclick" onclick="refreshcomments('+post_id+')"><b>View '+num_comments+' Comments</b></p>'+postreportbtn+'</div></div>'
                    //if our current post contains an attachment
                    if (attachment_id != null){
                        //embed our attachment with the fetched path to our post
                        document.getElementById(post_id).innerHTML+='<div class="embed"><img class="attachment" src="'+'http://76.181.32.163:5000/static/attachments/'+attachment_table[attachment_id][2]+'"/></div>'
                        //embed the defualt footer to the post
                        document.getElementById(post_id).innerHTML+=footer;
                    }
                    //if post does not have image
                    else{
                        //append the normal footer without the attachment to our container
                        document.getElementById(post_id).innerHTML+=footer;
                    }
                }
                else if(deleted_status == 1){ //if post is removed but not shadowbanned render it limited
                    //define a limited post where the content is banned and append it to our main container
                    header = '<div class="post" id="'+post_id+'"><div class="p_header"><img class="icon spaced" src="http://76.181.32.163:5000/static/resources/user.png"/><p>'+post_user+'</p><p class="ID">'+'#'+post_id+'</p><p class="ID">'+stamp+'</p></div><p class="spaced" style="color:red;"><b>[Post Removed By Moderator]</b></p><div class="p_footer"><p id="liketext" class="spaced laughtxt">'+likes+'  Laughs'+'</p><p class="spaced combtn deleted_post" id="comclick" onclick="refreshcomments('+post_id+')"><b>View Comments</b></p></div></div>'
                    //append the post to the container
                    document.getElementById("container").innerHTML += header;
                }
            }

            //append to the bottom of our container a fun little easter egg post telling the user they reached the end
            document.getElementById("container").innerHTML += '<div id="end"><img id="end" src="http://76.181.32.163:5000/static/resources/end.png"/></div>'
        })
        .catch(function (err) {
            console.error('An error occured!', err);
        });
    })
}

//function to destroy all posts in main container
function flushcontainer(){
    //flush container to load posts in
    while (container.lastChild.id !== 'save') {
        container.removeChild(container.lastChild); //destroy all children of main container
    }
}

//draw some comments to screen given a post id and the comments
function renderComments(id,data){
    //gather the post we intend to add comments to
    reqpost = document.getElementById(id);

    //add our top level comments container to the post
    reqpost.innerHTML += document.createElement('div').innerHTML = '<div class="comments"></div>';

    //grab the top level container we just created
    reqbox = reqpost.querySelector('.comments');

    //append a div allowing the user to reply with a comment to our selected post
    reqbox.innerHTML += '<p class="leavea" >Leave a comment:</p><div style="display:flex; flex-wrap:nowrap;"><input autocomplete="off" maxlength="250" id="commentbox" class="commentbox" type="text"/><a class="postcom" onclick="leavecomment('+id+')">Comment</a></div>' //TODO onclick
    
    //if this post is deleted we should not allow the option to leave additional comments
    if(document.getElementById(id).querySelector('#comclick').classList.contains('deleted_post')){
        reqpost.querySelector('.leavea').remove();
        reqpost.querySelector('.commentbox').remove();
        reqpost.querySelector('.postcom').remove();
    }

    //generate our comment actions
    for(comment in data){
        //declare our static preset elements for comment actions
        var comreportbtn = '<p onclick="report(\'' +data[comment][0]+ '\',\'' + 'comment'+ '\')" class="reportbtncom">Report</p>'
        var comlaughbtn = '<div onclick="laugh(\'' +data[comment][0]+ '\',\'' + 'comment'+ '\')" class="comlaughbtn"><p>Laugh</p><img class="joy" src="http://76.181.32.163:5000/static/resources/joy.png"/></div>'

        // if the deleted status of the comment is 0 (not banned at all)
        if(data[comment][6] == 0){
            // awful, disgusting string of a comment preset with its data filled in
            content = document.createElement('div').innerHTML='<div class="comment"><img class="compfp" src="http://76.181.32.163:5000/static/resources/user.png"/><p class="commentid">#'+String(data[comment][0])+'</p><p class="comname">'+String(data[comment][5])+':</p><p class="comtxt">'+String(data[comment][2])+'</p><div class="commentactionbound"><p class="comdate">'+String(data[comment][4])+'</p><p class-"comliketxt" id="comment_'+String(data[comment][0]+'"><Laughs>'+String(data[comment][3])+' Laughs</p>'+comlaughbtn+comreportbtn+'</div></div>');
            
            //append our comment to the parent post container
            reqbox.innerHTML += (content);
        }
        // else if the deleted status of the comment is 1 (directly banned)
        else if (data[comment][6] == 1){
            // awful, disgusting string of a visible banned comment preset with its data filled in
            content = document.createElement('div').innerHTML='<div class="comment"><img class="compfp" src="http://76.181.32.163:5000/static/resources/user.png"/><p class="commentid">#'+String(data[comment][0])+'</p><p class="comname">'+String(data[comment][5])+':</p><p class="comtxt"><p style="color:red;"><b>[Removed By Moderator]</b></p></p><div class="commentactionbound"><p class="comdate">'+String(data[comment][4])+'</p><p class-"comliketxt" id="comment_'+String(data[comment][0])+'"><Laughs>'+String(data[comment][3])+' Laughs</p></div></div>';
            
            //append our comment to the parent post container
            reqbox.innerHTML += (content);
        }
        else {
            // nothing should happen here because that means the post was likely shadowbanned and should not be rendered at all
        }
    }
}

//active soft reset of selected posts comments after user posts a comment themselves, also a waterfall initiator for new post expand comments
function refreshcomments(post){
    //will query for comments as single string, parse them and then append them programatically to the bottom of the post

    //grab our parent comment expand box
    handler = document.getElementById(post).querySelector('#comclick');

    //if our box is not open
    if (!handler.classList.contains('opened')){
        //fetch a comment box from the document
        box = document.getElementById('commentbox'); 
        //if that box exists
        if(box){
            //change the text back to closed text
            box.closest('.post').querySelector(".p_footer").querySelector('#comclick').innerText = "View Comments";
            //remove the comment section div
            box.closest('.comments').remove();
        }
        
        //normal behavior
        querycomments(post); //intiate waterfall to get comments and render them

        //change box text to show its currently opened
        handler.innerText = "Click To Hide Comments";
        //add the opened class so it can reflect the change visibly
        handler.classList.add('opened');
    }
    //if our box is already open
    else{
        //generate our request data
        var data = {
            'id': String(post),
        }
        //fetch the number of comments
        basicxhr('numcomments', data)
        .then(function (response) {
            //remove its opened class
            handler.classList.remove('opened');
            //get the given post
            post = document.getElementById(post);
            //get all children of our post
            children = post.childNodes;
            //cut our children into an array
            var array = Array.prototype.slice.call(children);
            //for all children in our array, remove them if they contain the .comments class
            [].forEach.call(children, function(child) {if(child.classList.contains('comments')){child.remove()}});
            //set our box text back to defualt
            handler.innerText = "View "+response+" Comments";
        })
        .catch(function (err) {
            console.error('An error occured!', err.statusText);
        });
    }
}

//function that tracks number of characters in the posting box and updates the char counter to reflect it
//(is updated every 100ms by main.js)
function trackchar(){
    var elem = document.getElementById("charlim"); //get character limit text
    elem.innerText = document.getElementById("field").value.length + "/250 characters"; //change to reflect new value entered in textbox
}

//function to gather all new comments
function querycomments(id){
    //set our header data to match the passed id
    var data = {
        "id": String(id),
    };

    //send a xhr request using our async function we wrote and act based on the result
    basicxhr('commentsnew', data)
    .then(function (response) {
        //pass our json return of comments assosciated with post id to be rendered
        commentReturn = JSON.parse(response)
        renderComments(id,commentReturn)
    })
    .catch(function (err) {
        console.error('An error occured!', err.statusText);
    });
}