const fs = require('fs');
const file = 'd:/001 - Proyectos de IA/vanguardcrux-local/index.html';
let html = fs.readFileSync(file, 'utf8');

const oldChunk = `                <span class="stop-label-city">Porto ✦</span>
              </div>
        <!-- Progress bar -->`;

const newChunk = `                <span class="stop-label-city">Porto ✦</span>
              </div>
              <div class="stop-dot"></div>
            </div>

            <!-- PLANE -->
            <div id="journey-plane">
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M407.7 26.6c-7.7 2.1-60.4 17.4-105 31.2L222.1 139l-149.1-41.8c-4.9-1.4-10.2.3-13.3 4.3l-24 32c-5.6 7.5-1.5 18.1 7.5 20.5L150.6 182l-58.6 58.6-46.5-13c-4.6-1.3-9.6.3-12.7 4l-16 20c-5.3 6.6-1.6 16.3 6.7 17.7l57.3 9.5 9.5 57.3c1.4 8.3 11.1 12 17.7 6.7l20-16c3.7-3.1 5.3-8.1 4-12.7l-13-46.5 58.6-58.6 28.5 107.4c2.4 9 12.9 13.1 20.5 7.5l32-24c4-3.1 5.7-8.4 4.3-13.3l-41.8-149.1 81.3-80.5c13.8-44.6 29.1-97.3 31.2-105 3.2-11.8-6.8-22-18.6-19.4z" fill="#64ffda"/>
              </svg>
            </div>

          </div><!-- end #journey-map-wrapper -->
        </div><!-- end #journey-right-panel -->

        <!-- Progress bar -->`;

if (html.includes(oldChunk)) {
  html = html.replace(oldChunk, newChunk);
  fs.writeFileSync(file, html);
  console.log('✅ Fixed HTML successfully');
} else {
  console.log('❌ Target chunk not found');
  // Try with \r\n
  const old2 = oldChunk.replace(/\n/g, '\r\n');
  if (html.includes(old2)) {
    html = html.replace(old2, newChunk.replace(/\n/g, '\r\n'));
    fs.writeFileSync(file, html);
    console.log('✅ Fixed HTML (CRLF) successfully');
  } else {
    console.log('❌ Neither LF nor CRLF variant found');
  }
}
