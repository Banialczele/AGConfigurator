const Device = {
	deviceComponent: function(device, index) {
		select(null, `deviceLabel`, `deviceSelect`, `segmentContainer${index}`, `deviceContainer`, 'device');
	},
	deviceButtons: function(element, index) {
		button(element, index);
	}
}

