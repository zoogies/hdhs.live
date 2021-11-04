//navbar shit
function fresh(){
    try{
        document.getElementById('old').classList.remove('nav_sel');
        document.getElementById('old').classList.remove('nav_btn');
        document.getElementById('new').classList.remove('nav_sel');
        document.getElementById('new').classList.remove('nav_btn');
        document.getElementById('pop').classList.remove('nav_sel');
        document.getElementById('pop').classList.remove('nav_btn');
    }
    catch{
        alert('Something went wrong')
    }
}

function s_new(){
    try{
        //content
        flushcontainer();
        getContent("new");

        //nav
        fresh();
        document.getElementById('pop').classList.add('nav_btn');
        document.getElementById('new').classList.add('nav_sel');
        document.getElementById('old').classList.add('nav_btn');
    }
    catch{
        alert("Something went wrong :(");
    }
    
}
function s_old(){
    try{
        //content
        flushcontainer();
        getContent("old");

        //nav
        fresh();
        document.getElementById('new').classList.add('nav_btn');
        document.getElementById('old').classList.add('nav_sel');
        document.getElementById('pop').classList.add('nav_btn');
    }
    catch{
        alert("Something went wrong :(");
    }
}
function s_pop(){
    try{
        //content
        flushcontainer();
        getContent("pop");

        //nav
        fresh();
        document.getElementById('new').classList.add('nav_btn');
        document.getElementById('old').classList.add('nav_btn');
        document.getElementById('pop').classList.add('nav_sel');
    }
    catch{
        alert("Something went wrong :(");
    }
}