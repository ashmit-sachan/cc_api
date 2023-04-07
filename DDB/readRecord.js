/**
 * createRecord.js creates a new record in a given table
 */

import {DDB} from "./DDBClient.js";
import {GetItemCommand} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

/**
 * Create new record/entry in a DynamoDB Table
 *
 * @param {string} tableName - Name of the Table
 * @param {Object} primaryKey - PrimaryKey (Partition | SortKey (if present in table))
 *
 * @returns Object
 */

export default async (tableName, primaryKey) => {
    const param = {
        TableName: tableName,
        Key: marshall(primaryKey)
    };

    try {
        const getResult = await DDB.send(new GetItemCommand(param));
        if (getResult.Item) {
            console.log("Record retrieved successfully:", unmarshall(getResult.Item));
        } else {
            console.log("Record not found.");
        }

        return getResult;
    } catch (error) {
        console.error("Error retrieving record:", error);
    }
};
