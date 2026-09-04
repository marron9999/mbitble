var LOG1, LOG2, ROW1,ROW2;

function log_clear() {
	ROW1 = ROW2 = 0;		
	LOG1.innerHTML = "";
	LOG2.innerHTML = "";
}
	
function log1(t) {
	if(ROW1 > 49) {
		let div = LOG1.firstElementChild;
		if (div) {
		   div.remove();
		}
	} else {
		ROW1 += 1;		
	}
	{
		let div = document.createElement('div');
		div.textContent = t;
		LOG1.appendChild(div);	
		div.scrollIntoView();
	}
}

function log2(t) {
	if(ROW2 > 49) {
		let div = LOG2.firstElementChild;
		if (div) {
		   div.remove();
		}
	} else {
		ROW2 += 1;		
	}
	{
		let div = document.createElement('div');
		div.textContent = t;
		LOG2.appendChild(div);	
		div.scrollIntoView();
	}
}
