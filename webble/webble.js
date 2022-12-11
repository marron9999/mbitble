var online = null;

MBIT_BLE.notify = function (text) {
	text = text;
	LOG(text.trim());
};
MBIT_BLE.connected = function () {
	online = "online";
	connected();
};
MBIT_BLE.closed = function () {
	online = null;
};
connect = async function() {
	let h = E("log");
	h.innerHTML = "";
	logged = 0;
	await MBIT_BLE.connect();
}
disconnect = async function () {
	if(online != null) {
		LOG2("Disconnected");
		await MBIT_BLE.disconnect();
	}
	online = null;
	E("connect").style.display = "inline-block";
	E("disconnect").style.display = "none";
}
async function write(value) {
	if(online == null) return;
	await MBIT_BLE.write(value);
}
