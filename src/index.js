const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig')

const { createChannel, subscribeMessage } = require('./utils/messageQueue');
const { REMINDER_BINDING_KEY, CONFIRMATION_BINDING_KEY } = require('./config/serverConfig')


const EmailService = require('./services/email-service')
const TicketController = require('./controller/ticket-controller');
const jobs = require('./utils/job')

const app = express();

const startServer = async () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const channel = await createChannel();

    //confirmation mail
    subscribeMessage(channel, EmailService.subscribeEvents, CONFIRMATION_BINDING_KEY);

    //reminder mail 48 hours before boarding
    subscribeMessage(channel, EmailService.subscribeEvents, REMINDER_BINDING_KEY);
    //console.log(channel)


    app.post('/api/v1/tickets', TicketController.create);

    app.listen(PORT, () => {
        console.log(`Server started at port, ${PORT}`);
        jobs();  //this will check for the pending mail
        // sendBasicEmail(
        //     'vishant0426@gmail.com',  //from will not change, it will the email used in auth
        //     'moneyniboray1246@gmail.com',
        //     'This is a testing email',
        //     'Hey, How are you? I hope you are satisfied with the company support'
        // );

    })
}

startServer();