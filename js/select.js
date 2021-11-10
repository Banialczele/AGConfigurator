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
			devices.splice(devices.length - 2, 2);
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
			devices.splice(devices.length - 2, 2);
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
			devices.splice(devices.length - 2, 2);
			generateOptions(devices, select);
			break;
		}
	}
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
			setupImagesForSegments();
		}
		if (e.target.classList.contains(`cableSelect`)) {
			systemData.bus[i].cableType = e.target.value
		}
		if (e.target.classList.contains(`segmentListCableLength`)) {
			systemData.bus[i].cableLen_m = e.target.value
		}
	});
}

function handleBasicDataChange(e, targetName) {
	const rightPanelDevice = document.querySelector(`.deviceSelect`);
	const rightPanelSelect = document.querySelector(`.cableSelect`);
	const rightPanelInput = document.querySelector(`.segmentListCableLength`);
	const segmentContainer = document.querySelectorAll(`.segmentContainer`);
	if (segmentContainer.length === 1) {
		if (targetName === `elementalDeviceLabel`) {
			systemData.bus[0].deviceName = e.target.value;
			rightPanelDevice.value = systemData.bus[0].deviceName ;
		} else if (targetName === `elementalCableLabel`) {
			systemData.bus[0].cableType = e.target.value;
			rightPanelSelect.value = systemData.bus[0].cableType;
		} else if (targetName === `powerSupply`) {
			systemData.supplyType = e.target.value;
		} else if (targetName === `wireDistance`) {
			systemData.bus[0].cableLen_m = parseInt(e.target.value);
			rightPanelInput.value = parseInt(e.target.value);
		}
	}
	setupBusImage();
}
