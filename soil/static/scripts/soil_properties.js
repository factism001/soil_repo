function updateDepthOptions() {
      var propertySelect = document.getElementById('propertySelect');
      var depthSelect = document.getElementById('depthSelect');

      // Reset depth options
      depthSelect.innerHTML = '';

      // Get the selected property value
      var selectedProperty = propertySelect.value;

      // Add depth options based on the selected property
      if (
        selectedProperty === 'crop_cover_2015' ||
        selectedProperty === 'crop_cover_2016' ||
        selectedProperty === 'crop_cover_2017' || 
	selectedProperty === 'crop_cover_2018' || 
	selectedProperty === 'crop_cover_2019'
      ) {
        depthSelect.innerHTML = '<option value="0">0 cm</option>';
      } else if (selectedProperty === 'bedrock_depth') {
        depthSelect.innerHTML = '<option value="0-200">0-200 cm</option>';
      } else if (
        selectedProperty === 'land_cover_2015' ||
        selectedProperty === 'land_cover_2016' ||
        selectedProperty === 'land_cover_2017' || 
	selectedProperty === 'land_cover_2018' || 
	selectedProperty === 'land_cover_2019' || 
	selectedProperty === 'slope_angle'
      ) {
        depthSelect.innerHTML = '<option value="0">0 cm</option>';
      } else if (selectedProperty === 'fcc') {
        depthSelect.innerHTML = '<option value="0-50">0-50 cm</option>';
      } else {
        // Default depth option for other properties
        depthSelect.innerHTML = '<option value="0-20">0-20 cm</option>' +
                                '<option value="20-50">20-50 cm</option>';
      }
}
