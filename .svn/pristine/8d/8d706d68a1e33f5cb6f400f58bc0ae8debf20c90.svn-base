const powerSupplies = PowerSupplies.map(powerSupply => ({ ...powerSupply }));

const collectedData = [ {
	cableType: "",
	cableLen_m: 0,
	deviceType: ""
} ];
const completeData = {};

window.addEventListener('scroll', () => {
	const buttonDiv = document.querySelector('.buttonDiv');
	if( window.scrollY >= buttonDiv.offsetTop ) {
		buttonDiv.classList.add('sticky');
	} else {
		buttonDiv.classList.remove('sticky');
	}
});

window.addEventListener('load', () => {
	select(powerSupplies, 'powerSupplyLabel', 'powerSupply', 'powerSupplySegmentContainer', `powerSupplyContainer`, `powerSupply`);
	picture('psu', `psuImageContainer`, `powerSupplyContainer`, `imagePSU`);

	collectedData.forEach((element, index) => {
		Cable.cableComponent(element, index);
		Device.deviceComponent(element, index);
		Device.deviceButtons(index);
	});

	displaySystemDataPanel();

	handleButtonEvents();

	const segments = document.querySelectorAll('.installationSegment');
	const images = document.querySelectorAll('.cableimage');

	//setting up images for wires
	setupBusImage(images);

	updateInputs(segments);

	completeData.bus = [ ...collectedData ];

	const powerSupplyElement = document.getElementById('powerSupply');
	handlePSU(powerSupplyElement);
	const targetNode = document.querySelector("#installationContainer");
	checkboxButtons();

	const config = {
		childList: true,
		subtree: true,
		attributes: false,
		characterData: false,
	};

	const observer = new MutationObserver(handleDOMChange);

	observer.observe(targetNode, config);
});

function handleDOMChange() {
	const images = document.querySelectorAll('.cableimage');
	setupBusImage(images);
	const segments = document.querySelectorAll('.installationSegment');

	updateInputs(segments);

	handleCheckboxes();

	const powerSupplyElement = document.getElementById('powerSupply');
	handlePSU(powerSupplyElement);

	completeData.bus = collectedData;
	displaySystemInfo(completeData);
}

//create panel with system information
function displaySystemDataPanel() {
	const installationContainer = document.querySelector('.powerManagementInstallationContainer');
	const systemInfo = document.createElement('div');
	systemInfo.classList.add('systemInfo');
	const systemInfoList = document.createElement('ol');
	systemInfoList.classList.add('systemInfoList');

	const isSystemOk = document.createElement('li');
	isSystemOk.classList.add('isSystemOk');
	isSystemOk.innerHTML = `isSystemOk: `;

	const requiredSupplyVoltage = document.createElement('li');
	requiredSupplyVoltage.classList.add('requiredSupplyVoltage');

	const currentConsumption = document.createElement('li');
	currentConsumption.classList.add('currentConsumption');

	const allDevicesPoweredUp = document.createElement('li');
	allDevicesPoweredUp.classList.add('allDevicesPoweredUp');

	const powerConsumption = document.createElement('li');
	powerConsumption.classList.add('powerConsumption');

	systemInfoList.append(isSystemOk);
	systemInfoList.append(requiredSupplyVoltage);
	systemInfoList.append(currentConsumption);
	systemInfoList.append(allDevicesPoweredUp);
	systemInfoList.append(powerConsumption);
	systemInfo.append(systemInfoList);
	installationContainer.appendChild(systemInfo);
}

function handlePSU(psuContainer) {
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

function setupBusImage(imageElements) {
	for( let p = 0; p < imageElements.length; p++ ) {
		if( p >= 0 && p !== imageElements.length - 1 ) {
			chooseImg(imageElements[p], "bus");
		} else {
			chooseImg(imageElements[p], "busEnd");
		}
	}
}

function checkboxButtons() {
	const buttonContainer = document.querySelector('.powerManagementInstallationContainer');
	const buttonDiv = document.createElement('div');
	buttonDiv.className = 'buttonDiv';
	//creating selectAll and unselectAll buttons for every segment
	const selectAllCheckboxesButton = document.createElement('input');
	selectAllCheckboxesButton.setAttribute('id', 'selectAllCheckboxes');
	selectAllCheckboxesButton.type = 'button';
	selectAllCheckboxesButton.value = 'Zaznacz wszystkie';

	const unCheckAllCheckboxesButton = document.createElement('input');
	unCheckAllCheckboxesButton.setAttribute('id', 'unCheckAllCheckboxesButton');
	unCheckAllCheckboxesButton.type = 'button';
	unCheckAllCheckboxesButton.value = 'Odznacz wszystkie';

	buttonDiv.prepend(unCheckAllCheckboxesButton);
	buttonDiv.prepend(selectAllCheckboxesButton);
	buttonContainer.prepend(buttonDiv);
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
				const img = document.querySelector(`#deviceimage${index}`);
				if( event.target.value === '' ) {
					img.parentNode.removeChild(img);
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

function displaySystemInfo(completeData) {
	const infoPanelDiv = document.querySelector('.systemInfo');
	const isSysOk = isSystemOk(completeData); //info, czy system jest ok
	const sysPower = analiseSystem(completeData); //info ile system żre prądu, requiredSupplyVoltage_V, currentConsumption_a,
																								// isEveryDeviceGoodVoltage_v, powerConsumption_w
	console.log(isSysOk);
	console.log(sysPower);
	console.log(completeData);	 //inputVoltage_v, inputCurrent_a, deviceSupplyVoltage_v
	// created 3rd div to display only data from system, segment info etc.
	infoPanelDiv.classList.add('toggle');
	(infoPanelDiv.querySelector('.isSystemOk')).innerHTML = `isSystemOk: ${isSysOk}`;
	(infoPanelDiv.querySelector('.requiredSupplyVoltage')).innerHTML = `requiredSupplyVoltage_V: ${sysPower.requiredSupplyVoltage_V}`;
	(infoPanelDiv.querySelector('.currentConsumption')).innerHTML = `currentConsumption_A: ${sysPower.currentConsumption_A}`;
	(infoPanelDiv.querySelector('.allDevicesPoweredUp')).innerHTML = `allDevicesPoweredUp: ${sysPower.isEveryDeviceGoodVoltage ? 'tak' : 'nie'}`;
	(infoPanelDiv.querySelector('.powerConsumption')).innerHTML = `powerConsumption_W: ${sysPower.powerConsumption_W}`;
	const busInfoList = document.createElement('ul');
	busInfoList.classList.add('busInfoList');
	completeData.bus.forEach((element, i) => {
		if( i === 0 && completeData.bus.length >= 2 ) {
			infoPanelDiv.childNodes[1].parentNode.removeChild(infoPanelDiv.childNodes[1]);
		}
		const segment = document.createElement('ul');
		segment.classList.add('segmentInfo');
		segment.classList.add(`segment${i}`);
		segment.innerHTML = `Segment${i}:`;
		const inputVoltage = document.createElement('li');
		inputVoltage.setAttribute('id', `inputVoltage${i}`);
		inputVoltage.innerHTML = `inputVoltage_V: ${element.eleStatus.inputVoltage_V}`;
		const inputCurrent = document.createElement('li');
		inputCurrent.setAttribute('id', `inputCurrent${i}`);
		inputCurrent.innerHTML = `inputCurrent_A: ${element.eleStatus.inputCurrent_A}`;
		const deviceSupplyVoltage = document.createElement('li');
		deviceSupplyVoltage.setAttribute('id', `deviceSupplyVoltage${i}`);
		deviceSupplyVoltage.innerHTML = `deviceSupplyVoltage_V: ${element.eleStatus.deviceSupplyVoltage_V}`;
		segment.append(inputVoltage);
		segment.append(inputCurrent);
		segment.append(deviceSupplyVoltage);
		busInfoList.append(segment);
	});
	infoPanelDiv.append(busInfoList);

}





