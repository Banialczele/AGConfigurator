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

chooseBusImage = (img, device, counterDevice = '') => {
	img.src = `${device}`;
	img.alt = `Unable to find image`;
	counterDevice.src = ``;
	counterDevice.alt = ``;
}

function setupImagesForSegments() {
	const segmentList = Array.from(document.querySelectorAll(`.segmentContainer`));
	segmentList.forEach((segment, i) => {
		//imageContainer
		const segmentImage = segment.querySelector(`.deviceImg`);
		try {
			chooseBusImage(segmentImage, `./PNG/${systemData.bus[i].deviceName}.png`, '');
		} catch (e) {
			chooseBusImage(segmentImage, ``, '');
		}
	});
}

function setupBusImage() {
	const installationSegment = document.querySelectorAll(`.installationSegment`);
	console.log(installationSegment);
	installationSegment.forEach((segment, i) => {
		const sirenImage = document.querySelector(`#sirenimage${i}`);
		const deviceimage = document.querySelector(`#deviceimage${i}`);
		const busImage = document.querySelector(`#cableimage${i}`);
		const device = NewDevices.find(deviceType => deviceType.type === systemData.bus[i].deviceName);
		if (device.typeOfDevice === `device`) {
			chooseBusImage(busImage, `./SVG/T-conP.svg`);
			chooseBusImage(deviceimage, `./SVG/${device.icon}`, sirenImage);
		} else if (device.typeOfDevice === `siren`) {
			chooseBusImage(busImage, `./SVG/T-conL.svg`);
			chooseBusImage(sirenImage, `./SVG/${device.icon}`, deviceimage);
		}
	});
}