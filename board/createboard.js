var sio = require('../common/sio.js');
var serverAddress = require('../common/settings.js').getAddress();
var port = 3001;

if (process.argv.length < 4){
    console.log('node createboard.js [modaddress] [threadserveraddress]');
    process.exit();
}

var mods = [process.argv[2]];
var threadServers = [process.argv[3]];

sio.sendPost(serverAddress + ':' + port, {
    title: 'Random',
    mods: mods,
    banners: [],
    fileFormats: ['jpg', 'png', 'gif'],
    threadServers: threadServers,
    admin: 'true',
    operation: 'new'
}, console.log);

