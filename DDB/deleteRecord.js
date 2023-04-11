import {DDB} from "./DDBClient.js";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import {marshall} from "@aws-sdk/util-dynamodb";


// Function to delete the item using the primary key
export default async (tableName, primaryKey) => {
    const params = {
        TableName: tableName,
        Key: marshall(primaryKey)
    };

    try {
        const data = await DDB.send(new DeleteItemCommand(params));
        console.log("Item deleted successfully:", data);
        return data;
    } catch (err) {
        console.error("Error deleting item:", err);
    }
};
