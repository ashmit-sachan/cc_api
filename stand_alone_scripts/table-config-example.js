const tableNameConfig = {
    TableName: "login",
    AttributeDefinitions: {
        key: {
            name: "PrimaryKey",
            sortKey: "PrimaryIndex",
            type: "S",
            throughput: 10
        },
        localIndex: [
            {
                name: "PrimaryIndex",
                indexName: "PrimaryIndexName",
                type: "S",
                projection: "ALL",
                read: 10,
                write: 10
            },
            {
                name: "SecondaryIndex",
                indexName: "SecondaryIndexName",
                type: "S",
                projection: "ALL",
                read: 10,
                write: 10
            },
            {
                name: "TertiaryIndex",
                indexName: "TertiaryIndexName",
                type: "S",
                projection: "ALL",
                read: 10,
                write: 10
            }
        ],
        GSI: [
            {
                name: "SecondaryKey",
                indexName: "GSI1",
                type: "S",
                sortKey: "SecondaryIndex",
                projection: "ALL",
                read: 10,
                write: 10
            }
        ]
    }
}