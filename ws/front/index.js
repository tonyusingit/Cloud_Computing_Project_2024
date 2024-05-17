import './assets/js/stomp.js';

var stomp_client; 
var SUBSCRIPTION;
var DESTINATION;


function onMessageReceived(payload) {
    console.log('Message Received');
    console.log(payload.body);

    $(".test").append(`<p>${payload.body}</p>`);
};


const openSocket = (ws_url, destination) => {
    stomp_client = Stomp.client(`ws://${ws_url}/ws`);

    var connect_callback = function() {
        console.log('STOMP Socket connected');
        SUBSCRIPTION = stomp_client.subscribe(destination, response => onMessageReceived(response));
        
        $(".conn").text(`${destination} connected.`)

        DESTINATION = destination;
    };

    var error_callback = function(error) {
        console.log('STOMP Socket cannot connected');
        console.log(error.headers?.message);
    };

    let connectHeader = {};
    stomp_client.connect(connectHeader, connect_callback, error_callback);

};

const sendSocket = (msg) => {
    var headers = {};
    var body = msg;
    stomp_client.send(DESTINATION, headers, body);
}

const closeSocket = () => {
    stomp_client.unsubscribe(SUBSCRIPTION);

    var disconnect_callback = function() {
        console.log("STOMP Socket disconnected");
        $(".conn").text(`nothing connected.`)
    }

    stomp_client.disconnect(disconnect_callback);
}







$(".create").on('click', function(){
    const xhr = new XMLHttpRequest();
    const server_url = "http://127.0.0.1:5000";
    xhr.open("POST", server_url+"/room/create", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    const room_id = "12345";
    const nickname = "hong_gil_dong";

    const body = JSON.stringify({
        room_id: room_id,
        name: nickname
    });

    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response_text = JSON.parse(xhr.responseText);
            console.log(`url: ${response_text.ws_url}`);
            console.log(`dest: ${response_text.ws_destination}`);
            // openSocket(response_text.ws_url, response_text.ws_destination);
            
        } else {
            console.log(`Error: ${xhr.responseText}`);
        }
    };

    xhr.send(body);
});

$(".enter").on('click', function(){
    const xhr = new XMLHttpRequest();
    const server_url = "http://127.0.0.1:5000";
    xhr.open("POST", server_url+"/room/enter", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    const room_id = "12345";
    const nickname = "hong_gil_dong";

    const body = JSON.stringify({
        room_id: room_id,
        name: nickname
    });

    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response_text = JSON.parse(xhr.responseText);
            console.log(response_text)
            console.log(`url: ${response_text.ws_url}`);
            console.log(`dest: ${response_text.ws_destination}`);
            // openSocket("ws://127.0.0.1:15674/ws", "/topic/12345");
            openSocket(response_text.ws_url, response_text.ws_destination);
            
        } else {
            console.log(`Error: ${xhr.responseText}`);
        }
    };

    xhr.send(body);

});

$(".out").on('click', function(){
    closeSocket();
});

$(".send").on('click', function(){
    var msg = $('.msg').val();
    sendSocket(msg);
});

$(".send_s").on('click', function(){
    const xhr = new XMLHttpRequest();
    const server_url = "http://127.0.0.1:5000";
    xhr.open("GET", server_url+"/room/send_msg", true);

    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response_text = JSON.parse(xhr.responseText);
            
        } else {
            console.log(`Error: ${xhr.responseText}`);
        }
    };

    xhr.send();
});


