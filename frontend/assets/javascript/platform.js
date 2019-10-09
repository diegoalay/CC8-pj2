var xhr = new XMLHttpRequest();
var platformIp = "";
var myIp = "localhost:80";
var myName = "greenhouse";

function getTimeInFormat(){
  var date = new Date();
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
        event('create');
    }  
};