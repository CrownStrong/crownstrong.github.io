export class Game{
	constructor(){
		this.timer = null;
		this.played = false;
		this.generationTime = document.getElementById('generationTime');
	}

	init({
		arrayData, 
		columns, 
		rows, 
		nodeList, 
		visibileRows, 
		visibileColumns
	}, speed){
		this.arrayData = arrayData;
		this.columnCount = columns;
		this.speed = speed;
		this.rowCount = rows;
		this.elemets = nodeList;
		this.visibileRows = visibileRows;
		this.visibileColumns = visibileColumns;
	}

	clickItemHandler(event){
		const el = event.target;
		if(el.localName != 'button') return false;
		const rowIndex = el.parentElement.getAttribute('data-row');
		const colIndex = el.getAttribute('data-column');
		const rowEl = this.arrayData[rowIndex];
		rowEl[colIndex] = !rowEl[colIndex];
		el.classList.toggle('active', rowEl[colIndex]);
	}

	playClickHandler(){
		if(this.played){
			clearInterval(this.timer);
			this.timer = null;
		}else{
			console.log(this.speed);
			this.timer = setInterval(
				()=>{
					window.requestAnimationFrame(
						this.changeItem.bind(this)
					)
				},
				this.speed
			);
		}
		this.played = !this.played;
	}

	changeItem(){
		// const deleteArray = [];
		// const addArray = [];
		const changeArray = [];
		
		const begin = performance.now();
		// Сбор массивов для удаления/добавления эл-ов
		for(let y = 0; y < this.rowCount; y++){
			for(let x = 0; x < this.columnCount; x++){
				const col = this.getNeighbor(x, this.columnCount);
				const row = this.getNeighbor(y, this.rowCount);
				const sum = 
					this.arrayData[y][col.prev] +
					this.arrayData[y][col.next] +
					this.arrayData[row.prev][x] +
					this.arrayData[row.next][x] +
					this.arrayData[row.prev][col.prev] +
					this.arrayData[row.next][col.prev] +
					this.arrayData[row.prev][col.next] +
					this.arrayData[row.next][col.next];

				if(this.arrayData[y][x]){ 
					if(sum < 2 || sum > 3){
						changeArray.push({x, y, life: false});
					}
				}else{
					if(sum === 3){
						changeArray.push({x, y, life: true});
					}
				}
			}
		}

		this.changeElementsByCoordArray(changeArray);

		this.generationTime.textContent = (performance.now() - begin).toFixed(2);
	}

	changeElementsByCoordArray(coordArray){
		console.time('changeElementsByCoordArray');
		coordArray.forEach(({x, y, life}) => {
			if(this.visibileRows[y] && this.visibileColumns[x]){
				this.elemets[y][x].classList.toggle('active', life);
			}
			this.arrayData[y][x] = life;
		});
		console.timeEnd('changeElementsByCoordArray');
	}

	getNeighbor(index, arrayLength){
		switch (index) {
			case 0:
			return {
				prev: arrayLength - 1,
				next: 1
			}
		
			case arrayLength - 1:
			return {
				prev: index - 1,
				next: 0
			}
		
			default:
			return {
				prev: index - 1,
				next: index + 1
			}
		}
	}
}