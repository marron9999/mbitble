var OPs = [];
var LOGMAX = 30;

function side(e) {
	let t = e.textContent;
	if(t.indexOf("LED") >= 0) {
		E("left").style.display = "none";
		e = E("left2");
	} else {
		E("left2").style.display = "none";
		e = E("left");
	}
	e.style.display = "inline-block";
	document.title = e.children[0].children[0].textContent;
}

function OP(op) {
	OPs.push(op);
	if(OPs.length == 1) {
		setTimeout(_OP,1);
	}
	if(OPs.length > 0) {
		E("que").innerHTML = OPs.length;
	} else {
		E("que").innerHTML = "";
	}
}

async function _OP() {
	let n = OPs[0];
	OPs.shift();
	if(OPs.length > 0) {
		E("que").innerHTML = OPs.length;
	} else {
		E("que").innerHTML = "";
	}
	if(online != null) {
		if(n != undefined) {
			LOG(n);
			await write(n + ";");
		}
		if(OPs.length > 0) {
			setTimeout(_OP, 21);
		}
		return;
	}
	OPs = [];
}

function E(id) {
	return document.getElementById(id);
}

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

var connected = async function(msg) { };

var connect = async function () {
	let h = E("log");
	h.innerHTML = "";
	logged = 0;
	let msg = await open();
	connected(msg);
};

var disconnect = async function () {
	if(online != null) {
		LOG("Disconnected");
		await close();
	}
	E("connect").style.display = "inline-block";
	E("disconnect").style.display = "none";
};

function clickTab(e) {
	let p;
	p = E("tab1");
	p.style.borderBottomColor = "";
	p = E("tab2");
	p.style.borderBottomColor = "";
	p = E("tab3");
	p.style.borderBottomColor = "";
	p = E("tab4");
	p.style.borderBottomColor = "";
	e.style.borderBottomColor = "white";

	let	x = E("tabx");
	p = x.children[0];
	p.style.visibility = "hidden";
	p = x.children[1];
	p.style.visibility = "hidden";
	if(x.children.length > 2) {
		p = x.children[2];
		p.style.visibility = "hidden";
	}
	if(x.children.length > 3) {
		p = x.children[3];
		p.style.visibility = "hidden";
	}
	if(e.id == "tab1") {
		p = x.children[0];
		p.style.visibility = "visible";
		return;
	}
	if(e.id == "tab2") {
		p = x.children[1];
		p.style.visibility = "visible";
		return;
	}
	if(e.id == "tab3") {
		p = x.children[2];
		p.style.visibility = "visible";
		return;
	}
	if(e.id == "tab4") {
		p = x.children[3];
		p.style.visibility = "visible";
		return;
	}
}

