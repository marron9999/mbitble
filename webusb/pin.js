var PIN_NO = [0,1,2,8
//,13,14,15,16
];
var PIN_VOL = [];
var PIN_SEL = [];
var PIN_ANI = [];
var MBIT= [0, 0];
var VOL = 0;

async function connectPIN(msg) {
	if(port == null) {
		OP(msg);
		return;
	}
	LOG("Connected");
	E("connect").style.display = "none";
	E("disconnect").style.display = "inline-block";
	let n = "#," + VOL + "," + ANIs[ANI][0];
	OP(n);
	n = "";
	for(let x = 0; x < 4; x++) {
		n = PIN_NO[x]
			+ "," + PIN_VOL[x]
			+ "," + ANIs[PIN_ANI[x]][0];
		OP(n);
	}
}

async function initPIN() {
	let h="<table>";
	for(let x = 0; x < PIN_NO.length; x++) {
		h += "<tr><td><div id=p" + x
			+ " onclick=clickPIN(this)>P" + PIN_NO[x]
			+ "</div></td><td><span id=t" + x
			+ ">0</span></td><td><div id=i" + x
			+ "></div></td></tr>";
		PIN_VOL[x] = 0;
		PIN_ANI[x] = 0;
		PIN_SEL[x] = 0;
	}
	h += "</table>";
	let p = E("pin");
	p.innerHTML = h;
	PIN_SEL[0] = 1;
	for(x = 0; x < PIN_NO.length; x++) {
		p = E("p" + x);
		p.innerHTML = "<span id=n" + x + ">P" + PIN_NO[x] + "</span><span id=b" + x + " style='width:0px;'></span>";
		p = E("t" + x);
		p.innerHTML = parseInt(VOL * 100/ 1023) + "%";
	}
	await setPIN();
}

async function clickPIN(e) {
	let x = parseInt(e.id.charAt(1));
	if(PIN_SEL[x] == 1) {
		PIN_SEL[x] = 0;
	} else {
		PIN_SEL[x] = 1;
	}
	await setPIN();
}

async function setPIN() {
	await _setPIN();
}

async function _setPIN() {
	if(port != null) {
		if(MBIT[0] != VOL
		|| MBIT[1] != ANI
		) {
			MBIT[0] = VOL;
			MBIT[1] = ANI
			OP("#," + VOL + "," + ANIs[ANI][0]);
		}
	}
	let n = "";
	let m = 0;
	for(let x = 0; x < PIN_NO.length; x++) {
		p = E("p" + x);
		if(PIN_SEL[x] == 0) {
			p.style.borderColor = "";
		} else {
			p.style.borderColor = "red";
			let u = false;
			if(PIN_VOL[x] != VOL) {
				PIN_VOL[x] = VOL;
				u = true;
			}
			if(PIN_ANI[x] != ANI) {
				PIN_ANI[x] = ANI;
				u = true;
			}
			if(u) {
				p = E("t" + x);
				p.innerHTML = parseInt(VOL * 100/ 1023) + "%";
				p = E("b" + x);
				p.style.width = parseInt(VOL * 116/ 1023) + "px";
				p = E("i" + x);
				if(ANI == 0) p.innerHTML = "";
				else p.innerHTML = "<img src=webusb/" + ANIs[ANI][1] + ".png>";
				if(port != null) {
					n += "," + PIN_NO[x];
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
	if(port != null) {
		if(n != "") {
			OP("=" + n);
		}
	}
}

async function changePIN(e) {
	VOL = e.value;
	setPIN();
}

function allPIN(n) {
	for(let x = 0; x < PIN_NO.length; x++) {
		PIN_SEL[x] = n;
	}
	setPIN();
}

