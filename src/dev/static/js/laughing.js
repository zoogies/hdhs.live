//what actual refactored code does to an mf:

//laugh at normal post
function laugh(id,type){
    //set our data
    var data = {
        "id": String(id),
        "type": String(type)
    };

    //send a xhr request using our async function we wrote and act based on the result
    basicxhr('laugh', data)
    .then(function (response) {
        if (type == 'post'){
            document.getElementById(id).querySelector('#liketext').innerText = response + ' Laughs';
        }
        else if (type == 'comment') {
            document.getElementById('comment_' + id).innerText = response + ' Laughs';
        }
        else {
            throw 'Laugh content type is invalid'
        }
    })
    .catch(function (err) {
        console.error('An error occured!', err.statusText);
    });
}