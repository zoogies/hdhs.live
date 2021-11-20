//TODO this will become main file for all gui feedback of loading and query processes

//append loading icon while waiting for database return for main posts
function loadicon() {
    //if our easter egg is already in the DOM remove it so we can add it again
    if (document.contains(document.getElementById("loading"))) {
        document.getElementById("loading").remove();  
    }
    else if (document.contains(document.getElementById("endcard"))) {
        document.getElementById("endcard").remove();  
    }
    if(!scrolledtobottom){
        //append to the bottom of our container a fun little easter egg post telling the user they reached the end
        document.getElementById("container").innerHTML += '<div id="loading"><img id="end" src="http://hdhs.live/static/resources/load.gif"/></div>'
    }
    else{
        document.getElementById("container").innerHTML += '<div id="endcard" style="padding-bottom:90px;"><img id="end" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/end.png?raw=true"/></div>';
    }
}