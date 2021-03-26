var map;

require([
    "esri/Color",
    "esri/geometry/Extent",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/tasks/query",
    "esri/map",
    "dojo/domReady!"],
    function (
        Color,
        Extent,
        ArcGISDynamicMapServiceLayer,
        ArcGISTiledMapServiceLayer,
        FeatureLayer,
        SimpleRenderer,
        SimpleFillSymbol,
        SimpleLineSymbol,
        Query,
        Map
    ) {
        var basisKartUrl = "https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBasis/MapServer";
        var dynamicMapUrl = "https://arcgis03.miljodirektoratet.no/arcgis/rest/services/faktaark/vern/MapServer";
        var featureLayerURL = "https://arcgis03.miljodirektoratet.no/arcgis/rest/services/faktaark/vern/MapServer/3";

        var tiledLayer = new ArcGISTiledMapServiceLayer(basisKartUrl, {
            id: "bakgrunnskart",
            showAttribution: true,
            format: "jpeg",
            fadeOnZoom: true
        });
        // --- Hele Norge
        var mapExtent = new Extent({
            'xmin': 157611,
            'ymin': 6228100,
            'xmax': 487737,
            'ymax': 8148325,
            'spatialReference': {
                'wkid': 25833
            }
        });

        var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer(dynamicMapUrl, {
            id: 'dynamicMapServiceLayer'
        });
        dynamicMapServiceLayer.setVisibleLayers([3]);

        var featureLayerSymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 0, 0]),
                2),
            new Color([0, 255, 0, 0.5])
        );

        var featureLayerRenderer = new SimpleRenderer(featureLayerSymbol);
        var queryStr = "vernRestriksjonId='VR00002993'";

        var featureLayer = new FeatureLayer(featureLayerURL, {
            id: 'featureLayer',
            outFields: ['*'],
            mode: FeatureLayer.MODE_SNAPSHOT,
            definitionExpression: queryStr
        });
        featureLayer.setRenderer(featureLayerRenderer);

        var query = new Query();
        query.where = queryStr;
        queryStr.outFields = ["*"];

        featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (features) {
            if (features.length > 0) {
                console.log(features);
                map.setExtent(features[0].geometry.getExtent().expand(2.0));
            }
        });

        map = new Map('map', {
            extent: mapExtent,
            navigationMode: 'css-transforms'
        });
        map.addLayers([tiledLayer, featureLayer, dynamicMapServiceLayer]);
    });