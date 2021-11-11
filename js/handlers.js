function handlePSU() {
	const psuContainer = document.getElementById('powerSupply');
	psuContainer.addEventListener('change', e => {
		systemData.supplyType = e.target.value;
		// systemInformation();
	});
}

// function adjustSystemCables() {
// 	const installationSegment = document.querySelector(`.adjustCable`);
// 	installationSegment.addEventListener('click', matchCablesToSystem);
// }

function handleInputAndSelectChange(event, selectedSegment) {
	const segments = document.querySelectorAll('.segmentListContainer');
	const indexToUpdate = Array.from(segments).findIndex(currentSegment => currentSegment === selectedSegment);
	const installationSegments = document.querySelectorAll(`.installationSegment`);
	switch (event.target.name) {
		case 'deviceQuantity': {
			const amountToCopy = event.target.value;
			handleCopyNthTimes(event, amountToCopy);
			break;
		}
		case 'cableSelect': {
			console.log(indexToUpdate);
			systemData.bus[indexToUpdate].cableType = event.target.value;
			const cableSelect = segments[indexToUpdate].querySelector(`.cableSelect`);
			cableSelect.value = event.target.value;
			systemData.bus[indexToUpdate].cableType = event.target.value;
			break;
		}

		case 'deviceSelect': {
			const segmentImg = selectedSegment.querySelector(`.deviceImage${indexToUpdate}`);
			const systemImg = installationSegments[indexToUpdate].querySelector(`.deviceimage`);
			systemData.bus[indexToUpdate].deviceName = event.target.value;
			chooseImg(systemImg, event.target.value, 'deviceImage');

			setupBusImage();
			break;
		}

		case 'cableInput': {
			event.target.value === "" ? event.target.value = 1 : '';
			systemData.bus[indexToUpdate].cableLen_m = parseFloat(event.target.value);
			const cableInput = segments[indexToUpdate].querySelector('input[name="cableInput"]');
			cableInput.value = event.target.value;

			break;
		}
	}
}

//handler
function findClickedSegment(e) {
	const segment = e.target.parentNode;
	const busSegments = Array.from(document.querySelectorAll(`.installationSegment`));
	const segmentContainers = Array.from(document.querySelectorAll(`.segmentContainer`));
	if (segment.classList.contains(`installationSegment`)) {
		const index = busSegments.indexOf(segment);
		segmentContainers[index].scrollIntoView(true);
	}
}

//handler
function clickBusSegment() {
	const busElements = document.querySelector(`.installationContainer`);
	busElements.addEventListener('click', findClickedSegment);
}

//handler
function submitChanges() {
	const submitFormButton = document.querySelector(`.changesForm`);

	const oldDeviceSelectValue = document.getElementById(`changeManyDevices`).value;
	const oldCableSelectValue = document.getElementById(`changeManyCables`).value;
	const oldInputValue = document.getElementById(`manyCablesInputChange`).value;
	submitFormButton.addEventListener('submit', e => {
		if (e.preventDefault) {
			e.preventDefault();
		}
		const input = document.getElementById(`range`).value;
		const arrayOfInputRanges = input.replace(/\s/g, "").split(`,`);
		const regex = /(\d+-\d+|\d+)/g;
		const checkIfRegExp = input.match(regex);
		const deviceSelect = document.getElementById(`changeManyDevices`).value;
		const wireSelect = document.getElementById(`changeManyCables`).value;
		const wireInput = parseInt(document.getElementById(`manyCablesInputChange`).value);
		if (!checkIfRegExp) {
			return alert(`Wprowadzono złe dane`);
		}
		arrayOfInputRanges.forEach((element) => {
			if (element.indexOf(`-`) > -1) {
				//splitting array and sorting data.
				const splitRange = element.split(`-`).sort();
				for (let i = splitRange[0]; i <= splitRange[splitRange.length - 1]; i++) {
					if (deviceSelect !== oldInputValue && wireSelect !== oldCableSelectValue && wireInput !== oldInputValue) {
						systemData.bus[i].deviceName = deviceSelect;
						systemData.bus[i].cableType = wireSelect;
						systemData.bus[i].cableLen_m = wireInput;
					} else if (deviceSelect !== oldInputValue && wireSelect !== oldCableSelectValue && wireInput === oldInputValue) {
						systemData.bus[i].deviceName = deviceSelect;
						systemData.bus[i].cableType = wireSelect;
					} else if (deviceSelect !== oldInputValue && wireSelect === oldCableSelectValue && wireInput !== oldInputValue) {
						systemData.bus[i].deviceName = deviceSelect;
						systemData.bus[i].cableLen_m = wireInput;
					} else if (deviceSelect === oldInputValue && wireSelect !== oldCableSelectValue && wireInput !== oldInputValue) {
						systemData.bus[i].cableType = wireSelect;
						systemData.bus[i].cableLen_m = wireInput;
					}
				}
			} else if (element.indexOf(`-`) === -1) {
				if (deviceSelect !== oldInputValue && wireSelect !== oldCableSelectValue && wireInput !== oldInputValue) {
					systemData.bus[element].deviceName = deviceSelect;
					systemData.bus[element].cableType = wireSelect;
					systemData.bus[element].cableLen_m = wireInput;
				} else if (deviceSelect !== oldInputValue && wireSelect !== oldCableSelectValue && wireInput === oldInputValue) {
					systemData.bus[element].deviceName = deviceSelect;
					systemData.bus[element].cableType = wireSelect;
				} else if (deviceSelect !== oldInputValue && wireSelect === oldCableSelectValue && wireInput !== oldInputValue) {
					systemData.bus[element].deviceName = deviceSelect;
					systemData.bus[element].cableLen_m = wireInput;
				} else if (deviceSelect === oldInputValue && wireSelect !== oldCableSelectValue && wireInput !== oldInputValue) {
					systemData.bus[element].cableType = wireSelect;
					systemData.bus[element].cableLen_m = wireInput;
				}
			}
		});
		updateSystem();
		return false;
	});
}

//handler
function clickSegmentAndDisplay() {
	const systemConfigurator = document.querySelector(`.systemConfiguration`).children;
	Array.from(systemConfigurator).forEach((child, i) => child.querySelector(`.panelInfo`).addEventListener('click', e => e.target.closest(`.panelStyle`).classList.toggle(`active`)));
}

//handler
function findMiddleSegment() {
	const segmentListContainer = document.querySelector(`.segmentListContainer`);
	let options = {
		root: segmentListContainer,
		rootMargin: `-50% 0%`,
		treshold: 1
	}
	const observer = new IntersectionObserver(highlightMid, options);
	const listOfElementsToObserve = document.querySelectorAll(`.segmentContainer`);
	listOfElementsToObserve.forEach(element => observer.observe(element));
}

//handler
function highlightMid(entries) {
	const segmentListContainer = Array.from(document.querySelectorAll(`.segmentContainer`));
	entries.forEach(entry => {
		entry.target.classList.toggle('midsegment', entry.isIntersecting);
	});
}