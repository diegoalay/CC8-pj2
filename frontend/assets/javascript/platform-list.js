var xhr = new XMLHttpRequest();
var myIp = 'localhost';

function createPlatform(platforms){
    platforms = JSON.parse(platforms);
    var objTo = document.getElementById('platform-list');
    for(key in platforms){
        console.log(platforms[key]);
        var name = platforms[key].name;
        var role = platforms[key].role;
        var div = document.createElement("div");
        div.setAttribute("id", name);
        div.addEventListener('click',function(){
            window.location = '/platform.html?url=' + platforms[key].url + '&name=' + platforms[key].name;
        });
        div.innerHTML = name;
        objTo.appendChild(div);
        objTo.appendChild(div);
    }
}

function poling(){
    // setInterval(() => {
        xhr.open('GET', 'http://' + myIp + '/platforms/list', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function (e) {
            if ((xhr.readyState === 4) && (xhr.status === 200)) {
                createPlatform(xhr.responseText);
            }
          };
          xhr.onerror = function (e) {
            console.error(xhr.statusText + e);
          };
          xhr.send(); 
    // }, 2000);
}


document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        poling();
    }  
};