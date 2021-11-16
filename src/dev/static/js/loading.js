//TODO this will become main file for all gui feedback of loading and query processes

//append loading icon while waiting for database return for main posts
function loadicon() {
    //if our easter egg is already in the DOM remove it so we can add it again
    if (document.contains(document.getElementById("end"))) {
        document.getElementById("end").remove();  
    }

    //append to the bottom of our container a fun little easter egg post telling the user they reached the end
    document.getElementById("container").innerHTML += '<div id="end"><img id="end" src="http://76.181.32.163:5000/static/resources/load.gif"/></div>'
}