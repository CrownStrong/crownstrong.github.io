import { Game } from "./game.js";
import { FieldBuilder } from "./field.js";

const Field = new FieldBuilder;
const GAME = new Game;
const config = {
	columns: 100,
	rows: 100,
	speed: Number(document.getElementById('speed').value),
}
const gameElement = document.querySelector('.game-wrap');
// let timerHold = null;
let configureOpened = false;


function changeConfig(ev){
	ev.preventDefault();
	config.columns = Number(document.getElementById('columns').value);
	config.rows = Number(document.getElementById('rows').value);
	config.speed = Number(document.getElementById('speed').value);
	buildField();
}

function buildField(){
	Field.init(config);
	GAME.init(Field, config.speed);
}

function playPause(ev){
	document.getElementById('fieldSubmit').toggleAttribute('disabled', !GAME.played);
	document.getElementById('columns').toggleAttribute('disabled', !GAME.played);
	document.getElementById('rows').toggleAttribute('disabled', !GAME.played);
	document.getElementById('randomizeButton').toggleAttribute('disabled', !GAME.played);
	document.getElementById('nextStepButton').toggleAttribute('disabled', !GAME.played);
	document.getElementById('resetButton').toggleAttribute('disabled', !GAME.played);
	gameElement.classList.toggle('blocked', !GAME.played);
	ev.target.classList.toggle('paused', GAME.played);
	GAME.playClickHandler.call(GAME);
}

document.getElementById('configureForm').addEventListener('submit', changeConfig);

buildField();

document.getElementById('playPause').addEventListener(
	'click', playPause
);
gameElement.addEventListener(
	'click', GAME.clickItemHandler.bind(GAME)
);

// gameElement.addEventListener(
// 	'mousemove', ev=>{
// 		if(ev.buttons == 1 && !timerHold){
// 			GAME.clickItemHandler.call(GAME, ev)
// 			timerHold = setTimeout(()=>{
// 				clearTimeout(timerHold);
// 				timerHold = null;
// 			}, 100);
// 		}
// 	}
// );

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
document.getElementById('configureButton').addEventListener(
    'click', ()=>{
        configureOpened = !configureOpened;
        document.getElementById('configure').classList.toggle(
            'opened', configureOpened
        )
    }
)
document.getElementById('speed').addEventListener(
    'change', ev=>{
        GAME.changeSpeed.call(
            GAME, 
            Number(ev.target.value)
        )
    }
)
