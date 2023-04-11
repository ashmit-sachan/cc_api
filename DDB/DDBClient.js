/**
 * DDBClient.js creates a DynamoDB Client
 * The following values need to be updated in the .env file
 *      - AWS_ACCESS_KEY_ID
 *      - AWS_SECRET_ACCESS_KEY
 *      - AWS_SESSION_TOKE
 *
 * @returns DynamoDBClient
 */

import dotenv from "dotenv";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

// Setting us Environment Variables
dotenv.config();


export const DDB = new DynamoDBClient({
    // endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    },
    region: process.env.AWS_DEFAULT_REGION
});
