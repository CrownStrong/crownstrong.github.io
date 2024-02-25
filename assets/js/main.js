import { Game } from "./game.js";
import { FieldBuilder } from "./field.js";

const Field = new FieldBuilder;
const GAME = new Game;
const config = {
	columns: 10,
	rows: 10,
	speed: 400,
}
const gameElement = document.querySelector('.game-wrap');


function changeConfig(ev){
	ev.preventDefault();
	config.speed = Number(document.getElementById('speed').value);
	config.columns = Number(document.getElementById('columns').value);
	config.rows = Number(document.getElementById('rows').value);
	buildField();
}

function buildField(){
	Field.init(config);
	GAME.init(Field, config.speed);
}

function playPause(ev){
	document.getElementById('configure').classList.toggle('disabled', !GAME.played);
	document.getElementById('randomizeButton').toggleAttribute('disabled', !GAME.played);
	document.getElementById('nextStepButton').toggleAttribute('disabled', !GAME.played);
	document.getElementById('resetButton').toggleAttribute('disabled', !GAME.played);
	gameElement.classList.toggle('blocked', !GAME.played);
	ev.target.classList.toggle('paused', GAME.played);
	GAME.playClickHandler.bind(GAME)();
}

document.getElementById('configure').addEventListener('submit', changeConfig);

buildField();

document.getElementById('playPause').addEventListener(
	'click', playPause
);
gameElement.addEventListener(
	'click', GAME.clickItemHandler.bind(GAME)
);
document.getElementById('nextStepButton').addEventListener(
	'click', GAME.changeItem.bind(GAME)
);
document.getElementById('resetButton').addEventListener(
	'click', ()=>{
		Field.cleanField()
	}
);
document.getElementById('randomizeButton').addEventListener(
	'click', ()=>{
		Field.randomize()
	}
);