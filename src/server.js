import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

const app = express();
app.use(cors());
app.use(express.json());

let nextParticipantId = 1;
let participants = [];
let nextMessageId = 1;
let messages = [];

app.post("/participants", (req, res) => {
    const participant = req.body;
    const { name } = participant;
    if(name.length === 0){
        res.sendStatus(400);
        return;
    }
    participant.lastStatus = Date.now();
    participant.id = nextParticipantId;
    participants.push(participant);
    nextParticipantId++;
    const enter = {
        from: name,
        to: 'Todos',
        text: 'entra na sala...',
        type: 'status',
        time: dayjs(participant.lastStatus).format('HH:mm:ss')
    }
    messages.push(enter);
    res.sendStatus(200);
});

app.get("/participants", (req, res) => {

});

app.post("/messages", (req, res) => {

});

app.get("/messages", (req, res) => {

});

app.post("/status", (req, res) => {

});

app.listen(4000);