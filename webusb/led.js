var LED_XY = [];
var LED_RGB = [];
var LED_ANI = [];

var HSL = [0, 0, 0];
var RGB = [0, 0, 0];
var MBIT= [0, 0, 0, 0];

async function connectLED(msg) {
	if(online == null) {
		OP(msg);
		return;
	}
	LOG("Connected");
	E("connect").style.display = "none";
	E("disconnect").style.display = "inline-block";
	OP("@,25");
	for(let y = 0; y < 5; y++) {
		for(let x = 0; x < 5; x++) {
			p = E("" + y + x);
			if(LED_XY[y][x] == 0) {
				p.style.borderColor = "";
			} else {
				p.style.borderColor = "red";
			}
			p.style.backgroundColor =
				"rgb(" + LED_RGB[y][x][0] + "," + LED_RGB[y][x][1] + "," + LED_RGB[y][x][2] + ")";
		}
	}
	let n = "";
	let m = 0;
	OP("#,0,0,0,0");
	for(let y = 0; y < 5; y++) {
		for(let x = 0; x < 5; x++) {
			if(LED_RGB[y][x][0] == 0
			&& LED_RGB[y][x][1] == 0
			&& LED_RGB[y][x][2] == 0
			&& LED_ANI[y][x] == 0) {
				n += "," + (y * 5 + x);
				m++;
				if(m >= 5) {
					OP("=" + n);
					n = "";
					m = 0;
				}
			}
		}
	}
	if(n != "") {
		OP("=" + n);
	}
	n = "#," + RGB[0] + "," + RGB[1] + "," + RGB[2] + "," + ANIs[ANI][0];
	OP(n);
	n = "";
	m = 0;
	for(let y = 0; y < 5; y++) {
		for(let x = 0; x < 5; x++) {
			if(LED_RGB[y][x][0] == 0
			&& LED_RGB[y][x][1] == 0
			&& LED_RGB[y][x][2] == 0
			&& LED_ANI[y][x] == 0) {
				continue;
			}
			p = E("" + y + x);
			n = (y * 5 + x)
				+ "," + LED_RGB[y][x][0]
				+ "," + LED_RGB[y][x][1]
				+ "," + LED_RGB[y][x][2]
				+ "," + ANIs[LED_ANI[y][x]][0];
			OP(n);
		}
	}
}

function initLED() {
	let h = "";
	for(let y = 0; y < 5; y++) {
		let zs = [];
		let zv = [];
		let za = [];
		for(let x = 0; x < 5; x++) {
			h += "<div id=" + y + x + " onclick='clickLED(this)'></div>";
			zv.push([0,0,0]);
			zs.push(0);
			za.push(0);
		}
		h += "<br>";
		LED_RGB.push(zv);
		LED_ANI.push(za);
		LED_XY.push(zs);
	}
	//LED_XY[0][0] = 1;
	let p = E("led");
	p.innerHTML = h;
	h = loaddata("LED25_RGB");
	if(h != null) {
		LED_RGB = h;
		h = loaddata("LED25_ANI");
		LED_ANI = h;
	}
}

async function clickLED(e) {
	let y = parseInt(e.id.charAt(0));
	let x = parseInt(e.id.charAt(1));
	if(LED_XY[y][x] == 1) {
		LED_XY[y][x] = 0;
	} else {
		LED_XY[y][x] = 1;
	}
	await setLED();
}

async function setLED() {
	setRGB();
	if(online != null) {
		if(MBIT[0] != RGB[0]
		|| MBIT[1] != RGB[1]
		|| MBIT[2] != RGB[2]
		|| MBIT[3] != ANI
		) {
			MBIT[0] = RGB[0];
			MBIT[1] = RGB[1];
			MBIT[2] = RGB[2];
			MBIT[3] = ANI
		}
	}
	OP("#," + RGB[0] + "," + RGB[1] + "," + RGB[2] + "," + ANIs[ANI][0]);
	let n = "";
	let m = 0;
	let u = false;
	for(let y = 0; y < 5; y++) {
		for(let x = 0; x < 5; x++) {
			if(LED_XY[y][x] > 0) {
				if(LED_RGB[y][x][0] != RGB[0]) {
					LED_RGB[y][x][0] = RGB[0];
					u = true;
				}
				if(LED_RGB[y][x][1] != RGB[1]) {
					LED_RGB[y][x][1] = RGB[1];
					u = true;
				}
				if(LED_RGB[y][x][2] != RGB[2]) {
					LED_RGB[y][x][2] = RGB[2];
					u = true;
				}
				if(LED_ANI[y][x] != ANI) {
					LED_ANI[y][x] = ANI;
					u = true;
				}
			}
			if(LED_RGB[y][x][0] == 0
			&& LED_RGB[y][x][1] == 0
			&& LED_RGB[y][x][2] == 0
			&& LED_ANI[y][x] == 0) {
				continue;
			}
			if(LED_XY[y][x] == 0) {
				if(online != null) {
					let nn = (y * 5 + x)
						+ "," + LED_RGB[y][x][0]
						+ "," + LED_RGB[y][x][1]
						+ "," + LED_RGB[y][x][2]
						+ "," + ANIs[LED_ANI[y][x]][0];
					OP(nn);
				}
			} else {
				if(online != null) {
					n += "," + (y * 5 + x);
					m++;
					if(m >= 5) {
						OP("=" + n);
						n = "";
						m = 0;
					}
				}
			}
		}
	}
	if(u) {
		savedata("LED25_RGB", LED_RGB);
		savedata("LED25_ANI", LED_ANI);
	}
	if(online != null) {
		if(n != "") {
			OP("=" + n);
		}
		n = "";
		m = 0;
		OP("#,0,0,0,0");
		for(let y = 0; y < 5; y++) {
			for(let x = 0; x < 5; x++) {
				if(LED_RGB[y][x][0] == 0
				&& LED_RGB[y][x][1] == 0
				&& LED_RGB[y][x][2] == 0
				&& LED_ANI[y][x] == 0) {
					n += "," + (y * 5 + x);
					m++;
					if(m >= 5) {
						OP("=" + n);
						n = "";
						m = 0;
					}
				}
			}
		}
		if(n != "") {
			OP("=" + n);
		}
	}
	await _setLED();
}

async function _setLED() {
	let p = E("seli");
	p.innerHTML = "<img src=webusb/" + ANIs[ANI][1] + ".png>";
	p = E("selc");
	p.style.backgroundColor =
		"rgb(" + RGB[0] + "," + RGB[1] + "," + RGB[2] + ")";
	for(let y = 0; y < 5; y++) {
		for(let x = 0; x < 5; x++) {
			p = E("" + y + x);
			if(LED_XY[y][x] == 0) {
				p.style.borderColor = "";
			} else {
				p.style.borderColor = "red";
			}
			p.style.backgroundColor =
				"rgb(" + LED_RGB[y][x][0] + "," + LED_RGB[y][x][1] + "," + LED_RGB[y][x][2] + ")";
			if(LED_ANI[y][x] == 0) p.innerHTML = "";
			else p.innerHTML = "<img src=webusb/" + ANIs[LED_ANI[y][x]][1] + ".png>";
		}
	}
}

async function allLED(n) {
	for(let y = 0; y < 5; y++) {
		for(let x = 0; x < 5; x++) {
			LED_XY[y][x] = n;
		}
	}
	await _setLED();
}

async function _clickICON(i) {
	for(let y=0; y<5; y++) {
		for(let x=0; x<5; x++) {
			p = E("" + y + x);
			if(_icon[i][y][x] == 0) {
				LED_XY[y][x] = 0;
				LED_RGB[y][x][0] = 0;
				LED_RGB[y][x][1] = 0;
				LED_RGB[y][x][2] = 0;
				LED_ANI[y][x] = 0;
			} else {
				LED_XY[y][x] = 1;
				LED_RGB[y][x][0] = RGB[0];
				LED_RGB[y][x][1] = RGB[1];
				LED_RGB[y][x][2] = RGB[2];
				LED_ANI[y][x] = ANI;
			}
			p.style.backgroundColor =
				"rgb(" + LED_RGB[y][x][0] + "," + LED_RGB[y][x][1] + "," + LED_RGB[y][x][2] + ")";
			if(LED_ANI[y][x] == 0) p.innerHTML = "";
			else p.innerHTML = "<img src=webusb/" + ANIs[LED_ANI[y][x]][1] + ".png>";
		}
	}
	await setLED();
}

