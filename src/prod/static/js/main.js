//what actual refactored code does to an mf:

function init(){
    //detect main container and load it into a variable
    var container = !!document.getElementById("container");

    //if we are on a page route with a container in it
    if (container) {
        //query to recieve new posts on load
        getContent("new","fresh");

        //intialize our character input tracking function to run in a loop every 100ms
        var chartrack=setInterval(trackchar,100);
        //var scrolltrack=setInterval(trackscroll,1000);
    }
}