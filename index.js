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
let logs = []


app.use(express.urlencoded());

app.post('/api/users', (req, res) => {
    const username = req.body.username;
    const id = users.length.toString();
    const newUser = {
        _id: id,
        username: username,
    };
    const newUserLog = {
        _id: id,
        log: [],
    }
    users.push(newUser);
    logs.push(newUserLog);
    res.json(newUser);
})

app.get('/api/users', (req, res) => {
    res.send(users);
})


app.post('/api/users/:_id/exercises', (req, res) => {
    const description = req.body.description;
    const duration = Number(req.body.duration);
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
    logs[id].log.push(newExercise);
    res.json({
        _id: id,
        username: users[id].username,
        date: date.toDateString(),
        duration: duration,
        description: description,
    })
})
app.get('/api/users/:_id/logs', (req, res) => {
    const id = req.params._id;
    const from = req.query.from;
    const to = req.query.to;
    const limit = req.query.limit;
    let filteredLog = [];
    const log = logs[id].log;
    log.forEach(exercise => {
        let exerciseCopy = structuredClone(exercise);
        const exerciseDate = exerciseCopy.date;
        const exerciseDateTime = exerciseDate.getTime();
        if (
            (!from || exerciseDateTime > Date.parse(from))
            && (!to || exerciseDateTime < Date.parse(to))
            && (!limit || filteredLog.length < limit)
        ) {
            exerciseCopy.date = exerciseDate.toDateString();
            filteredLog.push(exerciseCopy);
        }
    });

    const user = users[id];
    res.json({
        username: user.username,
        count: log.length,
        _id: id,
        log: filteredLog,
    });
})


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
