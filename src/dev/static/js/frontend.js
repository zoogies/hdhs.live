var attachment_table;
var scrolledtobottom = false;

const regex = /\B(\#[0-9]+\b)(?!;)/gm; //average regex user: (insert chad image)

function getContent(sort,start){
    //send a xhr request using our async function we wrote and act based on the result

    //specify our sort so the db knows how to return the data in the right order
    var data = {
        "order": String(sort),
        "start": String(start),
        "numloaded": String(numloaded),
    }

    //get all the images and their post ids
    basicxhr('getattachment', data)
    .then(function (response) {
        //parse the response as a json
        attachment_table = JSON.parse(response);

        //send xhr request to get all posts in database in order of our sort
        basicxhr('fetchposts', data)
        .then(function (response) {
            renderContent(response);
        })
        .catch(function (err) {
            console.error('An error occured!', err);
        });
    })
}

//set list of allowed content types
var videotypes = ['mp4','mov','quicktime']
var phototypes = ['png','jpg','gif','jpeg']

//render the content to the end of the main container
function renderContent(response){
    //create content variable out of json parsed response from server
    content = JSON.parse(response)

    //update our numloaded
    numloaded += content.length;
    //console.log('loaded',numloaded)

    if(content == "search 0 results"){
        nothing = '<div><h1>Nothing Found</h1></div>'
        document.getElementById("container").insertAdjacentHTML('beforeend',nothing);    }
    else{
        //iterate over all our loaded posts and render them
        for (p in content){
            //set current post to the row of content we are indexing from our lump json
            var post = content[p]

            if(post[0] == 'end'){
                scrolledtobottom = true;
                loadicon();
                return;
            }

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
                    finalcontent = post_content.replace(regex, function(m){return '<font color="0051BA"><b>'+m+'</b></font>';});
                    header = '<div class="post" id="'+post_id+'"><div class="p_header"><img class="icon" src="http://192.168.50.213/static/resources/user.png"/><p class="uname">'+post_user+'</p><p class="ID">'+'#'+post_id+'</p><p class="ID stamp">'+stamp+'</p></div><p class="spaced">'+finalcontent+'</p>'
                }
                else{
                    header = '<div class="post" id="'+post_id+'"><div class="p_header"><img class="icon" src="http://192.168.50.213/static/resources/user.png"/><p class="uname">'+post_user+'</p><p class="ID">'+'#'+post_id+'</p><p class="ID stamp">'+stamp+'</p></div>'
                }
                //append our generated post to the container
                document.getElementById("container").insertAdjacentHTML('beforeend',header);

                //set our post content presets
                var postreportbtn = '<div onclick="report(\'' +post_id+ '\',\'' + 'post'+ '\')" class="reportbtn"><p class="report_txt">Report</p></div>'
                var postlaughbtn = '<div onclick="laugh(\'' +post_id+ '\',\'' + 'post'+ '\')" class="combtn laughbtn"><img class="joy" src="http://192.168.50.213/static/resources/joy.png"/></div>'
                var postnotfunnybtn = '<div onclick="notfunny(\'' +post_id+ '\',\'' + 'post'+ '\')" class="combtn laughbtn"><img class="joy" src="http://192.168.50.213/static/resources/joy.png"/></div>'
                var footer = '<div class="p_footer noselect"><p id="liketext" class="laughtxt">'+commatize(likes)+'  Laughs'+'</p>'+postlaughbtn+'<div class="combtn" id="comclick" onclick="refreshcomments('+post_id+')"><p class="viewcom">View '+num_comments+' Comments</p></div>'+postreportbtn+'</div></div>'
                
                //if our current post contains an attachment
                if (attachment_id != null){
                    //console.log(post_id)
                    try{
                        var attachmentExtension = attachment_table[attachment_id][2].split('.')[1]
                        path = 'http://192.168.50.213/static/attachments/'+attachment_table[attachment_id][2]
                        //console.log(path)
                    }
                    catch{
                        var attachmentExtension = 'png'
                        path = 'http://192.168.50.213/static/resources/error.png'
                    }

                    //if its an allowed video
                    if(videotypes.includes(attachmentExtension)){
                        //document.getElementById(post_id).innerHTML+='<div class="embed"><img class="attachment" src="'+'http://192.168.50.213/static/attachments/'+attachment_table[attachment_id][2]+'"/></div>'
                        document.getElementById(post_id).insertAdjacentHTML('beforeend','<div class="embed"><video preload="none" poster="http://192.168.50.213/static/attachments/previews/'+attachment_id +'.jpg" class="attachment" controls><source src="'+path+'"></video></div>');
                    }
                    //else if its an allowed photo
                    else if(phototypes.includes(attachmentExtension)){
                        //embed a photo with a src of our attachment to post
                        document.getElementById(post_id).insertAdjacentHTML('beforeend','<div class="embed"><img class="attachment" src="'+path+'"/></div>');
                    }
                    //throw an error to make my life easier
                    else{
                        console.error('bad attachment type recieved for post '+post_id+' with attachmentid '+attachment_id)
                    }
                    
                    //embed the defualt footer to the post
                    document.getElementById(post_id).insertAdjacentHTML('beforeend',footer);
                }
                //if post does not have image
                else{
                    //append the normal footer without the attachment to our container
                    document.getElementById(post_id).insertAdjacentHTML('beforeend',footer);
                }
            }
            else if(deleted_status == 1){ //if post is removed but not shadowbanned render it limited
                //define a limited post where the content is banned and append it to our main container
                //if our post has comments in it allow it to have the expand button
                if(num_comments != 0){
                    header = '<div class="post" id="'+post_id+'"><div class="p_header"><img class="icon" src="http://192.168.50.213/static/resources/user.png"/><p class="uname">'+post_user+'</p><p class="ID">'+'#'+post_id+'</p><p class="ID stamp">'+stamp+'</p></div><p class="" style="color:red;"><b>[Post Removed By Moderator]</b></p><div class="p_footer noselect"><p id="liketext" class="laughtxt">'+commatize(likes)+'  Laughs'+'</p><div class="combtn" id="comclick" onclick="refreshcomments('+post_id+')"><p class="viewcom">View '+num_comments+' Comments</p></div>';
                }
                else{
                    header = '<div class="post" id="'+post_id+'"><div class="p_header"><img class="icon" src="http://192.168.50.213/static/resources/user.png"/><p class="uname">'+post_user+'</p><p class="ID">'+'#'+post_id+'</p><p class="ID stamp">'+stamp+'</p></div><p class="" style="color:red;"><b>[Post Removed By Moderator]</b></p><div class="p_footer noselect"><p id="liketext" class="laughtxt">'+commatize(likes)+'  Laughs'+'</p></div></div>';
                }
                //append the post to the container
                document.getElementById("container").insertAdjacentHTML('beforeend',header);
            }
        }
        if(section == 'search'){
            document.getElementById("container").insertAdjacentHTML('beforeend','<div id="endcard" style="padding-bottom:90px;"><img id="end" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/end.png?raw=true"/></div>');
        }
    }

    //do some shit with the load icon
    loadicon();
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
    reqpost.insertAdjacentHTML('beforeend',document.createElement('div').innerHTML = '<div class="comments"></div>');

    //grab the top level container we just created
    reqbox = reqpost.querySelector('.comments');

    //if this post is deleted we should not allow the option to leave additional comments
    if (!document.getElementById(id).querySelector('#comclick').classList.contains('deleted_post')){
        //append a div allowing the user to reply with a comment to our selected post
        reqbox.insertAdjacentHTML('beforeend','<p class="leavea" >Leave a comment:</p><div style="display:flex; flex-wrap:nowrap;"><input autocomplete="off" maxlength="250" id="commentbox_'+id+'" class="commentbox" type="text"/><a class="postcom" onclick="leavecomment('+id+')">Comment</a></div>'); //TODO onclick
    }

    //generate our comment actions
    for(comment in data){
        //declare our static preset elements for comment actions
        var comreportbtn = '<p onclick="report(\'' +data[comment][0]+ '\',\'' + 'comment'+ '\')" class="reportbtncom">Report</p>'
        var comlaughbtn = '<div onclick="laugh(\'' +data[comment][0]+ '\',\'' + 'comment'+ '\')" class="comlaughbtn"><p>Laugh</p><img class="joy" src="http://192.168.50.213/static/resources/joy.png"/></div>'

        // if the deleted status of the comment is 0 (not banned at all)
        if(data[comment][6] == 0){
            finalcomtxt = String(data[comment][2]).replace(regex, function(m){return '<font color="0051BA"><b>'+m+'</b></font>';});
            // awful, disgusting string of a comment preset with its data filled in
            content = document.createElement('div').innerHTML='<div class="comment"><div class="comheader"><img class="compfp" src="http://192.168.50.213/static/resources/user.png"/><p class="commentid">#'+String(data[comment][0])+'</p><p class="comname">'+String(data[comment][5])+':</p></div><p class="comdate">'+String(data[comment][4])+'</p><p class="comtxt">'+finalcomtxt+'</p><div class="commentactionbound noselect"><p class="comliketxt" id="comment_'+String(data[comment][0]+'">'+String(data[comment][3])+' Laughs</p>'+comlaughbtn+comreportbtn+'</div></div>');
            
            //append our comment to the parent post container
            reqbox.insertAdjacentHTML('beforeend',content);
        }
        // else if the deleted status of the comment is 1 (directly banned)
        else if (data[comment][6] == 1){
            // awful, disgusting string of a visible banned comment preset with its data filled in
            content = document.createElement('div').innerHTML='<div class="comment"><div class="comheader"><img class="compfp" src="http://192.168.50.213/static/resources/user.png"/><p class="commentid">#'+String(data[comment][0])+'</p><p class="comname">'+String(data[comment][5])+':</p></div><p class="comdate">'+String(data[comment][4])+'</p><p class="comtxt" style="color: red;">[Removed By Moderator]</p><div class="commentactionbound noselect"><p class="comliketxt" id="comment_'+String(data[comment][0]+'">'+String(data[comment][3])+' Laughs</p>'+comlaughbtn+comreportbtn+'</div></div>');
            
            //append our comment to the parent post container
            reqbox.insertAdjacentHTML('beforeend',content);
        }
        else {
            // nothing should happen here because that means the post was likely shadowbanned and should not be rendered at all
        }
    }
    //document.getElementById(id).querySelector('comloadgif').remove();
}

//active soft reset of selected posts comments after user posts a comment themselves, also a waterfall initiator for new post expand comments
function refreshcomments(post){
    //will query for comments as single string, parse them and then append them programatically to the bottom of the post

    //grab our parent comment expand box
    handler = document.getElementById(post).querySelector('.viewcom');

    //if our box is not open
    if (!handler.classList.contains('opened')){
        //fetch a comment box from the document
        box = document.getElementById('commentbox_' + post); 
        //if that box exists
        if(box){
            //change the text back to closed text
            box.closest('.post').querySelector(".p_footer").querySelector('.viewcom').innerText = "View Comments";
            //remove the comment section div
            box.closest('.comments').remove();
        }

        //document.getElementById(post).innerHTML += '<img id="comloadgif" src="http://192.168.50.213/static/resources/load.gif"/>';
        
        //normal behavior
        querycomments(post); //intiate waterfall to get comments and render them
        document.getElementById(post).insertAdjacentHTML('beforeend',document.createElement('div').innerHTML = '<div id="loadcom" class="loadcom"><img src="http://192.168.50.213/static/resources/load.gif"/></div>');

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
            //handler.style.width = "175.297px";
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


var jumpbtn = false;
//function that tracks users scroll progress and will request more content be appended if the user is within a specific amount of the end of the timeline
window.onscroll = function (){
    if(!scrolledtobottom){
        var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
        percentScroll = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight);
        if(percentScroll >= .50){
            if(section != 'search'){
                loadMore();
            }
        }


        //scroll to top button
        if(percentScroll >= .2 && jumpbtn == false){
            jumpbtn = true;
            document.getElementById('page').innerHTML += '<div onclick="jumppage()" class="noselect fade-in-image" id="jumpscroll"><img class="jumpimg noselect fade-in-image" src="http://192.168.50.213/static/resources/jumptotop.png"/></div>';
        }
        if(percentScroll<= .2 && jumpbtn == true){
            jumpbtn = false;
            document.getElementById('jumpscroll').remove();
        }
    }
}

function jumppage(){
    jumpbtn = false;
    window.scrollTo(0,0);
    document.getElementById('jumpscroll').remove();
}

//declare bool to ensure we dont trigger this twice before loadcompletes 
var querying = false;
//declare bool that triggers when we reach the end of the content
var capped = false;
//get numloaded for certain sort types
var numloaded  = 0;

//contact the server and request a specified amount of new posts to append to our DOM
function loadMore(){
    //if we arent at the bottom of the tl get posts
    if(capped == false){
        //setup our headers
        var data = {
            'order':String(section), //get our current section so server knows which tab to select from
            'start':String(parseInt(document.getElementById('container').lastChild.previousSibling.id)), //index that we want to start at
            'numloaded': String(numloaded),
        }

        //if not already triggered
        if (querying == false){
            //change bool
            querying = true;

            if(data['start'] == '0'){
                capped = true;
                return;
            }

            basicxhr('fetchposts',data).then(function (response) {
                renderContent(response);
                querying = false;
            }).catch(function (err) {
                console.error('An error occured!', err.statusText);
            });
        }
    }
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
        document.getElementById(id).querySelector('#loadcom').remove();
        //pass our json return of comments assosciated with post id to be rendered
        commentReturn = JSON.parse(response)
        renderComments(id,commentReturn)
    })
    .catch(function (err) {
        console.error('An error occured!', err.statusText);
    });
}