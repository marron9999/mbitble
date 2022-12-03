//function E(selectors) {
//	let e = document.querySelector(selectors);
//	return e;	
//}
//function ES(selectors) {
//	let e = document.querySelectors(selectors);
//	return e;	
//}

LOGMAX = 25;

var LED = [
	{s:0, c:[0, 0, 0, 0], n:"頭", i:[["F4"], ["R1"]], p:[0,4]},
	{s:0, c:[0, 0, 0, 0], n:"目", i:[["F3L", "F3R"],[]], p:[1,2]},
	{s:0, c:[0, 0, 0, 0], n:"胸", i:[["F5L", "F5R"],[]], p:[4,5]},
	{s:0, c:[0, 0, 0, 0], n:"肩", i:[["F6L", "F6R"], ["R4L", "R4R"]], p:[6,7,8,9]},
	{s:0, c:[0, 0, 0, 0], n:"腰", i:[["F9"],["R8"]], p:[13,14]},
	{s:0, c:[0, 0, 0, 0], n:"腿", i:[["F7L", "F7R"], ["R5L", "R5R"]], p:[17,18,21,22]},
	{s:0, c:[0, 0, 0, 0], n:"足", i:[["F8L", "F8R"], ["R6L", "R6R"]], p:[15,16,19,20]},
	{s:0, c:[0, 0, 0, 0], n:"Backpack", i:[[], ["R2L", "R2R", "R3"]], p:[23,24,25]},
	{s:0, c:[0, 0, 0, 0], n:"シールド", i:[["F1", "F2L", "F2R"], ["R7"]], p:[10,11,12]},
];

var SIDE = 0;
var HSL = [0, 0, 0];
var RGB = [0, 0, 0];
var MBIT= [0, 0, 0, 0];
var SIZE = [615, 630];

async function connectLED(msg) {
	if(online == null) {
		//OP(msg);
		return;
	}
	LOG("Connected");
	E("connect").style.display = "none";
	E("disconnect").style.display = "inline-block";
	OP("@,26");
	for(let i=0; i<LED.length; i++) {
		for(let j=0; j<LED[i].p.length; j++) {
			let n = LED[i].p[j]
					+ "," + LED[i].c[0]
					+ "," + LED[i].c[1]
					+ "," + LED[i].c[2]
					+ "," + ANIs[LED[i].c[3]][0];
			OP(n);
		}
	}
}

function selectLED() {
	if(online == null) return;
	let n = "#," + RGB[0] + "," + RGB[1] + "," + RGB[2] + "," + ANIs[ANI][0];
	OP(n);
	n = "";
	let m = 0;
	for(let i=0; i<LED.length; i++) {
		if(LED[i].s > 0) {
			for(let j=0; j<LED[i].p.length; j++) {
				n += "," + LED[i].p[j];
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
		n = "=" + n;
		OP(n);
	}
}
async function allLED(n) {
	for(let i=0; i<LED.length; i++) {
		LED[i].s = n;
	}
	await showSide(SIDE);
}

async function clickLED( n) {
	if(LED[n].s > 0) {
		LED[n].s = 0;
	} else {
		LED[n].s = 1;
	}
//	await setLED();
	await showSide(SIDE);
}

async function setLED() {
	setRGB();
	let u = false;
	for(let n=0; n<LED.length; n++) {
		if(LED[n].s > 0) {
			if(LED[n].c[0] != RGB[0]
			|| LED[n].c[1] != RGB[1]
			|| LED[n].c[2] != RGB[2]
			|| LED[n].c[3] != ANI) {
				u = true;
				LED[n].c = [RGB[0], RGB[1], RGB[2], ANI];
			}
		}
	}
	if(u) {
		u = [];
		for(let n=0; n<LED.length; n++) {
			u[n] = LED[n].c;
		}
		savedata("AERIAL", u);
	}
	selectLED();
	showSide(SIDE);
}

function showLog() {
	let e = E("log");
	if(e.style.display == "none") {
		e.style.display = "inline-block";
	} else {
		e.style.display = "none";
	}
}

function showSide(sw) {
	SIDE = sw;
	let p = E("seli");
	p.innerHTML = "<img src=webusb/" + ANIs[ANI][1] + ".png>";
	p = E("selc");
	p.style.backgroundColor =
		"rgb(" + RGB[0] + "," + RGB[1] + "," + RGB[2] + ")";
	for(let n=0; n<LED.length; n++) {
		let e = E("t" + n);
		if(LED[n].s > 0) {
			e.style.borderColor = "red";
		} else {
			e.style.borderColor = null;
		}
		e = E("i" + n);
		e.innerHTML = "<img src=webusb/" + ANIs[LED[n].c[3]][1] + ".png>";
		e = E("c" + n);
		e.style.background = "rgb(" + LED[n].c[0] + "," + LED[n].c[1] + ","+ LED[n].c[2] + ")";
	}
	let fc = E("front");
	let bc = E("back");
	let fs = E("_front");
	let bs = E("_back");
	if(sw) {
		fc.style.display = "none";
		bc.style.display = "inline-block";
		fs.style.borderColor = "#00000000";
		bs.style.borderColor = "gray";
	} else {
		bc.style.display = "none";
		fc.style.display = "inline-block";
		bs.style.borderColor = "#00000000";
		fs.style.borderColor = "gray";
	}
	let d = (SIDE>0)? AERIAL_R : AERIAL_F;
	let e = E((SIDE>0)? "backc" : "frontc");
	let i = E((SIDE>0)? "backi" : "fronti");
	e.width  = SIZE[0];
	e.height = SIZE[1];
	e.style.width  = parseInt(SIZE[0] * 0.55) + "px";
	e.style.height = parseInt(SIZE[1] * 0.55) + "px";
	let cc = e.getContext("2d");
	cc.fillStyle = "#00000000";
	cc.fillRect(0, 0, SIZE[0], SIZE[1]);
	for(let n=0; n<LED.length; n++) {
		if(LED[n].s <= 0) continue;
		for(let i=0; i<LED[n].i[SIDE].length; i++) {
			let ds = LED[n].i[SIDE][i];
			ds = d[ds];
			for(let dy=0; dy<ds.length; dy++) {
				let y = ds[dy][0];
				let x = ds[dy][1];
				let b = cc.getImageData(x, y, ds[dy].length - 2, 1);
				let bn = 0;
				for(let dx=2; dx<ds[dy].length; dx++) {
					if(ds[dy][dx] == 0) {
						b.data[bn+0] = 128;
						b.data[bn+1] = 128;
						b.data[bn+2] = 128;
						b.data[bn+3] = 64;
					} else {
						b.data[bn+0] = LED[n].c[0];
						b.data[bn+1] = LED[n].c[1];
						b.data[bn+2] = LED[n].c[2];
						b.data[bn+3] = 255;
					}
					bn+=4;
				}
				cc.putImageData(b, x, y);
			}
		}
	}
}

function initAerial() {
	let ls = "<table>";
	for(let n=0; n<LED.length; n++) {
		LED[n].s = 0;
		LED[n].c = [0,0,0,0];
		ls += "<tr>"
				+ "<td width=99%><span class=t id=t" + n + " onclick='clickLED(" + n + ")'>" + LED[n].n + "</span></td>"
				+ "<td><span class=c id=c" + n + " style='background: rgb(0,0,0);'>" + "</span></td>"
				+ "<td><div class=i id=i" + n + "></div></td></tr>";
	}
	E("list").innerHTML = ls + "</table>";
	let f = function(e) {
		e.style.width  = parseInt(SIZE[0] * 0.55) + "px";
		e.style.height = parseInt(SIZE[1] * 0.55) + "px";
	};
	f(E("body"));
	f(E("front"));
	f(E("back"));
	f(E("fronti"));
	f(E("backi"));
	clickRGB(0, 0, 0);
	h = loaddata("AERIAL");
	if(h != null) {
		for(let n=0; n<LED.length; n++) {
			LED[n].c = h[n];
		}
	}
	setTimeout(function() {
		showSide(SIDE);
	}, 500);
}
