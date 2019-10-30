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
let infoData = [];

function appendEvent(event) {
    console.log(event);
    var tableRef = document.getElementById("tableEvents").getElementsByTagName('tbody')[0];
    var id = event._id;
    var idEvent = event.idEvent;
    var date = event.date;
    text = `<tr>`;
    text += `<td id="${id}-idEvent">`;
    text += `${idEvent}`;
    text += `</td>`;
    text += `<td id="${id}-date">`;
    text += `${date}`;
    text += `</td>`;
    text += `<td>`;
    text += `<button data-toggle="tooltip"  onClick="editEvent('Editar Evento',\'` + id + `\',this)"  title="Edit" class="pd-setting-ed"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>`;
    text += `<button data-toggle="tooltip" onClick="deleteEvent(\'` + id + `\',this)" title="Trash" class="pd-setting-ed"><i class="fa fa-trash-o" aria-hidden="true"></i></button>`;
    text += `</td>`;
    text += `</tr>`;
    newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = text;
}

function newEvent(text, name, url, element) {
    action = `create`;
    eventModal.modal('toggle');
    document.getElementById(`titleEventModal`).textContent = text;
    // document.getElementById(`modalName`).value = name;
    // document.getElementById(`modalUrl`).value = url;
}

function sendRequest() {
    if (action == `create`) createEvent('create');
    else updateEvent();
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

function deleteEvent(id, element) {
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

function correctFormat(type, val) {
    alert(val);
    alert(type);
    try {
        if (type == `text`) {
            return val;
        } else if (type == `status`) {
            if (val == `true`) return true;
            else return false;
        } else {
            return parseFloat(val);
        }
    } catch (e) {
        alert(e);
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
        rigthKey = document.getElementById('rigthPlatform');
        rigthKey = rigthKey.options[rigthKey.selectedIndex].value;
        rigthValue = correctFormat(rigthKey, document.getElementById('rigthValue').value);
        obj[key].if = {
            left: {
                url: leftUrl,
                id: leftId,
                freq: 6000,
            },
            condition: condition,
            rigth: {
                [`${rigthKey}`]: rigthValue,
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
            [`${thenKey}`]: rigthValue,
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
    console.log(obj);
    return obj;
}

function createEvent(key) {
    var obj = header();
    obj[key] = {};
    if (key == 'create') {
        obj[key] = (generateCondition(key))[key];
    } else if (key == 'update') {
        obj[key].id = idEvent;
        obj[key] = (generateCondition(key))[key];
    } else if (key == 'delete') {
        obj[key].id = idEvent;
    }
    console.log(obj);
    // xhr.open('POST', 'http://' + eventIp + '/' + key, true);
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.onload = function (e) {
    //     var response = JSON.parse(xhr.responseText);
    //     if ((xhr.readyState === 4) && (xhr.status === 200)) {
    //         if(key == 'create') obj.idEvent = response.idEvent;
    //         xhr.open('POST', 'http://' + myIp + '/events/' + key, true);
    //         xhr.setRequestHeader("Content-Type", "application/json");
    //         xhr.onload = function (e) {
    //             if ((xhr.readyState === 4) && (xhr.status === 200)) {
    //                 alert(key + ' event successfully');
    //             }
    //         };
    //         xhr.onerror = function (e) {
    //             console.error(xhr.statusText + e);
    //         };
    //         xhr.send(JSON.stringify(obj));             
    //     }
    // };
    // xhr.onerror = function (e) {
    //     console.error(xhr.statusText + e);
    // };
    // xhr.send(JSON.stringify(obj)); 
}

function getHardware(element) {
    console.log(element)
}

function removeOptions(selectbox) {
    for (var i = selectbox.options.length - 1; i >= 1; i--) {
        selectbox.remove(i);
    }
}

function appendHardware(url, selectName) {
    jsonObj = infoData[url];
    console.log(jsonObj);
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
    var obj = header();
    xhr.open('POST', 'http://' + url + '/info', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            var item = JSON.parse(xhr.responseText);
            infoData[url] = item;
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj));
}

function appendPlatforms(json) {
    jsonObj = JSON.parse(json);
    var selectLeft = document.getElementById("leftPlatform");
    var selectThen = document.getElementById("thenPlatform");
    var selectElse = document.getElementById("elsePlatform");
    for (var key in jsonObj) {
        obj = jsonObj[key];
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
        info(obj.url);
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
        getPlatforms();
        if (view == `event_list`) {
            document.getElementById(`leftPlatform`).addEventListener('change', function() {
                let option = this[this.selectedIndex];
                const url = option.getAttribute('url');
                if (url == 'default') {
                    ifIsDirty = false;
                    removeOptions(document.getElementById('leftHardware'));
                } else {
                    ifIsDirty = true;
                    appendHardware(url, 'leftHardware');
                }
            });
            document.getElementById(`thenPlatform`).addEventListener('change', function() {
                let option = this[this.selectedIndex];
                const url = option.getAttribute('url');
                if (url == 'default') {
                    thenIsDirty = false;
                    removeOptions(document.getElementById('thenHardware'));
                } else {
                    thenIsDirty = true;
                    appendHardware(url, 'thenHardware');
                }
            });
            document.getElementById(`elsePlatform`).addEventListener('change', function() {
                let option = this[this.selectedIndex];
                const url = option.getAttribute('url');
                if (url == 'default') {
                    elseIsDirty = false;
                    removeOptions(document.getElementById('elseHardware'));
                } else {
                    elseIsDirty = true;
                    appendHardware(url, 'elseHardware');
                }
            });
        }
    }
};