Leaflet WMS GetFeatureInfo using bootstrap tabs-panel
==============

This control allows to make multiple ajax requests to different WMS services at the same time with no need of a proxy or worrying about CORS. The results are displayed on a bootstrap tab panel.

Tested in Leaflet 1.3.4, jQuery 3 and Bootstrap 3

**Demo:** [Link](https://fedesanchez.github.io/leaflet-getfeatureinfo-tabs/demo/)



## Requirements:

1. Include [jquery](#) and [bootstrap](#)

    ```html
    <!-- Jquery -->
    <script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous"></script>
    <!-- bootstrap -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    ```
2. Include Leaflet and add the plugin
  ```html
      <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet-src.js"></script>
      <script src="../src/Leaflet.Control.GetFeatureInfoTabs.js"></script>
  ```

## Usage:   

 Create a Leaflet map and add some L.tileLayer.wms layers, then:

  ```javascript
      L.control.getfeatureinfotabs().addTo(map);
  ```    

### Options

Object containing popupOptions inherited from [L.popup](https://leafletjs.com/reference-1.3.4.html#popup-l-popup):

```javascript
    var options = {
      popupOptions:{
        minWidth:600,
        autoPan:true,
        keepInView:false
      }
    }
    L.control.getfeatureinfotabs(options).addTo(map);
```    

### Tips and tricks
  maxHeight doesn't seem to work on popups so we need to add some css

````css
    .tab-content {
        overflow: auto;
        max-height: 300px !important;
    }
````

## Contact
- Email: federico.augusto.sanchez@gmail.com
