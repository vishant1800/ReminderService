const TicketService = require('../services/email-service');

const create = async(req, res) => {
    try {
        const response = await TicketService.createNotification(req.body);
        return res.status(201).json({
            success: true,
            data: response,
            err: {},
            message: "Succefully registered a email reminder"
        })
    } catch (error) {
        //console.log("FROM CONTROLLER", error);
        return res.status(500).json({
            success: false,
            data: response,
            err: error,
            message: "Unable to register an email reminder"

        })
    }
}

module.exports = {
    create
}