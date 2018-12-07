L.Control.GetFeatureInfoTabs = L.Evented.extend({
  // @aka Control options
  options: {
    popupOptions:{
      minWidth:600,
      //maxHeight:300, doesnt work, using css
      autoPan:true,
      keepInView:false
    }
  },
  popup:null,

  requested_layers: null,

  done_requests:null,

  something_to_show:false,

  template_popup: "<div class='row' id='loading-wmsgetfeatureinfo-requests'>  <span class='glyphicon glyphicon-refresh glyphicon-spin'></span> Loading ... </div>"+
                  "<div class='row'>"+
                    "<div class='col-sm-8'>"+
                      "<div class='tab-content'>{tabs}</div>"+
                    "</div>"+
                    "<div class='col-sm-4'>"+
                      "<ul class='nav nav-pills nav-stacked'>{tabs_content}</ul>"+
                    "</div>"+
                  "</div>",

  template_tab_pane:"<div id='tab-{index}' class='tab-pane fade {active}'></div>",

  template_tab_content:"<li class='{active}'>"+
                          "<a data-toggle='tab' href='#tab-{index}'>{title}</a>"+
                        "</li>",

  template_features_table:"<table class='table table-hover'> {rows} </table>",

  template_feature_row :  "<tr>"+
                            "<td><b>{key}</b></td>"+
                            "<td>{value}</td>"+
                          "</tr>",

  initialize: function (options) {
    L.Util.setOptions(this, options);
  },

	addTo: function (map) {
		this.remove();
		this._map = map;
    this._map.on('click', this.getFeatureInfo, this);
		return this;
	},

	remove: function () {
		if (!this._map) {
			return this;
		}
    this._map.off('click', this.getFeatureInfo, this);
		this._map = null;
		return this;
	},

  hideLoading: function(){
    $("#loading-wmsgetfeatureinfo-requests").hide();
  },

  updateStatus:function(){
    var that = this;
    that.done_requests++;
    if(that.requested_layers == that.done_requests){
      //done: if there is no content close popup
      if(!that.something_to_show){
        $("#loading-wmsgetfeatureinfo-requests").html("  No se encontró contenido para mostrar ...");
        setTimeout(function(){
          that.popup.removeFrom(that._map);
        },1000);
      }


    }
  },

  getFeatureInfo: function (evt) {
    //initialize
    if(this.popup) {
      this.popup.removeFrom(this._map);
    }
    this.done_requests=0;
    this.something_to_show=false;
    var that = this;
    //some aux vars
    var tabs=[];
    var tab_panes=[];
    var tab_lis=[];
    var index=0;

    this._map.eachLayer(function(l){
      if(l.wmsParams){
        var obj = that.tabInfo(l,evt.latlng);
        obj.index = index;
        obj.active = 'hidden';
        tab_panes.push(L.Util.template(that.template_tab_pane, obj));
        tab_lis.push(L.Util.template(that.template_tab_content, obj));
        tabs.push(obj);
        index++;
      }
    });
    this.requested_layers = index; //amount of current requests
    if(this.requested_layers > 0){
      //CREATE TEMPLATES
      var tabsData = {
        tabs : tab_panes.join(""),
        tabs_content: tab_lis.join("")
      };
      var popupContent = L.Util.template(this.template_popup, tabsData);
      //GET THE INFO
      for(var t in tabs){
        this.queryLayer(tabs[t].url,tabs[t].index);
      }
      this.popup = L.popup(this.options.popupOptions)
      .setLatLng(evt.latlng)
      .setContent(popupContent)
      .openOn(this._map);

    }

  },

  tabInfo: function(layer,latlng){
    //todo: we need to access somehow control.layers and get the title

    var title = (layer.options.title)? layer.options.title : layer.wmsParams.layers;
    var url = this.getFeatureInfoUrl(layer,latlng);

    return {
      'title':title,
      'url':url
    }
  },
  
  queryLayer: function(url,index){
    var target = '#tab-'+index;
    var that = this;
    $.getJSON(url,function(data){
      if(data.features.length>0){
        //there is info to show
        var props = data.features[0].properties;
        var rows = [];
        for(key in props){
          if(props[key]!=="" && props[key]!== null){
            var valor = props[key];
            rows.push(L.Util.template(that.template_feature_row, {key:key, value:valor}))
          };
        }
        var content = L.Util.template(that.template_features_table,{rows:rows.join("")});

        //allow tab and hide loading
        var searchFor = 'a[href$="#tab-'+index+'"]';
        $(searchFor).parent().removeClass("hidden");
        $(target).removeClass("hidden");
        $(searchFor).click();
        that.something_to_show = true;
        that.hideLoading();
      }else{
        var content = "sin resultados";
      }

      $(target).html(content);
      that.updateStatus();
    });
  },

  getFeatureInfoUrl: function (l,latlng) {
    // Construct a GetFeatureInfo request URL given a point
    var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
        size = this._map.getSize(),

        params = {
          request: 'GetFeatureInfo',
          service: 'WMS',
          srs: 'EPSG:4326',
          styles: l.wmsParams.styles,
          transparent: l.wmsParams.transparent,
          version: l.wmsParams.version,
          format: l.wmsParams.format,
          bbox: this._map.getBounds().toBBoxString(),
          height: size.y,
          width: size.x,
          layers: l.wmsParams.layers,
          query_layers: l.wmsParams.layers,
          info_format: 'application/json'
        };
        if(l.wmsParams.cql_filter)params.cql_filter = l.wmsParams.cql_filter;
        if(l.wmsParams.viewparams)params.viewparams = l.wmsParams.viewparams;

    params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
    params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

    return l._url + L.Util.getParamString(params, l._url, true)
  }

});

L.control.getfeatureinfotabs = function(opts) {
    return new L.Control.GetFeatureInfoTabs(opts);
}
