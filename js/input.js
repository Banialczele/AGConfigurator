const input = function(param, wireContainer, wireLabel, inputName, inputContainerDiv) {
	const wireDiv = document.querySelector(`${wireContainer}`);
	const inputDiv = document.createElement('div');
	inputDiv.className = inputContainerDiv;
	const label = document.createElement('label');
	label.setAttribute('for', wireLabel);
	const input = document.createElement('input');
	input.type = `number`;
	input.name = inputName;
	inputDiv.appendChild(label);
	inputDiv.appendChild(input);
	wireDiv.appendChild(inputDiv);
}
