'use strict';
const socket = io();

socket.on('test', function(message) {
    alert(message);
});

$('#btnExit').on('click', function () {
    window.opener='Self';
    window.open('','_parent','');
    window.close();
});

