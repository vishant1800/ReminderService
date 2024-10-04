const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig')

const { sendBasicEmail } = require('./services/email-service')

const app = express();

const startServer = async () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.listen(PORT, () => {
        console.log(`Server started at port, ${PORT}`);

        sendBasicEmail(
            'vishant0426@gmail.com',  //from will not change, it will the email used in auth
            'moneyniboray1246@gmail.com',
            'This is a testing email',
            'Hey, How are you? I hope you are satisfied with the company support'
        );

    })
}

startServer();