const powerSupplies = PowerSupplies.map(powerSupply => ({ ...powerSupply }));

const collectedData = [ {
	cableType: "2 x 1 mm2",
	cableLen_m: 10,
	deviceType: "Teta EcoWent"
} ];
const completeData = {};
let sysOk = false;

window.addEventListener('load', () => {
	select(powerSupplies, 'powerSupplyLabel', 'powerSupply', 'powerManagementInstallationContainer', `powerSupplyContainer`, `powerSupply`);
	picture('psu', `psuImageContainer`, `powerSupplyContainer`, `imagePSU`);

	// const dragAndDropContainer = document.getElementById('installationContainer');
	// dragAndDropContainer.addEventListener('dragenter', dragenter, false);
	// dragAndDropContainer.addEventListener('dragover', dragover, false);
	// dragAndDropContainer.addEventListener('drop', function(e) {
	// 	e.stopPropagation();
	// 	e.preventDefault();
	//
	// 	const dataTransfer = e.dataTransfer;
	// 	const files = dataTransfer.files;
	//
	// 	for( let file of files ) {
	// 		const blob = new Blob([ file ], { type: "application/json" });
	// 		const fr = new FileReader();
	//
	// 		fr.addEventListener('load', e => {
	// 			const firstSegment = document.querySelector('.segmentContainer0');
	// 			firstSegment.parentNode.removeChild(firstSegment);
	// 			const data = JSON.parse(fr.result);
	// 			const bus = [...data.bus];
	// 			generateSegmentsData(bus);
	// 			const segments = document.querySelectorAll('.installationSegment');
	// 			segments.forEach((segment,i) => {
	// 				segment.querySelector('.cableSelect').value = bus[i].cableType;
	// 				segment.querySelector('input[name="cableInput"]').value = bus[i].cableLen_m;
	// 				segment.querySelector('.deviceSelect').value = bus[i].deviceType;
	// 			});
	// 		});
	//
	// 		fr.readAsText(blob);
	// 	}
	//
	// }, false);

	generateSegments(collectedData);
	initializeSegmentData();

	handleButtonEvents();

	const segments = document.querySelectorAll('.installationSegment');
	//setting up images for wires
	setupBusImage();
	updateInputs(segments);
	handlePSU();

	completeData.bus = [ ...collectedData ];

	const targetNode = document.querySelector("#installationContainer");

	const config = {
		childList: true,
		subtree: true,
		attributes: false,
		characterData: true,
	};

	const observer = new MutationObserver(handleDOMChange);

	observer.observe(targetNode, config);
});

function handleDOMChange() {
	setupBusImage();
	completeData.bus = collectedData;
	systemInformation();
}

window.addEventListener('change', () => {
	handlePSU();
	const segments = document.querySelectorAll('.installationSegment');
	updateInputs(segments);
	handleCheckboxes();
	systemInformation();
});

function systemInformation() {
	const installationContainer = document.querySelector('.installationContainer');
	const systemStatus = document.querySelector('.systemStatusText');
	sysOk = isSystemOk(completeData);
	if(sysOk){
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

}

// function dragenter(e) {
// 	e.stopPropagation();
// 	e.preventDefault();
// }
//
// function dragover(e) {
// 	e.stopPropagation();
// 	e.preventDefault();
// }

// function drop(e) {
// 	e.stopPropagation();
// 	e.preventDefault();
//	
// 	const dataTransfer = e.dataTransfer;
// 	const files = dataTransfer.files;
// 	return handleFiles(files);
// }

// function handleFiles(files) {
// 	for( let file of files ) {
// 		const blob = new Blob([ file ], { type: "application/json" });
// 		const fr = new FileReader();
//
// 		fr.addEventListener('load', e => {
// 			console.log(JSON.parse(fr.result));
// 			return JSON.parse(fr.result);
// 		});
//
// 		fr.readAsText(blob);
// 		console.log(file.name);
//
// 	}
// }

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

function selectedCheckboxes(segments) {
	return Array.from(segments).filter((segment, i) => {
		const checkbox = segment.querySelector('input[type="checkbox"]');
		return checkbox.checked ? segment : null;
	});
}

const checkAllCheckboxes = function() {
	const checkboxes = document.querySelectorAll('input[name="cableType"]');
	for( let checkbox of checkboxes ) {
		checkbox.checked = true;
	}
	const segments = document.querySelectorAll('.installationSegment');
	updateInputs(segments);
};

const unCheckAllCheckboxes = function() {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	for( let checkbox of checkboxes ) {
		checkbox.checked = false;
	}
	handleDOMChange();

	const segments = document.querySelectorAll('.installationSegment');
	updateInputs(segments);
};

handleCheckboxes = function() {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	let lastChecked;

	function handleCheck(e) {
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
			handleDOMChange();
		}
		lastChecked = this;
	}

	checkboxes.forEach(checkbox => checkbox.addEventListener('click', handleCheck));
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
		}
	});
}

function handleInputAndSelectChange(event, checkedSegments, index, checked) {
	switch( event.target.name ) {
		case 'cableSelect': {
			if( checked ) {
				checkedSegments.forEach(segment => {
					const cableSelect = segment.querySelector(`.cableSelect`);
					cableSelect.value = event.target.value;
					collectedData[index].cableType = event.target.value;
				});
			} else {
				collectedData[index].cableType = event.target.value;
			}
			break;
		}
		case 'deviceSelect': {
			if( checked ) {
				checkedSegments.forEach(segment => {
					const deviceSelect = segment.querySelector(`.deviceSelect`);
					const img = segment.querySelector(`.deviceimage`);
					if( event.target.value === '' ) {
						img.removeAttribute('src');
						img.removeAttribute('srcset');
						img.removeAttribute('alt');
					} else {				
						chooseImg(img, event.target.value);
						deviceSelect.value = event.target.value;
						collectedData[index].deviceType = event.target.value;
					}
				});
			} else if( !checked ) {
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
			if( checked ) {
				checkedSegments.forEach(segment => {
					const cableInput = segment.querySelector('input[name="cableInput"]');
					cableInput.value = event.target.value;
					collectedData[index].cableLen_m = parseInt(event.target.value);
				});
			} else {
				collectedData[index].cableLen_m = parseInt(event.target.value);
			}
			break;
		}
	}
}

updateInputs = function(segments) {
	const segmentsChecked = selectedCheckboxes(segments) || [];
	segments.forEach((segment, i) => {
		const checkbox = segment.querySelector('input[type="checkbox"]');
		segment.addEventListener('change', e => handleInputAndSelectChange(e, segmentsChecked, i, checkbox.checked))
	});
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



