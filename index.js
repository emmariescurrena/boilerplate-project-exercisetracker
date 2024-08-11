const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

let users = [];

app.use(express.urlencoded());

app.post('/api/users', (req, res) => {
    const username = req.body.username;
    const newUser = {
        username: username,
        _id: users.length,
        count: 0,
        log: [],
    }
    users.push(newUser);
    res.json({
        username: newUser.username,
        _id: newUser._id,
    });
})

app.get('/api/users', (req, res) => {
    res.send(users);
})

app.post('/api/users/:_id/exercises', (req, res) => {
    const description = req.body.description;
    const duration = req.body.duration;
    const optionalDate = req.body.date;
    let date;
    if (!optionalDate) {
        date = new Date(Date.now());
    } else {
        date = new Date(Date.parse(optionalDate));
    }
    const newExercise = {
        description: description,
        duration: duration,
        date: date,
    }
    const id = req.params._id;
    users[id].log.push(newExercise);
    users[id].count += 1;
    res.json({
        _id: id,
        username: users[id].username,
        description: description,
        duration: duration,
        date: date.toDateString(),
    })
})


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
