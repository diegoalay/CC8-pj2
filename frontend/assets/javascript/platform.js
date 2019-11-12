var xhr = new XMLHttpRequest();
var myIp = 'localhost';
let myName = "greenhouse";
let start_day;
let end_day;

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
    console.log(jsonObj)
    var data = jsonObj.hardware;
    for (var key in data) {
        obj = data[key];
        // console.log(obj);
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

        idSelect = document.getElementById('id_hardware_date');
        optionSelect = document.createElement('option');
        optionSelect.setAttribute('value', `${key}`);
        optionSelect.innerHTML = `${key}`;
        idSelect.appendChild(optionSelect);


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
            inputFreq.setAttribute('id', `${key}-freq`);
            inputFreq.setAttribute('required', `true`);
            formGroup2.appendChild(labelFreq);
            formGroup2.appendChild(inputFreq);
            form1.appendChild(formGroup2);

            saveButton = document.createElement("button");
            saveButton.setAttribute('type', 'button');
            saveButton.setAttribute('class', 'botonEvento');

            onClick = "deletePlatform(\'` + id + `\',this)"
            saveButton.setAttribute('onclick', `sendChange(\'` + key + `\', \'` + obj.type + `\')`);
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
            inputText.setAttribute('id', `${key}-text`);
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
            inputStatus.setAttribute('id', `${key}-status`);
            inputStatus.setAttribute('required', `true`);
            formGroup5.appendChild(labelStatus);
            formGroup5.appendChild(inputStatus);
            form1.appendChild(formGroup5);



            saveButton = document.createElement("button");
            saveButton.setAttribute('type', 'button');
            saveButton.setAttribute('class', 'botonEvento');
            saveButton.setAttribute('onclick', `sendChange('${key}', '${obj.type}', this)`);
            saveButton.innerHTML = "Guardar";

            form1.appendChild(saveButton);

            document.getElementById(`form-${key}`).appendChild(form1);
        }
    }
}

function correctFormat(type, val) {
    try {
        if (type == `text`) {
            return val;
        } else if (type == `status`) {
            if (val === `true` || val === `1` || val === 1) return true;
            else return false;
        } else {
            return parseFloat(val);
        }
    } catch (e) {
        return `invalid format`;
    }
}

function sendChange(id, type) {
    var obj = header();
    let send = false;
    obj.change = {};
    if (type == `input`) {
        freq = document.getElementById(`${id}-freq`);
        freqVal = freq.value;
        if (freq != "") {
            obj.change[id] = {
                freq: correctFormat(`freq`, freqVal),
            }
            send = true;
            freq.value = ``;
        }
    } else {
        text = document.getElementById(`${id}-text`);
        textVal = text.value;
        if (textVal != "") {
            obj.change[id] = {
                text: correctFormat(`text`, textVal),
            }
            send = true;
        }

        var statusValor = document.getElementById(`${id}-status`).value;
        if (statusValor != "") {
            obj.change[id] = {
                status: correctFormat(`status`, statusValor),
            }
            send = true;
        }
        text.value = ``;
        status.value = ``;
    }
    if (send == true) {
        xhr.open('POST', 'http://' + platformIp + '/change', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function(e) {
            if ((xhr.readyState === 4) && (xhr.status === 200)) {
                var response = JSON.parse(xhr.responseText);
                alert(response.status);
            }
        };
        xhr.onerror = function(e) {
            console.error(xhr.statusText + e);
        };
        xhr.send(JSON.stringify(obj));
    } else {
        alert(`Complete los valores`);
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

function graphic(jsonObj) {
    let labels = [];
    let data = []
    for (key in jsonObj) {
        labels.push(key);
        data.push(jsonObj[key].sensor);
    }

    var ctx = document.getElementById('myChart').getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'line',
        backgroundColor: '#fff',
        data: {
            labels: labels,
            borderColor: "#fffff",
            datasets: [{
                label: 'Sensor vs Fecha',
                data: data,
                borderColor: "#000",
                borderWidth: "1",
                hoverBorderColor: "#000",
                backgroundColor: [
                    "#6970d5"
                ],
                fill: false,
            }],
            options: {
                responsive: true,
            }
        },
    });

    var charTxt = document.getElementById('chartText');

    var textData = {
        label: 'Text in devices',
        data: [10, 53, 14],
        borderWidth: 2,
        hoverBorderWidth: 0
    };

    var chartText = new Chart(charTxt, {
        type: 'horizontalBar',
        data: {
            labels: ["text1", "text2", "text3"],
            datasets: [textData],
        }
    });

    var charStats = document.getElementById('chartStatus');

    var statusData = {
        label: 'Status in devices',
        data: [10, 53, 14],
        borderWidth: 2,
        hoverBorderWidth: 0
    };

    var chartStatus = new Chart(charStats, {
        type: 'horizontalBar',
        data: {
            labels: ["status1", "status2", "status3"],
            datasets: [statusData],
        }
    });
}

function localeDate() {
    const nDate = new Date().toLocaleString('en-US', {
        timeZone: 'America/Guatemala'
    });
    console.log(nDate);
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

function search(hardware, startDate, finishDate) {
    //buscamos en cache primero
    let pending = false;
    let obj = header();
    obj.search = {};
    obj.search['id_hardware'] = hardware;
    obj.search['start_date'] = (startDate);
    obj.search['finish_date'] = (finishDate);
    xhr.open('POST', 'http://' + myIp + '/search/', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        var frontResp = JSON.parse(xhr.responseText);
        let pendingData = false;
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            var length = Object.keys(frontResp.data).length;
            if (length > 0) {
                if (new Date(frontResp.start) > new Date(startDate) && new Date(frontResp.finish) >= new Date(finishDate)) {
                    pending = new Date(new Date(frontResp.start).getTime());
                    pending = pending.setHours(pending.getHours() - 6);
                    finishDate = ISODateString(pending);
                    startDate = ISODateString(new Date(startDate));
                    console.log('pedir el resto izquierda: ' + startDate + ' - ' + finishDate);
                    pendingData = true;
                } else if (new Date(frontResp.start) >= new Date(startDate) && new Date(frontResp.finish) < new Date(finishDate)) {
                    let pending = new Date(new Date(frontResp.finish).getTime() + (new Date(finishDate).getTime() - new Date(frontResp.finish).getTime()));
                    pending = pending.setHours(pending.getHours() - 6);
                    finishDate = ISODateString(new Date(pending));
                    startDate = ISODateString(new Date(frontResp.finish));
                    console.log('pedir el resto derecha: ' + new Date(frontResp.finish) + '-' + pending);
                    pendingData = true;
                } else if (new Date(frontResp.start) <= new Date(startDate) && new Date(frontResp.finish) >= new Date(finishDate)) {
                    console.log('todo en cache');
                } else {
                    console.log('pedir todo 1');
                    pendingData = true;
                }
            } else {
                pendingData = true;
                startDate = ISODateString(new Date(startDate));
                finishDate = ISODateString(new Date(finishDate));
                console.log('pedir todo 2');
            }
            console.log(obj);
            let data = frontResp.data;
            if (pendingData) {
                obj.search['id_hardware'] = hardware;
                obj.search['start_date'] = startDate;
                xhr.open('POST', 'http://' + platformIp + '/search/', true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onload = function(e) {
                    console.log(xhr.responseText);
                    var platformResp = JSON.parse(xhr.responseText);
                    // console.log(platformResp);
                    obj.data = platformResp.data
                    if ((xhr.readyState === 4) && (xhr.status === 200)) {
                        xhr.open('POST', 'http://' + myIp + '/device', true);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.onload = function(e) {
                            if ((xhr.readyState === 4) && (xhr.status === 200)) {
                                for (key in platformResp.data) {
                                    data[key] = platformResp.data[key];
                                }
                                graphic(data);
                            }
                        };
                        xhr.onerror = function(e) {
                            console.error(xhr.statusText + e);
                        };
                        xhr.send(JSON.stringify(obj));
                    }
                };
                xhr.onerror = function(e) {
                    console.error(xhr.statusText + e);
                };
                xhr.send(JSON.stringify(obj));
            } else {
                graphic(data);
            }
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(JSON.stringify(obj));
}

function change(hardware) {
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
}

function searchChart() {
    var input = document.getElementById(`id_hardware_date`).value;
    if (input == `default`) {
        alert(`Seleccione un dispositivo`);
    } else {
        search(input, start_day, end_day);
    }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        var url = new URL(window.location.href);
        platformName = url.searchParams.get("name");
        platformIp = url.searchParams.get("url");
        poling();

        start_day = new Date(moment().startOf('day')).toISOString();
        end_day = new Date(moment().endOf('day')).toISOString();

        document.getElementById(`id_hardware_date`).addEventListener(`change`, function() {
            searchChart();
        });

        $(function() {
            $('input[name="daterange"]').daterangepicker({
                opens: "left",
                drops: "down",
                startDate: moment(),
                ranges: {
                    'Hoy': [moment(), moment()],
                    'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
                    'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                    'Este mes': [moment().startOf('month'), moment().endOf('month')],
                    'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
            }, function(start, end, label) {
                start_day = new Date(start.startOf('day')).toISOString();
                end_day = moment(end.endOf('day')).format("YYYY-MM-DDTHH:mm:ss.SSSZZ");
                searchChart();
            });
        });
    }
};