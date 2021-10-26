function saveToFile(dataToSave) {
	const date = new Date();
	const saveFileName = `TetaSystem_${date.getFullYear()}_${getMonth(date)}_${date.getDate()}__${date.getHours()}_${date.getMinutes()}`;
	const anchor = document.createElement('a');
	anchor.style = 'display:none';
	const fileName = prompt("Nazwa pliku?", `${saveFileName}`);
	if( fileName === null ) return;
	const dataAsString = JSON.stringify(dataToSave);
	const blob = new Blob([ dataAsString ], { type: "text/javascript" });
	anchor.href = window.URL.createObjectURL(blob);
	anchor.download = `${fileName}.json`;
	anchor.click();
}

function getMonth(date) {
	const month = new Date().getMonth() + 1;
	return month < 10 ? `0${month}` : month;
}

function dragenter(e) {
	e.stopPropagation();
	e.preventDefault();
}

function dragover(e) {
	e.stopPropagation();
	e.preventDefault();
}

function readFromFile() {
	const element = document.getElementById('file-input');
	element.addEventListener('change', e => handleDroppedFile(e));
	element.click();
}

function fileButtons() {
	const fileButtonsDiv = document.createElement('div');
	const saveToFile = document.createElement('button');
	const readFromFile = document.createElement('button');
	const saveToFileImage = document.createElement(`img`);
	const readFromFileImage = document.createElement(`img`);
	const fileContainer = document.querySelector(`.fileButtons`);

	saveToFile.setAttribute('id', 'saveSystemToFile');
	saveToFile.className = `saveSystemToFile`;

	readFromFile.setAttribute('id', 'readSystemFromFile');
	readFromFile.setAttribute('type', 'file');

	saveToFileImage.className = `saveToFileImage`;
	saveToFileImage.setAttribute('alt', 'unable to find image');
	readFromFileImage.setAttribute('alt', 'unable to find image');
	readFromFileImage.className = `readFromFileImage`;

	saveToFile.classList.add('saveFile');
	readFromFile.classList.add('readFile');
	fileButtonsDiv.classList.add('fileDiv');

	saveToFile.type = 'button';
	saveToFile.innerText = chooseText(usedText.zachowajSystem);

	readFromFile.innerText = chooseText(usedText.wczytajSystem);
	const powerSupplyContainer = document.querySelector('.configurationPanel');

	// fileButtonsDiv.append(fileInput);
	fileButtonsDiv.append(saveToFile);
	fileButtonsDiv.append(saveToFileImage);
	fileButtonsDiv.append(readFromFile);
	fileButtonsDiv.append(readFromFileImage);
	fileContainer.appendChild(fileButtonsDiv);
}

function addImageToFiles() {
	const saveToFileImage = document.querySelector(`.saveToFileImage`);
	const readFromFileImage = document.querySelector(`.readFromFileImage`);
	saveToFileImage.src = `./SVG/save.svg`;
	readFromFileImage.src = `./SVG/load.svg`;
}

function handleDroppedFile(e) {
	e.stopPropagation();
	e.preventDefault();
	const dataTransfer = e.dataTransfer;
	const files = e.target.files || dataTransfer.files;
	const installationContainer = document.querySelector('.installationContainer');
	for (let file of files) {
		const blob = new Blob([file], { type: "application/json" });
		const fr = new FileReader();

		fr.addEventListener('load', () => {
			Array.from(installationContainer.children).forEach(child => child.parentNode.removeChild(child));
			const data = JSON.parse(fr.result);

			Cable.usedIndexes = [];

			getSystem(setSystem(data));
			(document.querySelector('.powerSupply')).value = data.supplyType;

			const segments = document.querySelectorAll('.installationSegment');

			segments.forEach((segment, i) => {
				if (i !== 0) {
					segment.querySelector('.copyButton').setAttribute('id', `Skopiuj${i}`);
					segment.querySelector('.deleteButton').setAttribute('id', `Usun${i}`);
				}
			});
			systemInformation();

		});
		fr.readAsText(blob);
	}
}

function handleDragAndDrop() {
	const dragAndDropContainer = document.querySelector('body');
	dragAndDropContainer.addEventListener('dragenter', dragenter);
	dragAndDropContainer.addEventListener('dragover', dragover);
	dragAndDropContainer.addEventListener('drop', handleDroppedFile);
}