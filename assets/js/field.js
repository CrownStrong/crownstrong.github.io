export class FieldBuilder{		
	constructor(){
		this.generationTime = document.getElementById('generationTime');
		this.buttonTemplate = this.getButtonTemplate();
		this.rowTemplate = this.getRowTemplate();
		this.gameTemplate = this.getGameTemplate();
		this.wrapper = document.querySelector('.game-wrap');
		this.observerRow = this.observerRowInit();
		this.observerColumn = this.observerColumnInit();
		this.markerTemplate = this.getMarkerTemplate();
	}

	init({columns, rows}){
		this.rows = rows;
		this.columns = columns;
		this.arrayData = this.generateData(columns, rows);
		this.nodeList = this.getNodeList();
		this.visibileRows = Array(rows);
		this.visibileColumns = Array(columns);
	}

	observerRowInit(){
		const ob = new IntersectionObserver(
			entries=>{
				entries.forEach(entry=>{
					const {target, isIntersecting} = entry;
					this.toggleUnvisibleRowAttr(target, !isIntersecting);
					const rowIndex = Number(target.getAttribute('data-row'));
					this.visibileRows.fill(isIntersecting, rowIndex, rowIndex + 10);
				});
			},
			{
				rootMargin: '112px 0px 112px 0px'
			}
		);
		return ob;
	}
	observerColumnInit(){
		const ob = new IntersectionObserver(
			entries=>{
				entries.forEach(entry=>{
					const {target, isIntersecting} = entry;
					this.toggleUnvisibleColumnAttr(target, !isIntersecting);
					const columnIndex = Number(target.getAttribute('data-column'));
					this.visibileColumns.fill(isIntersecting, columnIndex, columnIndex + 10);
				});
				// console.log(this.visibileColumns);
			},
			{
				rootMargin: '0px 112px 0px 112px'
			}
		);
		return ob;
	}

	//
	async toggleUnvisibleColumnAttr(el, unvisibile, _index = 0){
		let begin = this.visibileRows.indexOf(true);
		const end = this.visibileRows.lastIndexOf(true);
		for(let i = begin; i <= end; i++){
			// console.log(this.visibileRows[i]);
			if(this.visibileRows[i]){
				this.repaint(
					document.querySelector(`[data-row="${i}"]`)
				)
			}
		}
	}
	//

	async toggleUnvisibleRowAttr(el, unvisibile, _index = 0){
		if(!unvisibile) this.repaint(el);
		el.classList.toggle('unvisible', unvisibile);
		const nextElement = el.nextSibling;
		if(nextElement && _index < 10) this.toggleUnvisibleRowAttr(nextElement, unvisibile, ++_index);
	}

	async repaint(el){
		const rowIndex = el.getAttribute('data-row');
		const children = [...el.children];
		children.forEach((child, childIndex)=>{
			child.classList.toggle(
				'active',
				this.arrayData[rowIndex][childIndex]
			);
		})
	}

	cleanField(){
		const begin = performance.now();
		this.arrayData.forEach((row, rowIndex)=>{
			row.forEach((col, colIndex)=>{
				if(col == true){
					this.arrayData[rowIndex][colIndex] = false;
					if(this.visibileRows[rowIndex]){
						this.nodeList[rowIndex][colIndex].classList.remove('active');
					}
				}
			})
		});
		this.generationTime.textContent = (performance.now() - begin).toFixed(2);
	}

	async randomize(){
		const begin = performance.now();
		for(let colIndex = 0; colIndex < this.columns; colIndex++){
			for(let rowIndex = 0; rowIndex < this.rows; rowIndex++){
				const old = this.arrayData[rowIndex][colIndex];
				const newValue = Math.random() < 0.3;
				if(old != newValue){
					this.arrayData[rowIndex][colIndex] = newValue;
					if(this.visibileRows[rowIndex]){
						this.nodeList[rowIndex][colIndex].classList.toggle(
							'active', 
							this.arrayData[rowIndex][colIndex]
						);
					}
				}
			}
		}
		this.generationTime.textContent = (performance.now() - begin).toFixed(2);
	}

	generateData(columns, rows){
		// console.time('generateBooleanData');
		let array = [];
		let column = [];
		for(let j = 0; j < columns; j++){
			column[j] = false;
		}
		for(let i = 0; i < rows; i++){
			array.push([...column]);
		}
		// console.timeEnd('generateBooleanData');
		return array;
	}

	getButtonTemplate(){
		const button = document.createElement('button');
		button.classList = 'game__item';
		return button;
	}
	getRowTemplate(){
		const rowEl = document.createElement('div');
		rowEl.classList = 'game__row';
		return rowEl;
	}
	getGameTemplate(){
		const game = document.createElement('div');
		game.classList = 'game';
		return game;
	}
	getNodeList(){
		console.time('generateNodeList');
		const game = this.gameTemplate.cloneNode(false);
		const nodeList = [];

		const row = this.rowTemplate.cloneNode(false);

		for(let j = 0; j < this.columns; j++){
			const button = this.buttonTemplate.cloneNode(false);
			button.setAttribute('data-column', j);
			row.append(button);

			//
			if(!(j % 10)){
				const markerClone = this.markerTemplate.cloneNode(false);
				markerClone.style = 'left:' + (j * 11) + 'px';
				markerClone.setAttribute('data-column', j);
				this.observerColumn.observe(markerClone);
				game.append(markerClone);
			}
			//
		}

		for(let i = 0; i < this.rows; i++){	
			const clone = row.cloneNode(true);
			clone.setAttribute('data-row', i);
			if(!(i % 10)){
				this.observerRow.observe(clone);
			}
			nodeList.push([...clone.children]);
			game.append(clone);
		}
		
		this.wrapper.innerHTML = '';
		this.wrapper.append(game);
		console.timeEnd('generateNodeList');
		return nodeList;
	}



	getMarkerTemplate(){
		const marker = document.createElement('div');
		marker.classList = 'game__marker';
		return marker;
	}
}