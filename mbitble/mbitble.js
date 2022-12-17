function E(id) {
	return document.getElementById(id);
}
var LOGMAX = 11;
var logged = 0;
function LOG(s) {
	let e = E("log");
	if(e == null) return;
	e.innerHTML += "<div>" + s + "</div>";
	logged++;
	if(logged > LOGMAX) {
		logged--;
		let i = e.innerHTML.indexOf("</div>");
		e.innerHTML = e.innerHTML.substr(i+6);
	}
}

var MBITBLE = {
	log: function (text) { LOG(text); },
	error: function (text) { LOG("Error:" + text); },
	connected: function () { },
	disconnected: function () { },
	notify: {},

	connect: async function (service) {
		this._function = {};
		try {
			let option = {
				acceptAllDevices: false,
				filters: [
					{ services: [MBITUUID[service].UUID] }, // <- 重要
					{ namePrefix: this._device_type },
				]
			};
			try {
				this._device = await navigator.bluetooth.requestDevice(option);
				this._server = await this._device.gatt.connect();
				this._primary = await this._server.getPrimaryService(MBITUUID[service].UUID);
				this._device_name = this._device.name;
				this._service_name = service;
				this.log("Connected: " + this._device_name);
				this.log("Primary: " + this._service_name + " Service");
				this.log(MBITUUID[this._service_name].UUID);
			} catch (error) {
				this.init();
				this.error(error);
				return;
			}
			let characteristic = async function (uuid, desc, callback) {
				if (MBITBLE._primary == null) {
					MBITBLE.error("characteristic: " + "primary is null");
					return null;
				}
				try {
					let characteristic = await MBITBLE._primary.getCharacteristic(uuid);
					if (characteristic != null
					&& callback != undefined
					&& callback != null) {
						characteristic.addEventListener("characteristicvaluechanged", callback);
						characteristic.startNotifications();
						MBITBLE.log("Characteristic: " + desc + " + listener");
					} else {
						MBITBLE.log("Characteristic: " + desc);
					}
					MBITBLE.log(uuid);
					return characteristic;
				} catch (error) {
					MBITBLE.error(error);
				}
				return null;
			};
			for(let name in MBITUUID[service].SERVICE) {
				this._function[name] = await characteristic(
					MBITUUID[service].SERVICE[name], name,
					(this.notify[name] == undefined)? null : this.notify[name]);
			}
			this._device.ongattserverdisconnected = function() {
				MBITBLE.log("Disconnected"); 
				MBITBLE.init();
				MBITBLE.disconnected();
			};
			this.connected();
		} catch (error) {
			this.init();
			this.error(error);
		}
	},
	disconnect: function () {
		if (this._device == null) {
			this.error("disconnect: " + "device is null");
			return;
		}
		this._device.gatt.disconnect();
		this.init();
	},

	init: function () {
		this._device = null;
		this._server = null;
		this._primary = null;
		this._device_name = null;
		this._service_name = null;
		this._function = {};
	},

	_device_type: "BBC micro:bit",
	_device_name: null,
	_device: null,
	_service: null,
	_server: null,
	_primary: null,
	_encoder: new TextEncoder('utf-8'),
	_decoder: new TextDecoder('utf-8'),

	read_data: async function (name) {
		if (this._device == null) {
			this.error("read_data: " + "device is null");
			return null;
		}
		if (this._function[name] == null) {
			this.error("read_data: " + name + " is ?");
			return null;
		}
		try {
			return await this._function[name].readValue();
		} catch (error) {
			this.error(error);
		}
		return null;
	},
	read_text: async function (name) {
		let event = this.read_data(name);
		return this.text(event);
	},
	write_data: async function (name, data) {
		if (this._device == null) {
			this.error("write_data: " + "device is null");
			return;
		}
		if (this._function[name] == null) {
			this.error("write_data: " + name + " is ?");
			return;
		}
		try {
			await this._function[name].writeValue(data);
		} catch (error) {
			this.error(error);
		}
	},
	write_text: async function (name, text) {
		let buffer = this._encoder.encode(text);
		this.write_data(name, buffer);
	},
	text: function (event) {
		return this._decoder.decode(event.target.value);
	},
	int8: function (event, n) {
		return event.target.value.getInt8(n);
	},
	uint8: function (event, n) {
		return event.target.value.getUint8(n);
	},
	int16: function (event, n) {
		return event.target.value.getInt16(n);
	},
	uint16: function (event, n) {
		return event.target.value.getUint16(n);
	}
};

var disconnectBLE = async function () {
	await MBITBLE.disconnect();
}

var connectBLE = async function () {
	initBLE();
};
var initBLE = async function () {
	logged = 0;
	let e = E("log");
	if(h != null) e.innerHTML = "";
};
