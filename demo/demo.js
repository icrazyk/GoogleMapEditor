function initMap() {
  $('.demo-map').GoogleGeoJson();
  $('.demo-map').GoogleGeoJson('loadGeoJson', 'https://storage.googleapis.com/maps-devrel/google.json');
}