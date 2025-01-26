const fs = require('fs');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

var index = 2;

async function createJsonFile(data) {
    // Convert the JavaScript object to a JSON string
    const jsonString = JSON.stringify(data, null, 2);
    const filePath = 'D:\\_Licenta\\Licenta incercarea 2\\src\\ipfs\\jsonFiles';
    // Ensure the directory exists or create it
    // Write the JSON string to the specified file
    var finalPath = filePath + "\\" + index + ".json";
    index++;
    
    try {
        fs.writeFileSync(finalPath, jsonString, 'utf8');
        console.log('JSON file has been saved.');
        return finalPath;
    } catch (err) {
        console.error('Error writing JSON to file:', err);
        return null;
    }
}


//createJsonFile(myData);

module.exports = {createJsonFile};
