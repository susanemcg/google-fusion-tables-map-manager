/**
 * authored by Susan E. McGregor
 * Tow Center for Digital Journalism
 * Columbia University Graduate School of Journalism
 * 
 */
var tableIDs;
var mapMeta;
var tableLayers = [];
//update the below map title to reflect your own content
var mapTitle = "Fusion Layers Map";

/**
 * Generate your own custom map styles by using the wizard located here: http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html. Be aware, this JSON will *not* validate properly with the likes of JSONLint
 */
var customMapStyle = [ { featureType: "transit", stylers: [ { hue: "#666666" }, { saturation: 7 }, { lightness: 7 }, { visibility: "off" } ] },{ featureType: "road", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "road", elementType: "geometry", stylers: [ { visibility: "on" }, { hue: "#0000ff" } ] },{ featureType: "water", elementType: "geometry", stylers: [ { hue: "#0091ff" }, { lightness: 61 } ] } ];

function initialize(){
var mapID = getParameterByName('mapID');
//Step 1: Get the meta data associated with this map: hed, dek, date &c.
//Replace the below with encrypted table ID of your metadata Fusion Table; also replace the key value with your own API key. Instructions on activating and locating the key can be found here: http://bit.ly/QiMcIF
var theQuery = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT * FROM 1dOv3xg7uS4hYZ54zu5kqOtfAQQxUJJrr92Eav5Y WHERE MapID="+mapID+"&key=AIzaSyDV1Plcrwo3Lu-MDUJGgWZKWYWnziHVuAs";
$.get(theQuery, parseMapMeta);
}

	
function parseMapMeta(theData){
	//the default data format returned is text, including the column headers. Since we know what these are, we'll go straight for the data itself.
	mapMeta = theData.rows[0];
	tableIDs = (mapMeta[6]).split(",");

	//Write the metadata straightoff
	$('#mapHed').html(mapMeta[1]);
	$('#mapDek').html(mapMeta[2]);
	$('#mapDate').html("Published: "+mapMeta[3]);
	$('#mapSource').html("Source: "+mapMeta[9]);
	
	//adjust the width and height of the map container based on what's in the metadata table
	$('#map_canvas').css({'width':mapMeta[4]+'px', 'height':mapMeta[5]+'px'});
	$('#mapContainer').css({'width':mapMeta[4]+'px'});
	$('#mapKey').html('<img src="'+mapMeta[11]+'" />');
	
	initializeMap();
	
	}	  
	
  function initializeMap() {
  	//parse & intitialize the basic map features - center + initial, min, max zoom
	var centerArray = (mapMeta[7]).split(",");
    var latlng = new google.maps.LatLng(Number(centerArray[0]),Number(centerArray[1]));
	var zoomArray = (mapMeta[8]).split(",");
    var myOptions = {
      zoom: Number(zoomArray[0]),
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
	  streetViewControl:false
    };
	if(zoomArray.length >1){
		myOptions.minZoom = Number(zoomArray[1]);
		myOptions.maxZoom = Number(zoomArray[2]);
	}
	
	//initialize the map
    var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
    //parse the info window layers specified in the metadata table
	var infoWindowsLayers = (mapMeta[10]).split(",");
	
	//suppress info windows for each Fusion Table layer as you add it, unless its table ID is found in the metadata table
	for (var i=0; i<tableIDs.length; i++){	
	var aTableLayer = new google.maps.FusionTablesLayer(tableIDs[i],{suppressInfoWindows:true});
	if((mapMeta[10]).indexOf(tableIDs[i]) != -1){
		aTableLayer.suppressInfoWindows = false;
		}
	//add each layer to the layers array (this will be useful in further iterations)
	tableLayers.push(aTableLayer);
	//add the layer to the map
	aTableLayer.setMap(map);
	
	}	

//that's all, folks
}

/**
 * getParameterByName is a helper function that pulls the "mapID" parameter from the query string.
 * Normally, I would have used jQuery bbq, but this conflicted with Jordon Mears' much more essential ft2json.
 */

function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}



 $(document).ready(function(){
  initialize();
   });	