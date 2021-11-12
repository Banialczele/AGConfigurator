function createInstallationSegment(index) {
	const checkIfUsed = usedIndexes.includes(index);
	if (!checkIfUsed) {
		const installationSegment = document.createElement('div');
		installationSegment.className = `installationSegment`;
		installationSegment.setAttribute('id', `installationSegment${index}`);

		const installationDeviceImage = document.createElement('div');
		installationDeviceImage.className = `installationDeviceContainer`;

		const installationBusImage = document.createElement('div');
		installationBusImage.className = `installationBusImage`;

		const installationSirenImage = document.createElement('div');
		installationSirenImage.className = `installationSirenContainer`;
		const installationCounter = document.createElement(`div`);
		installationCounter.className = `deviceCounterContainer`;
		const input = document.createElement(`input`);
		input.setAttribute('id', `deviceCounter${index}`);
		input.setAttribute('type', `number`);
		input.className = `deviceCounter`;
		input.value = `${index + 1}`;

		const installationContainer = document.querySelector('.installationContainer');

		installationCounter.appendChild(input);
		installationSirenImage.appendChild(installationCounter);
		installationContainer.appendChild(installationSegment);
		installationSegment.appendChild(installationSirenImage);
		installationSegment.appendChild(installationBusImage);
		installationSegment.appendChild(installationDeviceImage);

		picture('device', `deviceImageContainer`, `installationDeviceContainer`, `image${index}`, index);
		picture('siren', `sirenImageContainer`, `installationSirenContainer`, `image${index}`, index);
		picture('cable', `cableImageContainer`, `installationBusImage`, `image${index}`, index);
	}
}
//creating right panel containers
function createSegmentList(index) {
	const checkIfUsed = usedIndexes.includes(index);
	if (!checkIfUsed) {
		const segmentDataContainer = document.createElement('div');
		segmentDataContainer.className = `segmentDataContainer`;
		segmentDataContainer.setAttribute(`id`, `segmentDataContainer${index}`);

		const segment = document.createElement('div');
		segment.className = `segmentContainer`;
		segment.setAttribute('id', `segment${index}`);

		const deviceType = document.createElement('div');
		const devicePara = document.createElement(`p`);
		devicePara.innerHTML = `Urządzenie`
		deviceType.className = `deviceType${index} deviceName`;
		deviceType.setAttribute('id', `deviceType${index}`);

		const cableDiameter = document.createElement('div');
		const cablePara = document.createElement(`p`);
		cablePara.innerHTML = `Przekrój kabla`
		cableDiameter.className = `cableDiameter${index} cableDim`;
		cableDiameter.setAttribute('id', `cableDiameter${index}`);

		const cableLength = document.createElement('div');
		const lengthPara = document.createElement(`p`);
		lengthPara.innerHTML = `Długość kabla`
		cableLength.className = `cableLength${index} cableLen`;
		cableLength.setAttribute('id', `cableLength${index}`);

		const deviceImageContainer = document.createElement('div');
		deviceImageContainer.className = `deviceImageContainer`;
		deviceImageContainer.setAttribute('id', `deviceImageContainer${index}`);

		const deviceImage = document.createElement(`img`);
		deviceImage.className = `deviceImage${index} deviceImg`;
		deviceImageContainer.appendChild(deviceImage);

		const segmentListContainer = document.querySelector('.segmentListContainer');

		segment.appendChild(segmentDataContainer);

		deviceType.appendChild(devicePara);
		segmentDataContainer.appendChild(deviceType);
		cableDiameter.appendChild(cablePara);
		segmentDataContainer.appendChild(cableDiameter);
		cableLength.appendChild(lengthPara);
		segmentDataContainer.appendChild(cableLength);
		segment.appendChild(deviceImageContainer);
		segmentListContainer.appendChild(segment);
	}
}

function initializeSegmentData(system) {
	document.querySelector('.powerSupply').value = systemData.supplyType;

	document.querySelector('.deviceSelect').value = systemData.bus[0].deviceName;
	document.querySelector(`.elementalDevice`).value = systemData.bus[0].deviceName;
	
	document.querySelector(`.elementalCable`).value = systemData.bus[0].cableType;
	document.querySelector(`.cableSelect`).value = systemData.bus[0].cableType;


	document.querySelector('#wireDistance').value = systemData.bus[0].cableLen_m;
	document.querySelector('.segmentListCableLength').value = systemData.bus[0].cableLen_m;
}

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

function createConfigureManySegments() {
	select(`changeManyWiresType`, `changeManyCablesType`);
	select(`changeManyDevices`, `changeManyDevicesType`);
	input('.changeManyWiresLength', `manyCablesInputChange`, 'cableInput', `changeManyCableLength`);
}

function insertDataToSegment(index, data, i) {
	console.log(data);
	const newSegment = {
		cableType: `${data.cableType}`,
		cableLen_m: data.cableLen_m,
		deviceName: `${data.deviceName}`
	};
	const segmentContainer = document.querySelector(`.segmentContainer`);
	const segmentListContainer = document.querySelector(`.segmentListContainer`);
	const clone = segmentContainer.cloneNode(true);
	console.log(newSegment.cableType);
	clone.id = `segment${index}`;
	clone.className = `segmentContainer`;

	const deviceType = clone.querySelector(`.deviceType${0}`);
	deviceType.id = `deviceType${index}`;
	deviceType.className = `deviceType${index}`;
	const deviceSelect = deviceType.querySelector(`.deviceSelect`);
	deviceSelect.dataset.indexofdevice = index;
	deviceSelect.value = newSegment.deviceName;
	
	const cableDim = clone.querySelector(`.cableDiameter${0}`);
	cableDim.id = `cableDiameter${index}`;
	cableDim.className = `cableDiameter${index}`;
	const cableDimSelect = cableDim.querySelector(`.cableSelect`);
	cableDimSelect.dataset.indexofdevice = index;
	cableDimSelect.value = newSegment.cableType;

	const cableLen = clone.querySelector(`.cableLength${0}`);
	cableLen.id = `cableLength${index}`;
	cableLen.className = `cableLength${index}`;
	cableLen.querySelector(`.segmentListCableLength`).value = parseInt(systemData.bus[0].cableLen_m);

	const deviceImage = clone.querySelector(`.deviceImageContainer`);
	deviceImage.id = `deviceImageContainer${index}`;

	const image = clone.querySelector(`.deviceImg`);
	image.className = `deviceImage${index} deviceImg`;
	systemData.bus.push(newSegment);

	segmentListContainer.appendChild(clone);
}

function addSegmentsToBus(amount) {
	for (let i = 0; i < parseInt(amount); i++) {
		systemData.bus.push(systemData.bus[0]);
		if (i !== 0) {
			createInstallationSegment(i);
		}
	}
}
