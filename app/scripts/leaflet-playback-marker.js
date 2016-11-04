$(function () {

    var datavalue = demoTracks
    var bigship = L.icon({
        iconUrl: '../images/marker.png',

        iconSize: [8, 13], // size of the icon

        iconAnchor: [4, 13], // point of the icon which will correspond to marker's location

        popupAnchor: [0, -40] // point from which the popup should open relative to the iconAnchor
    });

    // Get start/end times
    var startTime = new Date(datavalue[0].properties.time[0]);


    var endTime = new Date(datavalue[1].properties.time[datavalue[1].properties.time.length - 1]);


    // Create a DataSet with data
    var timelineData = new vis.DataSet([{ start: startTime, end: endTime, content: 'AIS Tracking' }]);

    // Set timeline options
    var timelineOptions = {
        "width": "100%",
        "height": "120px",
        "style": "box",
        "axisOnTop": true,
        "showCustomTime": true
    };

    // Setup timeline
    var timeline = new vis.Timeline(document.getElementById('timeline'), timelineData, timelineOptions);

    // Set custom time marker (blue)

    timeline.setCustomTime(startTime);
    // use curent Date to position the timeline marker

    /* var currentTime = new Date().format('m-d-Y h:i:s');
    timeline.setCustomTime(currentTime);
    */


    // =====================================================
    // =============== Playback ============================
    // =====================================================
    
    // Playback options
    var playbackOptions = {

        
        dateControl: true,
        orientIcons: true,
        popups: true,
        

        // layer and marker options
        layer: {
            pointToLayer: function (featureData, latlng) {
                var result = {};

                if (featureData && featureData.properties && featureData.properties.path_options) {
                    result = featureData.properties.path_options;
                }

                if (!result.radius) {
                    result.radius = 5;
                }

                return new L.CircleMarker(latlng, result);
            }
        },

        marker: {
            icon: bigship,
            riseOnHover: true,
            getPopup: function (featureData) {
                var result = '';

                if (featureData && featureData.properties && featureData.properties.title) {
                    result = featureData.properties.title;
                }

                return result;
            }
         
        }

    };
 /*  var polyline = L.polyline(, {
                        color: 'blue',
                        weight: 1,
                        opacity: 0.2,
                        smoothFactor: 1
                    }).addTo(map);*/

    // Initialize playback
    var playback = new L.Playback(map, null, onPlaybackTimeChange, playbackOptions);
    SaveMyPlayback(playback);
    playback.setData(datavalue);
    playback.setSpeed(1);

    // Uncomment to test data reset;
    //playback.setData(blueMountain);    

    // Set timeline time change event, so cursor is set after moving custom time (blue)
    timeline.on('timechange', onCustomTimeChange);

    // A callback so timeline is set after changing playback time
    function onPlaybackTimeChange(ms) {
        timeline.setCustomTime(new Date(ms));
    };

    // 
    function onCustomTimeChange(properties) {
        if (!playback.isPlaying()) {
            playback.setCursor(properties.time.getTime());
        }
    }

});

var playbackitem;
function changeSpeed(value) {



    playbackitem.setSpeed(parseFloat(value));
}
function SaveMyPlayback(playback) {
    playbackitem = playback;
}
function handleFadeout(cb)
{


}
function changeFaster() {
    var speed = playbackitem.getSpeed();
    if (speed <= 1) {
        playbackitem.setSpeed(speed + 1);
    }
    else {
        if (speed <= 2) {
            playbackitem.setSpeed(speed + 2);
        } else {
            if (speed <= 4) {
                playbackitem.setSpeed(speed + 6);
            }
            else {
                if (speed <= 10) {
                    playbackitem.setSpeed(speed + 90);
                }
            }
        }
    }
}
function changeSlower() {
    var speed = playbackitem.getSpeed();
    if (speed >= 100) {
        playbackitem.setSpeed(speed - 90);
    }
    else {
        if (speed >=10 ) {
            playbackitem.setSpeed(speed - 6 );
        } else {
            if (speed >= 4) {
                playbackitem.setSpeed(speed - 2);
            }
            else {
                if (speed >= 2) {
                    playbackitem.setSpeed(speed - 1);
                }
            }
        }
    }
}
function changePlay()
{
    if(playbackitem.isPlaying())
    {
        playbackitem.stop();

    }
    else{
        
        playbackitem.start();
    }
}
