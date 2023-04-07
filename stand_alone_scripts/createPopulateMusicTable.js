import createTable from "../DDB/createTable.js";
import fs from 'fs/promises';
import createRecord from "../DDB/createRecord.js";
import {generateID} from "./util.js";


// Function to read JSON data from a file
async function readJsonData(filePath) {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading JSON data:', error);
    }
}

/**
 * Create music Table
 */
const musicTableConfig = {
    TableName: "music",
    AttributeDefinitions: {
        key: {
            name: "id",
            type: "S",
            throughput: 150
        },
        GSI: [
            {
                name: "title",
                indexName: "_title",
                type: "S",
                projection: "ALL",
                throughput: 150
            },
            {
                name: "artist",
                indexName: "_artist",
                type: "S",
                projection: "ALL",
                throughput: 150
            },
            {
                name: "year",
                indexName: "_year",
                type: "N",
                projection: "ALL",
                throughput: 100
            }
        ]
    }
}

const musicTable = createTable(musicTableConfig);


let index = 0;
let loadingMessage = "Creating Table: [";

const interval = setInterval(() => {
    process.stdout.write("\r" + loadingMessage + "=".repeat(index) + ">" + " ".repeat(50-index) + "] : (" + index*2 + "%)");
    index = index + 1;
}, 400);

// Simulate loading data
setTimeout(async () => {
    clearInterval(interval);
    process.stdout.write("\r" + loadingMessage + "=".repeat(50) + ">] : (100%)\n");
    console.log("\nTable Created:\n");
    console.log(musicTable);


    /**
     * Enter data in music table
     */
    const data = await readJsonData('./DDB/data/a1.json');

    for (const dataIndex of data.songs) {
        dataIndex.id = generateID();
        dataIndex.year = Number(dataIndex.year);
        const record = createRecord('music', dataIndex);
        console.log(record);
    }

}, 20000);

