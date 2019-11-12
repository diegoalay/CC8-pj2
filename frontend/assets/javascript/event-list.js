xhr = new XMLHttpRequest();
myIp = 'localhost';
myName = "greenhouse";
action = ``;
idRow = ``;
currentRow = ``;
eventModal = ``;
var ifIsDirty = ``;
var thenIsDirty = ``;
var elseIsDirty = ``;
var eventData = [];
var infoData = [];
var sendUrl = null;

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
        idEvent = event.idEvent;
        url = event.if.left.url;
    }
    var tableRef = document.getElementById("tableEvents").getElementsByTagName('tbody')[0];
    eventData[id] = event;
    text = `<tr>`;
    text += `<td id="${id}-idEvent">`;
    text += `${idEvent}`;
    text += `</td>`;
    text += `<td id="${id}-url">`;
    text +=   `${event.platformUrl}`;
    text += `</td>`;    
    text += `<td id="${id}-date">`;
    text += `${date}`;
    text += `</td>`;
    text += `<td>`;
    text +=    `<button data-toggle="tooltip"  onClick="editEvent('Editar Evento: ${id}',\'` + id + `\',this)"  title="Edit" class="pd-setting-ed"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>`;
    text    += `<button data-toggle="tooltip" onClick="deleteEvent(\'` + id + `\',\'` + key + `\',this)" title="Trash" class="pd-setting-ed"><i class="fa fa-trash-o" aria-hidden="true"></i></button>`;
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
    let event = eventData[id];
    let info = infoData[event.if.left.url]; 
    console.log(event);

    //PLATFORM
    $("#selectPlatformEvent").val(`${event.platformUrl}`);

    //IF
    $("#leftPlatform").val(`${event.if.left.url}`);
    changeSelect(document.getElementById(`leftPlatform`),event.if.left.url,'leftHardware');
    $("#leftHardware").val(`${event.if.left.id}`);
    $("#condition").val(`${event.if.condition}`);
    var keyRigth;
    var keyValue;
    for(key in event.if.right){
        keyRigth = key;
        keyValue = event.if.right[key];
        $("#rightPlatform").val(`${keyRigth}`);
    }
    $("#rightValue").val(`${keyValue}`);
    if(event.if.left.freq != undefined) $("#rightFreq").val(`${event.if.left.freq}`);


    //THEN
    $("#thenPlatform").val(`${event.then.url}`);
    changeSelect(document.getElementById(`thenPlatform`),event.then.url,'thenHardware');
    $("#thenHardware").val(`${event.then.id}`);
    var keyThen = key;
    keyVale = ``;
    for(let key in event.then) {
        if(key !== `url` && key != `id`) {
            keyThen = key;
            keyValue = event.then[key];
            $("#thenKey").val(`${key}`);
        }
    }
    $("#thenValue").val(`${keyValue}`);

    //ELSE
    $("#elsePlatform").val(`${event.else.url}`);
    changeSelect(document.getElementById(`elsePlatform`),event.else.url,'elseHardware');
    $("#elseHardware").val(`${event.else.id}`);
    var keyelse = key;
    keyVale = ``;
    for(let key in event.else) {
        if(key !== `url` && key != `id`) {
            keyelse = key;
            keyValue = event.else[key];
            $("#elseKey").val(`${key}`);
        }
    }
    $("#elseValue").val(`${keyValue}`);
    sendUrl = event.platformUrl;
}

function changeSelect(select, url, element) {
    let option = [select.selectedIndex];
    if(url == 'default') {
        ifIsDirty = false; 
        removeOptions(document.getElementById(element));
    }else{
        ifIsDirty = true;
        appendHardware(url, element);
    }
}
function deleteEvent(id, key, element){
    event = eventData[id];
    if(key == `create`) url = event.create.if.left.url;
    else url = event.if.left.url;
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
    selectPlatformEvent = document.getElementById('selectPlatformEvent');
    selectPlatformEvent = selectPlatformEvent.options[selectPlatformEvent.selectedIndex];
    event = eventData[idRow];
    console.log(`here`);
    let platformUrl;
    if(key === `create`) platformUrl = selectPlatformEvent.getAttribute('url');
    else platformUrl = sendUrl;
    if(platformUrl !== `default`){
        alert(sendUrl);
        alert(platformUrl);
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
            obj.platformUrl = platformUrl;
            obj.type = key;
            var response = JSON.parse(xhr.responseText);
            if(response.status.toUpperCase() == `OK`){
                if ((xhr.readyState === 4) && (xhr.status === 200)) {
                    if(key === 'create' ) obj.idEvent = response.idEvent;
                    else if(key === `update`) obj._id = event._id;
                    xhr.open('POST', 'http://' + myIp + '/events/' + key, true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.onload = function (e) {
                        if ((xhr.readyState === 4) && (xhr.status === 200)) {
                            obj._id = xhr.responseText.replace(/['"]+/g, '');
                            if(key == 'create') appendEvents(obj,key);
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
    } else {
        alert(`Debe seleccionar a qué plataforma desea crear el evento`);
    }
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

function ISODateString(d) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return d.getUTCFullYear() + '-' +
        pad(d.getUTCMonth() + 1) + '-' +
        pad(d.getUTCDate()) + 'T' +
        pad(d.getUTCHours()) + ':' +
        pad(d.getUTCMinutes()) + ':' +
        pad(d.getUTCSeconds()) + 'Z'
}

function getTimeInFormat() {
    var date = new Date();
    return ISODateString(date);
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
            try{
                return parseFloat(val);
            }catch(e){
                return 0;
            }
        }
    }catch(e){
        return ``;
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
        freqValue = correctFormat(`freq`, document.getElementById('rightFreq').value);
        obj[key].if = {
            left: {
                url: leftUrl,
                id: leftId,
                freq: freqValue,
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
        option.setAttribute('value', key);
        option.innerHTML = key;
        selectHardware.appendChild(option);
    }
}

function info(url) {
    return new Promise(function (resolve, reject) {
        try{
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
        }catch(e){
            
        }
    });
}

async function appendPlatforms(json) {
    jsonObj = JSON.parse(json);
    var selectPlatformEvent = document.getElementById("selectPlatformEvent");
    var selectLeft = document.getElementById("leftPlatform");
    var selectThen = document.getElementById("thenPlatform");
    var selectElse = document.getElementById("elsePlatform");
    for (var key in jsonObj) {
        obj = jsonObj[key];
        var url = obj[`url`];
        option = document.createElement("option");
        let name = obj.name;
        option.setAttribute('value', obj.url);
        option.setAttribute('url', obj.url);
        option2 = option.cloneNode(true);;
        option3 = option.cloneNode(true);
        option4 = option.cloneNode(true);
        option.innerHTML = obj.name;
        option2.innerHTML = obj.name;
        option3.innerHTML = obj.name;
        option4.innerHTML = obj.name;
        selectLeft.appendChild(option);
        selectThen.appendChild(option2);
        selectElse.appendChild(option3);
        selectPlatformEvent.appendChild(option4);
        var infoPlatform = await info(obj.url);
        var element = {
            id: name,
            hardware: infoPlatform.hardware,
        }
        infoData[`${url}`] = element;
        console.log(infoData);
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
        
        //DIRTY IF
        document.getElementById(`leftHardware`).addEventListener(`change`, function () { 
            ifIsDirty = true;
        })

        document.getElementById(`condition`).addEventListener(`change`, function () { 
            ifIsDirty = true;
        })

        document.getElementById(`rightPlatform`).addEventListener(`change`, function () { 
            ifIsDirty = true;
        })

        document.getElementById(`rightValue`).addEventListener(`change`, function () { 
            ifIsDirty = true;
        })

        document.getElementById(`rightFreq`).addEventListener(`change`, function () { 
            ifIsDirty = true;
        })


        //DIRTY THEN
        document.getElementById(`thenHardware`).addEventListener(`change`, function () { 
            thenIsDirty = true;
        })

        document.getElementById(`thenKey`).addEventListener(`change`, function () { 
            thenIsDirty = true;
        })

        document.getElementById(`thenValue`).addEventListener(`change`, function () { 
            thenIsDirty = true;
        })

        //DIRTY ELSE
        document.getElementById(`elseHardware`).addEventListener(`change`, function () { 
            elseIsDirty = true;
        })

        document.getElementById(`elseKey`).addEventListener(`change`, function () { 
            elseIsDirty = true;
        })

        document.getElementById(`elseValue`).addEventListener(`change`, function () { 
            elseIsDirty = true;
        })        

        //SELECT EVENTS
        document.getElementById(`leftPlatform`).addEventListener('change', function(){
            let option = this[this.selectedIndex];
            const url = option.getAttribute('url');
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