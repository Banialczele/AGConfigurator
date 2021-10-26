const  picture = function(type, imageContainer, containerName, imageId, index) {
	const image = document.createElement('img');
	switch( type ) {
		case "psu": {
			image.setAttribute('src', "./SVG/CU.svg");
			image.setAttribute('id', `${imageId}`);
			const container = document.querySelector(`.${containerName}`);
			container.appendChild(image);
			break;
		}
		case "cable" : {
			image.setAttribute('id', `${type}${imageId}`);
			image.classList.add(`${type}image`);
			const container = document.querySelector(`#installationSegment${index} .${containerName}`);
			container.appendChild(image);
			break;
		}
		case "device" : {
			image.setAttribute('id', `${type}${imageId}`);
			image.classList.add(`${type}image`);
			const container = document.querySelector(`#installationSegment${index} .${containerName}`);
			const deviceImageContainer = document.createElement(`div`);
			deviceImageContainer.className = `deviceImageContainer`;
			const deviceDiv = document.createElement(`div`);
			deviceDiv.className = `helper`;

			deviceImageContainer.appendChild(image);
			container.appendChild(deviceImageContainer);
			container.appendChild(deviceDiv);
			break;
		}
		case "siren": {
			image.setAttribute('id', `${type}${imageId}`);
			image.classList.add(`${type}image`);
			const container = document.querySelector(`#installationSegment${index} .${containerName}`);

			const sirenImageContainer = document.createElement(`div`);
			sirenImageContainer.className = `sirenImageContainer`;
			const sirenDiv = document.createElement(`div`);
			sirenDiv.className = `helper`;

			sirenImageContainer.appendChild(image);
			container.appendChild(sirenImageContainer);
			container.appendChild(sirenDiv);
			break;
		}
	}
}