var IN, LOG1, LOG2, ROW1, ROW2;

var MBIT = MBITBLE;
var UART = {};

var connected_mbit = function() { };
var disconnected_mbit = function() { };

async function sleep(ms) {
	await new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function connect_mbit() {
	MBIT.LOG = function (s) {
		log1(s);
	};
	MBIT.LOG2 = MBIT.LOG;
	MBIT.disconnected = function () {
		disconnected_mbit();
	};
	UART["TX"] = function(event) {
		let raw = UART.text(event);
		raw = raw.replace(/\r/g, "\n");
		if(raw == "") return;
		let d = raw.split("\n");
		for(let i=0; i<d.length; i++) {
			if(d[i] == null || d[i] == "") {
				continue;
			}
			log1(d[i]);
		}
	};
	log1('connect("UART", UART)');
	try {
		await MBIT.connect("UART", UART);
		await sleep(100);
		if(MBIT._device != null) {
			connected_mbit();
		}
	} catch (e) {
		log1("" + e);
	}
};


