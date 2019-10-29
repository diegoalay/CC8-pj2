var xhr = new XMLHttpRequest();
var myIp = 'localhost';
let myName = "greenhouse";
var action = ``;
var idRow = ``;
var currentRow = ``;

function appendEvent(event) {
    console.log(event);
    var tableRef = document.getElementById("tableEvents").getElementsByTagName('tbody')[0];
    var id = event._id;
    var idEvent = event.idEvent;
    var date = event.date;
    text = `<tr>`;
    text += `<td id="${id}-idEvent">`;
    text +=   `${idEvent}`;
    text += `</td>`;
    text += `<td id="${id}-date">`;
    text +=   `${date}`;
    text += `</td>`;
    text += `<td>`;
    text +=    `<button data-toggle="tooltip"  onClick="editEvent('Editar Evento',\'` + id + `\',this)"  title="Edit" class="pd-setting-ed"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>`;
    text    += `<button data-toggle="tooltip" onClick="deleteEvent(\'` + id + `\',this)" title="Trash" class="pd-setting-ed"><i class="fa fa-trash-o" aria-hidden="true"></i></button>`;
    text += `</td>`;
    text += `</tr>`;
    newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = text;
}

function newEvent(text, name, url, element) {
    action = `create`;
    eventModal.modal('toggle');
    document.getElementById(`titleEventModal`).textContent = text;
    document.getElementById(`modalName`).value = name;
    document.getElementById(`modalUrl`).value = url;
}

function sendRequest(){
    if(action == `create`) createEvent();
    else updateEvent();
}

function createEvent() {
    eventModal.modal("hide");
    var name = document.getElementById(`modalName`).value;
    var url = document.getElementById(`modalUrl`).value;
    var obj = {
        name: name,
        url: url,
    }
    xhr.open('POST', 'http://' + myIp + '/events/new', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            response  = xhr.responseText;
            response = response.replace(/['"]+/g, '')
            document.getElementById(`modalName`).value = ``;
            document.getElementById(`modalUrl`).value = ``;
            if(view == `event_list`){
                console.log(response);
                obj._id = response;
                appendEvent(obj);
            }
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj)); 
}

function updateEvent() {
    let name = document.getElementById(`modalName`).value;
    let url = document.getElementById(`modalUrl`).value
    var obj = {
        idEvent: idRow,
        name: name,
        url: url,
    }
    document.getElementById(`${idRow}-name`).innerHTML = name;
    document.getElementById(`${idRow}-url`).innerHTML = url;
    eventModal.modal('hide');
    xhr.open('POST', 'http://' + myIp + '/events/update', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {

        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj));     
}

function editEvent(text, id, element) {
    action = `update`;
    idRow = id;
    let name = document.getElementById(`${idRow}-name`).textContent;
    let url = document.getElementById(`${idRow}-url`).textContent;
    eventModal.modal('toggle');
    currentRow = element.parentElement.parentElement;
    document.getElementById(`titleEventModal`).textContent = text;
    document.getElementById(`modalName`).value = name;
    document.getElementById(`modalUrl`).value = url;   
}

function deleteEvent(id,element){
    currentRow = element.parentElement.parentElement;
    idRow = id;
    var index = $('table tr').index(currentRow);
    var obj = {
        idEvent: id,
    }
    xhr.open('POST', 'http://' + myIp + '/events/delete', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            document.getElementById("tableEvents").deleteRow(index);
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj));   
}

function poling() {
    xhr.open('POST', 'http://' + myIp + '/events/list', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            response = JSON.parse(xhr.responseText);
            for (key in response) {
                appendEvent(response[key]);
            }
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send();
}

function getTimeInFormat(){
  var date = new Date();
  return date.toISOString(); 
}

function convertDateInFormat(time){
    var date = new Date(time);
    return date.toISOString();
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
    obj[key] = {};
    //if
    if(ifIsDirty){
        // var leftChange = document.getElementById;
        leftKey = leftChange.getAttribute('type')
        // var rigthChange = document.getElementById;
        rigthKey = leftChange.getAttribute('type')
        obj[key].if = {
            left: {
                url: leftUrl,
                id: leftId,
                leftKey: leftChange.value,
            },
            condition: '=',
            rigth:{
                rigth: rigthChange.value,
            }
        };
    }

    //then
    if(thenIsDirty){
        // var thenChange = document.getElementById;
        thenKey = leftChange.getAttribute('type');
        obj[key].then = {
            url:"localhost:8080",
            id:"id01",
            status:false,
            freq:30000,
            text:"Prueba",        
        };
    
    }

    //else
    if(elseIsDirty){
        obj[key].else = {
            url:"localhost:8080",
            id:"id01",
            status:false,
            freq:30000,
            text:"Prueba"
        };
    }
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
    xhr.open('POST', 'http://' + eventIp + '/' + key, true);
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

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        platformModal = $('#eventModal');
        if(view == `event_list`) poling();
    }  
};