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
    const enter = {
        id: nextMessageId,
        from: name,
        to: 'Todos',
        text: 'entra na sala...',
        type: 'status',
        time: dayjs(participant.lastStatus).format('HH:mm:ss')
    }
    nextParticipantId++;
    nextMessageId++;
    messages.push(enter);
    res.sendStatus(200);
});

app.get("/participants", (req, res) => {
    res.send(participants);
});

app.post("/messages", (req, res) => {
    const newMessage = req.body;
    const { to, text, type } = newMessage;
    const from = req.headers.user;
    const typeValidation =  type === 'message' || type === 'private_message';
    if(to.length === 0 || text.length === 0 || from.length === 0 || !typeValidation){
        res.sendStatus(400);
        return;
    }
    newMessage.from = from;
    newMessage.time = dayjs(Date.now()).format('HH:mm:ss');
    newMessage.id = nextMessageId;
    messages.push(newMessage);
    nextMessageId++;
    res.sendStatus(200);
});

app.get("/messages", (req, res) => {
    let limit = req.query.limit;
    res.send(messages);
});

app.post("/status", (req, res) => {

});

app.listen(4000);