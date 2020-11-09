const powerSupplies = PowerSupplies.map(powerSupply => ({ ...powerSupply }));

const collectedData = [ {
	cableType: "2 x 1 mm2",
	cableLen_m: 10,
	deviceType: "Teta EcoWent"
} ];

const completeData = {
	supplyType: "24V z podtrzymaniem"
};

window.addEventListener('scroll', () => {
	const buttonDiv = document.querySelector('.popup');
	if( window.scrollY >= buttonDiv.offsetTop ) {
		buttonDiv.classList.add('sticky');
	} else {
		buttonDiv.classList.remove('sticky');
	}
});

window.addEventListener('load', () => {
	select(powerSupplies, 'powerSupplyLabel', 'powerSupply', 'powerManagementInstallationContainer', `powerSupplyContainer`, `powerSupply`);

	picture('psu', `psuImageContainer`, `powerSupplyContainer`, `imagePSU`);

	handleDragAndDrop();

	generateSegments(collectedData);
	initializeSegmentData();
	handleButtonEvents();
	handleCheckboxes();
	handleFileEvents();
	setupBusImage();
	handlePSU();

	const segments = document.querySelectorAll('.installationSegment');
	segments.forEach((segment) => {
		segment.addEventListener('change', e => handleInputAndSelectChange(e));
	});

	completeData.bus = [ ...collectedData ];

	const targetNode = document.querySelector("#installationContainer");

	const config = {
		childList: true,
		subtree: false,
		attributes: false,
		characterData: false,
	};

	const observer = new MutationObserver(handleDOMChange);
	observer.observe(targetNode, config);
	fileButtons();
	systemInformation();
});

function handleDOMChange(mutations) {
	if( document.querySelector('.segmentContainer0') ) {
		document.querySelector('.segmentContainer0').dataset.listener = 'true';
	}

	for( let changes of mutations ) {
		if( changes.removedNodes.length === 0 && changes.addedNodes.length > 0 && changes.addedNodes[0].dataset.listener === 'false' ) {
			changes.addedNodes[0].addEventListener('change', e => handleInputAndSelectChange(e));
			changes.addedNodes[0].dataset.listener = 'true';
		}
	}

	const segments = document.querySelectorAll('.installationSegment');
	if( segments.length === 1 && document.querySelector('.checkboxesContainer') ) {
		const checkboxesContainer = document.querySelector('.checkboxesContainer');
		checkboxesContainer.parentNode.removeChild(checkboxesContainer);
	}
	 console.log(Cable.usedIndexes);
	setupBusImage();
	completeData.bus = collectedData;
	handleCheckboxes();
	handlePSU();
	systemInformation();
}

function fileButtons() {
	const fileButtonsDiv = document.createElement('div');
	const saveToFile = document.createElement('input');
	const fileInput = document.createElement('input');
	const readFromFile = document.createElement('button');

	fileInput.setAttribute('id', "file-input");
	fileInput.type = "file";
	fileInput.name = "name";
	fileInput.setAttribute("style", "display: none;");
	readFromFile.setAttribute('onclick', ".click();");

	saveToFile.setAttribute('id', 'saveSystemToFile');
	readFromFile.setAttribute('id', 'readSystemFromFile');
	readFromFile.setAttribute('type', 'file');

	saveToFile.classList.add('saveFileAnchor');
	readFromFile.classList.add('readFile');
	fileButtonsDiv.classList.add('fileDiv');

	saveToFile.type = 'button';
	saveToFile.value = 'Zachowaj system';

	readFromFile.innerText = 'Wczytaj system';
	const powerSupplyContainer = document.querySelector('.powerSupplyContainer');

	fileButtonsDiv.append(fileInput);
	fileButtonsDiv.append(saveToFile);
	fileButtonsDiv.append(readFromFile);
	powerSupplyContainer.prepend(fileButtonsDiv);
}

function handleDroppedFile(e) {
	e.stopPropagation();
	e.preventDefault();

	const dataTransfer = e.dataTransfer;
	const files = dataTransfer.files;
	const installationContainer = document.querySelector('.installationContainer');

	for( let file of files ) {
		const blob = new Blob([ file ], { type: "application/json" });
		const fr = new FileReader();

		fr.addEventListener('load', () => {
			Array.from(installationContainer.children).forEach(child => child.parentNode.removeChild(child));
			const data = JSON.parse(fr.result);

			const bus = [ ...data.bus ];
			Cable.usedIndexes = [];
			generateSegments(bus);
			completeData.bus = [];
			while( collectedData.length > 0 ) {
				collectedData.pop();
			}

			(document.querySelector('.powerSupply')).value = data.supplyType;

			const segments = document.querySelectorAll('.installationSegment');
			segments.forEach((segment, i) => {
				completeData.bus.push({
																cableType: bus[i].cableType,
																cableLen_m: bus[i].cableLen_m,
																deviceType: bus[i].deviceType
															});
				segment.querySelector('.cableSelect').value = bus[i].cableType;
				segment.querySelector('input[name="cableInput"]').value = bus[i].cableLen_m;
				segment.querySelector('.deviceSelect').value = bus[i].deviceType;
				if(i !== 0) {
						segment.querySelector('#Skopiuj0').setAttribute('id', `Skopiuj${i}`);
						segment.querySelector('#Usun0').setAttribute('id', `Usun${i}`);
				}	
				chooseImg(segment.querySelector(`#deviceimage${i}`), bus[i].deviceType);
			});
			const firstSegment = document.querySelector('.segmentContainer0');
			firstSegment.addEventListener('change', e => handleInputAndSelectChange(e));
			collectedData.push(...completeData.bus);
		});
		checkboxButtons(installationContainer);
		systemInformation();
		fr.readAsText(blob);
	}
}

function handleDragAndDrop() {
	const dragAndDropContainer = document.querySelector('body');
	dragAndDropContainer.addEventListener('dragenter', dragenter);
	dragAndDropContainer.addEventListener('dragover', dragover);
	dragAndDropContainer.addEventListener('drop', handleDroppedFile);
}

function systemInformation() {
	const installationContainer = document.querySelector('.powerManagementInstallationContainer');
	const systemStatus = document.querySelector('.systemStatusText');
	const sysOk = isSystemOk(completeData);

	if( sysOk ) {
		installationContainer.classList.remove('sysWrong');
		installationContainer.classList.add('sysOk');
		systemStatus.innerText = `System: poprawny`;
		const powerConsumption = document.getElementById('powerConsumption');
		powerConsumption.innerText = `Zapotrzebowanie na moc przez elementy magistrali: ${Math.ceil(analiseSystem(completeData).powerConsumption_W)} W`;

	} else {
		installationContainer.classList.remove('sysOk');
		installationContainer.classList.add('sysWrong');
		systemStatus.innerText = "System: niepoprawny";
		const powerConsumption = document.getElementById('powerConsumption');
		powerConsumption.innerText = "";
	}
}

function generateSegments(dataArray) {
	dataArray.forEach((element, index) => {
		Cable.cableComponent(element, index);
		Device.deviceComponent(element, index);
		Device.deviceButtons(index);
	});
}

function initializeSegmentData() {
	const firstSegment = document.querySelector('.segmentContainer0');
	firstSegment.querySelector('.cableSelect').value = collectedData[0].cableType;
	firstSegment.querySelector('input[name="cableInput"]').value = collectedData[0].cableLen_m;
	firstSegment.querySelector('.deviceSelect').value = collectedData[0].deviceType;
	chooseImg(firstSegment.querySelector('#deviceimage0'), collectedData[0].deviceType);

	(document.querySelector('.powerSupply')).value = completeData.supplyType;
	const img = document.getElementById("imagePSU");
	img.srcset = "./Gfx/CU.svg";
	img.src = "./Gfx/CU.svg";
	img.alt = 'Unable to find image'
}

function dragenter(e) {
	e.stopPropagation();
	e.preventDefault();
}

function dragover(e) {
	e.stopPropagation();
	e.preventDefault();
}

function handlePSU() {
	const psuContainer = document.getElementById('powerSupply');
	psuContainer.addEventListener('change', e => {
		completeData.supplyType = e.target.value;
		const img = document.getElementById("imagePSU");
		if( e.target.value === '' ) {
			const parentNode = img.parentNode.parentNode;
			parentNode.removeChild(img.parentNode);
			picture('psu', `psuImageContainer`, `powerSupplyContainer`, `imagePSU`);
		} else {
			img.srcset = "./Gfx/CU.svg";
			img.src = "./Gfx/CU.svg";
			img.alt = 'Unable to find image';
		}
		systemInformation();
	});
}

function setupBusImage() {
	const imageElements = document.querySelectorAll('.cableimage');
	for( let p = 0; p < imageElements.length; p++ ) {
		if( p >= 0 && p !== imageElements.length - 1 ) {
			chooseImg(imageElements[p], "bus");
		} else {
			chooseImg(imageElements[p], "busEnd");
		}
	}
}

const checkAllCheckboxes = function() {
	const checkboxes = document.querySelectorAll('input[name="cableType"]');
	for( let checkbox of checkboxes ) {
		checkbox.checked = true;
	}
};

const unCheckAllCheckboxes = function() {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	for( let checkbox of checkboxes ) {
		checkbox.checked = false;
	}
};

function handleCheckboxes() {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');

	let lastChecked;

	function handleChange(e) {
		let inBetween = false;

		if( e.shiftKey && this.checked ) {
			checkboxes.forEach(checkbox => {
				if( checkbox === this || checkbox === lastChecked ) {
					inBetween = !inBetween;
				}
				if( inBetween ) {
					checkbox.checked = true;
				}
			});
		}
		lastChecked = this;
	}

	checkboxes.forEach(checkbox => checkbox.addEventListener('click', handleChange));
}

function readFromFile() {
	const element = document.getElementById('file-input');
	element.click();
}

function handleFileEvents() {
	const powerSupplyContainer = document.querySelector('.powerSupplyContainer');
	powerSupplyContainer.addEventListener('click', function(e) {
		if( e.target.id === 'saveSystemToFile' ) {
			saveToFile(completeData);
		} else if( e.target.id === 'readSystemFromFile' ) {
			readFromFile(e);
		}
	});
}

function handleButtonEvents() {
	const installationSegment = document.getElementById('powerManagementInstallationContainer');
	installationSegment.addEventListener('click', e => {
		console.log(e);
		console.log(e.currentTarget);
		if( e.target.id.includes("Skopiuj") ) {
			handleCopyNthTimes(e);
		} else if( e.target.id.includes("Usun") ) {
			handleDeleteDevice(e);
		} else if( e.target.id.includes('selectAllCheckboxes') ) {
			checkAllCheckboxes();
		} else if( e.target.id.includes('unCheckAllCheckboxesButton') ) {
			unCheckAllCheckboxes();
		}
	});
}

function selectedCheckboxes(segmentList) {
	return Array.from(segmentList).filter(segment => {
		const checkbox = segment.querySelector('input[type="checkbox"]');
		return checkbox.checked ? segment : null;
	});
}

function handleInputAndSelectChange(event) {
	const segments = document.querySelectorAll('.installationSegment');
	const checkedSegments = selectedCheckboxes(segments);

	switch( event.target.name ) {
		case 'cableSelect': {
			const findIndex = Array.from(segments).findIndex(segment => segment === event.currentTarget);
			collectedData[findIndex].cableType = event.target.value;
			if( checkedSegments ) {
				checkedSegments.forEach((segment) => {
					const indexToUpdate = Array.from(segments).findIndex(checkedSegment => segment === checkedSegment);
					const cableSelect = segment.querySelector(`.cableSelect`);
					cableSelect.value = event.target.value;
					collectedData[indexToUpdate].cableType = event.target.value;
				});
			}
			break;
		}

		case 'deviceSelect': {
			const findIndex = Array.from(segments).findIndex(segment => segment === event.currentTarget);
			const img = event.currentTarget.querySelector(`.deviceimage`);

			collectedData[findIndex].deviceType = event.target.value;
			chooseImg(img, event.target.value);

			if( checkedSegments ) {
				checkedSegments.forEach((segment) => {
					const indexToUpdate = Array.from(segments).findIndex(checkedSegment => segment === checkedSegment);
					const deviceSelect = segment.querySelector(`.deviceSelect`);
					const img = segment.querySelector(`.deviceimage`);

					chooseImg(img, event.target.value);
					deviceSelect.value = event.target.value;
					collectedData[indexToUpdate].deviceType = event.target.value;
				});
			}
			break;
		}

		case 'cableInput': {
			const findIndex = Array.from(segments).findIndex(segment => segment === event.currentTarget);
			collectedData[findIndex].cableLen_m = parseFloat(event.target.value);
			if( checkedSegments ) {
				checkedSegments.forEach((segment) => {
					const indexToUpdate = Array.from(segments).findIndex(checkedSegment => segment === checkedSegment);
					const cableInput = segment.querySelector('input[name="cableInput"]');
					cableInput.value = event.target.value;
					collectedData[indexToUpdate].cableLen_m = parseFloat(event.target.value);
				});
			}
			break;
		}
	}
	systemInformation();
}

chooseImg = (img, value) => {
	switch( value ) {
		case "Teta EcoWent" : {
			img.srcset = "./Gfx/EcoWent.svg";
			img.src = "./Gfx/EcoWent.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Teta EcoDet": {
			img.srcset = "./Gfx/EcoDet.svg";
			img.src = "./Gfx/EcoDet.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Teta EcoWent + MiniDet": {
			img.srcset = "./Gfx/EcoWent_MiniPel.svg";
			img.src = "./Gfx/EcoWent_MiniPel.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Teta EcoTerm": {
			img.srcset = "./Gfx/EcoTerm.svg";
			img.src = "./Gfx/EcoTerm.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Teta EcoH": {
			img.srcset = "./Gfx/TetaEcoH.svg";
			img.src = "./Gfx/TetaEcoH.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Teta EcoN": {
			img.srcset = "./Gfx/TetaEcoN.svg";
			img.src = "./Gfx/TetaEcoN.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "TOLED": {
			img.srcset = "./Gfx/TOLED.svg";
			img.src = "./Gfx/TOLED.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "SZOA": {
			img.srcset = "./Gfx/SZOA.svg";
			img.src = "./Gfx/SZOA.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Control V": {
			img.srcset = "./Gfx/ControlV.svg";
			img.src = "./Gfx/ControlV.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "bus": {
			img.srcset = "./Gfx/Bus.svg";
			img.src = "./Gfx/Bus.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "busEnd": {
			img.srcset = "./Gfx/busEnd.svg";
			img.src = "./Gfx/busEnd.svg";
			img.alt = 'Unable to find image';
			break;
		}
	}
}



