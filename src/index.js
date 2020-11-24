const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host:     '54.244.173.135',
     user:     '',
     password: '',
     database: '',
     connectionLimit: 5
});


const query = async (query, arguments) => {
    try {
        const connection = await pool.getConnection();
        try {
            await connection.query(query, arguments);
        } catch (e) {
            console.error('DB error single: ', query, arguments, e);
        }
        connection.end();
    } catch (e) {
        console.log('withPoolConnection error caught:', e);
    }
};

const flow = async (flowToExecute) => {
    try {
        const connection = await pool.getConnection();
        try {
            await flowToExecute(connection.query);
        } catch (e) {
            console.error('DB error single: ', e);
        }
        connection.end();
    } catch (e) {
        console.log('withPoolConnection error caught:', e);
    }
};


const maria = {
    query,
    flow,
};


const someBusinessLogicMethod = async () => {

    // Usage of single queries
    // Each query uses its own pool connection
    // More laconic way to make single query

    const insertionResult = await maria.query('INSERT INTO tmpTable (name) VALUES ("?")', ['tmpValue']);
    console.log('=> 1', insertionResult);

    const selectionResult = await maria.query('SELECT * FROM tmpTable');
    console.log('=> 2', selectionResult);

    // Usage of flow function
    // Multiple queries within
    // a single pool connection

    await maria.flow(async (query) => {

        const updateInFlowResult = await query('UPDATE tmpTable SET name="?" WHERE id = ?', ['newName', 2]);
        console.log('=> 3', updateInFlowResult);

        const selectInFlowResult = await query('SELECT name FROM tmpTable WHERE id = ?', [3]);
        console.log('=> 4', selectInFlowResult);

    })

};

someBusinessLogicMethod();