var xhr = new XMLHttpRequest();
var platformIp = "localhost:8000";
var myIp = "localhost:8000";
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
        console.log(formdata);
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

function change(hardware){
    // setInterval(() => {
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
    // // }, 2000);
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
        poling();
    }  
};