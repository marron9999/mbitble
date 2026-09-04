var IN;
var max_no = 0;
var R = 0, G = 0, B = 0;
var ix = -1;
  
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
				log1("RX:" + t);
				t =  parseInt(t.trim(), 16);
				if(t != "") {
					await UART.write_text("RX", t + "\n");
				}
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
		ix = -1;
		IN.value = "";
		let m0 = document.getElementById('m0');
		let m1 = document.getElementById('m1');
		let c1 = document.getElementById('ctl');
		m1.style.display = 'none';
		m0.style.display = 'inline-block';
		c1.style.display = 'none';
	};
	let t = "<table border=0>";
	for(let i=0; i<define.length; i++) {
		let e = define[i];
		e.rr = [e.r];
		e.gg = [e.g];
		e.bb = [e.b];
		for(let j=1; j<16; j++) {
			e.rr[j] = e.rr[j - 1] - 16; if(e.rr[j] < 0) e.rr[j] = 0;
			e.gg[j] = e.gg[j - 1] - 16; if(e.gg[j] < 0) e.gg[j] = 0;
			e.bb[j] = e.bb[j - 1] - 16; if(e.bb[j] < 0) e.bb[j] = 0;
		}
		t += "<tr><td nowrap width='1%'>" + e.name + "</td>";
		let c = '0' + e.r.toString(16); c = c.substring(c.length - 2);		
		let rgb = c;		
		c = '0' + e.g.toString(16); c = c.substring(c.length - 2);		
		rgb += c;		
		c = '0' + e.b.toString(16); c = c.substring(c.length - 2);		
		rgb += c;		
		t += "<td nowrap>" + "<input id=e" + i + " disabled type=color value='#" + rgb + "' onchange='update(" + i + ")'>" + "</td>";
		t += "<td nowrap>" + "<input id=a" + i + " disabled type=color value='#" + rgb + "'>" + "</td></tr>";
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

function ani_led_color(i, k) {
	if(ix < 0) return;
	let e = define[i];
	let c = '0' + e.rr[k].toString(16); c = c.substring(c.length - 2);		
	let rgb = c;		
	c = '0' + e.gg[k].toString(16); c = c.substring(c.length - 2);		
	rgb += c;		
	c = '0' + e.bb[k].toString(16); c = c.substring(c.length - 2);		
	rgb += c;		
	document.getElementById('a' + i).value = "#" + rgb;
}
async function set_led_color(i, k) {
	if(ix < 0) return;
	let e = define[i];
	let t1 = hex(parseInt(e.rr[k] / 8) + 0x20);
	let t2 = hex(parseInt(e.gg[k] / 8) + 0x60);		
	let t3 = hex(parseInt(e.bb[k] / 8) + 0xa0);
	let t = "";
	for(let j=0; j<e.led.length; j++) {
		t += " " + hex(e.led[j] + 0xe0);
	}
	if(ix < 0) return;
	log2("RX:" + t1 + " " + t2 + " " + t3 + t + " (" + e.name + ")");

	let s = "";
	if(R != e.rr[k]) {
		R = e.rr[k];
		s = "" + parseInt(t1, 16);
		if(ix < 0) return;
		await UART.write_text("RX", s + "\n");
	}
	if(G != e.gg[k]) {
		G = e.gg[k];
		s = "" + parseInt(t2, 16);
		if(ix < 0) return;
		await UART.write_text("RX", s + "\n");
	}
	if(B != e.bb[k]) {
		B = e.bb[k];
		s = "" + parseInt(t3, 16);
		if(ix < 0) return;
		await UART.write_text("RX", s + "\n");
	}
	t = t.split(" ");
	for(let i=0; i<t.length; i++) {
		if(t[i] != "") {
			s = "" + parseInt(t[i], 16);
			if(ix < 0) return;
			await UART.write_text("RX", s + "\n");
		}
	}
}

async function update(i) {
	let e = event.srcElement;
	e = e.value;
	define[i].r = parseInt(e.substring(1, 3), 16);
	define[i].g = parseInt(e.substring(3, 5), 16);
	define[i].b = parseInt(e.substring(5, 7), 16);
	await set_led_color(i, 0);
}

async function setted() {
	let t  =  (max_no + 1) + 0xc0;
	if(ix < 0) return;
	log2("RX:" + hex(t) + " (Max:" + (max_no + 1) + ")");
	if(ix < 0) return;
	await UART.write_text("RX", "" + t + "\n");
}
async function none() {
	let t  =  0xc0;
	if(ix < 0) return;
	log2("RX:" + hex(t) + " (Max:" + 0 + ")");
	if(ix < 0) return;
	await UART.write_text("RX", "" + t + "\n");
}

async function connect() {
	log_clear();
	await connect_mbit();
	if(document.getElementById('m1').style.display == 'inline-block') {
		await high_light();
	}
}
async function high_light() {
	ix = define[0].rr.length;
	await setted();
	for(let i=0; i<define.length; i++) {
		await set_led_color(i, 0);
		document.getElementById('e' + i).disabled = '';
	}
	await setted();
}
async function off_light() {
	ix = define[0].rr.length;
	await none();
}
async function low_high() {
	ix = define[0].rr.length;
	await setted();
	setTimeout(animation, 1);
}

async function animation() {
	if(ix >= 0) {
		ix--;
		if(ix < 0) ix = define[0].rr.length - 1;
		for(let i=0; i<define.length; i++) {
			ani_led_color(i, ix);
		}
		for(let i=0; i<define.length; i++) {
			if(ix < 0) return;
			await set_led_color(i, ix);
		}
		if(ix < 0) return;
		await setted();
		setTimeout(animation, 1);
	}
}

async function disconnect() {
	await disconnectBLE();
}
