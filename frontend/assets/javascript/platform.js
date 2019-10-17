var xhr = new XMLHttpRequest();
var platformIp = "";
var myIp = "localhost:80";
var myName = "greenhouse";

function getTimeInFormat(){
  var date = new Date();
  return date.toISOString(); 
}

function convertDateInFormat(time){
    var date = new Date(time);
    return date.toISOString();
}

function createForm(json){
    jsonObj = JSON.parse(json);
    var data = jsonObj.hardware;
    for (var key in data) {
        obj = data[key];
        console.log(obj);
        form = document.createElement("form");
        form.setAttribute('id',"form-"+key)
        document.getElementById("forms").appendChild(form);        
        var formdata = {
            schema: {
                id: {
                    type: 'string',
                    title: 'ID',
                    default: key,
                    readOnly: true,
                    required: true
                },
                description: {
                    type: 'string',
                    title: 'Description',
                    readOnly: true,
                    default: obj.tag,
                },
                freq: {
                    type: 'number',
                    title: 'Frequence',
                    step: 1000,
                    required: true,
                },
                text: {
                    type: 'string',
                    title: 'Text',
                    required: true,
                },                
                status: {
                    type: "string",
                    title: "Status",
                    required: false,
                    enum: [
                        true,
                        false,
                    ]
                },
            }, 
			onSubmit: function (errors, values) {
				if (errors) {
					alert(error);
				} else {
                    change(values);
				}
			}            
        }
        $("#form-" + key).jsonForm(formdata);
    }
}


function header(){
    obj = {
            "id": myName,
            "url": myIp,
            "date": getTimeInFormat(),        
        }
    return obj;
}

function generateCondition(key){
    var obj = {};
    //if
    obj[key] = {}
    obj[key].if = {
        left: {
            url: "192.168.1.14",
            id: "id001",
            freq: 6000
        },
        condition: '=',
        rigth:{
            sensor: 770,
            status: false,
            freq: 30000,
            text: "Prueba"
        }
    };

    //then
    obj[key].then = {
        url:"localhost:8080",
        id:"id01",
        status:false,
        freq:30000,
        text:"Prueba",        
    };

    //else
    obj[key].else = {
        url:"localhost:8080",
        id:"id01",
        status:false,
        freq:30000,
        text:"Prueba"
    };
    return obj;
}

function event(key){
    var obj = header();
    obj[key] = {};
    if(key == 'create'){
        obj[key] = (generateCondition(key))[key];
    }else if(key == 'update'){
        obj[key].id = idEvent;
        obj[key] = (generateCondition(key))[key];
    }else if(key == 'delete'){
        obj[key].id = idEvent;
    }
    xhr.open('POST', 'http://' + platformIp + '/' + key, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function (e) {
        var response = JSON.parse(xhr.responseText);
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            if(key == 'create') obj.idEvent = response.idEvent;
            xhr.open('POST', 'http://' + myIp + '/events/' + key, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function (e) {
                if ((xhr.readyState === 4) && (xhr.status === 200)) {
                    alert(key + ' event successfully');
                }
            };
            xhr.onerror = function (e) {
                console.error(xhr.statusText + e);
            };
            xhr.send(JSON.stringify(obj));             
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj)); 
}

function search(hardware,startDate,finishDate){
    //buscamos en cache primero
    var obj = header();
    obj.search = {};
    obj.search['id_hardware'] = hardware;
    obj.search['start_date'] = startDate;
    obj.search['finish_date'] = finishDate;  
    xhr.open('POST', 'http://' + myIp + '/search', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function (e) {
        var frontResp = JSON.parse(xhr.responseText);
        console.log(frontResp);
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            var length = Object.keys(frontResp.data).length;
            alert(length);
            if(length > 0){
                if(new Date(frontResp.start) > new Date(startDate) && new Date(frontResp.finish) >= new Date(finishDate)){
                    pending  = new Date(new Date(frontResp.start).getTime());
                    finishDate = pending.toISOString();
                    alert('pedir el resto izquierda: ' + startDate + ' - ' + finishDate);
                }else if(new Date(frontResp.start) >= new Date(startDate) && new Date(frontResp.finish) < new Date(finishDate)){
                    pending  = new Date(new Date(frontResp.finish).getTime() +  (new Date(finishDate).getTime() - new Date(frontResp.finish).getTime()));
                    startDate = finishDate;
                    finishDate = pending.toISOString();
                    alert('pedir el resto derecha: ' + new Date(frontResp.finish) + '-' + pending);
                }else if(new Date(frontResp.start) <= new Date(startDate) && new Date(frontResp.finish) >= new Date(finishDate)){
                    alert('todo en cache');
                }else{
                    alert('pedir todo');
                }
            }
            if(false){
                xhr.open('POST', 'http://' + platformIp + '/search', true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onload = function (e) {
                    var platformResp = JSON.parse(xhr.responseText);
                    console.log(platformResp);
                    if ((xhr.readyState === 4) && (xhr.status === 200)) {
                        console.log(platformResp);
                        xhr.open('POST', 'http://' + myIp + '/device', true);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.onload = function (e) {
                            if ((xhr.readyState === 4) && (xhr.status === 200)) {
                                console.log(true);   
                            }
                        };
                        xhr.onerror = function (e) {
                            console.error(xhr.statusText + e);
                        };
                        xhr.send(JSON.stringify(platformResp));                         
                    }
                };
                xhr.onerror = function (e) {
                    console.error(xhr.statusText + e);
                };
                xhr.send(JSON.stringify(obj)); 
            }            
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj)); 
}

function change(hardware){
    console.log(hardware);
    var obj = header();
    obj.change = {};
    obj.change[hardware.id] = {
        status: hardware.status,
        freq: hardware.freq,
        text: hardware.text,
    }
    xhr.open('POST', 'http://' + platformIp + '/change', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function (e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            console.log(xhr.responseText);
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj)); 
}

function poling(){
    // setInterval(() => {
        var obj = header();
        xhr.open('POST', 'http://' + platformIp + '/info', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function (e) {
            if ((xhr.readyState === 4) && (xhr.status === 200)) {
                console.log(xhr.responseText);
                createForm(xhr.responseText);
            }
          };
          xhr.onerror = function (e) {
            console.error(xhr.statusText + e);
          };
          xhr.send(JSON.stringify(obj)); 
    // }, 2000);
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        var url = new URL(window.location.href);
        platformName = url.searchParams.get("name");
        platformIp = url.searchParams.get("url");
        poling();
        // search("id01","2019-09-17T14:33:37-0600","2019-09-19T00:06:22-0600" );
        // search("id01","2019-09-12T14:33:37-0600","2019-09-19T00:06:22-0600" );
        // search("id01","2019-09-17T14:33:37-0600","2019-09-22T00:06:22-0600" );
        // search("id01","2019-09-17T14:33:38-0600","2019-09-18T00:06:22-0600" );
        // event('create');
    }  
};