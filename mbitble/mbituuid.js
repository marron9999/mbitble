// https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html

var MBITUUID = {
UART: {			UUID:	"6E400001-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase(),
	SERVICE: {	TX:		"6E400002-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase(),
				RX:		"6E400003-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase()}},

ACCELEROMETER: {UUID:	"E95D0753-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
	SERVICE: {	DATA:	"E95DCA4B-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				PERIOD:	"E95DFB24-251D-470A-A062-FA1922DFA9A8".toLowerCase()}},

MAGNETOMETER: {	UUID:	"E95DF2D8-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
	SERVICE: {	DATA:	"E95DFB11-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				PERIOD:	"E95D386C-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				BEARING:"E95D9715-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
			CALIBRATION:"E95DB358-251D-470A-A062-FA1922DFA9A8".toLowerCase()}},

BUTTON: {		UUID:	"E95D9882-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
	SERVICE: {	A:		"E95DDA90-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				B:		"E95DDA91-251D-470A-A062-FA1922DFA9A8".toLowerCase()}},

/*	TOUCH:	{
	UUID:				"e97dd91d-251d-470a-a062-fa1922dfa9a8".toLowerCase(),
	SERVICE: {	LOGO:	"e97d3b10-251d-470a-a062-fa1922dfa9a8".toLowerCase()}}, */

IO_PIN: {		UUID:	"E95D127B-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
	SERVICE: {	DATA:	"E95D8D00-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				AD_CONF:"E95D5899-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				IO_CONF:"E95DB9FE-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				PWM:	"E95DD822-251D-470A-A062-FA1922DFA9A8".toLowerCase()}},

LED: {			UUID:	"E95DD91D-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
	SERVICE: {	MATRIX:	"E95D7B77-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				TEXT:	"E95D93EE-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				DELAY:	"E95D0D2D-251D-470A-A062-FA1922DFA9A8".toLowerCase()}},

TEMPERATURE: {	UUID:	"E95D6100-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
	SERVICE: {	VALUE:	"E95D9250-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				PERIOD:	"E95D1B25-251D-470A-A062-FA1922DFA9A8".toLowerCase()}},

EVENT: {		UUID:	"E95D93AF-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
	SERVICE: { MBIT_REQ:"E95DB84C-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
			   MICROBIT:"E95D9775-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				CLI_REQ:"E95D23C4-251D-470A-A062-FA1922DFA9A8".toLowerCase(),
				CLIENT:	"E95D5404-251D-470A-A062-FA1922DFA9A8".toLowerCase()}}
};
