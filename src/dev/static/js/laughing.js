//what actual refactored code does to an mf:

//laugh at normal post
function laugh(id,type){
    //update the display count only
    if (type == 'post'){
        //get new laugh num
        var num = parseInt(document.getElementById(id).querySelector('#liketext').innerText.split(' ')[0]) + 1;
        document.getElementById(id).querySelector('#liketext').innerText = num + ' Laughs';
    }
    else if (type == 'comment') {
        //get new laugh num
        var num = parseInt(document.getElementById('comment_'+id).innerText.split(' ')[0]) + 1;
        document.getElementById('comment_' + id).innerText = num + ' Laughs';
    }
    else {
        throw 'Laugh content type is invalid'
    }
    
    //set our data
    var data = {
        "id": String(id),
        "type": String(type)
    };
    
    //send a xhr request using our async function we wrote and act based on the result
    basicxhr('laugh', data)
    .then(function (response) {
        //blank lmao
    })
    .catch(function (err) {
        console.error('An error occured!', err.statusText);
    });
}