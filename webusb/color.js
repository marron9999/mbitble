function rgb2hsl(r, g, b) {
	const RGB_MAX = 255;
	const HUE_MAX = 360;
	const SATURATION_MAX = 100;
	const LIGHTNESS_MAX = 100;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l;

	// Hue
	const hp = HUE_MAX / 6;
	if (max == min) {
		h = 0;
	} else if (r == max) {
		h = hp * ((g - b) / (max - min));
	} else if (g == max) {
		h = hp * ((b - r) / (max - min)) + HUE_MAX / 3;
	} else {
		h = hp * ((r - g) / (max - min)) + HUE_MAX * 2 / 3;
	}
	if (h < 0) {
		h += HUE_MAX;
	}

	// Saturation
	const cnt = (max + min) / 2;
	if (cnt < RGB_MAX / 2) {
		if (max + min <= 0) {
			s = 0;
		} else {
			s = (max - min) / (max + min) * SATURATION_MAX;
		}
	} else {
		if((RGB_MAX * 2 - max - min) == 0) s = 100;
		else s = (max - min) / (RGB_MAX * 2 - max - min) * SATURATION_MAX;
	}

	// Lightness
	l = (max + min) / RGB_MAX / 2 * LIGHTNESS_MAX;
	
	return [parseInt(h), parseInt(s), parseInt(l)];
}

const hsl2rgb = function(h, s, l) {
	const RGB_MAX = 255;
	const HUE_MAX = 360;
	const SATURATION_MAX = 100;
	const LIGHTNESS_MAX = 100;
	let r, g, b, max, min;
	
	h = h % HUE_MAX;
	s = s / SATURATION_MAX;
	l = l / LIGHTNESS_MAX;
	
	if (l < 0.5) {
		max = l + l * s;
		min = l - l * s;
	} else {
		max = l + (1 - l) * s;
		min = l - (1 - l) * s;
	}
	
	const hp = HUE_MAX / 6;
	const q = h / hp;
	if (q <= 1) {
		r = max;
		g = (h / hp) * (max - min) + min;
		b = min;
	} else if (q <= 2) {
		r = ((hp * 2 - h) / hp) * (max - min) + min;
		g = max;
		b = min;
	} else if (q <= 3) {
		r = min;
		g = max;
		b = ((h - hp * 2) / hp) * (max - min) + min;
	} else if (q <= 4) {
		r = min;
		g = ((hp * 4 - h) / hp) * (max - min) + min;
		b = max;
	} else if (q <= 5) {
		r = ((h - hp * 4) / hp) * (max - min) + min;
		g = min;
		b = max;
	} else {
		r = max;
		g = min;
		b = ((HUE_MAX - h) / hp) * (max - min) + min;
	}

	return [
		parseInt(r * RGB_MAX),
		parseInt(g * RGB_MAX),
		parseInt(b * RGB_MAX)];
}

function initRGB() {
	let h = "<table><tr align=center>";
	h += "<td>色相<small></td><td width=20% id=Hue>0</td>";
	h += "<td>彩度</td><td width=20% id=Saturation>0%</td>";
	h += "<td>輝度</td><td width=20% id=Lightness>0%</td>";
	h += "</tr><tr align=center>";
	h += "<td>赤色</td><td id=Red>0</td>";
	h += "<td>緑色</td><td id=Green>0</td>";
	h += "<td>青色</td><td id=Blue>0</td>";
	h += "</tr><tr>";
	h += "<td colspan=6><input type=range min=0 max=360 step=1 value=0";
	h += " id=sHue oninput='changeHSL(this)' onchange='changeHSL(this)'></td>";
	h += "</tr><tr>";
	h += "<td colspan=6><input type=range min=0 max=100 step=1 value=0";
	h += " id=sSaturation oninput='changeHSL(this)' onchange='changeHSL(this)'></td>";
	h += "</tr><tr>";
	h += "<td colspan=6><input type=range min=0 max=100 step=1 value=0";
	h += " id=sLightness oninput='changeHSL(this)' onchange='changeHSL(this)'></td>";
	h += "</tr></table>";
	let e = E("op2");
	e.innerHTML = h;

	h = "";
	let n = 0;
	for(let r = 0; r <= 256; r+=128) {
		for(let g = 0; g <= 256; g+=128) {
			for(let b = 0; b <= 256; b+=128) {
				if(r == g && g == b) continue;
				let rv = (r > 255)? 255 : r;
				let gv = (g > 255)? 255 : g;
				let bv = (b > 255)? 255 : b;
				h += "<span onclick='clickRGB(" + rv + "," + gv + "," + bv + ")' "
				h += "style='background:rgb(" + rv + "," + gv + "," + bv + ")'";
				h += "></span>";
				n++;
				if(n == 6) {
					h += "<br>";
					n = 0;
				}
			}
		}
	}
	for(let r = 0; r <= 256; r+=50) {
		let rv = (r >= 250)? 255 : r;
		h += "<span onclick='clickRGB(" + rv + "," + rv + "," + rv + ")' "
		h += "style='background:rgb(" + rv + "," + rv + "," + rv + ")'";
		h += "></span>";
		n++;
	}
	e = E("ope");
	e.innerHTML = h;
}

var _changeHSL_ = null;
async function changeHSL(e) {
	if(_changeHSL_ != null) return;
	_changeHSL_ = setTimeout(_changeHSL, 100);
}
async function _changeHSL() {
	_changeHSL_ = null;
	e = E("sHue");
	if(HSL[0] != e.value) {
		HSL[0] = e.value;
	}
	e = E("sSaturation");
	if(HSL[1] != e.value) {
		HSL[1] = e.value;
	}
	e = E("sLightness");
	if(HSL[2] != e.value) {
		HSL[2] = e.value;
	}
	RGB = hsl2rgb(HSL[0], HSL[1], HSL[2]);
	await setLED();
}

function clickRGB(r, g, b) {
	let h = rgb2hsl(r, g, b);
	HSL[0] = h[0];
	HSL[1] = h[1];
	HSL[2] = h[2];
	RGB = hsl2rgb(HSL[0], HSL[1], HSL[2]);
	let p;
	p = E("sHue");
	p.value = h[0];
	p = E("sSaturation");
	p.value = h[1];
	p = E("sLightness");
	p.value = h[2];
	setLED();
}

function setRGB() {
	let vS = "", vL = "";
	for(let n=0; n<=100; n+=10) {
		vS += ",hsl(" + HSL[0] + "," + n + "%,50%)";
		vL += ",hsl(" + HSL[0] + ",100%," + n + "%)";
	}
	let p;
	p = E("sSaturation");
	p.style.background = "linear-gradient(to right" + vS + ")";
	p = E("sLightness");
	p.style.background = "linear-gradient(to right" + vL + ")";
	p = E("Hue");
	p.innerHTML = HSL[0] + "";
	p = E("Saturation");
	p.innerHTML = HSL[1] + "%";
	p = E("Lightness");
	p.innerHTML = HSL[2] + "%";
	p = E("Red");
	p.innerHTML = RGB[0] + "";
	p = E("Green");
	p.innerHTML = RGB[1] + "";
	p = E("Blue");
	p.innerHTML = RGB[2] + "";
}
