var SOUND = {
	note1: [
		[["ド", 131], ["ド#", 139], ["レ", 147], ["レ#", 156],
			["ミ", 165], ["ファ", 175], ["ファ#", 185], ["ソ", 196],
			["ソ#", 208], ["ラ", 220], ["ラ#", 233], ["シ", 247]],
		[["ド", 262], ["ド#", 277], ["レ", 294], ["レ#", 311],
			["ミ", 330], ["ファ", 349], ["ファ#", 370], ["ソ", 392],
			["ソ#", 415], ["ラ", 440], ["ラ#", 466], ["シ", 498]],
		[["ド", 523], ["ド#", 554], ["レ", 587], ["レ#", 622],
			["ミ", 659], ["ファ", 698], ["ファ#", 740], ["ソ", 784],
			["ソ#", 831], ["ラ", 880], ["ラ#", 932], ["シ", 988]],
	],
	note2: [
		["A", 440], ["A3", 220], ["A4", 440], ["A5", 880],
		["B", 494], ["Bb", 466], ["B3", 247], ["Bb3", 233], 
			["B4", 494], ["Bb4", 466], ["B5", 988], ["Bb5", 932],
		["C", 262], ["C#", 277], ["C3", 131], ["C#3", 139],
			["C4", 262], ["C#4", 277], ["C5", 523], ["C#5", 555],
		["D", 294], ["D3", 147], ["D4", 294], ["D5", 587],
		["E", 330],	["Eb", 311], ["E3", 165], ["Eb3", 156],
			["E4", 330],["Eb4", 311], ["E5", 659], ["Eb5", 622],
		["F", 349], ["F#", 370], ["F3", 175], ["F#3", 185],
			["F4", 349], ["F#4", 370], ["F5", 698], ["F#5", 740],
		["G", 392], ["G#", 415], ["G3", 196], ["G#3", 208],
			["G4", 392], ["G#4", 415], ["G5", 784], ["G#5", 831],
	],

	"チューリップ": [
		"ドレミー ドレミー ソミレド レミレー",
		"ドレミー ドレミー ソミレド レミドー",
		"ソソミソ ララソー ミミレレ ドー",
	],

	"どんぐりころころ": [
		"ソ.ミ.ミ .ファ.ミ.レ.ド＿",
		".ソ.ソ.ミ.ミ レ＿",
		".ミ.ミ.ソ.ソ .ラ.ラ.ラ.ラ",
		"^.ド^.ド.ミ.ミ ソ＿",
		".ソ.ミ.ミ .ファ.ミ.レ.ド",
		".ソ.ソ.ミ.ミ レ＿",
		".ソ.ソ.ミ.ミ .ラ.ラ.ソ.ソ",
		".ラ.ラ.シ.シ ^ド",
	],

	"静かな湖畔": [
		"ド.ドド.レ ミ.ミミ.ミ レドレ.ミ ドー_ソー",
		"ミ.ミミ.ファ ソ.ソソ.ソ ファ.ミファ.ソ ミー＿.ソ",
		"ミー＿.ソ ミー＿.ソ ミ.ソミ.ソ ミー",
	],

	"さくらさくら": [
		"ララシー ララシー ラシドシ ラ.シ.ラファ",
		"ミドミファ ミ.ミ.ドシー ラシドシ ラ.シ.ラファ",
		"ミドミファ ミ.ミ.ドシー ララシー ララシー",
		"ミファ.シ.ラファ ミー",
	],

	"パプリカ": [
		"ド＿ミソ ドラシ.ミ.ソ ラファソー",
		"ファラシソ.ソ.ファ ミ#ソラシ ドラシ.ソ.ソ",
		".ラ.ド.シ.ソミミ .ファ.ミ.レ.ミラ#ソファソラー＿.#ファ.ラ",
	],

	"紅蓮華": [
		".レ.レレシ .ラ.シ.レ.シ.ラ:シ:シ_ソ",
		":ラ:シ:レ:シ:ラ:シ:シ_レ",
		":れ:そ:ソ.ソ.レ:レ:ソ:ラ:ソ レド.シ.ラ.ソ.ソ",
		"ソ:ソ:ラ:シ:ラ .レ.ラ:ラ:シ:レ:ラ",
	],

	playList: ["チューリップ", "どんぐりころころ",
				"静かな湖畔", "さくらさくら",
				//"パプリカ", "紅蓮華",
			],
	play2List: [["クスクス笑う", "giggle"], ["ハッピー", "happy"],
				["ハロー", "hello"], ["神秘的", "mysterious"],
				["寂しい", "sad"], ["スライド", "slide"],
				["急上昇", "soaring"], ["春", "spring"],
				["きらめく", "twinkle"], ["あくび", "yawn"],],

	values: function (data) {
		let val = [], len = [], key = [];
		let base = 1, short = 0, shift = 0;
		for (let i = 0; i < data.length; i++) {
			val[i] = []; len[i] = []; key[i] = [];
			for (let j = 0; j < data[i].length; j++) {
				val[i][j] = 0; len[i][j] = 0; key[i][j] = -1;
				let c = data[i].charAt(j);
				if (c == "_") { base = 0; continue; }
				if (c == "^") { base = 2; continue; }
				if (c == ".") { short = 2; continue; }
				if (c == ":") { short = 1; continue; }
				if (c == "#") { shift = 1; continue; }
				if (c == " ") { continue; }
				if (c == "ァ") { continue; }
				if (c == "＿") { len[i][j] = 4; continue; }
				if (c == "_") { len[i][j] = 2; continue; }
				if (c == "ー") { key[i][j] = -2; continue; }
				for (let k = 0; k < this.note1[base].length; k++) {
					if (c == this.note1[base][k][0].charAt(0)) {
						if (shift > 0) {
							if (this.note1[base][k][0].indexOf("#") < 0) continue;
						}
						val[i][j] = this.note1[1][k][1];
						key[i][j] = ("" + base) + k;
						len[i][j] = (short > 0) ? short : 4;
						break;
					}
				}
				base = 1;
				short = 0;
				shift = 0;
			}
			for (let j = key[i].length - 1; j >= 0; j--) {
				if (key[i][j] == -2) {
					len[i][j - 1] *= 2;
					len[i][j] = 0;
					key[i][j] = -1;
				}
			}
		}
		return { val: val, len: len, key: key };
	},
};

//function device_sound() {
//	device_note1();
//	device_note();
//}

function device_note1() {
	let v;
	let ee = ["", "", ""];
	let e2 = ["", "", ""];
	for (let j = 0; j < SOUND.note1.length; j++) {
		for (let i = 0; i < SOUND.note1[0].length; i++) {
			v = "<span class='key' onclick='device_key1(this)' id=k"
				+ j + i + "><b>" + SOUND.note1[j][i][0] + "</b></span>";
			if (SOUND.note1[j][i][0].indexOf("#") >= 0) {
				e2[j] += v.replace("#", "");
			} else {
				if (SOUND.note1[j][i][0].indexOf("ミ") >= 0
					//|| SOUND.note1[j][i][0].indexOf("シ") >= 0
				) {
					e2[j] += "<span class='key null'> </span>";
				}
				ee[j] += v;
			}
		}
	}
	v = "<div><div class=key1>" + e2[2] + "</div><div class=key2>" + ee[2] + "</div></div>";
	v += "<div><div class=key1>" + e2[1] + "</div><div class=key2>" + ee[1] + "</div></div>";
	v += "<div><div class=key1>" + e2[0] + "</div><div class=key2>" + ee[0] + "</div></div>";
	E("key1").innerHTML = v;
}

function device_note2() {
	let v = "";
	for (let k = 0; k < SOUND.note2.length; ) {
		v += "<div><div class=key3>";
		for (let i = 0; i < 4; i++, k++) {
			v += "<span class='key' onclick='device_key2(this)' id=k"
				+ k + "><b>" + SOUND.note2[k][0] + "</b></span>";
		}
		v += "</div></div>";
	}
	E("key2").innerHTML = v;
}

function device_note() {
	let v = "";
	for (let i=0; i<SOUND.playList.length; i++) {
		v += ' <button class=push onclick="device_play(this)">'
				+ SOUND.playList[i] + '</button>';
	}
//	v += "<span id=plaing></span>";
//	v += "<span id=play2><br>";
//	for (let i=0; i<SOUND.play2List.length; i++) {
//		v += ' <button class=push onclick="device_play2(\''
//				+ SOUND.play2List[i][1] + '\')">'
//				+ SOUND.play2List[i][0] + '</button>';
//	}
//	v += "</span>";
	E("play").innerHTML = v;
}

async function device_key1(e) {
	if(online == null) return;
	e.style.background = "rgba(0,255,0,0.2)";
	let j = parseInt(e.id.charAt(1));
	let i = parseInt(e.id.substr(2));
	j = SOUND.note1[j][i][1];
	i = parseInt(1000 / 4);
	OP("!," + j + "," + i);
	setTimeout(function () {
		e.style.background = null;
	}, 500);
}
async function device_key2(e) {
	if(online == null) return;
	e.style.background = "rgba(0,255,0,0.2)";
	let j = parseInt(e.id.substr(1));
	j = SOUND.note2[j][1];
	let i = parseInt(1000 / 4);
	OP("!," + j + "," + i);
	setTimeout(function () {
		e.style.background = null;
	}, 500);
}

//async function device_play2(e) {
//	await MAQUEEN.post({ express: e });
//}

var _device_play = null;
function device_play(e) {
	if(online == null) return;
	//device_note1();
	e = e.innerHTML;
	_device_play = SOUND.values(SOUND[e]);
	_device_play.i = 0;
	_device_play.j = 0;
	E("plaing").innerHTML = "♪";
	setTimeout(device_play_, 1);
}
async function device_play_() {
	if (_device_play.i >= _device_play.val.length) {
		E("plaing").innerHTML = "";
		return;
	}
	if (_device_play.j >= _device_play.val[_device_play.i].length) {
		_device_play.j = 0;
		_device_play.i++;
		setTimeout(device_play_, 1);
		return;
	}
	let len = _device_play.len[_device_play.i][_device_play.j];
	let val = _device_play.val[_device_play.i][_device_play.j];
	let key = _device_play.key[_device_play.i][_device_play.j];
	if (len == 0) {
		_device_play.j++;
		setTimeout(device_play_, 1);
		return;
	}
	if (val == 0) {
		_device_play.j++;
		if (len == 2) {
			setTimeout(device_play_, parseInt(1000 / 8));
			return;
		}
		setTimeout(device_play_, parseInt(1000 / 4));
		return;
	}
	_device_play.j++;
	let s = parseInt(1000 / 4);
	if (len == 1) s = parseInt(1000 / 16);
	else if (len == 2) s = parseInt(1000 / 8);
	else if (len == 8) s = parseInt(1000 / 2);
	OP("!," + val + "," + s);
	setTimeout(device_play_, s);
}

function initSND() {
	device_note();
	device_note1();
	device_note2();
}
function keyset(k) {
	if(k) {
		E("key1").style.display = "none";
		E("key2").style.display = "inline-block";
	} else {
		E("key2").style.display = "none";
		E("key1").style.display = "inline-block";
	}
}
