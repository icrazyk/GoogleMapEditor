var map;

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

function initMap() 
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });

  initDrawing(map);
}

function initDrawing(map)
{
  var drawingManagerOptions = {
    // drawingMode: google.maps.drawing.OverlayType.MARKER,     // Default draw tool    
    // drawingControl: false                                    // Hide control
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 0.3,
      strokeWeight: 2,
      clickable: false,
      editable: true,
    },
    markerOptions: {
      draggable: true,
      editable: true,
    }
  };

  var drawingManager = new google.maps.drawing.DrawingManager({
    // drawingMode: google.maps.drawing.OverlayType.MARKER,     // Default draw tool    
    // drawingControl: false                                    // Hide control
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 0.3,
      strokeWeight: 2,
      clickable: false,
      editable: true,
    }
  });
  drawingManager.setMap(map);

  var drawing = {
    config: drawingManagerOptions,
    manager: drawingManager
  }

  initDrawConfigPanel(drawing);
}

function initDrawConfigPanel(drawing)
{
  createControlPosition(drawing);
}

function createControlPosition(drawing)
{
  var controlPositionOptions = '';

  //
  // create
  //
  for(position in google.maps.ControlPosition)
  {
    controlPositionOptions += '<option value="' + position+ '">' + position+ '</option>';
  }

  var controlPositionSelect = $('<select>', {id: 'control-position'})
    .append(controlPositionOptions)
    .appendTo('#map-control');

  //
  // handlers
  //
  controlPositionSelect.change(function(){  
    var newDrawingControlOptions = {
      drawingControlOptions: {
        position: google.maps.ControlPosition[$(this).val()]
      }
    }

    var mergeDrawingControlOptions = merge_options(drawing.config, newDrawingControlOptions);

    drawing.manager.setOptions(mergeDrawingControlOptions);
  });
}