// screenshare

function set_video(stream)
    {
        var video = $('video')[0];
        
        video.srcObject        = stream;
        video.onloadedmetadata = function(e) { video.play(); };
    }

function log_error(err)
    {
        console.log("Error:");
        console.log('a'+err);
    }


//---- Execution -----------------------------------------------------------------------------------------------------

var constraints =
    {
        audio: true,
        video:
            {
                width      : 1280,
                height     : 720,
                mediaSource: 'screen'
            }
    }

var promise = navigator.mediaDevices.getUserMedia(constraints).then(set_video).catch(log_error);
console.log(promise);
