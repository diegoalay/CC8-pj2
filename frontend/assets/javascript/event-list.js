xhr = new XMLHttpRequest();
myIp = 'localhost';
myName = "greenhouse";
action = ``;
idRow = ``;
currentRow = ``;
eventModal = ``;
let ifIsDirty = ``;
let thenIsDirty = ``;
let elseIsDirty = ``;
let eventData = [];
let infoData = [];

function appendEvents(event,key) {
    var date = event.date;
    var idEvent;
    var id;
    var url;
    if(key == `create` || key == `update`) {
        idEvent = event.idEvent;
        id = event._id;
        url = event[key].if.left.url;
    }else{
        id = event._id;
        idEvent = event.id;
    }
    var tableRef = document.getElementById("tableEvents").getElementsByTagName('tbody')[0];
    eventData[id] = event;
    text = `<tr>`;
    text += `<td id="${id}-idEvent">`;
    text += `${idEvent}`;
    text += `</td>`;
    text += `<td id="${id}-url">`;
    text +=   `${url}`;
    text += `</td>`;    
    text += `<td id="${id}-date">`;
    text += `${date}`;
    text += `</td>`;
    text += `<td>`;
    text +=    `<button data-toggle="tooltip"  onClick="editEvent('Editar Evento: ${id}',\'` + id + `\',this)"  title="Edit" class="pd-setting-ed"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>`;
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
}

function sendRequest(){
    if(action == `create`) sendEvent('create');
    else sendEvent('update');
}

function editEvent(text, id, element) {
    action = `update`;
    idRow = id;
    eventModal.modal('toggle');
    currentRow = element.parentElement.parentElement;
    document.getElementById(`titleEventModal`).textContent = text;  
    event = eventData[id];
}

function deleteEvent(id,element){
    event = eventData[id];
    url = event.if.left.url;
    currentRow = element.parentElement.parentElement;
    var index = $('table tr').index(currentRow);
    var obj = header(); 
    obj.delete = {
        id: event.idEvent,
    }
    xhr.open('POST', 'http://' + url + '/delete', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            response = JSON.parse(xhr.responseText);
            if(response.status.toUpperCase() == `OK`){
                obj = {
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
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj)); 
}

function sendEvent(key){
    leftPlatform = document.getElementById('leftPlatform');
    leftPlatform = leftPlatform.options[leftPlatform.selectedIndex];
    platformUrl = leftPlatform.getAttribute('url');
    event = eventData[idRow];
    if(platformUrl == `default`) platformUrl = event.if.left.url;
    var obj = header();
    obj[key] = {};
    if(key == 'create'){
        obj[key] = (generateCondition(key))[key];
    }else if(key == 'update'){
        obj[key] = (generateCondition(key))[key];
        obj[key].id = event.idEvent;
    }else if(key == 'delete'){
        obj[key].id = event.idEvent;
    }
    xhr.open('POST', 'http://' + platformUrl + '/' + key, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function (e) {
        var response = JSON.parse(xhr.responseText);
        if(response.status.toUpperCase() == `OK`){
            if ((xhr.readyState === 4) && (xhr.status === 200)) {
                if(key == 'create') obj.idEvent = response.idEvent;
                xhr.open('POST', 'http://' + myIp + '/events/' + key, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onload = function (e) {
                    if ((xhr.readyState === 4) && (xhr.status === 200)) {
                        obj._id = xhr.responseText.replace(/['"]+/g, '');
                        appendEvents(obj,key);
                        eventModal.modal('hide');
                    }
                };
                xhr.onerror = function (e) {
                    console.error(xhr.statusText + e);
                };
                xhr.send(JSON.stringify(obj));             
            }
        }else{
            alert('error al crear el evento');
        }
    };
    xhr.onerror = function (e) {
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
                appendEvents(response[key],``);
            }
        }
        getPlatforms();
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send();
}

function getTimeInFormat() {
    var date = new Date();
    return date.toISOString();
}

function convertDateInFormat(time) {
    var date = new Date(time);
    return date.toISOString();
}

function header() {
    obj = {
        "id": myName,
        "url": myIp,
        "date": getTimeInFormat(),
    }
    return obj;
}

function correctFormat(type, val){
    try{
        if(type == `text`){
            return val;
        } else if (type == `status`) {
            if (val == `true`) return true;
            else return false;
        } else {
            return parseFloat(val);
        }
    }catch(e){
        return `invalid format`;
    }
}

function generateCondition(key) {
    var obj = {};
    obj[key] = {};
    //if
    if (ifIsDirty) {
        leftPlatform = document.getElementById('leftPlatform');
        leftPlatform = leftPlatform.options[leftPlatform.selectedIndex];
        leftHardware = document.getElementById('leftHardware')
        leftHardware = leftHardware.options[leftHardware.selectedIndex];
        condition = document.getElementById('condition');
        condition = condition.options[condition.selectedIndex].value;
        leftId = leftHardware.getAttribute('id');
        leftUrl = leftPlatform.getAttribute('url');
        rightKey = document.getElementById('rightPlatform');
        rightKey = rightKey.options[rightKey.selectedIndex].value;
        rightValue = correctFormat(rightKey, document.getElementById('rightValue').value);
        obj[key].if = {
            left: {
                url: leftUrl,
                id: leftId,
                freq: 6000,
            },
            condition: condition,
            right: {
                [`${rightKey}`]: rightValue,
            }
        };
    }

    //then
    if (thenIsDirty) {
        thenPlatform = document.getElementById('thenPlatform');
        thenPlatform = thenPlatform.options[thenPlatform.selectedIndex];
        thenHardware = document.getElementById('thenHardware');
        thenHardware = thenHardware.options[thenHardware.selectedIndex];
        thenUrl = thenPlatform.getAttribute('url');
        thenId = thenHardware.getAttribute('id');
        thenKey = document.getElementById('thenKey');
        thenKey = thenKey.options[thenKey.selectedIndex].value;
        thenValue = correctFormat(thenKey, document.getElementById('thenValue').value);
        obj[key].then = {
            url: thenUrl,
            id: thenId,
            [`${thenKey}`]: thenValue,       
        };
    }

    //else
    if (elseIsDirty) {
        elsePlatform = document.getElementById('elsePlatform');
        elsePlatform = elsePlatform.options[elsePlatform.selectedIndex];
        elseHardware = document.getElementById('elseHardware');
        elseHardware = elseHardware.options[elseHardware.selectedIndex];
        elseUrl = elsePlatform.getAttribute('url');
        elseId = elseHardware.getAttribute('id');
        elseKey = document.getElementById('elseKey');
        elseKey = elseKey.options[elseKey.selectedIndex].value;
        elseValue = correctFormat(elseKey, document.getElementById('elseValue').value);
        obj[key].else = {
            url: elseUrl,
            id: elseId,
            [`${elseKey}`]: elseValue,
        };
    }
    return obj;
}

function removeOptions(selectbox) {
    for (var i = selectbox.options.length - 1; i >= 1; i--) {
        selectbox.remove(i);
    }
}

function appendHardware(url, selectName) {
    jsonObj = infoData[url];
    console.log(infoData);
    var selectHardware = document.getElementById(selectName);
    removeOptions(selectHardware);
    var data = jsonObj.hardware;
    for (var key in data) {
        obj = data[key];
        option = document.createElement("option");
        option.setAttribute('tag', obj.tag);
        option.setAttribute('type', obj.type);
        option.setAttribute('id', key);
        option.innerHTML = key;
        selectHardware.appendChild(option);
    }
}

function info(url) {
    return new Promise(function (resolve, reject) {
        var obj = header();
        xhr.open('POST', 'http://' + url + '/info', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function(e) {
            if ((xhr.readyState === 4) && (xhr.status === 200)) {
                resolve(JSON.parse(xhr.response));
            }
        };
        xhr.onerror = function(e) {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(JSON.stringify(obj));
    });
}

async function appendPlatforms(json) {
    jsonObj = JSON.parse(json);
    var selectLeft = document.getElementById("leftPlatform");
    var selectThen = document.getElementById("thenPlatform");
    var selectElse = document.getElementById("elsePlatform");
    for (var key in jsonObj) {
        obj = jsonObj[key];
        var url = obj[`url`];
        option = document.createElement("option");
        option.setAttribute('name', obj.name);
        option.setAttribute('url', obj.url);
        option2 = option.cloneNode(true);;
        option3 = option.cloneNode(true);
        option.innerHTML = obj.name;
        option2.innerHTML = obj.name;
        option3.innerHTML = obj.name;
        selectLeft.appendChild(option);
        selectThen.appendChild(option2);
        selectElse.appendChild(option3);
        var infoPlatform = await info(obj.url);
        var element = {
            hardware: infoPlatform.hardware,
        }
        infoData[`${url}`] = element;
    }
}

function getPlatforms() {
    xhr.open('GET', 'http://' + myIp + '/platforms/list', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            appendPlatforms(xhr.responseText);
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send();
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        eventModal = $('#eventModal');
        if(view == `event_list`) {
            poling();
        }else{
            getPlatforms();
        }
        document.getElementById(`leftPlatform`).addEventListener('change', function(){
            let option = this[this.selectedIndex];
            const url = option.getAttribute('url');
            console.log(url);
            if(url == 'default') {
                ifIsDirty = false; 
                removeOptions(document.getElementById('leftHardware'));
            }else{
                ifIsDirty = true;
                appendHardware(url, 'leftHardware');
            }
        });
        document.getElementById(`thenPlatform`).addEventListener('change', function(){
            let option = this[this.selectedIndex];
            const url = option.getAttribute('url');
            if(url == 'default'){
                thenIsDirty = false;
                removeOptions(document.getElementById('thenHardware'));
            }else{
                thenIsDirty = true;
                appendHardware(url,'thenHardware');
            }
        });
        document.getElementById(`elsePlatform`).addEventListener('change', function(){
            let option = this[this.selectedIndex];
            const url = option.getAttribute('url');
            if(url == 'default'){ 
                elseIsDirty = false; 
                removeOptions(document.getElementById('elseHardware'));
            }else{
                elseIsDirty = true;
                appendHardware(url,'elseHardware');
            }
        });
    
    }
};