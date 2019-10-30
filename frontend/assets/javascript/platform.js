var xhr = new XMLHttpRequest();
var myIp = 'localhost';
let myName = "greenhouse";

function getTimeInFormat() {
    var date = new Date();
    return date.toISOString();
}

function convertDateInFormat(time) {
    var date = new Date(time);
    return date.toISOString();
}

function createForm(json) {
    jsonObj = JSON.parse(json);
    var data = jsonObj.hardware;
    for (var key in data) {
        obj = data[key];
        console.log(obj);

        //TABS

        form = document.createElement("div");
        form.setAttribute('id', "form-" + key)
        form.setAttribute('class', 'tab-pane fade');
        tabElement = document.createElement("li");
        tabElementAnchor = document.createElement("a");
        tabElementAnchor.setAttribute('data-toggle', 'tab');
        tabElementAnchor.setAttribute('href', '#form-' + key);
        tabElementAnchor.innerHTML = `${key}`;
        tabElement.appendChild(tabElementAnchor);
        document.getElementById("tabs-ul").appendChild(tabElement);
        document.getElementById("tabs").appendChild(form);

        if (obj.type == 'input') {
            form1 = document.createElement("form");

            formGroup = document.createElement("div");
            formGroup.setAttribute('class', 'form-group');
            labelId = document.createElement("label");
            labelId.innerHTML = "ID:";
            inputId = document.createElement("input");
            inputId.setAttribute('type', 'text');
            inputId.setAttribute('class', 'form-control');
            inputId.setAttribute('id', `${key}-id`);
            inputId.setAttribute('value', `${key}`);
            inputId.setAttribute('required', `true`);
            inputId.readOnly = true;
            formGroup.appendChild(labelId);
            formGroup.appendChild(inputId);
            form1.appendChild(formGroup);

            formGroup3 = document.createElement("div");
            formGroup3.setAttribute('class', 'form-group');
            labelTag = document.createElement("label");
            labelTag.innerHTML = "Tag:";
            inputTag = document.createElement("input");
            inputTag.setAttribute('type', 'text');
            inputTag.setAttribute('class', 'form-control');
            inputTag.setAttribute('id', `${key}-id`);
            inputTag.setAttribute('value', `${obj.tag}`);
            inputTag.setAttribute('required', `true`);
            inputTag.readOnly = true;
            formGroup3.appendChild(labelTag);
            formGroup3.appendChild(inputTag);
            form1.appendChild(formGroup3);

            formGroup4 = document.createElement("div");
            formGroup4.setAttribute('class', 'form-group');
            labelType = document.createElement("label");
            labelType.innerHTML = "Type:";
            inputType = document.createElement("input");
            inputType.setAttribute('type', 'text');
            inputType.setAttribute('class', 'form-control');
            inputType.setAttribute('id', `${key}-id`);
            inputType.setAttribute('value', `${obj.type}`);
            inputType.setAttribute('required', `true`);
            inputType.readOnly = true;
            formGroup4.appendChild(labelType);
            formGroup4.appendChild(inputType);
            form1.appendChild(formGroup4);

            formGroup2 = document.createElement("div");
            formGroup2.setAttribute('class', 'form-group');
            labelFreq = document.createElement("label");
            labelFreq.innerHTML = "Freq:";
            inputFreq = document.createElement("input");
            inputFreq.setAttribute('type', 'number');
            inputFreq.setAttribute('class', 'form-control');
            inputFreq.setAttribute('id', `${key}-id`);
            inputFreq.setAttribute('required', `true`);
            formGroup2.appendChild(labelFreq);
            formGroup2.appendChild(inputFreq);
            form1.appendChild(formGroup2);

            saveButton = document.createElement("button");
            saveButton.setAttribute('type', 'button');
            saveButton.setAttribute('class', 'botonEvento');
            saveButton.setAttribute('onclick', `sendChange('${key}', '${obj.type}')`);
            saveButton.innerHTML = "Guardar";

            form1.appendChild(saveButton);

            document.getElementById(`form-${key}`).appendChild(form1);


        } else if (obj.type == 'output') {
            form1 = document.createElement("form");

            formGroup = document.createElement("div");
            formGroup.setAttribute('class', 'form-group');
            labelId = document.createElement("label");
            labelId.innerHTML = "ID:";
            inputId = document.createElement("input");
            inputId.setAttribute('type', 'text');
            inputId.setAttribute('class', 'form-control');
            inputId.setAttribute('id', `${key}-id`);
            inputId.setAttribute('value', `${key}`);
            inputId.setAttribute('required', `true`);
            inputId.readOnly = true;
            formGroup.appendChild(labelId);
            formGroup.appendChild(inputId);
            form1.appendChild(formGroup);

            formGroup3 = document.createElement("div");
            formGroup3.setAttribute('class', 'form-group');
            labelTag = document.createElement("label");
            labelTag.innerHTML = "Tag:";
            inputTag = document.createElement("input");
            inputTag.setAttribute('type', 'text');
            inputTag.setAttribute('class', 'form-control');
            inputTag.setAttribute('id', `${key}-id`);
            inputTag.setAttribute('value', `${obj.tag}`);
            inputTag.setAttribute('required', `true`);
            inputTag.readOnly = true;
            formGroup3.appendChild(labelTag);
            formGroup3.appendChild(inputTag);
            form1.appendChild(formGroup3);

            formGroup4 = document.createElement("div");
            formGroup4.setAttribute('class', 'form-group');
            labelType = document.createElement("label");
            labelType.innerHTML = "Type:";
            inputType = document.createElement("input");
            inputType.setAttribute('type', 'text');
            inputType.setAttribute('class', 'form-control');
            inputType.setAttribute('id', `${key}-id`);
            inputType.setAttribute('value', `${obj.type}`);
            inputType.setAttribute('required', `true`);
            inputType.readOnly = true;
            formGroup4.appendChild(labelType);
            formGroup4.appendChild(inputType);
            form1.appendChild(formGroup4);

            formGroup2 = document.createElement("div");
            formGroup2.setAttribute('class', 'form-group');
            labelText = document.createElement("label");
            labelText.innerHTML = "Text:";
            inputText = document.createElement("input");
            inputText.setAttribute('type', 'text');
            inputText.setAttribute('class', 'form-control');
            inputText.setAttribute('id', `${key}-id`);
            inputText.setAttribute('required', `true`);
            formGroup2.appendChild(labelText);
            formGroup2.appendChild(inputText);
            form1.appendChild(formGroup2);

            formGroup5 = document.createElement("div");
            formGroup5.setAttribute('class', 'form-group');
            labelStatus = document.createElement("label");
            labelStatus.innerHTML = "Status:";
            inputStatus = document.createElement("input");
            inputStatus.setAttribute('type', 'text');
            inputStatus.setAttribute('class', 'form-control');
            inputStatus.setAttribute('id', `${key}-id`);
            inputStatus.setAttribute('required', `true`);
            formGroup5.appendChild(labelStatus);
            formGroup5.appendChild(inputStatus);
            form1.appendChild(formGroup5);

            saveButton = document.createElement("button");
            saveButton.setAttribute('type', 'button');
            saveButton.setAttribute('class', 'botonEvento');
            saveButton.setAttribute('onclick', `sendChange('${key}', '${obj.type}')`);
            saveButton.innerHTML = "Guardar";

            form1.appendChild(saveButton);

            document.getElementById(`form-${key}`).appendChild(form1);
        }
    }
}


function header() {
    obj = {
        "id": myName,
        "url": myIp,
        "date": getTimeInFormat(),
    }
    return obj;
}

function search(hardware, startDate, finishDate) {
    //buscamos en cache primero
    var obj = header();
    obj.search = {};
    obj.search['id_hardware'] = hardware;
    obj.search['start_date'] = startDate;
    obj.search['finish_date'] = finishDate;
    xhr.open('POST', 'http://' + myIp + '/search', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        var frontResp = JSON.parse(xhr.responseText);
        console.log(frontResp);
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            var length = Object.keys(frontResp.data).length;
            alert(length);
            if (length > 0) {
                if (new Date(frontResp.start) > new Date(startDate) && new Date(frontResp.finish) >= new Date(finishDate)) {
                    pending = new Date(new Date(frontResp.start).getTime());
                    finishDate = pending.toISOString();
                    alert('pedir el resto izquierda: ' + startDate + ' - ' + finishDate);
                } else if (new Date(frontResp.start) >= new Date(startDate) && new Date(frontResp.finish) < new Date(finishDate)) {
                    pending = new Date(new Date(frontResp.finish).getTime() + (new Date(finishDate).getTime() - new Date(frontResp.finish).getTime()));
                    startDate = finishDate;
                    finishDate = pending.toISOString();
                    alert('pedir el resto derecha: ' + new Date(frontResp.finish) + '-' + pending);
                } else if (new Date(frontResp.start) <= new Date(startDate) && new Date(frontResp.finish) >= new Date(finishDate)) {
                    alert('todo en cache');
                } else {
                    pending
                    alert('pedir todo');
                }
            }
            if (pending) {
                xhr.open('POST', 'http://' + platformIp + '/search', true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onload = function(e) {
                    var platformResp = JSON.parse(xhr.responseText);
                    console.log(platformResp);
                    if ((xhr.readyState === 4) && (xhr.status === 200)) {
                        console.log(platformResp);
                        xhr.open('POST', 'http://' + myIp + '/device', true);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.onload = function(e) {
                            if ((xhr.readyState === 4) && (xhr.status === 200)) {
                                console.log(true);
                            }
                        };
                        xhr.onerror = function(e) {
                            console.error(xhr.statusText + e);
                        };
                        xhr.send(JSON.stringify(platformResp));
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

function change(hardware) {
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
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            console.log(xhr.responseText);
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj));
}

function poling() {
    // setInterval(() => {
    var obj = header();
    xhr.open('POST', 'http://' + platformIp + '/info', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            console.log(xhr.responseText);
            createForm(xhr.responseText);
            $('#platform-name').text(platformName);
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj));
    // }, 2000);
}
// HACKEr-123

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