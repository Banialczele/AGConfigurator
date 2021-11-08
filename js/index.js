let systemData = {
	supplyType: "24V bez podtrzymania",
	bus: [{
		cableType: "2 x 2 mm2",
		cableLen_m: 15,
		deviceName: "Teta EcoWent"
	}],
};

let lang = 'EN';

const usedText = {
	konfigurator: {
		pl: 'Konfigurator Systemów Teta',
		en: 'Teta System Configurator'
	},
	systemNiepoprawny: {
		pl: 'System: N/A',
		en: 'System: N/A'
	},
	zapotrzebowanieMocy: {
		pl: 'Zapotrzebowanie na moc przez elementy magistrali: ',
		en: 'System power demand: '
	},
	zaznaczWszystkie: {
		pl: 'Zaznacz wszystkie',
		en: 'Select all'
	},
	odznaczWszystkie: {
		pl: 'Odznacz wszystkie',
		en: 'Deselect all'
	},
	dobierzKabel: {
		pl: 'Dobierz kabel',
		en: 'Adjust cable'
	},
	zachowajSystem: {
		pl: 'Zachowaj system',
		en: 'Save system'
	},
	wczytajSystem: {
		pl: 'Wczytaj system',
		en: 'Load system'
	},
	usunSegment: {
		pl: 'Usunieto segment',
		en: 'Deleted segment'
	},
	usunJedynySegment: {
		pl: 'Nie można usunąć jedynego segmentu',
		en: 'Cannot delete only segment'
	}
}

window.addEventListener('load', () => {
	checkLang();
	const installationContainer = document.querySelector(`.installationContainer`);
	document.querySelector('h2').innerText = chooseText(usedText.konfigurator);
	highlightTeta();

	const systemStatus = document.querySelector('.systemStatus');
	const systemContainer = document.querySelector('.installation');

	if (systemStatus && systemContainer) {
		systemContainer.appendChild(installationContainer);
		//creating select inputs for elemental data
		select(`wireTypeSelect`, `elementalCable`);
		select(`deviceTypeSelect`, 'elementalDevice');
		select(`supplyTypeSelect`, `supplyType`);

		picture('psu', `powerSupplyImage`, `powerSupplyImage`, `imagePSU`, null);

		adjustSystemCables();

		handlePSU();

		//creating save/read file

		fileButtons();
		addImageToFiles();
		//handling save/read file buttons function
		handleFileButtons();

		adjustCableButton();
		clickSegmentAndDisplay();
		const targetNode = document.querySelector("#appContainer");

		const config = {
			childList: true,
			subtree: true,
			attributes: false,
			characterData: false
		};

		const observer = new MutationObserver(findMiddleSegment);
		observer.observe(targetNode, config);
		//getting and setting system		
		getSystem(setSystem(systemData));
		initializeSegmentData(systemData);

		systemInformation();

		// segmentListEvents();		

		setupBusImage();

		handlePSU();
		segmentListEvents();
		findMiddleSegment();
		elementalDataEvents();
		addSelectsAndInputToConfigureMany();
		submitChanges();
		clickBusSegment();
	}
});

function findClickedSegment(e) {
	const segment = e.target.parentNode;
	const busSegments = Array.from(document.querySelectorAll(`.installationSegment`));
	const segmentContainers = Array.from(document.querySelectorAll(`.segmentContainer`));
	if(segment.classList.contains(`installationSegment`)){  
		const index = busSegments.indexOf(segment);
		segmentContainers[index].scrollIntoView(true);
	}
}

function clickBusSegment() {
	const busElements = document.querySelector(`.installationContainer`);
	busElements.addEventListener('click', findClickedSegment);
}

//segmentListCableLength
function updateSystem() {
	setupBusImage();
	const segmentContainers = document.querySelectorAll(`.segmentContainer`);
	segmentContainers.forEach((segment, i) => {
		const device = segment.querySelector(`.deviceSelect`);
		const cable = segment.querySelector(`.cableSelect`);
		const wireLen = segment.querySelector(`.segmentListCableLength`);
		device.value = systemData.bus[i].deviceName;
		cable.value = systemData.bus[i].cableType;
		wireLen.value = systemData.bus[i].cableLen_m;
	});
}

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
		const checkIfRegExp = regex.test(input);

		const deviceSelect = document.getElementById(`changeManyDevices`).value;
		const wireSelect = document.getElementById(`changeManyCables`).value;
		const wireInput = parseInt(document.getElementById(`manyCablesInputChange`).value);
		if (!checkIfRegExp) {
			alert(`wrong input`);
			return false;
		} else if (checkIfRegExp) {
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
		}
		updateSystem();
		return false;
	});
}

function clickSegmentAndDisplay() {
	const systemConfigurator = document.querySelector(`.systemConfiguration`).children;
	Array.from(systemConfigurator).forEach((child, i) => child.querySelector(`.panelInfo`).addEventListener('click', e => e.target.closest(`.panelStyle`).classList.toggle(`active`)));
}

function highlightTeta() {
	let text = document.getElementById(`configuratorInfo`);
	const highlightedText = text.innerHTML.replace(/Teta/, "<span class=hightlighted>Teta</span>");
	text.innerHTML = highlightedText;
}

function addSelectsAndInputToConfigureMany() {
	select(`changeManyWiresType`, `changeManyCablesType`);
	select(`changeManyDevices`, `changeManyDevicesType`);
	input('.changeManyWiresLength', `manyCablesInputChange`, 'cableInput', `changeManyCableLength`);
}

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

function highlightMid(entries) {
	const middleIdToDisplay = document.querySelector(`.counterBox`);
	const segmentListContainer = Array.from(document.querySelectorAll(`.segmentContainer`));
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const index = segmentListContainer.indexOf(entry.target)
			middleIdToDisplay.value = index + 1;
		}
		entry.target.classList.toggle('midsegment', entry.isIntersecting);
	});
}

function elementalDataEvents() {
	const elementalDeviceSelect = document.querySelector('.elementalDeviceLabel');
	const powerSupply = document.querySelector('.powerSupply');
	const elementalCableLabel = document.querySelector('.elementalCableLabel');
	const elementalWireLength = document.querySelector('#wireDistance');
	const deviceQuantity = document.querySelector('#deviceQuantity');

	elementalDeviceSelect.addEventListener(`change`, e => handleBasicDataChange(e, e.target.name));
	powerSupply.addEventListener(`change`, e => handleBasicDataChange(e, e.target.name));
	elementalCableLabel.addEventListener(`change`, e => handleBasicDataChange(e, e.target.name));
	elementalWireLength.addEventListener('change', e => handleBasicDataChange(e, e.target.name));
	// elementalWireLength.addEventListener('keyup', e => (e.key === `Enter` || e.keyCode === 13) ? handleBasicDataChange(e, e.target.name) : '');

	deviceQuantity.addEventListener('keyup', e => {
		if (e.key === 'Enter' || e.keyCode === 13) {
			handleCopyNthTimes(e, e.target.value);
		}
	});
}

function segmentListEvents() {
	const listOfSegments = document.querySelector(`.segmentListContainer`);
	listOfSegments.addEventListener(`change`, e => {
		if (e.target.classList.contains(`deviceSelect`)) {
			const i = e.target.dataset.indexofdevice;
			systemData.bus[i].deviceName = e.target.value;
			setupBusImage();
		}
		if (e.target.classList.contains(`cableSelect`)) {
			systemData.bus[i].cableType = e.target.value
		}
		if (e.target.classList.contains(`segmentListCableLength`)) {
			systemData.bus[i].cableLen_m = e.target.value
		}
	});
}

//set images for bus
function setupBusImage() {
	const installationSegment = document.querySelectorAll(`.installationSegment`);
	installationSegment.forEach((segment, i) => {
		const sirenImage = document.querySelector(`#sirenimage${i}`);
		const deviceimage = document.querySelector(`#deviceimage${i}`);
		const busImage = document.querySelector(`#cableimage${i}`);
		const device = NewDevices.find(deviceType => deviceType.type === systemData.bus[i].deviceName);
		if (device.typeOfDevice === `device`) {
			chooseBusImage(busImage, `T-conP.svg`);
			chooseBusImage(deviceimage, `${device.icon}`);
			sirenImage.src = ``;
			sirenImage.alt = ``;
		} else if (device.typeOfDevice === `siren`) {
			chooseBusImage(busImage, `T-conL.svg`);
			chooseBusImage(sirenImage, `${device.icon}`);
			deviceimage.src = ``;
			deviceimage.alt = ``;
		}
	});
}

function getSystem(system) {
	system.bus.forEach((item, i) => {
		generateSegments(item, i);
	});
}

function setSystem(system) {
	systemData = system;
	return systemData;
}

function systemInformation() {
	const installationContainer = document.querySelector('.powerManagementInstallationContainer');
	// const sysOk = isSystemOk(setSystem(systemData));
	const sysOk = true;
	const info = document.getElementById('systemStatusText');
	const statusTxt = document.querySelector(`.statusText`);
	const status = document.querySelector(`.status`);
	const powerConsumption = document.getElementById(`powerConsumption`);
	// powerConsumption.style.display = `none`;
	if (sysOk) {
		statusTxt.innerHTML = `OK`;
		powerConsumption.innerHTML = `${chooseText(usedText.zapotrzebowanieMocy)} 342W`;
		status.classList.add('sysOk');
		status.classList.remove('sysWrong');
	} else {
		statusTxt.innerHTML = `FALSE`;
		powerConsumption.style.display = `none`;
		// powerConsumption.innerHTML = `0W`;
		status.classList.add('sysWrong');
		status.classList.remove('sysOk');
	}
}

function generateSegments(item, index) {
	const checkIfSegmentExists = document.getElementById(`installationSegment${index}`);
	//creating segment if it doesn't exists and if exists, don't create new one.
	if (checkIfSegmentExists === null || !checkIfSegmentExists) {
		Cable.cableComponent(item, index);
		Device.deviceComponent(item, index);
	}
}

function initializeSegmentData(system) {
	document.querySelector('.powerSupply').value = systemData.supplyType;

	document.querySelector(`.elementalCableLabel`).value = system.bus[0].cableType;
	document.querySelector('.cableLabel').value = system.bus[0].cableType;

	document.querySelector('.deviceSelect').value = system.bus[0].deviceName;
	document.querySelector(`.elementalDevice`).value = system.bus[0].deviceName;

	document.querySelector('#wireDistance').value = systemData.bus[0].cableLen_m;
	document.querySelector('.segmentListCableLength').value = systemData.bus[0].cableLen_m;
}

function matchCablesToSystem() {
	const installationContainer = document.querySelector('.installationContainer');
	while (installationContainer.firstChild) {
		installationContainer.removeChild(installationContainer.firstChild);
	}
	getSystem(setSystem(matchSystemCables(systemData)));
}

//set images for right panel segments
function setupSegmentImage() {
	// const segments = document.querySelectorAll('.segmentContainer');
	// segments.forEach( (segment,i) => {
	// 	const imageForSegment = segment.querySelector(`.deviceImg`);
	// chooseBusImage(imageForSegment, `siren`, systemData.bus[i].deviceName, `sirenImage` );
	// });
	// 	const imageElements = document.querySelectorAll('.cableimage');
	// 	segments.forEach((segment, i) => {
	// 		const deviceImage = segment.querySelector(`.deviceImg`);
	// 		chooseImg(deviceImage, `Teta EcoWent`, `deviceImage`);
	// 	});
	// segments.forEach((segment, i) => {
	// 	const selectedOptionIndex = segment.querySelector('.deviceSelect').selectedIndex;
	// 	const isDeviceBig = segment.querySelector('.deviceSelect').options[selectedOptionIndex].dataset.isbig || 'false';
	// 	if (isDeviceBig === "true") {
	// 		segment.classList.add('segmentBig');
	// 	} else if (isDeviceBig !== "true" && segment.classList.contains('segmentBig')) {
	// 		segment.classList.remove('segmentBig');
	// 	}
	// 	if (!(segments[i + 1])) {
	// 		isDeviceBig === 'false' ? chooseImg(imageElements[i], "busEndShort", 'busImage') : chooseImg(imageElements[i], "busEndLong", 'busImage');
	// 	} else {
	// 		isDeviceBig === 'false' ? chooseImg(imageElements[i], "busShort", 'busImage') : chooseImg(imageElements[i], "busLong", 'busImage');
	// 	}
	// });
}

function checkLang() {
	let HREF = window.location.href;
	if (HREF.includes(`lang=pl`)) {
		lang = 'PL';
	} else if (HREF.includes(`lang=eng`)) {
		lang = 'EN'
	} else if (HREF.includes(`licenses`)) {
		displayLicenseInfo();
	}
}

function displayLicenseInfo() {
	const installationContainer = document.querySelector('.powerManagementInstallationContainer');
	installationContainer.outerHTML = "";
	const licenseDiv = document.createElement('div');
	licenseDiv.className = 'licenseDiv';
	licenseDiv.setAttribute('id', 'licenseDiv');
	const mitLicenseInfo = document.createElement('p');
	mitLicenseInfo.className = `licenseIntro`;
	mitLicenseInfo.innerText = ` Grafiki objęte prawami autorskimi na następującej licencji MIT.`
	const mitLicenseText = document.createElement('article');
	mitLicenseText.className = `mitLicenseText`;
	mitLicenseText.innerText = `Copyright 2021 AtestGaz
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`;


	const licensedCopyImage = document.createElement('img');
	const licensedDeleteImage = document.createElement('img');
	licensedCopyImage.className = 'licensedCopyImage';
	licensedDeleteImage.className = 'licensedDeleteImage';
	licensedDeleteImage.src = `./Icons/delete.svg`;
	licensedCopyImage.src = `./Icons/copy.svg`;
	licenseDiv.appendChild(licensedCopyImage);
	licenseDiv.appendChild(licensedDeleteImage);
	licenseDiv.appendChild(mitLicenseInfo);
	licenseDiv.appendChild(mitLicenseText);
	document.body.appendChild(licenseDiv);
}

function chooseText(text) {
	let res;
	switch (lang) {
		case "PL": {
			res = text.pl;
			break;
		}
		case "EN": {
			res = text.en;
			break;
		}
	}
	return res;
}

chooseBusImage = (img, device) => {
	img.src = `./SVG/${device}`;
	img.alt = `Unable to find image`;
}