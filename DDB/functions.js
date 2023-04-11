import readRecord from "./readRecord.js";
import {unmarshall} from "@aws-sdk/util-dynamodb";
import createRecord from "./createRecord.js";
import {searchRecords} from "./searchRecords.js";
import deleteRecord from "./deleteRecord.js";

export const checkEmailPassword = async (email, password) => {
    const tableName = 'login'
    const record = await readRecord(tableName, {email: email});

    if (record) {
        return record.password === password;
    } else {
        return false;
    }
}

export const createNewUser = async (email, user_name, password) => {
    const tableName = 'login';
    const record = await readRecord(tableName, {email: email});

    if (!record) {
        const entry = await createRecord(tableName, {
            email: email,
            user_name: user_name,
            password: password
        });
        return entry.$metadata.httpStatusCode === 200;
    } else {
        return false;
    }
}

export const getUserSubscriptions = async (email) => {
    const exp = {
        tableName: 'subscriptions',
        pk: true,
        key: 'email',
        value: email,
        columns: 'song',
    }

    const items = [];
    const records = await searchRecords(exp);


    if (records.Items) {
        for (const item of records.Items) {
            items.push(await readRecord('music', {id: unmarshall(item).song}));
        }
    }

    return items;
}

export const addUserSubscription = async (email, songId) => {
    const tableName = 'subscriptions';

    const entry = await createRecord(tableName, {
        email: email,
        song: songId
    });

    return entry.$metadata.httpStatusCode === 200;
}

export const searchMusic = async (params) => {
    const exp = {
        tableName: 'music',
        pk: false,
    }

    const precedenceKeys = ["title", "artist", "release_year"];
    for(let index=0; index < precedenceKeys.length; index++) {
        if (params[precedenceKeys[index]]) {
            exp.key = precedenceKeys[index];
            exp.value = params[precedenceKeys[index]];

            delete params[precedenceKeys[index]];
            break;
        }
    }

    if (Object.keys(params).length) {
        exp.filter = {};
        for (let param in params) {
            exp.filter[param] = {};
            exp.filter[param].condition = "=";
            exp.filter[param].value = params[param];
        }
    }
    const items =[];
    const records = await searchRecords(exp);

    if (records.Items) {
        for (const item of records.Items) {
            items.push(unmarshall(item));
        }
    }
    return items;
}

export const removeSubscription = async (email, song) => {
    const tableName = 'subscriptions';
    const result = await deleteRecord(tableName, {email, song})

    return result.$metadata.httpStatusCode === 200;;
}