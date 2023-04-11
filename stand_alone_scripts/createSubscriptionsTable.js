import createTable from "../DDB/createTable.js";

const subscriptionsNameConfig = {
    TableName: "subscriptions",
    AttributeDefinitions: {
        key: {
            name: "email",
            sortKey: "song",
            type: "S",
            throughput: 10
        },
        localIndex: [
            {
                name: "song",
                indexName: "song_LSI",
                type: "S",
                projection: "ALL",
                throughput: 10
            }
        ]
    }
}

const subscriptionsTable = createTable(subscriptionsNameConfig);


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
    console.log(subscriptionsTable);
}, 20000);

