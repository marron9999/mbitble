function E(id) {
	return document.getElementById(id);
}
var LOGMAX = 11;
var logged = 0;
function LOG(s) {
	let h = E("log");
	h.innerHTML += "<div>" + s + "</div>";
	logged++;
	if(logged > LOGMAX) {
		logged--;
		let i = h.innerHTML.indexOf("</div>");
		h.innerHTML = h.innerHTML.substr(i+6);
	}
}

var MBITBLE = {
	log: function (text) {
		LOG(text);
	},
	error: function (text) {
		LOG("Error:" + text);
	},

	connected: function () { },
	closed: function () { },
	notify: {},

	connect: async function (service) {
		this._function = {};
		try {
			await this.device(service);
			if (this._device != null) {
				for(let name in MBITUUID[service].SERVICE) {
					this._function[name] = null;
					try {
						if(this.notify[name] == undefined)
							this._function[name] = await this.characteristic(
								MBITUUID[service].SERVICE[name], name);
						else
							this._function[name] = await this.characteristic(
								MBITUUID[service].SERVICE[name], name, this.notify[name]);
					} catch(e) {
						// NONE;
					}
				}
				this._device.ongattserverdisconnected = this.device_closed;
				this._device.addEventListener("gattserverdisconnected", function () {
					MBITBLE.notify = {};
					MBITBLE.init();
					MBITBLE.closed();
					MBITBLE.log("Disconnected");
				});
				this.connected();
			}
			return;
		} catch (error) { this.error(error); }
		if (this._device != null)
			this._device.gatt.disconnect();
		this.init();
	},
	disconnect: function () {
		if (this._device == null) {
			this.error("disconnect: " + "device is null");
			return;
		}
		if (this._device == null) return;
		this._device.gatt.disconnect();
		this.init();
	},

	DEVICE_NAME: "BBC micro:bit",

	_service: null,
	_device: null,
	_server: null,
	_primary: null,
	_encoder: new TextEncoder('utf-8'),
	_decoder: new TextDecoder('utf-8'),
	_name: null,

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
		if (this._device == null) {
			this.error("write_text: " + "device is null");
			return;
		}
		if (this._function[name] == null) {
			this.error("write_text: " + name + " is ?");
			return;
		}
		try {
			let buffer = this._encoder.encode(text);
			await this._function[name].writeValue(buffer);
		} catch (error) {
			this.error(error);
		}
		return;
	},
	read_text: async function (event) {
		let text = this._decoder.decode(event.target.value.buffer);
		return text;
	},
	init: function () {
		this._device = null;
		this._server = null;
		this._primary = null;
		this._name = null;
		this._service = null;
	},

	characteristic: async function (uuid, desc, callback) {
		if (this._primary == null) {
			this.error("characteristic: " + "primary is null");
			return null;
		}
		try {
			let characteristic =
				await this._primary.getCharacteristic(uuid);
			this.log("characteristic: " + desc);
			if (characteristic != null
				&& callback != undefined
				&& callback != null) {
				characteristic.addEventListener("characteristicvaluechanged", callback);
				characteristic.startNotifications();
				this.log("+ notifications");
			}
			this.log(uuid);
			return characteristic;
		} catch (error) {
			this.error(error);
		}
		return null;
	},

	device: async function (service) {
		this.init();
		let option = {
			acceptAllDevices: false,
			filters: [
				{ services: [MBITUUID[service].UUID] }, // <- 重要
				{ namePrefix: this.DEVICE_NAME },
			]
		};
		try {
			let device = await navigator.bluetooth.requestDevice(option);
			let server = await device.gatt.connect();
			let primary = await server.getPrimaryService(MBITUUID[service].UUID);
			this.log(device.name);
			this.log(service + " Service");
			this.log(MBITUUID[service].UUID);
			this._service = service;
			this._device = device;
			this._name = this._device.name;
			this._server = server;
			this._primary = primary;
		} catch (error) {
			this.error(error);
		}
	},
};

async function disconnectBLE() {
	await MBITBLE.disconnect();
}

var connectBLE = async function () {
	initBLE();
}

var initBLE = async function () {
	logged = 0;
	E("log").innerHTML = "";
};
