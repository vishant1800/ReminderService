const sender = require('../config/emailConfig')

const TicketRepository = require('../repository/ticket-repository');

const ticketRepository = new TicketRepository();

const sendBasicEmail = async(mailFrom, mailTo, mailSubject, mailBody) => {
    try {
        await sender.sendMail({
            from: mailFrom,
            to: mailTo,
            subject: mailSubject,
            text: mailBody
        })
        console.log(response);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const fetchingPendingEmails = async(timestamp) => {
    try {
        const response = await ticketRepository.get({status: "PENDING"});
        return response;
    } catch (error) {
        throw error;
    }
}

const createNotification = async(data) => {
    try {
        const response = await ticketRepository.create(data);
        return response;
    } catch (error) {
        throw error;
    }
}

const updateTicket = async(ticketId, data) => {
    try {
        const response = await ticketRepository.update(ticketId, data);
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    sendBasicEmail,
    fetchingPendingEmails,
    createNotification,
    updateTicket
}