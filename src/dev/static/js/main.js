//what actual refactored code does to an mf:

function init(){
    //detect main container and load it into a variable
    var container = !!document.getElementById("container");

    //if we are on a page route with a container in it
    if (container) {
        //query to recieve new posts on load
        getContent("new");

        //get our loading symbol appended by loading waterfall and remove it
        var ld = document.getElementById("loading");
        ld.remove();

        //intialize our character input tracking function to run in a loop every 100ms
        var chartrack=setInterval(trackchar,100);
    }
}