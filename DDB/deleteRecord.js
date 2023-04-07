import {DDB} from "./DDBClient.js";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import {marshall} from "@aws-sdk/util-dynamodb";


const primaryKey = marshall({
    email: 's38738270@student.rmit.edu.au'
});

// Define the parameters for the delete operation
const params = {
    TableName: "login", // Replace with your table name
    Key: primaryKey
};

// Function to delete the item using the primary key
const deleteItem = async () => {
    try {
        const data = await DDB.send(new DeleteItemCommand(params));
        console.log("Item deleted successfully:", data);
    } catch (err) {
        console.error("Error deleting item:", err);
    }
};

// Execute the deleteItem function
deleteItem();