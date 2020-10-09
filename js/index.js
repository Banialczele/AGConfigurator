const powerSupplies = PowerSupplies.map(powerSupply => ({ ...powerSupply }));
const cableArr = Cables.map(cable => ({ ...cable }));
const deviceArr = Devices.map(devices => ({ ...devices }));

const collectedData = [];
const initElement = {
	cableType: "",
	calbleLen_m: 0,
	deviceType: ""
}
const completeData = {};

window.addEventListener('load', () => {
	select(powerSupplies, 'powerSupplyLabel', 'powerSupply', 'powerSupplySegmentContainer', `powerSupplyContainer`, `powerSupply`);
	picture('psu', `psuImageContainer`, `powerSupplyContainer`, `imagePSU`);

	collectedData.push(initElement);
	collectedData.forEach((element, index) => {
		Cable.cableComponent(element, index);
		Device.deviceComponent(element, index);
		Device.deviceButtons(index);
	});

	handleButtonEvents();

	handleInputAndSelectChange('cableSelect');
	handleInputAndSelectChange('deviceSelect');
	handleInputAndSelectChange('cableContainerInput input');

	//setting up PSU value and it's image
	const powerSupplyElement = document.getElementById('powerSupply');
	powerSupplyElement.addEventListener('change', e => {
		completeData.supplyType = e.target.value;
		const img = document.getElementById("imagePSU");
		if( e.target.value === '' ) {
			const parentNode = img.parentNode.parentNode;
			parentNode.removeChild(img.parentNode);
			picture('psu', `psuImageContainer`, `powerSupplyContainer`, `imagePSU`);
		}
		img.srcset = "./Gfx/CU.svg";
		img.src = "./Gfx/CU.svg";
		img.alt = 'Unable to find image';
	});

	//creating selectAll and unselectAll buttons for every segment
	const selectAllCheckboxesButton = document.createElement('input');
	selectAllCheckboxesButton.setAttribute('id', 'selectAllCheckboxes');
	selectAllCheckboxesButton.type = 'button';
	selectAllCheckboxesButton.value = 'Zaznacz wszystkie';

	const targetNode = document.getElementById("installationContainer");
	targetNode.append(selectAllCheckboxesButton);

	const config = {
		childList: true,
		subtree: true,
		attributes: true
	};

	const observer = new MutationObserver(handleDOMChange);
	observer.observe(targetNode, config);
});

const handleDOMChange = function(e) {

	const powerSupplyElement = document.getElementById('powerSupply');
	powerSupplyElement.addEventListener('change', e => completeData.supplyType = e.target.value);

	completeData.bus = [ ...collectedData ];
	console.table(completeData.bus);
	// console.log(isSystemOk(completeData));
	// console.log(getBusSectionVoltageDrop_V(completeData.bus[1], 1));
}

const checkAllCheckboxes = function() {
	const segments = document.querySelectorAll('.installationSegment');
	segments.forEach((segment) => {
		const checkbox = segment.querySelector('input[type="checkbox"]');
		checkbox.checked = !checkbox.checked;
		if( checkbox.checked ) {
			handleManySegmentsChange(segment);
		} else {
			segment.addEventListener('change', e => {
				console.log(segment);
			});
			// handleInputAndSelectChange(segment.id);
		}
	});
};

// checkCheckboxesByShift = function() {
// 	const segments = document.querySelectorAll('.installationSegment');
// 	let lastChecked;
//	
// 	segments.forEach(segment => {
// 		const checkbox = segment.querySelector('input[type="checkbox"]');
// 		checkbox.addEventListener('change', function(e) {
// 			let inBetween = false;
//
// 			if( e.shiftKey && this.checked ) {
// 				checkboxes.forEach(checkbox => {
// 					if( checkbox === this || checkbox === lastChecked ) {
// 						inBetween = !inBetween;
// 					}
// 					if( inBetween ) {
// 						checkbox.checked = true;
// 					}
// 				})
// 			}
// 			lastChecked = this;
// 		})
// 		;
// 	});
//
// 	segments.forEach(segment => {
// 		const checkbox = segment.querySelector('input[type="checkbox"]');
// 		if( checkbox.checked ) {
// 			console.log('yup!');
// 			console.log(segment);
// 		}
// 	})
// }

handleButtonEvents = function() {
	const installationSegment = document.getElementById('installationContainer');
	installationSegment.addEventListener('click', e => {
		if( e.target.id.includes("Skopiuj") ) {
			handleCopyNthTimes(e);
		} else if( e.target.id.includes("Usun") ) {
			handleDeleteDevice(e);
		} else if( e.target.id === 'selectAllCheckboxes' ) {
			checkAllCheckboxes();
		}
	});
}

handleManySegmentsChange = function(segment) {
	segment.addEventListener('change', (e) => {
		switch( e.target.name ) {
			case 'cableSelect': {
				// console.log(e.target.value);
				const images = document.querySelectorAll('.cableImageContainer');
				const allcableSelect = document.querySelectorAll('.cableSelect');
				allcableSelect.forEach(cable => cable.value = e.target.value);
				images.forEach((image, i) => {
					if( i < images.length - 1 ) {
						chooseImg(image.firstChild, 'bus');
					} else if( i === images.length - 1 ) {
						chooseImg(image.firstChild, `busEnd`);
					}
				});
				collectedData.forEach(cable => cable.cableType = e.target.value);
				break;
			}
			case 'deviceSelect': {
				const images = document.querySelectorAll('.deviceImageContainer');
				const allDeviceSelect = document.querySelectorAll('.deviceSelect');

				allDeviceSelect.forEach(device => device.value = e.target.value);
				images.forEach(image => chooseImg(image.firstChild, e.target.value));
				collectedData.forEach(device => device.deviceType = e.target.value);
				break;
			}
			case 'cableInput': {
				const allInputs = document.querySelectorAll('input[name="cableInput"]');
				allInputs.forEach(input => input.value = e.target.value);
				const num = parseInt(e.target.value);
				collectedData.forEach(input => input.calbleLen_m = num);
				handleDOMChange(e);
				break;
			}
		}
	});
}

handleInputAndSelectChange = (selector) => {
	const element = document.querySelector(`.${selector}`);
	element.addEventListener('change', e => {
		switch( select.name || input.name ) {
			case 'cableSelect': {
				// const img = document.getElementById(`cableimage${i}`);
				collectedData[i].cableType = e.target.value;
				// if( selectElement.length !== 0 && (selectElement.length !== selectElement.length - 1) ) {
				// 	chooseImg(img, 'bus');
				// } else {
				// 	chooseImg(img, `busEnd`);
				// }
				break;
			}
			case 'deviceSelect': {
				const img = document.getElementById(`deviceimage${i}`);
				collectedData[i].deviceType = e.target.value;
				chooseImg(img, e.target.value);
				break;
			}
			case 'cableInput': {
				collectedData[i].calbleLen_m = parseInt(e.target.value);
				handleDOMChange();
			}
		}
	})

};

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
