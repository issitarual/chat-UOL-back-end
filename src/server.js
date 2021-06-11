import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

const app = express();
app.use(cors());
app.use(express.json());

let participants = [];
let messages = [];

app.post("/participants", (req, res) => {
    const participant = req.body;
    const { name } = participant;
    if(name.length === 0){
        res.sendStatus(400);
        return;
    }
    participant.lastStatus = Date.now();
    participants.push(participant);
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
    messages.push(newMessage);
    res.sendStatus(200);
});

app.get("/messages", (req, res) => {
    let limit = req.query.limit;
    const user = req.headers.user;
    const filterMessages = messages.filter(n => n.type === 'message' || n.type === 'status' || (n.type === 'private_message' && (n.from === user || n.to === user)))
    if(!limit){
        res.send(filterMessages);
    }
    else{
        const reverseFilterMessages = filterMessages.reverse();
        let limitFilterMessages = []
        for( let i = 0; i< reverseFilterMessages.length; i++){
            limitFilterMessages.push(reverseFilterMessages[i]);
            if(limitFilterMessages.length === limit){
                res.send(limitFilterMessages.reverse());
                return;
            }
        }
        res.send(limitFilterMessages.reverse());
    }        
});

app.post("/status", (req, res) => {
    const user = req.headers.user;
    if(!participants.find(n => n.name === user)){
        res.sendStatus(400);
    }
    let online = []
    for(let i = 0; i < participants.length; i++){
        if(participants[i].name === user){
            participants[i].lastStatus = dayjs(Date.now()).format('HH:mm:ss');
            online.push(participants[i]);
        }
        else{
            online.push(participants[i]);
        }
    }
    participants = online;
    res.sendStatus(200);
});

app.listen(4000);