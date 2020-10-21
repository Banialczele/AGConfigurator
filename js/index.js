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

window.addEventListener('change', () => {	
	// console.log(isSystemOk(completeData));		
});

window.addEventListener('load', () => {
	select(powerSupplies, 'powerSupplyLabel', 'powerSupply', 'powerSupplySegmentContainer', `powerSupplyContainer`, `powerSupply`);
	picture('psu', `psuImageContainer`, `powerSupplyContainer`, `imagePSU`);

	collectedData.forEach((element, index) => {
		Cable.cableComponent(element, index);
		Device.deviceComponent(element, index);
		Device.deviceButtons(index);
	});

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
	checkboxButtons(targetNode);

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

	handleCheckboxes();

	const powerSupplyElement = document.getElementById('powerSupply');
	handlePSU(powerSupplyElement);

	updateInputs(segments);

	completeData.bus = [ ...collectedData ];
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

function checkboxButtons(buttonContainer) {
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
		return checkbox.checked ? segment : '';
	});
}

const checkAllCheckboxes = function() {
	const checkboxes = document.querySelectorAll('input[name="cableType"]');
	for( let checkbox of checkboxes ) {
		checkbox.checked = true;
	}
};

const unCheckAllCheckboxes = function() {
	const checkboxes = document.querySelectorAll('input[name="cableType"]');
	for( let checkbox of checkboxes ) {
		checkbox.checked = false;
	}
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
	const installationSegment = document.getElementById('installationContainer');
	installationSegment.addEventListener('click', e => {
		if( e.target.id.includes("Skopiuj") ) {
			handleCopyNthTimes(e);
		} else if( e.target.id.includes("Usun") ) {
			handleDeleteDevice(e);
		} else if( e.target.id === 'selectAllCheckboxes' ) {
			checkAllCheckboxes(e);
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
					const img = document.querySelector(`#deviceimage${index}`);
					console.log(img);
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




