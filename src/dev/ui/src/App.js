import logo from './logo.svg';
import './App.css';

function basicxhr(route,data){
  return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://127.0.0.1:5000/"+route);
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

function App() {
  var data = {
    "order": "new",
    "start": "fresh",
    "numloaded": String(0),
  }
  basicxhr('fetchposts',data).then(function (response) {
    console.log(JSON.parse(response))
    JSON.parse(response).map(function(post){
      return(
        <p>{post[2]}</p>
      )
    })
  })
  
  return (
    <div className="App">
      <div id="subcontainer">
        <p>balls</p>
      </div>
    </div>
  );
  
}

export default App;
