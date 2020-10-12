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
	const images = document.querySelectorAll('.cableimage');
	for( let p = 0; p < images.length; p++ ) {
		if( p >= 0 && p !== images.length - 1 ) {
			chooseImg(images[p], "bus");
		} else {
			chooseImg(images[p], "busEnd");
		}
	}
	segments.forEach((segment, i) => {
		const checkbox = segment.querySelector('input[type="checkbox"]');
		segment.addEventListener('change', e => {
			handleInputAndSelectChange(segment, e, i, checkbox.checked);
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

	const unCheckAllCheckboxesButton = document.createElement('input');
	unCheckAllCheckboxesButton.setAttribute('id', 'unCheckAllCheckboxesButton');
	unCheckAllCheckboxesButton.type = 'button';
	unCheckAllCheckboxesButton.value = 'Odznacz wszystkie';

	const targetNode = document.querySelector("#installationContainer");
	targetNode.append(selectAllCheckboxesButton);
	targetNode.append(unCheckAllCheckboxesButton);


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
function handleDOMChange() {
	const images = document.querySelectorAll('.cableimage');
	for( let p = 0; p < images.length; p++ ) {
		if( p >= 0 && p !== images.length - 1 ) {
			chooseImg(images[p], "bus");
		} else {
			chooseImg(images[p], "busEnd");
		}
	}

	const segments = document.querySelectorAll('.installationSegment');

	checkCheckboxesByShift();

	const powerSupplyElement = document.getElementById('powerSupply');
	powerSupplyElement.addEventListener('change', e => completeData.supplyType = e.target.value);

	segments.forEach((segment, i) => {
		const checkbox = segment.querySelector('input[type="checkbox"]');
		segment.addEventListener('change', (e) => {
			handleInputAndSelectChange(segment, e, i, checkbox.checked);
		});
	});

	completeData.bus = [ ...collectedData ];
	console.log(completeData);
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

checkCheckboxesByShift = function() {
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

handleInputAndSelectChange = function(segment, event, index, checked) {
	switch( event.target.name ) {
		case 'cableSelect': {
			const cableAndCheckboxContainer = document.querySelectorAll('.checkboxAndcableContainer');
			cableAndCheckboxContainer.forEach(container => {
				const checkbox = container.querySelector('input[type="checkbox"]');
				if( checkbox.checked === checked ) {
					const cableSelect = container.querySelectorAll(`.cableSelect`);
					cableSelect.forEach(cable => cable.value = event.target.value);
				}
			});

			//fix changing single element without checking checkbox!
			// collectedData[index].cableType = event.target.value;

			break;
		}
		case 'deviceSelect': {
			//fix changing device values for selected checkboxes
			// const deviceContainer = document.querySelectorAll('.checkboxAndcableContainer');
			// deviceContainer.forEach(container => {
			// 	const checkbox = container.querySelector('input[type="checkbox"]');
			//  	console.log(checkbox);
			//  	console.log(checked);
			// 	if( checkbox.checked === checked ) {
			// 		const deviceSelect = document.querySelectorAll('.deviceSelect');
			// 		console.log(deviceSelect);
			// 		const images = document.querySelectorAll('.deviceimage');
			// 		images.forEach(image => chooseImg(image, event.target.value));
			// 		deviceSelect.forEach((device) => device.value = event.target.value);
			// 		collectedData.forEach((device, i) => device.deviceType = event.target.value);
			// 	}
			// });
			// } else if( !checked ) {
			// 	const img = document.querySelector(`#deviceimage${index}`);
			// 	collectedData[index].deviceType = event.target.value;
			// 	chooseImg(img, event.target.value);
			// }
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
