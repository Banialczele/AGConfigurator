const dataToInsert = {
	cableType: '',
	deviceName: '',
	cableLength: 0
};

function dataToCopy(data) {
	dataToInsert.cableType = data.cableType;
	dataToInsert.cableLength = data.cableLen_m;
	dataToInsert.deviceName = data.deviceName;
	return dataToInsert;
}

function insertDataToSegment(index, data, i) {
	const newSegment = {
		cableType: `${data.cableType}`,
		cableLen_m: data.cableLength,
		deviceName: `${data.deviceName}`
	};
	const segmentContainer = document.querySelector(`.segmentContainer`);
	const segmentListContainer = document.querySelector(`.segmentListContainer`);
	const clone = segmentContainer.cloneNode(true);

	clone.id = `segment${index}`;
	clone.className = `segmentContainer`;

	const deviceType = clone.querySelector(`.deviceType${0}`);
	deviceType.id = `deviceType${index}`;
	deviceType.className = `deviceType${index}`;
	const deviceSelect = deviceType.querySelector(`.deviceSelect`);
	deviceSelect.dataset.indexofdevice = index;
	// deviceSelect.value = systemData.bus[0].deviceName;

	const cableDim = clone.querySelector(`.cableDiameter${0}`);
	cableDim.id = `cableDiameter${index}`;
	cableDim.className = `cableDiameter${index}`;

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

function  handleCopyNthTimes(e, amountToCopy) {
	const data = dataToCopy(systemData.bus[0]);

	let newIndex = 0;

	for (let i = 1; i <= amountToCopy; i++) {

		//generating unique index for segment.
		while (newIndex === Cable.usedIndexes[newIndex]) {
			newIndex++;
			if (newIndex !== Cable.usedIndexes[newIndex]) {
				createInstallationSegment(newIndex);

				Cable.usedIndexes.push(newIndex);
				break;
			}
		}
		insertDataToSegment(newIndex, data, i);
	}
	setupBusImage();
}

function handleDeleteDevice(e) {
	const segments = Array.from(document.querySelectorAll('.installationSegment'));
	if (segments.length > 1) {

		const segmentContainer = e.target.closest('.installationSegment');
		//number assigned to segment
		const segmentId = segmentContainer.querySelector('.segmentIterator').innerHTML;

		const findIndexToDelete = Array.from(segments).findIndex(segment => segment === segmentContainer);
		systemData.bus.splice(findIndexToDelete, 1);
		if (segmentContainer.parentNode !== null) {
			const infoPopup = document.querySelector('.popup');

			infoPopup.innerText = `${chooseText(usedText.usunSegment)} ${segmentId}`;
			segmentContainer.classList.add('installationSegment--delete')

			segmentContainer.addEventListener('transitionend', e => {
				segmentContainer.parentNode.removeChild(segmentContainer);
			});

			infoPopup.classList.add('open-active')
			setTimeout(() => { infoPopup.classList.remove('open-active') }, 3000);
		}
	} else {
		const infoPopup = document.querySelector('.popup');
		infoPopup.innerText = chooseText(usedText.usunJedynySegment);

		infoPopup.classList.add('open-active')
		setTimeout(() => { infoPopup.classList.remove('open-active') }, 3000);
	}
}

function adjustCableButton() {
	const systemStatus = document.querySelector(`.systemStatus `);
	const adjustCable = document.querySelector(`.adjustCable`);
	const matchSystemCables = document.createElement('input');
	matchSystemCables.setAttribute('id', 'matchCablesToSystem');
	matchSystemCables.type = "button";
	matchSystemCables.value = chooseText(usedText.dobierzKabel);
	matchSystemCables.className = `adjustCable`;
	adjustCable.appendChild(matchSystemCables);
}