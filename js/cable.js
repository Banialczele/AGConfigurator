const Cable = {
	usedIndexes: [],
	cableComponent: function(cable, index) {
		checkbox(cable, 'installationContainer', `segmentContainer${index}`, `checkboxContainer`);
		select(null,'wireLabel', 'wireSelect', `segmentContainer${index}`, `wireContainer`, `cable`);
		input(cable, `.segmentContainer${index} .wireContainer`, `wireInput`, 'wireInput', 'wireContainerInput');
		this.usedIndexes.push(index);
	},

}


