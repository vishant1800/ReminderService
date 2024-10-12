const sender = require('../config/emailConfig')

const TicketRepository = require('../repository/ticket-repository');

const ticketRepository = new TicketRepository();

const sendBasicEmail = async (mailFrom, mailTo, mailSubject, mailBody, htmlContent) => {
    try {
        await sender.sendMail({
            from: mailFrom,
            to: mailTo,
            subject: mailSubject,
            text: mailBody,
            html: htmlContent
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const fetchingPendingEmails = async (timestamp) => {
    try {
        const response = await ticketRepository.get({ status: "PENDING" });
        return response;
    } catch (error) {
        throw error;
    }
}

const createNotification = async (data) => {
    try {
        const response = await ticketRepository.create(data);
        return response;
    } catch (error) {
        console.log(error);
        //throw error;
    }
}

const updateTicket = async (ticketId, data) => {
    try {
        const response = await ticketRepository.update(ticketId, data);
        return response;
    } catch (error) {
        throw error;
    }
}

const subscribeEvents = async (payload) => {
    const service = payload.service;
    const data = payload.data;
    switch (service) {
        case 'CREATE_TICKET': {
            await createNotification(data);
            break;
        }

        case 'SEND_BASIC_MAIL': {
            await sendBasicEmail(data.mailFrom, data.mailTo, data.subject, data.text, data.html);
            break;
        }

        default:
            console.log('No valid event recieved');
            break;
    }
}

module.exports = {
    sendBasicEmail,
    fetchingPendingEmails,
    createNotification,
    updateTicket,
    subscribeEvents
}