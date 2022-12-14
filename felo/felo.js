
async function connectFELO(msg) {
	if( ! _connected(msg)) {
		return;
	}
	OP("+," + felo_sensor);
	if(mode == 2) {
		fireICON();
	}
}

var felo_sensor = 0;

function sensorFELO() {
	let e = E("sensor")
	if(felo_sensor == 0) {
		felo_sensor = 1;
		e.style.color = "black";
	} else {
		felo_sensor = 0;
		e.style.color = null;
		E("vleft").innerHTML = "0";
		E("vright").innerHTML = "0";
	}
	if(online != null) {
		OP("+," + felo_sensor);
	}
}

var base = [0, 0];
var felo_mdown = null;

var _mouseFELO_ = null;
async function mouseFELO(event) {
	if(_mouseFELO_ != null) return;
	if(felo_mdown == null) return;
	_mouseFELO_ = setTimeout(function() {
		_mouseFELO_ = null;
		if(felo_mdown == null) return;
		if(event.buttons == 0) {
			stopFELO();
			felo_mdown = null;
			return;
		}
		moveFELO(event);
	}, 100);
}

function moveFELO(e) {
	let ex = 0 - base[0];
	let ey = 0 - base[1];
	if(e.x == undefined) {
		ex += e.touches[0].pageX;
		ey += e.touches[0].pageY;
	} else {
		ex += e.x;
		ey += e.y;
	}
	E("mark").style.left = (ex - 38) + "px";
	E("mark").style.top = (ey - 38) + "px";
	let x = ex * 2048 / 340;
	let y = ey * 2048 / 340;
	x = Math.round(x / 128) * 128;
	y = Math.round(y / 128) * 128;
	x -= 1024;
	y -= 1024;
	if(x >= 1024) x = 1023;
	else if(x <= -1024) x = -1023;
	if(y >= 1024) y = 1023;
	else if(y <= -1024) y = -1023;
	if(0 <= x) { if(x < 256) x = 0;
	} else { if(-256 < x) x = 0; }
	if(0 <= y) { if(y < 256) y = 0;
	} else { if(-256 < y) y = 0; }
	y = 0 - y;
	if(felo_mdown[0] != x || felo_mdown[1] != y) {
		console.log(ex + "," + ey + " => " + x + "," + y);
		if(online != null) {
			OP("M," + y + "," + x);
		}
	}
	felo_mdown = [x, y];
}

function stopFELO() {
	E("mark").style.display = null;
	//console.log("felo_stop");
	if(online != null) {
		OP("S");
	}
}

function notifyFELO(text) {
	let v = text.split(";");
	LOG2(v[0]);
	v = v[0].split(",");
	if(v[0] == "L") {
		E("vleft").innerHTML = v[1];
	} else if(v[0] == "R") {
		E("vright").innerHTML = v[1];
	}
}

function pointerdown(event) {
	if(mode != 0) return;
	event.stopPropagation();
	event.preventDefault();
	//console.log('pointerdown');
	felo_mdown = [-9999,-9999];
	E("mark").style.display = "inline-block";
	moveFELO(event);
}
function pointermove(event) {
	if(mode != 0) return;
	event.stopPropagation();
	event.preventDefault();
	//console.log('pointermove');
	mouseFELO(event);
}
function pointerup(event) {
	if(mode != 0) return;
	event.stopPropagation();
	event.preventDefault();
	//console.log('pointerup');
	if(felo_mdown != null) stopFELO();
	felo_mdown = null;
}

function initFELO() {
	MBIT_BLE.notify = notifyFELO;
	let e = E("left");
	base = [e.offsetLeft, e.offsetTop];
	e.addEventListener('mousedown', pointerdown, {passive: false});
	e.addEventListener('mousemove', pointermove, {passive: false});
	e.addEventListener('mouseup', pointerup, {passive: false});
	e.addEventListener('touchstart', pointerdown, {passive: false});
	e.addEventListener('touchmove', pointermove, {passive: false});
	e.addEventListener('touchend', pointerup, {passive: false});
	e = E("body");
	e.addEventListener('mouseup', pointerup, {passive: false});
	e.addEventListener('touchend', pointerup, {passive: false});

	e = E("felo");
	let s = '';
	let x = 0;
	for(let n=128; n<1024-256; n+=128) {
		x = Math.round(n * 150 / 1024);
		s += '<div class=c style="left:' + x + 'px;top:' + x + 'px;'
			+ 'width:' + (300 - x - x) + 'px;height:' + (300 - x - x) + 'px;"></div>';
	}
	s += '<div class=r>'
	s += '<span style="top:-10px; left:122px; transform:rotate( 90deg); color:#080f;">〈</span>';
	s += '<span style="top:120px; left:257px; transform:rotate(180deg); color:#0808;">〈</span>';
	s += '<span style="top:250px; left:128px; transform:rotate(270deg); color:#0888;">〈</span>';
	s += '<span style="top:125px; left: -7px; color:#0808;">〈</span>';
	s += '</div>';
	s += '<div class=t>'
	s += '<span style="top:-20px; left:137px; color:gray;">前進</span>';
	s += '<span style="top:140px; left:299px; color:gray; writing-mode: vertical-rl;">右旋回</span>';
	s += '<span style="top:301px; left:137px; color:gray;">後退</span>';
	s += '<span style="top:140px; left:-22px; color:gray; writing-mode: vertical-rl;">左旋回</span>';
	s += '</div>';
	s += '<div id=mark></div>';
	e.innerHTML = s;
}

var mode = 0;
function sound() {
	event.stopPropagation();
	event.preventDefault();
	mode = (mode != 0)? 0 : 1;
	if(mode == 1) {
		E("felo").style.display = "none";
		E("keys").style.display = "inline-block";
		E("log2").style.display = "none";
		E("sel").style.display = "inline-block";
	} else {
		E("keys").style.display = null;
		E("felo").style.display = null;
		E("sel").style.display = null;
		E("log2").style.display = null;
	}
}

keyset = function(k) {
	mode = k
	event.stopPropagation();
	event.preventDefault();
	if(k == 1) {
		E("key1").style.display = "none";
		E("key3").style.display = "none";
		E("key2").style.display = "inline-block";
	} else if(k == 2) {
		E("key1").style.display = "none";
		E("key2").style.display = "none";
		E("key3").style.display = "inline-block";
	} else {
		E("key2").style.display = "none";
		E("key3").style.display = "none";
		E("key1").style.display = "inline-block";
	}
}
