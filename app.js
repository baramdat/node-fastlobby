const express = require('express');

const app = express();
var server = require('http').createServer(app)

server.listen(80, () => {
    console.log('Server is running');
});

const { proxy, scriptUrl } = require('rtsp-relay')(app);

const handler = proxy({
    url: `rtsp://admin:troiano10!@68.195.234.210:3067/chID=2&streamType=main&linkType=tcp`,
    // if your RTSP stream need credentials, include them in the URL as above
    verbose: false,
    transport: 'tcp',
    additionalFlags: ['-q', '8']
});

// app.listen(2000, () => {
//     console.log('App is running');
// });

server.get("/url", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});

// the endpoint our RTSP uses
// app.ws('/api/stream', handler);
server.ws('/api/stream/:chID', (ws, req) =>
  proxy({
    url: `rtsp://admin:troiano10!@68.195.234.210:3067/chID=${req.params.chID}&streamType=main&linkType=tcp`,
    // if your RTSP stream need credentials, include them in the URL as above
    verbose: false,
    transport: 'tcp',
    additionalFlags: ['-q', '10']
  })(ws),
);

// this is an example html page to view the stream
server.get('/streaming/:chID', (req, res) =>
    res.send(`
    <canvas id='canvas' style="width:100%;height:100%"></canvas>

    <script src='${scriptUrl}'></script>
    <script>
        loadPlayer({
        url: 'ws://localhost:2000/api/stream/${req.params.chID}',
        canvas: document.getElementById('canvas')
        });
    </script>
    `),
);