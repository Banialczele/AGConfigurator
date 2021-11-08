const Cable = {
	usedIndexes: [],
	cableComponent: function(cable, index) {
		createInstallationSegment(index);
		createSegmentList(index);
		//cable select for list of devices.
		select(`cableDiameter${index}`, `cable`);
		//cable input for list of devices.
		input(`.cableLength${index}`, `cableInput`, 'cableInput', 'cableContainerInput');
		//picture for bus devices.
		// picture('cable', `cableImageContainer`, `installationBusImage`, `image${index}`, index);
		this.usedIndexes.push(index);
	},	
}
