const powerSupplies = PowerSupplies.map(powerSupply => ({ ...powerSupply }));
const cableArr = Cables.map(cable => ({ ...cable }));
const deviceArr = Devices.map(devices => ({ ...devices }));

const collectedData = [ {
	cableType: "",
	calbleLen_m: 0,
	deviceType: ""
} ];
const completeData = {};

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
	segments.forEach((segment, i) => {
		handleInputAndSelectChange(segment, i);
	});

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
		attributes: true,
		characterData: true
	};

	const observer = new MutationObserver(handleDOMChange);
	observer.observe(targetNode, config);
});

const handleDOMChange = function() {
	const powerSupplyElement = document.getElementById('powerSupply');
	powerSupplyElement.addEventListener('change', e => completeData.supplyType = e.target.value);
	const segments = document.querySelectorAll('.installationSegment');
	if( segments.length >= 2 ) {
		segments.forEach((segment, i) => {
			const checkbox = segment.querySelector('input[type="checkbox"]');
			if( !checkbox.checked ) {
				//updating value for single change, i is index of element in array and none of checkboxes is checked.
				handleInputAndSelectChange(segment, i);
			} else if( checkbox.checked ) {
				//updating value for every segment exisitng in DOM whose checkbox has been checked. 
				handleManySegmentsChange(segment);
			}
		});
	}

	completeData.bus = [ ...collectedData ];
	console.table(completeData.bus);
}

const checkAllCheckboxes = function() {
	const segments = document.querySelectorAll('.installationSegment');
	segments.forEach((segment, i) => {
		const checkbox = segment.querySelector('input[type="checkbox"]');
		checkbox.checked = !checkbox.checked;
		handleDOMChange();
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
			checkAllCheckboxes(e);
		}
	});
}

handleManySegmentsChange = function(segment) {
	segment.addEventListener('change', (e) => {
		switch( e.target.name ) {
			case 'cableSelect': {
				const cableSelect = document.querySelectorAll('.cableSelect');
				cableSelect.forEach(cable => cable.value = e.target.value);
				collectedData.forEach(cable => cable.cableType = e.target.value);
				handleDOMChange();
				break;
			}
			case 'deviceSelect': {
				const deviceSelect = document.querySelectorAll('.deviceSelect');
				deviceSelect.forEach(device => device.value = e.target.value);
				collectedData.forEach(device => device.deviceType = e.target.value);
				handleDOMChange();
				break;
			}
			case 'cableInput': {
				const cableInput = document.querySelectorAll('input[name="cableInput"]');
				cableInput.forEach(input => input.value = e.target.value);
				collectedData.forEach(input => input.calbleLen_m = parseInt(e.target.value));
				handleDOMChange();
				break;
			}
		}
	})

}

handleInputAndSelectChange = function(segment, index) {
	segment.addEventListener('change', (event) => {
		switch( event.target.name ) {
			case 'cableSelect': {
				collectedData[index].cableType = event.target.value;
				break;
			}
			case 'deviceSelect': {
				collectedData[index].deviceType = event.target.value;
				break;
			}
			case 'cableInput': {
				collectedData[index].calbleLen_m = parseInt(event.target.value);
				break;
			}
		}
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
