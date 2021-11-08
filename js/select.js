const cables = Cables.map(cables => ({ ...cables }));
const devices = NewDevices.map(devices => ({ ...devices }));
const powerSupplies = PowerSupplies.map(psu => ({ ...psu }));

const generateOptions = (param, select) => {
	for (let i = 0; i < param.length; i++) {	
		const option = document.createElement('option');
		option.innerHTML = param[i].type;
		option.value = param[i].type;
		param[i].isBig ? option.setAttribute('data-isBig', `${param[i].isBig = true}`) : '';
		select.appendChild(option);
	}
}
function select(segmentName, type, index) {
	const label = document.createElement('label');
	const select = document.createElement('select');
	const div = document.querySelector(`.${segmentName}`);
	const containerDiv = document.createElement('div');

	switch (type) {
		case 'supplyType': {
			containerDiv.className = `powerSupplyContainer`;
			label.className = `powerSupplyLabel`;
			label.setAttribute('for', 'powerSupply');
			select.className = 'powerSupply';
			select.setAttribute('name', 'powerSupply');
			select.setAttribute('id', 'powerSupply');
			label.appendChild(select);
			containerDiv.appendChild(label);
			div.appendChild(containerDiv);
			generateOptions(powerSupplies, select);
			break;
		}

		case 'cable': {
			label.className = `cableLabel`;
			label.setAttribute('for', 'cableLabel');
			select.className = 'cableSelect';
			select.setAttribute('name', 'cableLabel');
			select.setAttribute('id', 'cableLabel');
			label.appendChild(select);
			div.appendChild(label);
			generateOptions(cables, select);

			break;
		}

		case 'elementalCable': {
			label.className = `elementalCableLabel`;
			label.setAttribute('for', 'elementalCableLabel');
			select.className = 'elementalCable';
			select.setAttribute('name', 'elementalCableLabel');
			select.setAttribute('name', 'elementalCableLabel');
			select.setAttribute('id', 'elementalCableLabel');
			label.appendChild(select);
			div.appendChild(label);
			generateOptions(cables, select);

			break;
		}

		case 'device': {
			label.className = `deviceLabel`;
			label.setAttribute('for', 'deviceLabel');
			select.className = 'deviceSelect';
			select.setAttribute('name', 'deviceLabel');
			select.setAttribute('data-indexOfDevice', `${index}`);
			select.setAttribute('id', 'deviceLabel');
			label.appendChild(select);
			div.appendChild(label);
			generateOptions(devices, select);
			break;
		}

		case 'elementalDevice': {
			label.className = `elementalDeviceLabel`;
			label.setAttribute('for', 'elementalDeviceLabel');
			select.className = 'elementalDevice';
			select.setAttribute('name', 'elementalDeviceLabel');
			select.setAttribute('id', 'elementalDeviceLabel');

			label.appendChild(select);
			div.appendChild(label);
			generateOptions(devices, select);
			break;
		}

		case 'changeManyCablesType': {
			label.className = `changeManyCables`;
			label.setAttribute('for', 'changeManyCables');
			select.className = 'changeCables';
			select.setAttribute('name', 'changeManyCables');
			select.setAttribute('id', 'changeManyCables');
			label.appendChild(select);
			div.appendChild(label);
			generateOptions(cables, select);
			break;
		}

		case 'changeManyDevicesType': {
			label.className = `changeManyDevices`;
			label.setAttribute('for', 'changeManyDevices');
			select.className = 'changeDevices';
			select.setAttribute('name', 'changeManyDevices');
			select.setAttribute('id', 'changeManyDevices');
			label.appendChild(select);
			div.appendChild(label);
			generateOptions(devices, select);
			break;
		}
	}
}

function createInstallationSegment(index) {
	const checkIfUsed = Cable.usedIndexes.includes(index);
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
	const checkIfUsed = Cable.usedIndexes.includes(index);
	if (!checkIfUsed) {
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

		deviceType.appendChild(devicePara);
		segment.appendChild(deviceType);
		cableDiameter.appendChild(cablePara);
		segment.appendChild(cableDiameter);
		cableLength.appendChild(lengthPara);
		segment.appendChild(cableLength);
		segment.appendChild(deviceImageContainer);
		segmentListContainer.appendChild(segment);
	}
}