import { departments } from './tones.js';
const silentAudio = new Audio('silent.mp3');
const audioCtx = new window.AudioContext();
let cancelCurrent;

const deptTable = document.createElement('table');
departments.forEach(deptData => deptTable.appendChild(deptRow(deptData)));
document.body.appendChild(deptTable);

function playTone(frequency, delay, duration) {
	silentAudio.play(); // allow sound on iOS when ringer is on silent
	const { destination, currentTime } = audioCtx;
	const oscillator = new OscillatorNode(audioCtx, {
		type: 'sine',
		frequency: frequency
	});
	oscillator.connect(destination);
	oscillator.start(currentTime + delay);
	oscillator.stop(currentTime + delay + duration);
	return () => oscillator.disconnect();
}

function twoTone(frequency1, frequency2) {
	if (cancelCurrent) cancelCurrent(); 
	const cancelTone1 = playTone(frequency1, 0, 1);
	const cancelTone2 = playTone(frequency2, 1, 3);
	return () => {
		cancelTone1();
		cancelTone2();
	};
}

function btnCell(text, fn) {
	const td = document.createElement('td');
	const btn = document.createElement('button');
	btn.appendChild(document.createTextNode(text));
	btn.onclick = fn;
	td.appendChild(btn);
	return td;
}

function deptRow(deptData) {
	const { name, pager, siren, siren2 } = deptData;
	const row = document.createElement('tr');
	const nameCell = document.createElement('td');
	nameCell.appendChild(document.createTextNode(name));
	row.appendChild(nameCell);
	
	/*
	row.appendChild(pager?.c ? btnCell('Chief', () => {
		cancelCurrent = twoTone(pager.a, pager.c);
	}) : document.createElement('td'));
	*/
	row.appendChild(pager ? btnCell('Pager', () => {
		cancelCurrent = twoTone(pager.a, pager.b);
	}) : document.createElement('td'));
	
	row.appendChild(siren ? btnCell('Siren', () => {
		cancelCurrent = twoTone(siren.a, siren.b);
	}) : document.createElement('td'));
	
	row.appendChild(siren2 ? btnCell('Siren', () => {
		cancelCurrent = twoTone(siren2.a, siren2.b);
	}) : document.createElement('td'));
	
	return row;
}