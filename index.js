import api from './server.js';
import db from './data/customers.js';

const server = api;

server.get('/', (req, res) => {
    res.json(db);
});

server.get('/:customerId', (req, res) => {
    const { customerId } = req.params;

    let result = db.filter(x => x.id == customerId);

    if(!result && result.length)
        res.json(db);

    res.json(result);
});