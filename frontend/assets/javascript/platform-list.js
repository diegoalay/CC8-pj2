xhr = new XMLHttpRequest();
myIp = 'localhost';
action = ``;
idRow = ``;
currentRow = ``;
platformModal = ``;

function appendPlatform(platform) {
    console.log(platform);
    var tableRef = document.getElementById("IpHardware").getElementsByTagName('tbody')[0];
    var name = platform.name;
    var id = platform._id;
    var url = platform.url;
    text = `<tr>`;
    text += `<td id="${id}-name">`;
    text +=   `${name}`;
    text += `</td>`;
    text += `<td id="${id}-url">`;
    text +=   `${url}`;
    text += `</td>`;
    text += `<td>`;
    text +=    `<button data-toggle="tooltip"  onClick="editPlatform('Editar plataforma',\'` + id + `\',this)"  title="Edit" class="pd-setting-ed"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>`;
    text    += `<button data-toggle="tooltip" onClick="deletePlatform(\'` + id + `\',this)" title="Trash" class="pd-setting-ed"><i class="fa fa-trash-o" aria-hidden="true"></i></button>`;
    text += `</td>`;
    text += `</tr>`;
    newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = text;
}

function appendPlatformCard(platform) {
    console.log(platform);
    var name = platform.name;
    var id = platform._id;
    var url = platform.url;
    text = `<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" id="${id}-name">`;
    text += `<div class="admin-content analysis-progrebar-ctn res-mg-t-15">`;
    text += `<h4 class="text-left text-uppercase"><b>${name}<b></h4>`;
    text += `<div class="row vertical-center-box vertical-center-box-tablet">`;
    text += `<div class="col-xs-9 cus-gh-hd-pro">`;
    text += `<h2 class="text-left no-margin">${url}</h2>`;
    text += `</div></div></div></div>`;
    $('#platformCard').append(text);



}

function polingCard() {
    alert('entra');
    xhr.open('GET', 'http://' + myIp + '/platforms/list', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            response = JSON.parse(xhr.responseText);
            for (key in response) {
                appendPlatformCard(response[key]);
            }
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send();
}

function newPlatform(text, name, url, element) {
    action = `create`;
    platformModal.modal('toggle');
    document.getElementById(`titlePlatformModal`).textContent = text;
    document.getElementById(`modalName`).value = name;
    document.getElementById(`modalUrl`).value = url;
}

function sendRequest(){
    if(action == `create`) createPlatform();
    else updatePlatform();
}

function createPlatform() {
    platformModal.modal("hide");
    var name = document.getElementById(`modalName`).value;
    var url = document.getElementById(`modalUrl`).value;
    var obj = {
        name: name,
        url: url,
    }
    xhr.open('POST', 'http://' + myIp + '/platforms/new', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            response  = xhr.responseText;
            response = response.replace(/['"]+/g, '')
            document.getElementById(`modalName`).value = ``;
            document.getElementById(`modalUrl`).value = ``;
            if(view == `platform_list`){
                console.log(response);
                obj._id = response;
                appendPlatform(obj);
            }
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj)); 
}

function updatePlatform() {
    let name = document.getElementById(`modalName`).value;
    let url = document.getElementById(`modalUrl`).value
    var obj = {
        idPlatform: idRow,
        name: name,
        url: url,
    }
    document.getElementById(`${idRow}-name`).innerHTML = name;
    document.getElementById(`${idRow}-url`).innerHTML = url;
    platformModal.modal('hide');
    xhr.open('POST', 'http://' + myIp + '/platforms/update', true);
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

function editPlatform(text, id, element) {
    action = `update`;
    idRow = id;
    let name = document.getElementById(`${idRow}-name`).textContent;
    let url = document.getElementById(`${idRow}-url`).textContent;
    platformModal.modal('toggle');
    currentRow = element.parentElement.parentElement;
    document.getElementById(`titlePlatformModal`).textContent = text;
    document.getElementById(`modalName`).value = name;
    document.getElementById(`modalUrl`).value = url;   
}

function deletePlatform(id,element){
    currentRow = element.parentElement.parentElement;
    idRow = id;
    var index = $('table tr').index(currentRow);
    var obj = {
        idPlatform: id,
    }
    xhr.open('POST', 'http://' + myIp + '/platforms/delete', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            document.getElementById("IpHardware").deleteRow(index);
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj));   
}

function poling() {
    xhr.open('GET', 'http://' + myIp + '/platforms/list', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            response = JSON.parse(xhr.responseText);
            for (key in response) {
                appendPlatform(response[key]);
            }
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send();
}


document.onreadystatechange = () => {
    alert(1);
    if (document.readyState === 'complete') {
        platformModal = $('#platformModal');
        if(view == `platform_list`) poling();
        else if (view == `index`) {
            polingCard();   
            alert(1);
        }
    }
};var xhr = new XMLHttpRequest();
var myIp = 'localhost';
let myName = "greenhouse";
var action = ``;
var idRow = ``;
var currentRow = ``;
var platformModal = ``;

function appendPlatform(platform) {
    console.log(platform);
    var tableRef = document.getElementById("IpHardware").getElementsByTagName('tbody')[0];
    var name = platform.name;
    var id = platform._id;
    var url = platform.url;
    text = `<tr>`;
    text += `<td id="${id}-name">`;
    text += `${name}`;
    text += `</td>`;
    text += `<td id="${id}-url">`;
    text += `${url}`;
    text += `</td>`;
    text += `<td>`;
    text += `<button data-toggle="tooltip"  onClick="editPlatform('Editar plataforma',\'` + id + `\',this)"  title="Edit" class="pd-setting-ed"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>`;
    text += `<button data-toggle="tooltip" onClick="deletePlatform(\'` + id + `\',this)" title="Trash" class="pd-setting-ed"><i class="fa fa-trash-o" aria-hidden="true"></i></button>`;
    text += `</td>`;
    text += `</tr>`;
    newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = text;
}

function appendPlatformCard(platform) {
    console.log(platform);
    var name = platform.name;
    var id = platform._id;
    var url = platform.url;
    text = `<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" id="${id}-name">`;
    text += `<div class="admin-content analysis-progrebar-ctn res-mg-t-15">`;
    text += `<h4 class="text-left text-uppercase"><b>${name}<b></h4>`;
    text += `<div class="row vertical-center-box vertical-center-box-tablet">`;
    text += `<div class="col-xs-9 cus-gh-hd-pro">`;
    text += `<h2 class="text-left no-margin">${url}</h2>`;
    text += `</div></div></div></div>`;
    $('#platformCard').append(text);
}

function polingCard() {
    xhr.open('GET', 'http://' + myIp + '/platforms/list', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            response = JSON.parse(xhr.responseText);
            for (key in response) {
                appendPlatformCard(response[key]);
            }
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send();
}

function newPlatform(text, name, url, element) {
    action = `create`;
    platformModal.modal('toggle');
    document.getElementById(`titlePlatformModal`).textContent = text;
    document.getElementById(`modalName`).value = name;
    document.getElementById(`modalUrl`).value = url;
}

function sendRequest() {
    if (action == `create`) createPlatform();
    else updatePlatform();
}

function createPlatform() {
    platformModal.modal("hide");
    var name = document.getElementById(`modalName`).value;
    var url = document.getElementById(`modalUrl`).value;
    var obj = {
        name: name,
        url: url,
    }
    xhr.open('POST', 'http://' + myIp + '/platforms/new', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            response = xhr.responseText;
            response = response.replace(/['"]+/g, '')
            document.getElementById(`modalName`).value = ``;
            document.getElementById(`modalUrl`).value = ``;
            if (view == `platform_list`) {
                console.log(response);
                obj._id = response;
                appendPlatform(obj);
            }
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj));
}

function updatePlatform() {
    let name = document.getElementById(`modalName`).value;
    let url = document.getElementById(`modalUrl`).value
    var obj = {
        idPlatform: idRow,
        name: name,
        url: url,
    }
    document.getElementById(`${idRow}-name`).innerHTML = name;
    document.getElementById(`${idRow}-url`).innerHTML = url;
    platformModal.modal('hide');
    xhr.open('POST', 'http://' + myIp + '/platforms/update', true);
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

function editPlatform(text, id, element) {
    action = `update`;
    idRow = id;
    let name = document.getElementById(`${idRow}-name`).textContent;
    let url = document.getElementById(`${idRow}-url`).textContent;
    platformModal.modal('toggle');
    currentRow = element.parentElement.parentElement;
    document.getElementById(`titlePlatformModal`).textContent = text;
    document.getElementById(`modalName`).value = name;
    document.getElementById(`modalUrl`).value = url;
}

function deletePlatform(id, element) {
    currentRow = element.parentElement.parentElement;
    idRow = id;
    var index = $('table tr').index(currentRow);
    var obj = {
        idPlatform: id,
    }
    xhr.open('POST', 'http://' + myIp + '/platforms/delete', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            document.getElementById("IpHardware").deleteRow(index);
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj));
}

function poling() {
    xhr.open('GET', 'http://' + myIp + '/platforms/list', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            response = JSON.parse(xhr.responseText);
            for (key in response) {
                appendPlatform(response[key]);
            }
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send();
}


document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        platformModal = $('#platformModal');
        if (view == `platform_list`) {
            poling();
        } else if (view == `index`) {
            polingCard();
        }
    }
};

