function prepDataToSaveInFile(systemData) {
	let cableLength = 0;

	const sumAllDeviceEntries = systemData.bus.reduce((obj, currentValue, i) => {
		if (!obj[currentValue.deviceName]) {
			obj[currentValue.deviceName] = 0;
		}
		obj[currentValue.deviceName]++;
		return obj;
	}, {});

	const sumAllCableDimsLengths = systemData.bus.reduce((obj, currentValue, i) => {
		if (!obj[currentValue.cableType]) {
			obj[currentValue.cableType] = 0;
		}
		if (!obj[`Długość kabla:`]) {
			obj[`Długość kabla`] = cableLength;
		}
		obj[currentValue.cableType]++;
		cableLength += systemData.bus[i].cableLen_m;
		obj[`Długość kabla`] = cableLength;
		return obj;
	}, {});

	const deviceTypes = Object.keys(sumAllDeviceEntries).map((value, index) => {
		const foundDevice = NewDevices.find(device => device.type === value ? device : '');
		return foundDevice.device;
	});

	const CSV = [
		["kolumnaA", "kolumnaB", "kolumnaC"],
		["RządA", "RządB", "RządC"]
	]

	// const CSV = [
	// 	[`lp.`, `Nazwa urządzenia`, `Rodzaj urządzenia`, `Ilość`, `Zasilacz`],
	// 	[deviceTypes],
	// 	Object.keys(sumAllDeviceEntries),
	// 	Object.values(sumAllDeviceEntries),
	// 	Object.keys(sumAllCableDimsLengths),
	// 	Object.values(sumAllCableDimsLengths),
	// 	[systemData.supplyType]
	// ];
	return CSV;
}

function systemSketch(dataToSave, saveFileName) {
	const anchor = document.createElement('a');
	anchor.style = 'display:none';
	const fileName = `${saveFileName}sketch`;
	if (fileName === null) return;
	const dataAsString = JSON.stringify(dataToSave);
	const blob = new Blob([dataAsString], { type: "text/javascript" });
	anchor.href = window.URL.createObjectURL(blob);
	anchor.download = `${fileName}.json`;
	anchor.click();
}


function saveToFile(dataToSave) {
	const result = prepDataToSaveInFile(dataToSave);


	// const csvFile = "data:text/csv/csv;charset=utf-8, " + result.map(element => element.join(",")).join("\n");
	// const csvFile = "data:text/csv/csv;charset=utf-8, " + result.map((element, i) => {
	// 	// element.join(",").join("\n")
	// 	for (let k = 0; k <= result[i].length; k++) {
	// 		console.log(result[k]);
	// 		// for (let p = 0; p <= element[i].length; p++) {
	// 		// 	reutrn result[]
	// 		// }
	// 		return result;			
	// 	}
	// })
	// console.log(csvFile);

	const date = new Date();
	const saveFileName = `TetaSystem_${date.getFullYear()}_${getMonth(date)}_${date.getDate()}__${date.getHours()}_${date.getMinutes()}`;
	// const encodedUri = encodeURI(csvFile);
	// const anchor = document.createElement('a');
	// anchor.style = 'display:none';
	// const fileName = prompt("Nazwa pliku?", `${saveFileName}`);
	// anchor.setAttribute(`href`, encodedUri);
	// systemSketch(systemData, fileName);
	// if (fileName === null) {
	// 	anchor.setAttribute(`download`, `${saveFileName}.csv`);
	// } else {
	// 	anchor.setAttribute(`download`, `${fileName}.csv`);
	// }
	// anchor.click();
}

function getMonth(date) {
	const month = new Date().getMonth() + 1;
	return month < 10 ? `0${month}` : month;
}

function loadFile(e) {
	console.log('dfgh');
	const reader = new FileReader();
	reader.onload = function () {
		getSystem(setSystem(JSON.parse(reader.result)));
		setupBusImage();
		setupImagesForSegments();
	}
	reader.readAsText(e.target.files[0]);
}

function readFromFile() {
	const fileInput = document.getElementById(`readFileInput`);
	fileInput.addEventListener('change', loadFile);
	fileInput.click();
}

function fileButtons() {
	const fileButtonsDiv = document.createElement('div');
	const saveToFile = document.createElement('button');
	const readIFileInput = document.createElement(`input`);
	const readFromFile = document.createElement('button');
	const saveToFileImage = document.createElement(`img`);
	const readFromFileImage = document.createElement(`img`);
	const fileContainer = document.querySelector(`.fileButtons`);

	saveToFile.setAttribute('id', 'saveSystemToFile');
	saveToFile.className = `saveSystemToFile`;

	readIFileInput.setAttribute(`id`, `readFileInput`);
	readIFileInput.setAttribute(`type`, `file`);
	readIFileInput.style.display = `none`;

	readFromFile.setAttribute('id', 'readSystemFromFile');
	readFromFile.setAttribute('type', 'button');

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
	fileButtonsDiv.append(readIFileInput);
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


function dragenter(e) {
	e.stopPropagation();
	e.preventDefault();
}

function dragover(e) {
	e.stopPropagation();
	e.preventDefault();
}

function handleDroppedFile(e) {
	e.stopPropagation();
	e.preventDefault();
	const dataTransfer = e.dataTransfer;
	const files = e.target.files || dataTransfer.files;
	const reader = new FileReader();
	reader.onload = function () {
		getSystem(setSystem(JSON.parse(reader.result)));
		setupBusImage();
		setupImagesForSegments();
	}
	reader.readAsText(files[0]);
}

function handleDragAndDrop() {
	const dragAndDropContainer = document.querySelector('body');
	dragAndDropContainer.addEventListener('dragenter', dragenter);
	dragAndDropContainer.addEventListener('dragover', dragover);
	dragAndDropContainer.addEventListener('drop', handleDroppedFile);
}