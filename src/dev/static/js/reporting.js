//what actual refactored code does to an mf:

//report a post
function report(id,type) {
    //ask user for reason for their report and generate our request data to go along with it if they provide one
    var response = window.prompt('Please enter a reason for reporting this content:');
    if (response != null) {
        var data = {
            "id": String(id),
            "reason": String(response),
            "type": String(type)
        };
    }

    //send a xhr request using our async function we wrote and act based on the result
    basicxhr('report', data)
    .then(function (response) {
        if (JSON.parse(response) == "ok"){
            alert('Your report has been recieved and will be reviewed by a moderator.')
        }
        else {
            alert('An issue has occurred and your report has not been recieved.')
        }
    })
    .catch(function (err) {
        console.error('An error occured!', err.statusText);
    });
}