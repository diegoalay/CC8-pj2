
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
  
  
  function header(){
        obj = {
            "id": myName,
            "url": myIp,
            "date": getTimeInFormat(),        
        }
        return obj;
  }
  
  function correctFormat(type, val){
      alert(val);
      alert(type);
      try{
          if(type == `text`){
              return val;
          }else if(type == `status`){
              if(val == `true`) return true;
              else return false;
          }else{
              return parseFloat(val);
          }
      }catch(e){
          alert(e);
          return `invalid format`;
      }
  }
  
  function generateCondition(key){
      var obj = {};
      obj[key] = {};
      //if
      if(ifIsDirty){
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
              right:{
                  [`${rightKey}`]: rightValue,
              }
          };
      }
  
      //then
      if(thenIsDirty){
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
      if(elseIsDirty){
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
  
  function createEvent(key){
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
  
  function getHardware(element){
      console.log(element)
  }
  
  function removeOptions(selectbox) {
      for(var i = selectbox.options.length - 1 ; i >= 1 ; i--){
          selectbox.remove(i);
      }
  }
  
  function appendHardware(url, selectName){
      jsonObj = infoData[url];
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
  
  function info(url){
      var obj = header();
      xhr.open('POST', 'http://' + url + '/info', true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function (e) {
          if ((xhr.readyState === 4) && (xhr.status === 200)) {
              var item = JSON.parse(xhr.responseText);
              infoData[url] = item;
          }
      };
      xhr.onerror = function (e) {
          console.error(xhr.statusText + e);
      };
      xhr.send(JSON.stringify(obj)); 
  }
  
  function appendPlatforms(json){
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
  
function getPlatforms(){
    xhr.open('GET', 'http://' + myIp + '/platforms/list', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function (e) {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
            appendPlatforms(xhr.responseText);
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText + e);
    };
    xhr.send(); 
}
  
document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        eventModal = $('#eventModal');
        getPlatforms();
        if(view == `event_list`) {
            poling();    
        }
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