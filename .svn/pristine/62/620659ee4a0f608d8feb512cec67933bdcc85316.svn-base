const powerSupplies = PowerSupplies.map(powerSupply => ({ ...powerSupply }));

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
		segment.addEventListener('change', e => {
			const checkbox = segment.querySelector('input[type="checkbox"]');
			handleInputAndSelectChange(segment, e, i, checkbox.checked, segments.length);
		})
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

	const targetNode = document.querySelector("#installationContainer");
	targetNode.append(selectAllCheckboxesButton);

	const config = {
		childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
	};

	const observer = new MutationObserver(handleDOMChange);

	observer.observe(targetNode, config);
});


////////////////////////////////////    TU TESTOWAĆ    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function handleDOMChange(mutations) {
	mutations.forEach( () => {
		completeData.bus = [ ...collectedData ];

		const powerSupplyElement = document.getElementById('powerSupply');
		powerSupplyElement.addEventListener('change', e => completeData.supplyType = e.target.value);

		const segments = document.querySelectorAll('.installationSegment');

		segments.forEach((segment, i) => {
			segment.addEventListener('change', (e) => {
				const checkbox = segment.querySelector('input[type="checkbox"]');
				if( completeData.bus.length > 1 )
					handleInputAndSelectChange(segment, e, i, checkbox.checked, completeData.bus.length);
			});
		});

		console.log(completeData);
	});

}

const checkAllCheckboxes = function() {
	const checkboxes = document.querySelectorAll('input[name="cableType"]');
	for( let checkbox of checkboxes ) {
		checkbox.checked = !checkbox.checked;
	}
};

// checkCheckboxesByShift = function() {
// 	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
// 	let lastChecked;
//
// 	function handleCheck(e) {
// 		let inBetween = false;
//
// 		if( e.shiftKey && this.checked ) {
// 			checkboxes.forEach(checkbox => {
// 				if( checkbox === this || checkbox === lastChecked ) {
// 					inBetween = !inBetween;
// 				}
// 				if( inBetween ) {
// 					checkbox.checked = true;
// 				}
// 			})
// 		}
// 		lastChecked = this;
// 	}
//
// 	checkboxes.forEach(checkbox => checkbox.addEventListener('click', handleCheck));
// 	handleDOMChange();
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

handleInputAndSelectChange = function(segment, event, index, checked, busLength) {
	switch( event.target.name ) {
		case 'cableSelect': {
			const img = document.querySelector(`#cableimage${index}`);
			console.log(img);
			if( checked ) {
				const cableSelect = document.querySelectorAll('.cableSelect');
				cableSelect.forEach(cable => cable.value = event.target.value);
			} else if( !checked ) {
				collectedData[index].cableType = event.target.value;
			}
			break;
		}
		case 'deviceSelect': {
			if( checked ) {
				const deviceSelect = document.querySelectorAll('.deviceSelect');
				deviceSelect.forEach(device => device.value = event.target.value);
				collectedData.forEach(device => device.deviceType = event.target.value);
			} else if( !checked ) {
				collectedData[index].deviceType = event.target.value;
			}
			break;
		}
		case 'cableInput': {
			if( checked ) {
				const cableInput = document.querySelectorAll('input[name="cableInput"]');
				cableInput.forEach(input => input.value = event.target.value);
				collectedData.forEach(input => input.calbleLen_m = parseInt(event.target.value));
			} else if( !checked ) {
				collectedData[index].calbleLen_m = parseInt(event.target.value);
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
