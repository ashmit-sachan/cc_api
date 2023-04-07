import createTable from "../DDB/createTable.js";
import fs from 'fs/promises';
import createRecord from "../DDB/createRecord.js";


/**
 * Create Login Table
 */
const loginTableConfig = {
    TableName: "login",
    AttributeDefinitions: {
        key: {
            name: "email",
            type: "S",
            throughput: 10
        },
        GSI: [
            {
                name: "user_name",
                indexName: "user_name_GSI",
                type: "S",
                projection: "ALL",
                throughput: 10
            }
        ]
    }
}

const loginTable = createTable(loginTableConfig);


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
    console.log("\nTable Created");
    console.log(loginTable);


    /**
     * Enter data in login table
     */

    // Function to read JSON data from a file
    async function readJsonData(filePath) {
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error('Error reading JSON data:', error);
        }
    }

    const data = await readJsonData('./DDB/data/initial_users.json');

    for (const dataIndex of data.login) {
        const record = createRecord('login', dataIndex);
        console.log(record);
    }

}, 20000);

