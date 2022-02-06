import app from './server.js';
import db from './data/customers.js';

const api = app.api;
const jwt = app.jwt;

api.post('/auth', (req, res) => {
    if(!req.body)
        return res.status(401).send();
    
    const { userId, authPass } = req.body;

    if(!userId || !authPass)
        return res.status(403).send();

    const user = db.some(x => x.userId === userId && x.authPass === authPass);

    if(user){
        const { id } = user;

        const token = jwt.sign({id, userId}, process.env.SECRET_KEY, {
            expiresIn: 600
        });
    
        return res.json({token});
    }
    return res.status(401).json({message: 'User not valid'});
})

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if(!token)
        return res.status(401).json({auth: false, message: 'Token is not present'});

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if(err)
            return res.status(403).json({auth: false, message: 'Invalid token'})

        next();
    })
}

api.post('/', verifyToken, (req, res)=> {
    if(!req.body)
        return res.status(401).send('No customer present');

    const { userId, name, authPass, age } = req.body;

    if(!userId && (!name || !authPass))
        return res.status(401).send('UserId, Name or Password not present');

    if(db.some(x => x.userId == userId && x.name === name && x.authPass === authPass))
        return res.status(401).send();
    
    const lastCustomer = db.reduce((acm, current) => acm.id > current.id ? acm : current);

    const id = lastCustomer.id + 1;

    db.push({id, userId, name, age, authPass})
    
    return res.status(201).send();
})

api.get('/', verifyToken, (req, res) => {
    res.json(db);
});

api.get('/:customerId', verifyToken, (req, res) => {
    const { customerId } = req.params;

    let result = db.filter(x => x.id == customerId);

    res.json(result);
});