//TODO this will become main file for all gui feedback of loading and query processes

//append loading icon while waiting for database return for main posts
function loadinside(container) {
    inner = document.createElement('div').innerHTML = '<div id="loading"><img src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/load.gif?raw=true"></div>';
    container.innerHTML += inner;
}

//remove main container loading icon
function stopload() {
    document.getElementById('loading').remove();
}