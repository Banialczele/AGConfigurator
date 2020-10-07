const cables = Cables.map(wires => ({ ...wires }));
const devices = Devices.map(devices => ({ ...devices }));

const generateOptions = (param, select, targetName) => {
	for( let i = 0; i < param.length; i++ ) {
		const option = document.createElement('option');
		if( i === 0 ) {
			const blank = new Option(`Wybierz ${targetName}`, '');
			select.add(blank, undefined);
		}
		option.innerHTML = param[i].type;
		option.value = param[i].type;
		select.appendChild(option);
	}
}

const select = function(param, labelClass, selectName, segmentName, selectContainer, type) {
	const selectContainerDiv = document.createElement('div');

	selectContainerDiv.className = selectContainer;
	const label = document.createElement('label');
	label.className = labelClass;
	label.setAttribute('for', selectName);
	const select = document.createElement('select');
	select.className = selectName;
	select.setAttribute('name', selectName);
	select.setAttribute('id', selectName);
	const div = document.querySelector(`.${segmentName}`);

	switch( type ) {
		case 'powerSupply' : {
			generateOptions(param, select, 'zasilacz');
			break;
		}
		case 'cable' : {
			generateOptions(cables, select, 'przewód');
			break;
		}

		case 'device' : {
			generateOptions(devices, select, 'urządzenie');
			break;
		}
	}

	label.appendChild(select);
	selectContainerDiv.appendChild(label);
	div.appendChild(selectContainerDiv);
}
