// Updated helix-team-360.js

// Assuming the original file has the following structure
// ...

// Change rotationSpeed from 1.5 to 1.2
const rotationSpeed = 1.2;

// Change video.playbackRate from 1.5 to 1.2
video.playbackRate = 1.2;

// Pass container parameter to setupVideoPlayback method
setupVideoPlayback(video, container);

// Update setupVideoPlayback function signature to accept container parameter
function setupVideoPlayback(video, container) {
    // Ensure loading class is removed when video loads and on error
    video.onloadeddata = () => {
        container.classList.remove('loading');
    };
    video.onerror = () => {
        container.classList.remove('loading');
    };
}

// ...