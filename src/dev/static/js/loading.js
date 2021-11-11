//TODO this will become main file for all gui feedback of loading and query processes

//append loading icon while waiting for database return for main posts
function loadinside(container) {
    inner = document.createElement('div').innerHTML = '<div id="loading"><img src="http://76.181.32.163:5000/static/resources/load.gif"></div>';
    container.innerHTML += inner;
}

//remove main container loading icon
function stopload() {
    document.getElementById('loading').remove();
}