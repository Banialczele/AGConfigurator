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

const usedIndexes = [];

window.addEventListener('load', () => {
	checkLang();
	const installationContainer = document.querySelector(`.installationContainer`);
	document.querySelector('h2').innerText = chooseText(usedText.konfigurator);
	highlightTeta();

	const systemStatus = document.querySelector('.systemStatus');
	const systemContainer = document.querySelector('.installation');

	if (systemStatus && systemContainer) {
		systemContainer.appendChild(installationContainer);
		createFundamentalData();

		//creating select inputs for elemental data
		getSystem(setSystem(systemData));

		// adjustSystemCables();

		handlePSU();

		//creating save/read file

		fileButtons();
		addImageToFiles();
		//handling save/read file buttons function
		handleFileButtons();
		handleDragAndDrop();
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
		initializeSegmentData(systemData);
		systemInformation();

		// segmentListEvents();		

		setupBusImage();

		handlePSU();
		segmentListEvents();
		findMiddleSegment();
		elementalDataEvents();
		submitChanges();
		clickBusSegment();
		setupImagesForSegments();
	}
});

function createFundamentalData() {
	select(`wireTypeSelect`, `elementalCable`);
	select(`deviceTypeSelect`, 'elementalDevice');
	select(`supplyTypeSelect`, `supplyType`);

	picture('psu', `powerSupplyImage`, `powerSupplyImage`, `imagePSU`, null);
}

function getSystem(system) {
	system.bus.forEach((item, index) => {
		const checkIfSegmentExists = document.getElementById(`installationSegment${index}`);
		if (checkIfSegmentExists === null || !checkIfSegmentExists) {
			createInstallationSegment(index);
			createSegmentList(index);
			select(`cableDiameter${index}`, `cable`, index);
			input(`.cableLength${index}`, `cableInput`, 'cableInput', 'cableContainerInput', index);
			usedIndexes.push(index);
			select(`deviceType${index}`, 'device', index);
		}
	});
	createConfigureManySegments();
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

function highlightTeta() {
	let text = document.getElementById(`configuratorInfo`);
	const highlightedText = text.innerHTML.replace(/Teta/, "<span class=hightlighted>Teta</span>");
	text.innerHTML = highlightedText;
}

//index file
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

//info file
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

//info file
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