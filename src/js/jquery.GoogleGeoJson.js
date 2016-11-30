(function($) 
{
  $.fn.GoogleGeoJson = function()
  {
    return this.each(function()
    {
      var self = this;

      //
      // init
      //

      var map = new google.maps.Map($(this).find('.ggj-map')[0], 
      {
        center: {lat: 54, lng: 35},
        zoom: 5
      });

      setDataLayerStyle();

      //
      // handlers
      //

      // brush

      $(this)
      .find('.ggj-brush')
      .click(function(e)
      {
        var instrumentName = $(e.target).data('instrument');

        if(instrumentName)
        {
          var activeClass = 'ggj-brush__btn_active';

          $(self)
            .find('.ggj-brush')
            .children()
            .removeClass(activeClass);

          $(e.target)
            .addClass(activeClass);
          
          switch(instrumentName)
          {
            case 'edit':
              setDataLayerStyle('editable');
              map.data.setDrawingMode(null);
              break;

            case 'view':
              setDataLayerStyle();
              map.data.setDrawingMode(null);
              break;

            default:
              setDataLayerStyle();
              map.data.setDrawingMode(instrumentName);
              break;
          }
        }
      });

      // drawings

      var drawings = $(this).find('.ggj-drawings');

      $(drawings)
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
        drawing.feature.setProperty('id', getRandomInt());

        // add to DOM

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
        .appendTo(drawings);
      });

      map.data.addListener('mouseover', function(event) {
        var id = event.feature.getProperty('id');
        $(drawings)
          .find('[data-feature-id="'+ id +'"]')
          .addClass('ggj-drawings__item_hover');
      });

      map.data.addListener('mouseout', function(event) {
        $(drawings)
          .children()
          .removeClass('ggj-drawings__item_hover');
      });

      // state

      $(this)
      .find('.ggj-dwstate')
      .click(function(e)
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
                $(self).find('.ggj-drawings').html('');
              }
              break;
          }
        }
      });

      //
      // functions
      //

      function setDataLayerStyle(editable) 
      {
        map.data.setStyle(function(feature)
        {
          var prop = 
          {
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
      };

      function getRandomInt()
      {
        var min = 0;
        var max = 99999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
    });
  };
})(jQuery);