/**
 * createRecord.js creates a new record in a given table
 */

import {DDB} from "./DDBClient.js";
import {PutItemCommand} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb"

/**
 * Create new record/entry in a DynamoDB Table
 *
 * @param {string} tableName - Name of the Table
 * @param {Object} item - Object
 *
 * @returns PutCommand
 */

export default async (tableName, item) => {
    let createResult;

    try {
        createResult = await DDB.send(new PutItemCommand({
            TableName: tableName,
            Item: marshall(item),
        }));
        console.log("Record added successfully:\n", item);
    } catch (error) {
        console.error("Error adding record:", error);
    }

    return createResult;
};