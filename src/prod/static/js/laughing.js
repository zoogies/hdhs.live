//what actual refactored code does to an mf:
var action_queue = {
}
var waiting = false;
var waiting_queue = []
//laugh at normal post
function laugh(id,type){
    //update our action queue
    if(id in action_queue){
        action_queue[id] += 1;
    }
    else{
        action_queue[id] = 1;
    }
    
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
        return;
    }
    

    if(!waiting_queue.includes(id)){
        waiting_queue.push(id);
        setTimeout(function(){
            //set our data
            var data = {
                "id": String(id),
                "type": String(type),
                "amount": String(action_queue[id]),
            };
            
            //send a xhr request using our async function we wrote and act based on the result
            basicxhr('laugh', data)
            .then(function (response) {
                delete action_queue[id];
                waiting_queue.pop(id);
                waiting=false;
            })
            .catch(function (err) {
                console.error('An error occured!', err.statusText);
            });
        },3000)
    }
}

//thinking out loud (i guess not out loud but on the computer)
// queue actions to happen 5 seconds after track amounts 