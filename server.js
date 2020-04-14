const PORT = 2399;
const HOST = '127.0.0.1';
const SerialPort = require('serialport');
const parser = require('./parser');
const port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200
})
let usb = {}
let thbresult = '';
let timer

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('listening', function() {
    const address = server.address();
    console.log('UDP Server listening on ' + address.address + ':' + address.port);
});

const who = () => {
    port.write('RMX.WHOIS\r\n', (err) => {
        if (err) {
            return console.log('Error on write: ', err.message)
        }
        if (usb.payload) {
            clearInterval(timer)
            console.log('clear')
        }
        console.log('whois')

    })
}

port.on('open', () => {
    console.log('oopen')
    timer = setInterval(() => {
       who(usb)
    }, 1000)

    setInterval(() => {

        port.write('THB.CURR\r\n', function(err) {
            if (err) {
                return console.log('Error on write: ', err.message)
            }
            console.log('message written')
        })
    }, 1000)
})
port.on('data', function (data) {
    // console.log('Data:', data.toString())
    // if (!usb.payload) {
    //     who(usb)
    //     console.log(usb)
    // }
    if (data.toString().startsWith('RMX.WHOIS') && data.toString().endsWith('STS=OK>\r\n')) {
        const dataTostring = parser(data.toString());
        // console.log(dataTostring)
        usb.payload = dataTostring[1].payload
    }
    if (data.toString().startsWith('THB.CURR') && data.toString().endsWith('STS=OK>\r\n')) {
        // thbresult=parser(dataTostring)
        const dataTostring = parser(data.toString());
        // if(dataTostring[1].payload[1] && dataTostring[1].payload[1].COMMAND === 'RMX.WHOIS') console.log(dataTostring)
        thbresult = '';
            // console.log(dataTostring)
        if (dataTostring[1].payload) {

            for (let elem in dataTostring[1].payload) {
                if (elem !== 'COMMAND' && elem !== 'STS' && elem !== 'STAT')
                thbresult += dataTostring[1].payload[elem] +';'

            }
            thbresult += '\r\n'
        }
    }
})

server.on('message', function(message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    if (message === "GOD") {


        server.send(JSON.stringify(usb), remote.port, remote.address, (err) => {
            if (err) {
                server.close();
            } else {
                console.log('Data sent !!!');
            }

        })
    } else {
        console.log('fffff')
    }
});

server.bind(PORT);