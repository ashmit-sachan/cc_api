// Import the required AWS SDK clients and commands
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

// Set up the AWS Region and DynamoDB client
const REGION = "us-west-2"; // Replace with your desired AWS region
const ddbClient = new DynamoDBClient({ region: REGION });

// Define the primary key of the item you want to update
const primaryKey = {
    "PrimaryKeyAttributeName": { S: "PrimaryKeyAttributeValue" } // Replace with your primary key attribute name and value
};

// Define the update expression, attribute names, and attribute values
const updateExpression = "SET #attr1 = :val1";
const expressionAttributeNames = {
    "#attr1": "AttributeNameToUpdate" // Replace with the attribute name you want to update
};
const expressionAttributeValues = {
    ":val1": { S: "NewAttributeValue" } // Replace with the new attribute value
};

// Define the parameters for the update operation
const params = {
    TableName: "YourTableName", // Replace with your table name
    Key: primaryKey,
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
};

// Function to update the item using the primary key
const updateItem = async () => {
    try {
        const data = await ddbClient.send(new UpdateItemCommand(params));
        console.log("Item updated successfully:", data);
    } catch (err) {
        console.error("Error updating item:", err);
    }
};

// Execute the updateItem function
updateItem();