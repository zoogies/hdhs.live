function admin_init(){psk=window.prompt("hey buddy. im gonna need to see some identification for you to proceed:");var e=new XMLHttpRequest;e.open("POST","http://hdhs.live/auth"),e.setRequestHeader("Accept","application/json"),e.setRequestHeader("Content-Type","application/json"),e.onreadystatechange=function(){e.readyState==XMLHttpRequest.DONE&&("true"==e.responseText?(admincontent=document.getElementById("admincontent"),admin_querydb("numreps")):window.location.replace("https://www.youtube.com/watch?v=vOtqPictUUQ&list=PLRfJd4ggmHhS_pBNUwayGWLVMZLUppgtH&index=21"))};var t={psk:String(psk)};e.send(JSON.stringify(t))}function admin_querydb(e){fetch("http://hdhs.live/fetch"+e).then(e=>e.json()).then(t=>{if(console.log(t),t)if(document.getElementById("maintable")&&document.getElementById("maintable").remove(),"new"==e||"old"==e||"pop"==e)for(admincontent.insertAdjacentHTML("beforeend",'<table border="1" id="maintable" style="width:700px;"><tr><th>id</th><th>user</th><th>content</th><th>comments</th><th>likes</th><th>stamp</th><th>deleted</th><th>delete</th><th>set_no_render</th></tr></table>'),i=0;i<t.length;i++)document.getElementById("maintable").insertAdjacentHTML("beforeend",'<tr id="'+t[i][0]+'"><th>'+t[i][0]+"</th><th>"+t[i][1]+"</th><th>"+t[i][2]+"</th><th>"+t[i][3]+"</th><th>"+t[i][4]+"</th><th>"+t[i][5]+"</th><th>"+t[i][6]+'</th><th><button type="button" onclick="moderate(\''+t[i][0]+"','post_no_rep','delete_norep')\">Delete</button></th><th><button type=\"button\" onclick=\"moderate('"+t[i][0]+"','post_no_rep','no_render_norep')\">set_no_render</button></th></tr>");else if("reports"==e)for(admincontent.insertAdjacentHTML("beforeend",'<table border="1" id="maintable" style="width:700px;"><tr><th>id</th><th>reason</th><th>content</th><th>type</th><th>content_id</th><th>delete</th><th>dismiss</th><th>set_no_render</th></tr></table>'),i=0;i<t.length;i++)document.getElementById("maintable").insertAdjacentHTML("beforeend",'<tr id="'+t[i][0]+'"><th>'+t[i][0]+"</th><th>"+t[i][1]+"</th><th>"+t[i][2]+"</th><th>"+t[i][3]+"</th><th>"+t[i][4]+'</th></th><th><button type="button" onclick="moderate(\''+t[i][0]+"','"+t[i][3]+"','delete')\">Delete</button></th><th><button type=\"button\" onclick=\"moderate('"+t[i][0]+"','"+t[i][3]+"','dismiss')\">Dismiss</button></th><th><button type=\"button\" onclick=\"moderate('"+t[i][0]+"','"+t[i][3]+"','no_render')\">set_no_render</button></th></tr>");else if("allcomments"==e)for(admincontent.innerHTML+='<table border="1" id="maintable" style="width:700px;"><tr><th>id</th><th>post</th><th>content</th><th>likes</th><th>stamp</th><th>user</th><th>deleted</th><th>delete</th><th>set_no_render</th></tr></table>',i=0;i<t.length;i++)document.getElementById("maintable").insertAdjacentHTML("beforeend",'<tr id="'+t[i][0]+'"><th>'+t[i][0]+"</th><th>"+t[i][1]+"</th><th>"+t[i][2]+"</th><th>"+t[i][3]+"</th><th>"+t[i][4]+"</th><th>"+t[i][5]+"</th></th><th>"+t[i][6]+'</th><th><button type="button" onclick="moderate(\''+t[i][0]+"','comment_no_rep','delete_norep')\">Delete</button></th><th><button type=\"button\" onclick=\"moderate('"+t[i][0]+"','comment_no_rep','no_render_norep')\">set_no_render</button></th></tr>");else"numreps"==e&&(document.getElementById("reportcnt").innerHTML='<h1 style="color:red;"><b>'+t+" Pending Reports Need Action</b></ht>")})}function moderate(e,t,n){console.log(e,t,n);var o=new XMLHttpRequest;o.open("POST","http://hdhs.live/moderate"),o.setRequestHeader("Accept","application/json"),o.setRequestHeader("Content-Type","application/json"),o.onreadystatechange=function(){o.readyState==XMLHttpRequest.DONE&&(document.getElementById(e).remove(),admin_querydb("numreps"))};var s={id:String(e),type:String(t),action:String(n)};o.send(JSON.stringify(s))}function getContent(e,t){var n={order:String(e),start:String(t),numloaded:String(numloaded)};basicxhr("getattachment",n).then(function(e){attachment_table=JSON.parse(e),basicxhr("fetchposts",n).then(function(e){renderContent(e)}).catch(function(e){console.error("An error occured!",e)})})}function renderContent(e){if(content=JSON.parse(e),numloaded+=content.length,"search 0 results"==content)nothing="<div><h1>Nothing Found</h1></div>",document.getElementById("container").insertAdjacentHTML("beforeend",nothing);else{for(p in content){var t=content[p];if("end"==t[0])return scrolledtobottom=!0,void loadicon();if(post_id=t[0],post_user=t[1],post_content=t[2],comments=t[3],likes=t[4],stamp=t[5],deleted_status=t[6],attachment_id=t[7],num_comments=t[8],0==deleted_status){""!=post_content?(finalcontent=post_content.replace(regex,function(e){return'<font color="0051BA"><b>'+e+"</b></font>"}),header='<div class="post" id="'+post_id+'"><div class="p_header"><img class="icon" src="http://hdhs.live/static/resources/user.png"/><p class="uname">'+post_user+'</p><p class="ID">#'+post_id+'</p><p class="ID stamp">'+stamp+'</p></div><p class="spaced">'+finalcontent+"</p>"):header='<div class="post" id="'+post_id+'"><div class="p_header"><img class="icon" src="http://hdhs.live/static/resources/user.png"/><p class="uname">'+post_user+'</p><p class="ID">#'+post_id+'</p><p class="ID stamp">'+stamp+"</p></div>",document.getElementById("container").insertAdjacentHTML("beforeend",header);var n="<div onclick=\"report('"+post_id+'\',\'post\')" class="reportbtn"><p class="report_txt">Report</p></div>',o="<div onclick=\"laugh('"+post_id+'\',\'post\')" class="combtn laughbtn"><p>Laugh</p><img class="joy" src="http://hdhs.live/static/resources/joy.png"/></div>',s='<div class="p_footer noselect"><p id="liketext" class="laughtxt">'+likes+"  Laughs</p>"+o+'<div class="combtn" id="comclick" onclick="refreshcomments('+post_id+')"><p class="viewcom">View '+num_comments+" Comments</p></div>"+n+"</div></div>";if(null!=attachment_id){try{var c=attachment_table[attachment_id][2].split(".")[1];path="http://hdhs.live/static/attachments/"+attachment_table[attachment_id][2]}catch{c="png";path="http://hdhs.live/static/resources/error.png"}videotypes.includes(c)?document.getElementById(post_id).insertAdjacentHTML("beforeend",'<div class="embed"><video preload="none" poster="http://hdhs.live/static/attachments/previews/'+attachment_id+'.jpg" class="attachment" controls><source src="'+path+'"></video></div>'):phototypes.includes(c)?document.getElementById(post_id).insertAdjacentHTML("beforeend",'<div class="embed"><img class="attachment" src="'+path+'"/></div>'):console.error("bad attachment type recieved for post "+post_id+" with attachmentid "+attachment_id),document.getElementById(post_id).insertAdjacentHTML("beforeend",s)}else document.getElementById(post_id).insertAdjacentHTML("beforeend",s)}else 1==deleted_status&&(0!=num_comments?header='<div class="post" id="'+post_id+'"><div class="p_header"><img class="icon" src="http://hdhs.live/static/resources/user.png"/><p class="uname">'+post_user+'</p><p class="ID">#'+post_id+'</p><p class="ID stamp">'+stamp+'</p></div><p class="" style="color:red;"><b>[Post Removed By Moderator]</b></p><div class="p_footer noselect"><p id="liketext" class="laughtxt">'+likes+'  Laughs</p><div class="combtn" id="comclick" onclick="refreshcomments('+post_id+')"><p class="viewcom">View '+num_comments+" Comments</p></div>":header='<div class="post" id="'+post_id+'"><div class="p_header"><img class="icon" src="http://hdhs.live/static/resources/user.png"/><p class="uname">'+post_user+'</p><p class="ID">#'+post_id+'</p><p class="ID stamp">'+stamp+'</p></div><p class="" style="color:red;"><b>[Post Removed By Moderator]</b></p><div class="p_footer noselect"><p id="liketext" class="laughtxt">'+likes+"  Laughs</p></div></div>",document.getElementById("container").insertAdjacentHTML("beforeend",header))}"search"==section&&document.getElementById("container").insertAdjacentHTML("beforeend",'<div id="endcard" style="padding-bottom:90px;"><img id="end" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/end.png?raw=true"/></div>')}loadicon()}function flushcontainer(){for(;"save"!==container.lastChild.id;)container.removeChild(container.lastChild)}function renderComments(e,t){for(comment in reqpost=document.getElementById(e),reqpost.insertAdjacentHTML("beforeend",document.createElement("div").innerHTML='<div class="comments"></div>'),reqbox=reqpost.querySelector(".comments"),document.getElementById(e).querySelector("#comclick").classList.contains("deleted_post")||reqbox.insertAdjacentHTML("beforeend",'<p class="leavea" >Leave a comment:</p><div style="display:flex; flex-wrap:nowrap;"><input autocomplete="off" maxlength="250" id="commentbox_'+e+'" class="commentbox" type="text"/><a class="postcom" onclick="leavecomment('+e+')">Comment</a></div>'),t){var n="<p onclick=\"report('"+t[comment][0]+"','comment')\" class=\"reportbtncom\">Report</p>",o="<div onclick=\"laugh('"+t[comment][0]+'\',\'comment\')" class="comlaughbtn"><p>Laugh</p><img class="joy" src="http://hdhs.live/static/resources/joy.png"/></div>';0==t[comment][6]?(finalcomtxt=String(t[comment][2]).replace(regex,function(e){return'<font color="0051BA"><b>'+e+"</b></font>"}),content=document.createElement("div").innerHTML='<div class="comment"><div class="comheader"><img class="compfp" src="http://hdhs.live/static/resources/user.png"/><p class="commentid">#'+String(t[comment][0])+'</p><p class="comname">'+String(t[comment][5])+':</p></div><p class="comdate">'+String(t[comment][4])+'</p><p class="comtxt">'+finalcomtxt+'</p><div class="commentactionbound noselect"><p class="comliketxt" id="comment_'+String(t[comment][0]+'">'+String(t[comment][3])+" Laughs</p>"+o+n+"</div></div>"),reqbox.insertAdjacentHTML("beforeend",content)):1==t[comment][6]&&(content=document.createElement("div").innerHTML='<div class="comment"><div class="comheader"><img class="compfp" src="http://hdhs.live/static/resources/user.png"/><p class="commentid">#'+String(t[comment][0])+'</p><p class="comname">'+String(t[comment][5])+':</p></div><p class="comdate">'+String(t[comment][4])+'</p><p class="comtxt" style="color: red;">[Removed By Moderator]</p><div class="commentactionbound noselect"><p class="comliketxt" id="comment_'+String(t[comment][0]+'">'+String(t[comment][3])+" Laughs</p>"+o+n+"</div></div>"),reqbox.insertAdjacentHTML("beforeend",content))}}function refreshcomments(e){if(handler=document.getElementById(e).querySelector(".viewcom"),handler.classList.contains("opened")){var t={id:String(e)};basicxhr("numcomments",t).then(function(t){handler.classList.remove("opened"),e=document.getElementById(e),children=e.childNodes;Array.prototype.slice.call(children);[].forEach.call(children,function(e){e.classList.contains("comments")&&e.remove()}),handler.innerText="View "+t+" Comments"}).catch(function(e){console.error("An error occured!",e.statusText)})}else box=document.getElementById("commentbox_"+e),box&&(box.closest(".post").querySelector(".p_footer").querySelector(".viewcom").innerText="View Comments",box.closest(".comments").remove()),querycomments(e),handler.innerText="Click To Hide Comments",handler.classList.add("opened")}function trackchar(){var e=document.getElementById("charlim");e.innerText=document.getElementById("field").value.length+"/250 characters"}function loadMore(){if(0==capped){var e={order:String(section),start:String(parseInt(document.getElementById("container").lastChild.previousSibling.id)),numloaded:String(numloaded)};if(0==querying){if(querying=!0,"0"==e.start)return void(capped=!0);basicxhr("fetchposts",e).then(function(e){renderContent(e),querying=!1}).catch(function(e){console.error("An error occured!",e.statusText)})}}}function querycomments(e){var t={id:String(e)};basicxhr("commentsnew",t).then(function(t){commentReturn=JSON.parse(t),renderComments(e,commentReturn)}).catch(function(e){console.error("An error occured!",e.statusText)})}function laugh(e,t){if(e in action_queue?action_queue[e]+=1:action_queue[e]=1,"post"==t){var n=parseInt(document.getElementById(e).querySelector("#liketext").innerText.split(" ")[0])+1;document.getElementById(e).querySelector("#liketext").innerText=n+" Laughs"}else{if("comment"!=t)throw"Laugh content type is invalid";n=parseInt(document.getElementById("comment_"+e).innerText.split(" ")[0])+1;document.getElementById("comment_"+e).innerText=n+" Laughs"}waiting_queue.includes(e)||(waiting_queue.push(e),setTimeout(function(){var n={id:String(e),type:String(t),amount:String(action_queue[e])};basicxhr("laugh",n).then(function(t){delete action_queue[e],waiting_queue.pop(e),waiting=!1}).catch(function(e){console.error("An error occured!",e.statusText)})},3e3))}function loadicon(){document.contains(document.getElementById("loading"))?document.getElementById("loading").remove():document.contains(document.getElementById("endcard"))&&document.getElementById("endcard").remove(),scrolledtobottom?document.getElementById("container").insertAdjacentHTML("beforeend",'<div id="endcard" style="padding-bottom:90px;"><img id="end" src="https://github.com/Yoyolick/hdhs.live/blob/main/src/dev/static/resources/end.png?raw=true"/></div>'):"search"!=section&&document.getElementById("container").insertAdjacentHTML("beforeend",'<div id="loading"><img id="end" src="http://hdhs.live/static/resources/load.gif"/></div>')}function init(){var e=!!document.getElementById("container");if(e){getContent("new","fresh");setInterval(trackchar,100)}}function fresh(){try{document.getElementById("container").insertAdjacentHTML("beforeend",'<div id="loading"><img id="end" src="http://hdhs.live/static/resources/load.gif"/></div>'),document.getElementById("old").classList.remove("nav_sel"),document.getElementById("old").classList.remove("nav_btn"),document.getElementById("new").classList.remove("nav_sel"),document.getElementById("new").classList.remove("nav_btn"),document.getElementById("pop").classList.remove("nav_sel"),document.getElementById("pop").classList.remove("nav_btn"),document.getElementById("Searchbtn").classList.remove("search_sel"),document.getElementById("Searchbtn").classList.remove("Searchbtn"),numloaded=0,scrolledtobottom=!1}catch{alert("Something went wrong")}}function s_search(){try{loadicon(),flushcontainer(),getContent("search",document.getElementById("searchbar").value.replace("#","")),fresh(),document.getElementById("pop").classList.add("nav_btn"),document.getElementById("new").classList.add("nav_btn"),document.getElementById("old").classList.add("nav_btn"),document.getElementById("Searchbtn").classList.add("search_sel"),section="search"}catch{alert("Something went wrong :(")}}function s_new(){try{loadicon(),flushcontainer(),getContent("new","fresh"),fresh(),document.getElementById("pop").classList.add("nav_btn"),document.getElementById("new").classList.add("nav_sel"),document.getElementById("old").classList.add("nav_btn"),document.getElementById("Searchbtn").classList.add("Searchbtn"),section="new"}catch{alert("Something went wrong :(")}}function s_old(){try{loadicon(),flushcontainer(),getContent("old","fresh"),fresh(),document.getElementById("new").classList.add("nav_btn"),document.getElementById("old").classList.add("nav_sel"),document.getElementById("pop").classList.add("nav_btn"),document.getElementById("Searchbtn").classList.add("Searchbtn"),section="old"}catch{alert("Something went wrong :(")}}function s_pop(){try{loadicon(),flushcontainer(),getContent("pop","fresh"),fresh(),document.getElementById("new").classList.add("nav_btn"),document.getElementById("old").classList.add("nav_btn"),document.getElementById("pop").classList.add("nav_sel"),document.getElementById("Searchbtn").classList.add("Searchbtn"),section="pop"}catch{alert("Something went wrong :(")}}function postingpopup(){var e=document.getElementById("popup");e.classList.remove("hide"),document.getElementById("toplevel").style.overflow="hidden"}function posst(){if(!currentlyPosting){currentlyPosting=!0;var e=document.getElementById("field").value;file=document.getElementById("selector").files[0];var t=document.getElementById("name").value;if(""==t&&(t="Anonymous"),e.length<=250&&e.length>0||null!=file)if(file){if(type=file.type.split("/")[1],!["png","jpg","gif","jpeg","mp4","quicktime","mov"].includes(type))return alert('Invalid Image Format! You can only submit png jpg or gifs, not "'+String(type)+'"!'),void(currentlyPosting=!1);if(file.size>1e7)return alert('Your image is way too big! Please keep the size under 10mb. Google "image compressor" to make it smaller.'),void(currentlyPosting=!1);postingpopup();var n={USER:String(t),CONTENT:String(e),attachment:String(file.name).replace(/[.](?=.*[.])/g,"")};filexhr(file,n).then(function(e){location.reload()})}else{postingpopup();n={USER:String(t),CONTENT:String(e),attachment:"none"};basicxhr("post",n).then(function(e){location.reload()}).catch(function(e){console.error("An error occured!",e.statusText),alert("An error has occured. (Err xhr_notext)"),location.reload()})}else alert("Your post needs to be more than 0 and less than 250 characters or contain an image");currentlyPosting=!1}}function leavecomment(e){var t=document.getElementById("commentbox_"+e).value;if(t.length<=250&&t.length>0){var n={POST:String(e),CONTENT:String(t),USER:"Anonymous"};basicxhr("comment",n).then(function(t){setTimeout(()=>{refreshcomments(e)},1),setTimeout(()=>{refreshcomments(e)},250)}).catch(function(e){console.error("An error occured!",e.statusText)})}else alert("Your comment needs to be more than 0 and less than 250 characters")}function report(e,t){var n=window.prompt("Please enter a reason for reporting this content:");if(null!=n)var o={id:String(e),reason:String(n),type:String(t)};basicxhr("report",o).then(function(e){"ok"==JSON.parse(e)?alert("Your report has been recieved and will be reviewed by a moderator."):alert("An issue has occurred and your report has not been recieved.")}).catch(function(e){console.error("An error occured!",e.statusText)})}function basicxhr(e,t){return new Promise(function(n,o){var s=new XMLHttpRequest;s.open("POST","http://hdhs.live/"+e),s.setRequestHeader("Accept","apllication/json"),s.setRequestHeader("Content-Type","application/json"),s.onload=function(){this.status>=200&&this.status<300?n(s.response):o({status:this.status,statusText:s.statusText})},s.onerror=function(){o({status:this.status,statusText:s.statusText})},s.send(JSON.stringify(t))})}function filexhr(e,t){return new Promise(function(n,o){var s=new FormData;s.append("file",e),s.append("USER",t.USER),s.append("text",t.CONTENT);var c=new XMLHttpRequest;c.open("POST","http://hdhs.live/postimage",!0),c.onload=function(){this.status>=200&&this.status<300?n(c.response):o({status:this.status,statusText:c.statusText})},c.onerror=function(){o({status:this.status,statusText:c.statusText})},c.send(s)})}var attachment_table,scrolledtobottom=!1;const regex=/\B(\#[0-9]+\b)(?!;)/gm;var videotypes=["mp4","mov","quicktime"],phototypes=["png","jpg","gif","jpeg"];window.onscroll=function(){if(!scrolledtobottom){var e=document.documentElement,t=document.body,n="scrollTop",o="scrollHeight";percentScroll=(e[n]||t[n])/((e[o]||t[o])-e.clientHeight),percentScroll>=.5&&"search"!=section&&loadMore()}};var querying=!1,capped=!1,numloaded=0,action_queue={},waiting=!1,waiting_queue=[],section="new",currentlyPosting=!1;