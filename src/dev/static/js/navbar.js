//declare globals
var section = 'new'; //its new because thats the default section

//navbar shit
function fresh(){
    try{
        document.getElementById('old').classList.remove('nav_sel');
        document.getElementById('old').classList.remove('nav_btn');
        document.getElementById('new').classList.remove('nav_sel');
        document.getElementById('new').classList.remove('nav_btn');
        document.getElementById('pop').classList.remove('nav_sel');
        document.getElementById('pop').classList.remove('nav_btn');
        
        //reset our numloaded
        numloaded = 0;
    }
    catch{
        alert('Something went wrong')
    }
}

function s_new(){
    try{
        //content
        flushcontainer();
        getContent("new",'fresh');

        //nav
        fresh();
        document.getElementById('pop').classList.add('nav_btn');
        document.getElementById('new').classList.add('nav_sel');
        document.getElementById('old').classList.add('nav_btn');

        //update global
        section = 'new';
    }
    catch{
        alert("Something went wrong :(");
    }
    
}
function s_old(){
    try{
        //content
        flushcontainer();
        getContent("old",'fresh');

        //nav
        fresh();
        document.getElementById('new').classList.add('nav_btn');
        document.getElementById('old').classList.add('nav_sel');
        document.getElementById('pop').classList.add('nav_btn');

        //update global
        section = 'old';
    }
    catch{
        alert("Something went wrong :(");
    }
}
function s_pop(){
    try{
        //content
        flushcontainer();
        getContent("pop",'fresh');

        //nav
        fresh();
        document.getElementById('new').classList.add('nav_btn');
        document.getElementById('old').classList.add('nav_btn');
        document.getElementById('pop').classList.add('nav_sel');

        //update global
        section = 'pop';
    }
    catch{
        alert("Something went wrong :(");
    }
}