function basicxhr(route,data){
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://76.181.32.163:5000/"+route);
        xhr.setRequestHeader("Accept","apllication/json");
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } 
            else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            //this is where its rejecting on mobile TODO HTTPS
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(JSON.stringify(data));
        });
}

//file xhr
function filexhr(file,data){
    var formData = new FormData();
    formData.append("file", file);
    formData.append('USER', data['USER']);
    formData.append('text', data['CONTENT']);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://76.181.32.163:5000/postimage', true);
    xhr.send(formData);
}