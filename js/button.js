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

function addDevice() {

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

//button file
// function matchCablesToSystem() {
// 	const installationContainer = document.querySelector(`.installationContainer`);
// 	const segmentListContainer = document.querySelector(`.segmentListContainer`);
// 	while(installationContainer.firstChild){
// 		installationContainer.removeChild(installationContainer.firstChild);
// 		segmentListContainer.removeChild(segmentListContainer.firstChild);
// 	}
// 	systemData.bus = [];
// 	systemData.supplyType = ``;
// 	getSystem(setSystem(matchSystemCables(systemData)));
// }

function handleFileButtons() {
	const fileButtons = document.querySelector('.fileButtons');
	fileButtons.addEventListener('click', e => {
		if (e.target.id === 'saveSystemToFile') {
			saveToFile(systemData);
		} else if (e.target.id === 'readSystemFromFile') {
			readFromFile(e);
		}
	}, false);
}
