/**
 * createTable.js creates a new table
 */

import {DDB} from "./DDBClient.js";
import { CreateTableCommand } from '@aws-sdk/client-dynamodb';

/**
 * Generates a Set of Parameters for the Create Table command
 *
 * @param {Object} config - Name of new Table
 *
 * @returns Object
 */

const params = (config) => {
    function getThroughput(data) {
        if(data.throughput) {
            return {
                ReadCapacityUnits: data.throughput,
                WriteCapacityUnits: data.throughput
            }
        } else if (data.read && data.write) {
            return {
                ReadCapacityUnits: data.read,
                WriteCapacityUnits: data.write
            }
        } else {
            console.error("ERROR: Can not generate \"ProvisionedThroughput\" from given data:", data)
        }
    }

    function generateAttributeDefinitions() {
        let attributes = [];
        const dataAttributes = config.AttributeDefinitions;

        // 1. PrimaryKey of the table
        if (dataAttributes.key) {
            attributes.push({
                AttributeName: dataAttributes.key.name,
                AttributeType: dataAttributes.key.type
            });
        } else {
            console.error(
                "KeySchema not found:","\t\"[TableConfig].AttributeDefinitions.key\" is needed to generate PrimaryKey"
            )
        }

        // 2. Global Secondary Indexes of the table
        if (dataAttributes.GSI) {
            for (const GSI of dataAttributes.GSI) {
                const requiredKeys = ["name", "indexName", "type", "projection"].every(
                    (key) => GSI.hasOwnProperty(key)
                );

                if (requiredKeys && (GSI.throughput || (GSI.write && GSI.read))) {
                    attributes.push({
                        AttributeName: GSI.name,
                        AttributeType: GSI.type
                    })
                }
            }
        }

        // 3. Local Indexes of the table (- includes the LSIs)
        if (dataAttributes.localIndex) {
            for (const localIndex of dataAttributes.localIndex) {
                const requiredKeys = ["name", "indexName", "type", "projection"].every(
                    (key) => localIndex.hasOwnProperty(key)
                );
                if (requiredKeys && (localIndex.throughput || (localIndex.write && localIndex.read))) {
                    attributes.push({
                        AttributeName: localIndex.name,
                        AttributeType: localIndex.type
                    })
                }
            }
        }

        return attributes;
    }

    function generateKeySchema() {
        let keySchema = [];
        let localIndexes = [];
        const keySchemaAttributes = config.AttributeDefinitions;

        // 1. PrimaryKey of the table
        if (keySchemaAttributes.key) {
            keySchema.push({
                AttributeName: keySchemaAttributes.key.name,
                KeyType: 'HASH'
            });
        } else {
            console.error(
                "KeySchema not found:","\t\"[TableConfig].AttributeDefinitions.key\" is needed to generate PrimaryKey"
            )
        }

        // 2. Local Indexes of the table (- includes the LSIs)
        if (keySchemaAttributes.localIndex) {
            for (const localIndex of keySchemaAttributes.localIndex) {
                const requiredKeys = ["name", "indexName", "type", "projection"].every(
                    (key) => localIndex.hasOwnProperty(key)
                );
                if (requiredKeys && (localIndex.throughput || (localIndex.write && localIndex.read))) {
                    localIndexes.push({
                        AttributeName: localIndex.name,
                        KeyType: 'RANGE'
                    });
                }
            }
        }

        if (localIndexes.length > 0) {
            if (keySchemaAttributes.key.sortKey) {
                for (const localIndex of localIndexes)
                    if (localIndex.AttributeName === keySchemaAttributes.key.sortKey)
                        keySchema.push(localIndex);
            } else {
                keySchema.push(localIndexes[0]);
            }
        }

        return keySchema;
    }

    function getLocalSecondaryIndexes() {
        let LSI = [];
        const dataLSI = config.AttributeDefinitions;

        // 3. Local Indexes of the table (- includes the LSIs)
        if (dataLSI.localIndex) {

            let sortKeyMatch = false;

            for (const localIndex of dataLSI.localIndex) {

                const requiredKeys = ["name", "indexName", "type", "projection"].every(
                    (key) => localIndex.hasOwnProperty(key)
                );

                if (requiredKeys && (localIndex.throughput || (localIndex.write && localIndex.read))) {
                    if (!(localIndex.name === dataLSI.key.sortKey)) {
                        LSI.push({
                                IndexName: localIndex.indexName,
                                KeySchema: [
                                    { AttributeName: dataLSI.key.name, KeyType: 'HASH' },
                                    { AttributeName: localIndex.name, KeyType: 'RANGE' }
                                ],
                                Projection: {
                                    ProjectionType: localIndex.projection
                                },
                                ProvisionedThroughput: getThroughput(localIndex)
                            }
                        );
                    } else {
                        sortKeyMatch = true;
                    }
                }
            }

            if (!sortKeyMatch) {
                LSI.shift();
            }
        }

        return LSI;
    }

    function getGlobalSecondaryIndexes() {
        let GSI = [];
        let localIndexes = [];
        const dataGSI = config.AttributeDefinitions;

        // 2. Local Indexes of the table (- includes the LSIs)
        if (dataGSI.localIndex) {
            for (const localIndex of dataGSI.localIndex) {
                const requiredKeys = ["name", "indexName", "type", "projection"].every(
                    (key) => localIndex.hasOwnProperty(key)
                );
                if (requiredKeys && (localIndex.throughput || (localIndex.write && localIndex.read))) {
                    localIndexes.push({
                        AttributeName: localIndex.name,
                        KeyType: 'RANGE'
                    });
                }
            }
        }

        // 3. Local Indexes of the table (- includes the LSIs)
        if (dataGSI.GSI) {
            for (const GSIIndex of dataGSI.GSI) {
                const requiredKeys = ["name", "indexName", "type", "projection"].every(
                    (key) => GSIIndex.hasOwnProperty(key)
                );

                if (requiredKeys && (GSIIndex.throughput || (GSIIndex.write && GSIIndex.read))) {
                    let obj = {
                        IndexName: GSIIndex.indexName, // Name of the new GSI index
                        KeySchema: [
                            { AttributeName: GSIIndex.name, KeyType: 'HASH' }
                        ],
                        Projection: {
                            ProjectionType: GSIIndex.projection
                        },
                        ProvisionedThroughput: getThroughput(GSIIndex)
                    }

                    if (localIndexes.length > 0) {
                        if (GSIIndex.sortKey) {
                            obj.KeySchema.push(
                                { AttributeName: GSIIndex.sortKey, KeyType: 'RANGE' }
                            );
                        }
                    }

                    GSI.push(obj);
                }
            }
        }

        return GSI;
    }

    const tableConfig = {
        TableName: config.TableName,
        AttributeDefinitions: generateAttributeDefinitions(),
        KeySchema: generateKeySchema(),
        ProvisionedThroughput: getThroughput(config.AttributeDefinitions.key)
    }

    if (getLocalSecondaryIndexes().length !== 0)
        tableConfig.LocalSecondaryIndexes = getLocalSecondaryIndexes()

    if (getGlobalSecondaryIndexes().length !== 0)
        tableConfig.GlobalSecondaryIndexes = getGlobalSecondaryIndexes()

    return tableConfig;
}

/**
 * Create a new table in DynamoDB
 *
 * @param {Object} config - New Table Configuration
 *
 * @returns CreateTableCommand
 */

export default async (config) => {

    let createTableResult = undefined;

    try {
        createTableResult = await DDB.send(new CreateTableCommand(params(config)));
    } catch (error) {
        console.error("Error creating table:\n", error);
    }

    DDB.destroy();
    return createTableResult;
};