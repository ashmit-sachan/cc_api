import readRecord from "./readRecord.js";
import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";

export const checkEmailPassword = async (email, password) => {
    const tableName = 'login'
    const record = await readRecord(tableName, {email: email});

    return !!(record.Item && unmarshall(record.Item).password === password);
}