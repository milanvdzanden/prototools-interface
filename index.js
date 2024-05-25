var express = require('express');
var app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');

var socketConnected = false;
var socketClient = null;

var txBuffer = [];
var txAvailable = false;

io.on('connection', (socket) => {
  	console.log('[INFO] Client Connected');
  	socketClient = socket;
  	socketConnected = true;

	socket.on('update', (message) => {
		txBuffer = message;
		txAvailable = true;
	});
});

app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendFile('app.html', { root: __dirname } );
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

function bufferToHex(buffer){
  let hexString = buffer.map(byte => '0x' + byte.toString(16).padStart(2,'0'));
  return hexString.join(' ');
}

function bufferCompare(buffer1, buffer2, length) {
	for (var i = 0; i < length; i++){
		if (buffer1[i] != buffer2[i]) {
			return false;
		}
	}
	return true;
}

try {
	const i2c = require('i2c-bus');

	//const i2cBus = i2c.openSync(11); // Open I2C bus 1

	// Create an I2C slave and set the address

	const SLAVE_ADDR = 0x20;
	const BUF_SIZE = 4;

	let prevTime = 0;
	let prevBuffer;

	const rbuf = Buffer.alloc(BUF_SIZE);
	i2c.openPromisified(11).
	then(i2c11 => interval = setInterval(function(){
		i2c11.i2cRead(SLAVE_ADDR, rbuf.length, rbuf).then(data => {
			var input = data.buffer;
			if (socketConnected /*&& !bufferCompare(Array.from(new Uint8Array(input)), Array.from(new Uint8Array(prevBuffer)), BUF_SIZE)*/) { // dont print if it is the same state to save bandwidth

				if (!bufferCompare(Array.from(new Uint8Array(input)), Array.from(new Uint8Array(prevBuffer)), BUF_SIZE)) {
					fs.writeSync(0, (Math.round(performance.now()-prevTime)).toString()+'ms ');
					fs.writeSync(0,bufferToHex(data.buffer)+'\n')			
					socketClient.emit("module-updates", {input});
				}
				prevBuffer = [...input];
			}
			prevTime = performance.now();
		}).then(() => {
			if (txAvailable) {
				txAvailable = false;
				i2c11.i2cWrite(0x20, 1, Buffer.from([txBuffer.length])).then(() => { // send the number of bytes that the stm32 should expect
					// if that message arrives send the buffer over
					for (var j = 0; j < Buffer.from(txBuffer).length; j++) {
						fs.writeSync(0, Buffer.from(txBuffer)[j].toString() + '\n');
					}
					i2c11.i2cWrite(0x20, txBuffer.length, Buffer.from(txBuffer)).then(() => { // send the buffer
						fs.writeSync(0,txBuffer.toString() + ' sent\n');
					}).catch(error => {fs.writeSync(0, error.toString())}); ; 
				}).catch(error => {fs.writeSync(0, error.toString())}); 
			}
		});
	},50));
} catch (err) {
	console.log("Failed to init I2C");
}