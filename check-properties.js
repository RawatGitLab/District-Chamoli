import { MongoClient } from "mongodb";



async function run() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  const collection = db.collection(MONGODB_COLLECTION);
  
  const docs = await collection.find({}).toArray();
  console.log("Total docs:", docs.length);
  
  docs.forEach((doc) => {
    const layerName = doc.name || doc.Layer || doc.layer || "Unassigned";
    let featureCount = 0;
    let sampleGeom = null;
    let sampleProps = null;
    
    let coordSamples = [];
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    
    function processCoords(coords) {
      if (!Array.isArray(coords)) return;
      if (coords.length === 2 && typeof coords[0] === 'number') {
        const [x, y] = coords;
        if (isFinite(x) && isFinite(y)) {
          if (x < xMin) xMin = x;
          if (x > xMax) xMax = x;
          if (y < yMin) yMin = y;
          if (y > yMax) yMax = y;
          if (coordSamples.length < 5) coordSamples.push([x, y]);
        }
      } else {
        coords.forEach(processCoords);
      }
    }

    if (Array.isArray(doc.features)) {
      featureCount = doc.features.length;
      if (featureCount > 0) {
        sampleGeom = doc.features[0].geometry?.type;
        sampleProps = doc.features[0].properties;
        doc.features.forEach(f => {
          if (f.geometry?.coordinates) {
            processCoords(f.geometry.coordinates);
          }
        });
      }
    } else if (doc.geometry) {
      featureCount = 1;
      sampleGeom = doc.geometry.type;
      sampleProps = doc.properties || doc;
      if (doc.geometry.coordinates) {
        processCoords(doc.geometry.coordinates);
      }
    }
    
    console.log(`Layer: "${layerName}" | count: ${featureCount} | type: ${sampleGeom}`);
    if (xMin !== Infinity) {
      console.log(`   Bounding Box: X [${xMin}, ${xMax}] | Y [${yMin}, ${yMax}]`);
      console.log(`   Sample Raw Coordinates: ${JSON.stringify(coordSamples)}`);
    }
    if (sampleProps) {
      console.log(`   Sample Properties: ${JSON.stringify(Object.keys(sampleProps))}`);
    }
  });
  
  await client.close();
}
run();
