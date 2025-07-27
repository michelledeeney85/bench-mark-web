const fs = require('fs');
const path = require('path');

// Use global fetch if available (Node 18+), else require node-fetch
let fetchFn;
try {
  fetchFn = fetch;
} catch {
  fetchFn = require('node-fetch');
}

console.log('updateOpenBenchData.js script started');

// Both files are in the same directory
const jsonPath = path.join(__dirname, 'openBenchData.json');

async function updateOpenBenchData() {
  let data = [];
  try {
    data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (err) {
    console.error('Failed to read JSON:', err);
    return;
  }

  //Max Id already saved in local json file
  const maxId = data.length ? Math.max(...data.map(d => d.id)) : 0;
  //Max id manually found by checking the website. Need to update this manually every month
  const maxKnownId = 38693;
  for (let i = 1; i <= 10; i++) {
    const nextId = maxId + i;
    const url = `https://openbenches.org/api/bench/${nextId}`;
    console.log(`Fetching ${url}`);
    try {
      const res = await fetchFn(url);
      const json = await res.json();

      if (!json.features || json.features.length === 0) {
        if(nextId < maxKnownId){
          console.log(`No bench found for ID ${nextId}, continuing to next ID`);
          continue;
        } 
        else {
          console.log(`No bench found for ID ${nextId}, continuing to next ID`);
          console.log('No more benches found. Stopping.');
          break;
        }
      }

      const feature = json.features[0];
      const [lon, lat] = feature.geometry.coordinates;
      data.push({ id: nextId, lat, lon });
      console.log(`Added bench ${nextId}: lat=${lat}, lon=${lon}`);
    } catch (err) {
      console.error(`Error fetching ID ${nextId}:`, err);
      break;
    }
  }

  try {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log('Updated openBenchData.json');
  } catch (err) {
    console.error('Failed to write JSON:', err);
  }
}

updateOpenBenchData();