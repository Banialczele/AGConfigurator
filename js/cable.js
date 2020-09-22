const Cable = {
	cableComponent: function(Cables) {
		Cables.forEach((wire, i) => {
			checkbox(wire, 'installationContainer', `segmentContainer${i}`, `checkboxContainer`);
			select(Cables, 'wireLabel', 'wireSelect', `segmentContainer${i}`, `wireContainer`);
			input(wire, `.segmentContainer${i} .wireContainer`, `wireInput`, 'wireInput', 'wireContainerInput');
		});
	}
}






