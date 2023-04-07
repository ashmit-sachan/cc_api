
const exp = {
    tableName: 'music',
    key: 'artist',
    value: 'Arcade Fire',
    filter: {
        year: {
            condition: '>',
            value: 2000
        },
        title: {
            condition: '=',
            value: 'Half Light I'
        }
    },
    columns: 'id, web_url',
    limit: 10
}
