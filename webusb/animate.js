var ANI = 0;
var ANIs = [
		[ 0, "0"  ], [41, "4x1"], [42, "4x2"], [43, "4x3"], [44, "4x4"],
		[ 1, "1x1"], [ 3, "1x2"], [ 5, "1x3"], [ 7, "1x4"], [ 9, "1x5"],
		[ 2, "2x1"], [ 4, "2x2"], [ 6, "2x3"], [ 8, "2x4"], [10, "2x5"],
		[11, "3x1"], [13, "3x2"], [16, "3x3"], [20, "3x4"], [25, "3x5"],
	];

var	setANI = function() {};

function initANI() {
	let h = "";
	for(let i=0; i<ANIs.length; i++) {
		h += "<div class=b onclick='clickANI(this)' id=a" + i
			+ " ><img src=webusb/" + ANIs[i][1] + ".png></div>";
		if(i % 5 == 4) h += "<br>";
	}
	let a = E("ani");
	a.innerHTML = h;
	a = E("a0");
	a.style.borderColor = "red";
}

function clickANI(e) {
	E("a" + ANI).style.borderColor = null;
	e.style.borderColor = "red";
	ANI = parseInt(e.id.substr(1));
	setANI();
}
