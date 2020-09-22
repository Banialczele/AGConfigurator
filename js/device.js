const Device = {
	deviceComponent: function(Devices) {
		Devices.forEach((device, index) => {
			select(Devices, `deviceLabel`, `deviceSelect`, `segmentContainer${index}`, `deviceContainer`);
		})
	},
	deviceButtons: function(Devices, selectedDeviceIndex, selectedWireIndex) {
		button(Devices, selectedDeviceIndex, selectedWireIndex, `segmentContainer`, `deviceContainer`, `buttonContainer`);

	}
}

