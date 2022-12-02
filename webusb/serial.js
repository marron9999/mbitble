var online /* port */ = null;
var writer = null;
var reader = null;
var speed = 100;
var buffer = [];
var onlineInfo = [];

async function open () {
	// Windows Microsoft USB Serial device
	// See: Device Manager -> online(COM & LPT)
	//      -> COMx -> Proterty -> Detail -> Hardware ID
	const filters = [
	  { usbVendorId: 0x0d28, usbProductId: 0x0204 }
	];
	//const online = await navigator.serial.requestonline();
	online = await navigator.serial.requestonline({ filters });
	if(online == null) {
		return "No device";
	}
	await online.open({ baudRate:9600,
		dataBits:8, stopBits:1,
		parity:"none", flowControl:"none"
		//,bufferSize:1024
		});
	onlineInfo = online.getInfo();
	if( ! online.readable ) {
		online = null;
		return "Not readable";
	}
	if( ! online.writable) {
		online = null;
		return "Not writable";
	}
	reader = online.readable.getReader();
	writer = online.writable.getWriter();
	buffer = [];
	//read();
	return null;
}

async function close() {
	if(online == null) return;
	reader.releaseLock();
	writer.releaseLock();
	online.close();
	online = null;
}

async function read() {
	let _online = online;
	const { value, done } = await reader.read();
	if (done) {
	    reader.releaseLock();
		online = null;
	} else {
		buffefr.push(value);
	}
	if(_online != null) {
		try { await reader.cancel(); } catch(e) {}
		try { await writer.abort(); } catch(e) {}
		reader.releaseLock();
		writer.releaseLock();
		setTimeout(async function() {
			await _online.close();
		}, 10);
	}
	setTimeout(read, 100);
}

async function write(value) {
	if(online == null) return;
	value = (new Uint8Array([].map.call(value, function(c) {
			return c.charCodeAt(0)
		}))).buffer;
	await writer.write(value + "\n");
}
