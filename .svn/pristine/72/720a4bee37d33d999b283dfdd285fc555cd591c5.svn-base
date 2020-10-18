const checkbox = function (param, installationContainerName, segmentName, checkboxContainer, i) {
	const input = document.createElement('input');
	const segmentDiv = document.createElement('div');
	const checkboxDiv = document.createElement('div');
	input.setAttribute('id', `checkbox${i}`);
	segmentDiv.className = segmentName;
	segmentDiv.classList.add('installationSegment');	
	segmentDiv.setAttribute('id', segmentName );
	checkboxDiv.className = checkboxContainer;
	const div = document.querySelector(`.${installationContainerName}`);
	input.type = 'checkbox';
	input.name = 'cableType';
	checkboxDiv.appendChild(input);
	segmentDiv.appendChild(checkboxDiv);
	div.appendChild(segmentDiv);
};
