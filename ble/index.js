var IN;
var max_no = 0;
var R = 0, G = 0, B = 0;
var C = 0, A = 0;
var T0 = T1 = 0;
  
document.addEventListener("DOMContentLoaded", () => {
	IN = document.getElementById('in');
	LOG1 = document.getElementById('log1');
	LOG2 = document.getElementById('log2');
	IN.value = "";
	log_clear();
	IN.addEventListener('keydown', async (e) => {
		if (e.key === 'Enter') {
			let t = IN.value;
			IN.value = "";
			if(t != "") {
				RX(parseInt(t.trim(), 16), "");
			}
		}
	});
	connected_mbit = function() {
		let m0 = document.getElementById('m0');
		let m1 = document.getElementById('m1');
		let c1 = document.getElementById('ctl');
		m0.style.display = 'none';
		m1.style.display = 'inline-block';
		c1.style.display = 'inline-block';
	};
	disconnected_mbit = function() {
		C = -1;
		IN.value = "";
		let m0 = document.getElementById('m0');
		let m1 = document.getElementById('m1');
		let c1 = document.getElementById('ctl');
		m1.style.display = 'set_none';
		m0.style.display = 'inline-block';
		c1.style.display = 'set_none';
	};
	let t = "<table border=0>";
	for(let i=0; i<define.length; i++) {
		let e = define[i];
		let rr = e.rgb.charAt(0); rr = rr + rr; 
		let gg = e.rgb.charAt(1); gg = gg + gg;
		let bb = e.rgb.charAt(2); bb = bb + bb;
		t += "<tr><td nowrap width='1%'>" + e.name + "</td>";
		t += "<td nowrap width=32px>" + "<input id=e" + i + " disabled type=color value='#" + rr + gg + bb + "'>" + "</td>";
		t += "<td nowrap width=32px id=a" + i + ">" + "&nbsp;" + "</td></tr>";
		for(let j=0; j<e.led.length; j++) {
			max_no = Math.max(max_no, e.led[j]);
		}
	}
	t += "</table>";
	document.getElementById('led').innerHTML = t;
});

function hex(n) {
	return ('0' + n.toString(16)).slice(-2).toUpperCase();
}

async function RX(t, m) {
	if(C < 0) return;
	if(m != "") m = " (" + m + ")"
	log2("RX:" + hex(t) + m);
	if(C < 0) return;
	await UART.write_text("RX", "" + t + "\n");
}

async function set_show(show) {
	await RX(0x50 + show, (show == 1)? "show" : ((show == 0)? "none" : "" + show));
}
async function set_max(max) {
	await RX(0x80 + (max - 1), "max=" + max);
}
async function set_ani(a) {
	if(A != a) { A = a; await RX(0x51 + a, "ani=" + a); }
}
async function set_time(t1, t0) {
	if(T1 != t1) { T1 = t1; await RX(0x60 + T1, "T1=" + T1); }
	if(T0 != t0) { T0 = t0; await RX(0x70 + T0, "T0=" + T0); }
}
async function set_rgb(rgb) {
	let rr = parseInt(rgb.charAt(0), 16);
	let gg = parseInt(rgb.charAt(1), 16);
	let bb = parseInt(rgb.charAt(2), 16);
	if(R != rr) { R = rr; await RX(0x10 + R, "R=" + R); }
	if(G != gg) { G = gg; await RX(0x20 + G, "G=" + G); }
	if(B != bb) { B = bb; await RX(0x30 + B, "B=" + B); }
}

async function led_rgb(i) {
	if(C < 0) return;
	let e = define[i];
	await set_rgb(e.rgb);
	for(let j=0; j<e.led.length; j++) {
		await RX(0xa0 + e.led[j], e.name);
	}
}
async function led_ani(i, a) {
	if(C < 0) return;
	await set_ani(a - 1);
	let e = define[i];
	for(let j=0; j<e.led.length; j++) {
		if(C < 0) return;
		await RX(0xc0 + e.led[j], e.name);
	}
}

async function anime(a) {
	if(a == 0 || a == 1 || a == 15) {
		for(let i=0; i<define.length; i++) {
			document.getElementById('a' + i).innerHTML = "<span class=ani" + a + " />";
		}
		A = 0;
		await set_show(a);
	} else if(a == 15) {
		await set_show(15);
	} else {
		for(let i=0; i<define.length; i++) {
			document.getElementById('a' + i).innerHTML = "<span class=ani" + (a + 1) + " />";
		}
		await set_show(1);
		for(let i=0; i<define.length; i++) {
			await led_ani(i, a);
		}
		await set_show(15);
	}
}
async function connect() {
	log_clear();
	await connect_mbit();
	if(document.getElementById('m1').style.display == 'inline-block') {
		for(let i=0; i<define.length; i++) {
			document.getElementById('a' + i).innerHTML = "<span class=ani1 />";
		}
		await set_max(max_no);
		for(let i=0; i<define.length; i++) { await led_rgb(i); }
		await set_show(1);
	}
}
async function disconnect() {
	await disconnectBLE();
}
