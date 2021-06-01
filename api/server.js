// BUILD YOUR SERVER HERE
const express = require('express');

const User = require('./users/model');

const server = express();

//global middleware
server.use(express.json());

//endpoints
server.post('/api/users', async (req, res) => {
    try {
        //pull user info from req.body
        //use User.create with req.body
        //send back to client the new user
        if(!req.body.name || !req.body.bio) {
            res.status(400).json({
                message: "Please provide name and bio for the user"
            })
        } else {
            const newUser = await User.insert(req.body)
            res.status(201).json(newUser);
        }
    } catch (err) {
        res.status(500).json({ 
            message: "There was an error while saving the user to the database",
            error: err.message,
            stack: err.stack,
        })
    }
});

//another way to type the above code
server.post('/api/users', (req, res) => {
    const user = req.body;
    if(!user.name || !user.bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user"
        })
    } else {
        User.insert(user)
            .then(createdUser => {
                res.status(201).json(createdUser)
            })
            .catch(err => {
                res.status(500).json({ 
                    message: "There was an error while saving the user to the database",
                    error: err.message,
                    stack: err.stack,
                })
            })
    }
})

server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
            //test error message
            //throw new Error('foo')
            //send users back to client
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({ 
                message: "The users information could not be retrieved",
                error: err.message,
                stack: err.stack,
            })
        })
});

server.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        } else {
            res.json(user);
        }
    } catch (err) {
        res.status(500).json({ 
            message: "The user information could not be retrieved"
        })
    }
});
//another way to type the above code
server.get('/api/users/:id', async (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if(!user) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            }
            res.json(user)
        })
        .catch(err => {
            res.status(500).json({
                message: "The user information could not be retrieved",
                err: err.message,
                stack: err.stack,
            })
        })
});



server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    User.remove(id)
        .then(deletedUser => {
            if (!deletedUser) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            } else {
                res.json(deletedUser);
            }
        })
        .catch(err => {
            res.status(500).json({ 
                message: "The user could not be removed",
                error: err.message,
            })
        })
});
//another way to do the above code
server.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params
    try {
        const possibleUser = await User.findById(id)
    if(!possibleUser) {
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    } else {
        const deletedUser = await User.remove(id)
        res.status(200).json(deletedUser)
    }
    } catch (err) {
        res.status(500).json({ 
            message: "The user could not be removed",
            err: err.message,
            stack: err.stack,
        })
    }
})

server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req
    try {
        const updated = await User.update(id, body)
        if (!updated) {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        } else if(!body.name || !body.bio) {
            res.status(400).json({
                message: "Please provide name and bio for the user"
            })
        } else {
            res.status(200).json(updated);
        }
    } catch (err) {
        res.status(500).json({ 
            message: "The user information could not be modified",
            err: err.message,
            stack: err.stack,
        })
    }
});

server.use('*', (req, res) => {
    res.status(404).json({
        message: "not found"
    })
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
