const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

// The orphan markers start with stop-argentina and end with journey-stops-overlay end tag
const startTag = '<div class="journey-map-stop" id="stop-argentina">';
const endTag = '</div><!-- end #journey-stops-overlay -->';

let startIdx = content.indexOf(startTag);
// Find the SECOND one if there's more than one (one is inside wrapper)
// But wait, the one inside wrapper should also have this.
// So let's check which one is inside wrapper.

const wrapperTag = '<div id="journey-map-wrapper">';
const wrapperEndTag = '</div><!-- end #journey-map-wrapper -->';
const wrapperStart = content.indexOf(wrapperTag);
const wrapperEnd = content.indexOf(wrapperEndTag, wrapperStart);

if (startIdx !== -1) {
    // If this startIdx is INSIDE the wrapper, find the next one.
    if (startIdx > wrapperStart && startIdx < wrapperEnd) {
        startIdx = content.indexOf(startTag, startIdx + 1);
    }
    
    if (startIdx !== -1) {
        const endIdx = content.indexOf(endTag, startIdx);
        if (endIdx !== -1) {
            const fullEndIdx = endIdx + endTag.length;
            content = content.slice(0, startIdx) + content.slice(fullEndIdx);
            fs.writeFileSync(path, content);
            console.log('Orphan markers removed');
        } else {
            console.log('End tag for orphan not found');
        }
    } else {
        console.log('No orphan markers found');
    }
} else {
    console.log('Start tag not found');
}
