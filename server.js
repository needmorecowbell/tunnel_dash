var express = require('express'); 
var auth = require('http-auth');
const basic = auth.basic({
  realm: "Private.",
  file: __dirname + "/htpasswd" 
});

var fs = require('fs');

const tpl_devices = ([device,info]) => 
`<div class="device-container">
<p class="device-name ${info.status}">Device: ${device}</p>
<p class="status">Status: ${info.status}</p>
<p class="last-online">Last Connection:<br>${info.last_online}</p>
</div>`;

const timeout="<script>setTimeout(location.reload.bind(location), 15000);</script>"

const css = `<style>
.device-container {
    background-color: #d9d9d9;
    max-width: fit-content;
    margin: 1em;
}
.online{
    background-color: #9ff288 !important; 
}

.device-name{
    background-color: #f79191;
}
</style>`;

var server = express();

server.use('/tunnels',basic.check((req,res) =>{
    var content = [];
    let raw = fs.readFileSync('status.json');
    let tunnelStatus = JSON.parse(raw);
    Object.entries(tunnelStatus).forEach(([device,info]) => {
        content.push(tpl_devices(([device,info])));
    });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><head>'+timeout+css+'</head><body>'+content.join('')+'</body></html>');
    res.end();
}));

server.listen(6963, () =>{
    console.log('Node.js web server at port 6963 is running..');
});
