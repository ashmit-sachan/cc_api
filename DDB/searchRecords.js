import {DDB} from "./DDBClient.js";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

const getConfig = (exp) => {
    function generateFilters() {
        let ret = "";
        for (const key of Object.keys(exp.filter)){
            ret = ret + "#"+key+exp.filter[key].condition+":"+key+" AND ";
        }
        return ret.slice(0, -4);
    }

    function generateExpressionAttributeNames() {
        let ret = {};
        Object.keys(exp.filter).forEach(key => {
            ret[`#${key}`] = key;
        });
        return ret;
    }

    function generateExpressionAttributeValues() {
        let ret = {};
        ret[`:${exp.key}`] = exp.value;
        if (exp.filter) {
            Object.keys(exp.filter).forEach(key => {
                ret[`:${key}`] = exp.filter[key].value;
            });
        }
        return ret;
    }

    const config = {
        TableName: exp.tableName,
        IndexName: '_'+exp.key,
        KeyConditionExpression: exp.key+'=:'+exp.key,
        ExpressionAttributeValues: marshall(generateExpressionAttributeValues())
    }

    if (exp.filter) {
        config.FilterExpression = generateFilters();
        config.ExpressionAttributeNames = generateExpressionAttributeNames();
    }

    if (exp.columns)
        config.ProjectionExpression = exp.columns;

    if (exp.limit)
        config.Limit = exp.limit;

    return config;
}


const searchRecords = async (config) => {
    try {
        const queryResult = await DDB.send(new QueryCommand(getConfig(config)));
        return queryResult;
    } catch (error) {
        console.error("Error searching records:", error);
    }
};
