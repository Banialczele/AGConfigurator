const powerSupplies = PowerSupplies.map(powerSupply => ({ ...powerSupply }));

const collectedData = [ {
	cableType: "2 x 1 mm2",
	cableLen_m: 10,
	deviceType: "Teta EcoWent"
} ];

const completeData = {
	supplyType: "24V z podtrzymaniem"
};
let sysOk = false;

window.addEventListener('load', () => {
	select(powerSupplies, 'powerSupplyLabel', 'powerSupply', 'powerManagementInstallationContainer', `powerSupplyContainer`, `powerSupply`);

	picture('psu', `psuImageContainer`, `powerSupplyContainer`, `imagePSU`);

	handleDragAndDrop();

	generateSegments(collectedData);
	initializeSegmentData();
	handleButtonEvents();
	setupBusImage();
	handlePSU();

	const segments = document.querySelectorAll('.installationSegment');
	segments.forEach((segment, i) => {
		segment.addEventListener('change', e => handleInputAndSelectChange(e, segments, i))
	});

	completeData.bus = [ ...collectedData ];

	const targetNode = document.querySelector("#installationContainer");

	const config = {
		childList: true,
		subtree: true,
		attributes: false,
		characterData: false,
	};

	const observer = new MutationObserver(handleDOMChange);
	observer.observe(targetNode, config);
	saveToFileButton();
	systemInformation();
});

function handleDOMChange() {
	setupBusImage();
	completeData.bus = collectedData;
	handleCheckboxes();
	const segments = document.querySelectorAll('.installationSegment');
	segments.forEach((segment, i) => {
		segment.addEventListener('change', e => handleInputAndSelectChange(e, segments, i))
	});
	droppedFileGenerateData();
	systemInformation();
}

window.addEventListener('change', () => {
	handlePSU();
	const segments = document.querySelectorAll('.installationSegment');
	segments.forEach((segment, i) => {
		segment.addEventListener('change', e => handleInputAndSelectChange(e, segments, i))
	});
	systemInformation();
});

function droppedFileGenerateData() {
	const segments = document.querySelectorAll('.installationSegment');
	completeData.supplyType = (document.querySelector('.powerSupply')).value;
	segments.forEach((segment) => {
		completeData.bus.push({
														cableType: segment.querySelector('.cableSelect').value,
														cableLen_m: segment.querySelector('input[name="cableInput"]').value,
														deviceType: segment.querySelector('.deviceSelect').value
													});
	});
}

function saveToFileButton() {
	const saveToFile = document.createElement('input');
	saveToFile.setAttribute('id', 'saveSystemToFile');
	saveToFile.classList.add('saveFileAnchor');
	saveToFile.type = 'button';
	saveToFile.value = 'Zachowaj system';
	const powerSupplyContainer = document.querySelector('.powerSupplyContainer');

	powerSupplyContainer.prepend(saveToFile);
}

function handleDroppedFile(e) {
	e.stopPropagation();
	e.preventDefault();

	const dataTransfer = e.dataTransfer;
	const files = dataTransfer.files;
	
	for( let file of files ) {
		const blob = new Blob([ file ], { type: "application/json" });
		const fr = new FileReader();

		fr.addEventListener('load', e => {
			// const installationContainer = document.querySelector('.installationContainer');
			// const firstSegment = installationContainer.firstElementChild;
			const installationContainer = document.querySelector('.installationContainer');
			Array.from(installationContainer.children).forEach(child => child.parentNode.removeChild(child));
			const data = JSON.parse(fr.result);
			
			const bus = [ ...data.bus ];               	

			generateSegments(bus);

			(document.querySelector('.powerSupply')).value = data.supplyType;

			const segments = document.querySelectorAll('.installationSegment');
			segments.forEach((segment, i) => {
				segment.querySelector('.cableSelect').value = bus[i].cableType;
				segment.querySelector('input[name="cableInput"]').value = bus[i].cableLen_m;
				segment.querySelector('.deviceSelect').value = bus[i].deviceType;
				chooseImg(segment.querySelector(`#deviceimage${i}`), bus[i].deviceType);
			});
			systemInformation();

		});

		fr.readAsText(blob);
	}
}

function handleDragAndDrop() {
	const dragAndDropContainer = document.querySelector('body');
	dragAndDropContainer.addEventListener('dragenter', dragenter, false);
	dragAndDropContainer.addEventListener('dragover', dragover, false);
	dragAndDropContainer.addEventListener('drop', handleDroppedFile, false);
}

function systemInformation() {
	const installationContainer = document.querySelector('.powerManagementInstallationContainer');
	const systemStatus = document.querySelector('.systemStatusText');
	sysOk = isSystemOk(completeData);
	if( sysOk ) {
		installationContainer.classList.remove('sysWrong');
		installationContainer.classList.add('sysOk');
	} else {
		installationContainer.classList.remove('sysOk');
		installationContainer.classList.add('sysWrong');
	}
	sysOk ? systemStatus.innerText = "System: poprawny" : systemStatus.innerText = "System: niepoprawny";
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

handleCheckboxes = function() {
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

handleButtonEvents = function() {
	const installationSegment = document.getElementById('powerManagementInstallationContainer');
	installationSegment.addEventListener('click', e => {
		if( e.target.id.includes("Skopiuj") ) {
			handleCopyNthTimes(e);
		} else if( e.target.id.includes("Usun") ) {
			handleDeleteDevice(e);
		} else if( e.target.id === 'selectAllCheckboxes' ) {
			checkAllCheckboxes();
		} else if( e.target.id === 'unCheckAllCheckboxesButton' ) {
			unCheckAllCheckboxes();
		} else if ( e.target.id === 'saveSystemToFile') {
			console.log(collectedData);
			saveToFile(completeData);
		}
	});
}

function selectedCheckboxes(segmentList) {
	return Array.from(segmentList).filter(segment => {
		const checkbox = segment.querySelector('input[type="checkbox"]');
		return checkbox.checked ? segment : null;
	});
}

function handleInputAndSelectChange(event, segments, index) {
	const checkedSegments = selectedCheckboxes(segments) || [];
	switch( event.target.name ) {
		case 'cableSelect': {
			if( checkedSegments.length > 0 ) {
				checkedSegments.forEach((segment) => {
					const indexToUpdate = Array.from(segments).findIndex( checkedSegment => segment === checkedSegment ); 					
					const cableSelect = segment.querySelector(`.cableSelect`);
					cableSelect.value = event.target.value;
					collectedData[indexToUpdate].cableType = event.target.value;
				});
			} else {
				collectedData[index].cableType = event.target.value;
			}
			break;
		}
		case 'deviceSelect': {
			if( checkedSegments.length > 0 ) {
				checkedSegments.forEach((segment) => {
					const indexToUpdate = Array.from(segments).findIndex( checkedSegment => segment === checkedSegment );
					const deviceSelect = segment.querySelector(`.deviceSelect`);
					const img = segment.querySelector(`.deviceimage`);
					if( event.target.value === '' ) {
						img.removeAttribute('src');
						img.removeAttribute('srcset');
						img.removeAttribute('alt');
					} else {
						chooseImg(img, event.target.value);
						deviceSelect.value = event.target.value;
						collectedData[indexToUpdate].deviceType = event.target.value;
					}
				});
			} else {
				const segment = event.target.parentNode.parentNode.parentNode;
				const selectedSegmentIndex = parseInt(segment.id.match(/\d+/)[0]);
				const img = document.querySelector(`#deviceimage${selectedSegmentIndex}`);

				if( event.target.value === '' ) {
					img.removeAttribute('src');
					img.removeAttribute('srcset');
					img.removeAttribute('alt');
				} else {
					collectedData[index].deviceType = event.target.value;
					chooseImg(img, event.target.value);
				}
			}
			break;
		}
		case 'cableInput': {
			if( checkedSegments.length > 0 ) {
				checkedSegments.forEach((segment) => {
					const indexToUpdate = Array.from(segments).findIndex( checkedSegment => segment === checkedSegment );
					const cableInput = segment.querySelector('input[name="cableInput"]');
					cableInput.value = event.target.value;
					collectedData[indexToUpdate].cableLen_m = parseFloat(event.target.value);
				});
			} else {
				collectedData[index].cableLen_m = parseFloat(event.target.value);
			}
			break;
		}
	}
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



