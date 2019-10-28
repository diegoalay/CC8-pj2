var xhr = new XMLHttpRequest();
var myIp = 'localhost';

function createPlatform(platforms) {
    platforms = JSON.parse(platforms);
    var tableRef = document.getElementById("IpHardware").getElementsByTagName('tbody')[0];
    var objTo = document.getElementById('platform-list');
    var i = 1; 
    for (key in platforms) {
        var name = platforms[key].name;
        var role = platforms[key].role;
        var url = platforms[key].url;
        text = `<tr>`;
        text += `<td>`;
        text +=   `${name}`;
        text += `</td>`;
        text += `<td>`;
        text +=   `${url}`;
        text += `</td>`;
        text += `<td>`;
        if(role == 0) text +=   `<button class="pd-setting">PRPIA</button>`;
        else text += `<button class="ps-setting">EXTERNA</button>`;
        text += `</td>`;
        text += `<td>`;
        text +=    `<button data-toggle="tooltip"  onClick="editPlatform(\'` + name + `\',\'` + url + `\',\'` + role + `\',this)"  title="Edit" class="pd-setting-ed"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>`;
        text    += `<button data-toggle="tooltip" onClick="deletePlatform(` + i + `,this)" title="Trash" class="pd-setting-ed"><i class="fa fa-trash-o" aria-hidden="true"></i></button>`;
        text += `</td>`;
        text += `</tr>`;
        newRow = tableRef.insertRow(tableRef.rows.length);
        newRow.innerHTML = text;
        i++;
    }
}

function editPlatform(name, url, role, element) {
    
}

function deletePlatform(index,element){
    var row = element.parentElement.parentElement;
    var index = $('table tr').index(row);
    document.getElementById("IpHardwarse").deleteRow(index);
}

function poling() {
    // setInterval(() => {
    xhr.open('GET', 'http://' + myIp + '/platforms/list', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            createPlatform(xhr.responseText);
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText + e);
    };
    xhr.send();
    // }, 2000);
}


document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        poling();
    }
};