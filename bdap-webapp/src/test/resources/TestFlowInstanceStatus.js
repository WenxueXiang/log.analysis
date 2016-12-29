var wsUri = "ws://127.0.0.1/dashview/ws/dbadmin/flow/instances/0000000-161229111519789-oozie-play-W";
  var i = 0;
  var closed = false;

  function testWebSocket()
  {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
    while (!closed)
    	java.lang.Thread.sleep(100);
  }

  function onOpen(evt)
  {
    writeToScreen("CONNECTED");
    doSend("{\"startLine\": 0, \"endLine\": 10}");
  }

  function onClose(evt)
  {
    writeToScreen("DISCONNECTED");
    closed = true;
  }

  function onMessage(evt)
  {
    writeToScreen('RESPONSE: ' + evt);
    if (i > 10) {
    	websocket.close();
    }
	i++;
  }

  function onError(evt)
  {
    writeToScreen(evt);
  }

  function doSend(message)
  {
    writeToScreen("SENT: " + message);
    websocket.send(message);
  }

  function writeToScreen(message)
  {
    print(message);
  }

  testWebSocket();
