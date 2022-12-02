var MBIT_BLE = {
	log: function (text) {
		console.log("log:" + text);
	},
	trace: function (text) {
		console.log("trace:" + text);
	},
	error: function (text) {
		console.log("error:" + text);
	},
	connected: function () { },
	closed: function () { },
	notify: function (text) { },
	connect: async function () {
		try {
			await MBIT_BLE.device();
			MBIT_BLE._RX_Characteristic =
				await MBIT_BLE.characteristic(MBIT_BLE.RX_Characteristic, "RX Characteristic");
			MBIT_BLE._TX_Characteristic =
				await MBIT_BLE.characteristic(MBIT_BLE.TX_Characteristic, "TX Characteristic", MBIT_BLE.TX_notify);
			if (MBIT_BLE._device != null) {
				MBIT_BLE._device.ongattserverdisconnected = MBIT_BLE.device_closed;
				MBIT_BLE._device.addEventListener("gattserverdisconnected", function () {
					MBIT_BLE.init();
					MBIT_BLE.closed();
				});
				MBIT_BLE.connected();
			}
			return;
		} catch (error) { MBIT_BLE.error(error); }
		if (MBIT_BLE._device != null)
			MBIT_BLE._device.gatt.disconnect();
		MBIT_BLE.init();
	},
	disconnect: function () {
		if (MBIT_BLE._device == null) return;
		MBIT_BLE._device.gatt.disconnect();
		MBIT_BLE.init();
	},

	DEVICE_NAME: "BBC micro:bit",
	UART_SERVICE: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase(),
	TX_Characteristic: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase(),
	RX_Characteristic: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase(),

	_RX_Characteristic: null,
	_TX_Characteristic: null,
	_device: null,
	_server: null,
	_primary: null,
	_encoder: new TextEncoder('utf-8'),
	_decoder: new TextDecoder('utf-8'),
	_name: null,

	write: async function (text) {
		if (MBIT_BLE._RX_Characteristic == null) return;
		MBIT_BLE.trace(">" + text);
		try {
			let buffer = MBIT_BLE._encoder.encode(text + "\n");
			await MBIT_BLE._RX_Characteristic.writeValue(buffer);
		} catch (error) {
			MBIT_BLE.error(error);
		}
	},
	TX_notify: function (event) {
		let text = MBIT_BLE._decoder.decode(event.target.value.buffer);
		MBIT_BLE.trace("<" + text);
		MBIT_BLE.notify(text);
	},
	init: function () {
		MBIT_BLE._device = null;
		MBIT_BLE._server = null;
		MBIT_BLE._primary = null;
		MBIT_BLE._RX_Characteristic = null;
		MBIT_BLE._TX_Characteristic = null;
		MBIT_BLE._name = null;
	},

	characteristic: async function (uuid, desc, callback) {
		if (MBIT_BLE._primary == null) return null;
		try {
			let characteristic =
				await MBIT_BLE._primary.getCharacteristic(uuid);
			MBIT_BLE.log("+ " + desc);
			if (characteristic != null
				&& callback != undefined
				&& callback != null) {
				characteristic.addEventListener("characteristicvaluechanged", callback);
				characteristic.startNotifications();
			}
			return characteristic;
		} catch (error) { MBIT_BLE.error(error); }
		return null;
	},

	device: async function () {
		MBIT_BLE.init();
		let option = {
			acceptAllDevices: false,
			filters: [
				{ services: [MBIT_BLE.UART_SERVICE] }, // <- 重要
				{ namePrefix: MBIT_BLE.DEVICE_NAME },
			]
		};
		try {
			let device = await navigator.bluetooth.requestDevice(option);
			let server = await device.gatt.connect();
			let primary = await server.getPrimaryService(MBIT_BLE.UART_SERVICE);
			MBIT_BLE.log(device.name);
			MBIT_BLE.log("+ UART Service");
			MBIT_BLE._device = device;
			MBIT_BLE._name = MBIT_BLE._device.name;
			MBIT_BLE._server = server;
			MBIT_BLE._primary = primary;
		} catch (error) {
			MBIT_BLE.error(error);
		}
	},
};
