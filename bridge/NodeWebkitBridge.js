var gui = require('nw.gui');
var win = gui.Window.get();
var appId = gui.App.argv[0];
var port = gui.App.argv[1];
var net = require('net');
var client = new net.Socket();


// AS3 to JS
client.on('data', function(data) 
{
    // convert to string, for bug
    var a = String.fromCharCode.apply(null, new Uint16Array(data));
    console.log(a);

    try {
        var json = JSON.parse(data);
    } catch (e) {
        console.log('err ' + e);
    }

    // show all events
    // alert(json.fnc);
    var fnc = window[json.fnc];
    fnc(json.data);
    
});
    

// AS3 to JS
function updateDisplay(i_data)
{
  win.x = i_data.x;
  win.y = i_data.y;
  win.width = i_data.width;
  win.height = i_data.height;
  win.setAlwaysOnTop(true);


  var ret = new Object();
  ret.fnc = "returnUpdateDisplay";
  client.write(JSON.stringify(ret));
}


// AS3 to JS
function killApp(i_data)
{
  dispose();
  win.close(true);
}

function setVisible(i_data)
{
  if (i_data)
    win.show();
  else
    win.hide();
}


var fncIndex = 0;
var callbackMap = {};


function getObjectValue(i_handle, i_key, i_callback)
{
  fncIndex++;
  callbackMap[fncIndex] = i_callback;

  var call = new Object();
  call.fnc = "getObjectValue";
  call.handle = i_handle;
  call.key = i_key; 
  call.callback = fncIndex;
  client.write(JSON.stringify(call));
}


function getObjectHandle(i_handle, i_key, i_callback)
{
  fncIndex++;
  callbackMap[fncIndex] = i_callback;

  var call = new Object();
  call.fnc = "getObjectHandle";
  call.handle = i_handle;
  call.key = i_key; 
  call.callback = fncIndex;
  client.write(JSON.stringify(call));
}



// AS3 to JS
function callback(i_data)
{
  callbackMap[i_data.fncIndex](i_data.data);
  delete callbackMap[i_data.fncIndex];
}




client.connect(port, '192.168.81.128', function()
{
    client.write('{"appId":"' + appId + '"}');
});
