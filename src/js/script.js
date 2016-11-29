var map;

// functions

function initMap() 
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 54, lng: 35},
    zoom: 5
  });

  initDataLayerStyles();
  initInstruments();
  initDrawingList();
  initMapControlTools();
}

function initInstruments()
{
  $('#instruments').click(function(e)
  {
    if(e.target.tagName == 'BUTTON')
    {
      setInstrument(e.target);
    }
  });

  function setInstrument(instrument)
  {
    var activeClass = 'ggj-brush__btn_active';
    var instrumentName = $(instrument).data('instrument');
    $('#instruments')
      .children()
      .removeClass(activeClass);

    $(instrument)
      .addClass(activeClass);
    
    switch(instrumentName)
    {
      case 'edit':
        setEditStatus(true);
        map.data.setDrawingMode(null);
        break;

      case null:
        setEditStatus(false);
        map.data.setDrawingMode(instrumentName);    
        break;

      default:
        setEditStatus(false);
        map.data.setDrawingMode(instrumentName);
        break;
    }
  }

  function setEditStatus(status)
  {
    initDataLayerStyles(status)
  }
}

function initDrawingList()
{
  $('#drawings-list')
    .click(function(e)
    {
      var listEvent = $(e.target).data('btn');
      if(listEvent)
      {
        var listItem = $(e.target).closest('.ggj-drawings__item');
        var feature = listItem.data('feature');
        switch(listEvent)
        {
          case 'drawing-delete':
            map.data.remove(feature);
            listItem.remove();
            break;
        }
      }
    });

  map.data.addListener('addfeature', function(drawing)
  {
    // add id property

    drawing.feature.setProperty('id', getRandomInt());


    // add to list

    $(
      '<li class="ggj-drawings__item">' +
        '<div class="ggj-drawing">' +
          '<div class="ggj-drawing__content">' +
            '<div class="ggj-dwcontent">' +
              '<div class="ggj-dwcontent__title">'+ drawing.feature.getGeometry().getType() +'</div>' +
            '</div>' +
          '</div>' +
          '<div class="ggj-drawing__tool">' +
            '<div class="ggj-dwtool">' +
              '<button class="ggj-dwtool__btn" data-btn="drawing-delete">Delete</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</li>'
    )
    .data({'feature': drawing.feature})
    .attr({'data-feature-id': drawing.feature.getProperty('id')})
    .mouseover(function()
    {
      map.data.revertStyle();
      map.data.overrideStyle($(this).data('feature'), {strokeWeight: 8, animation: google.maps.Animation.BOUNCE});
    })
    .mouseout(function()
    {
      map.data.revertStyle();
    })
    .appendTo('#drawings-list');
  });

  map.data.addListener('mouseover', function(event) {
    var id = event.feature.getProperty('id');
    $('#drawings-list')
      .find('[data-feature-id="'+ id +'"]')
      .addClass('ggj-drawings__item_hover');
  });

  map.data.addListener('mouseout', function(event) {
    $('#drawings-list')
      .children()
      .removeClass('ggj-drawings__item_hover');
  });
}

function initMapControlTools()
{
  $('#drawings-state').click(function(e)
  {
    var state = $(e.target).data('btn');
    if(state)
    {
      switch(state)
      {
        case 'map-save':
          map.data.toGeoJson(function(geoJson)
          {
            console.log(geoJson);
          });
          break;

        case 'map-reset':
          if(confirm('Удалить все элементы?'))
          {
            map.data.forEach(function(feature)
            {
              map.data.remove(feature);
            });
            $('#drawings-list').html('');
          }
          break;
      }
    }
  });
}

function initDataLayerStyles(editable)
{
  map.data.setStyle(function(feature)
  {
    var prop = {
      fillColor: 'blue',
      strokeColor: 'blue'
    };
    if(editable)
    {
      prop.editable = true;
      prop.draggable = true;
    }
    return prop;
  });
}

function getRandomInt()
{
  var min = 0;
  var max = 99999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}