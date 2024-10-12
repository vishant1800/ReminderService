const amqplib = require('amqplib');

const { EXCHANGE_NAME, MESSAGE_BROKER_URL, CONFIRMATION_BINDING_KEY, REMINDER_BINDING_KEY } = require('../config/serverConfig')

const createChannel = async () => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
        return channel;
    } catch (error) {
        throw error;
    }
}

const subscribeMessage = async (channel, service, binding_key) => {
    try {

        // Creating queues 
        const confirmationQueue = await channel.assertQueue('CONFIRMATION_QUEUE');
        const reminderQueue = await channel.assertQueue('REMINDER_QUEUE');

        if (binding_key === CONFIRMATION_BINDING_KEY) {
            channel.bindQueue(confirmationQueue.queue, EXCHANGE_NAME, binding_key);
            
            // Consume message from confirmationQueue
            channel.consume(confirmationQueue.queue, msg => {
                console.log("recieved confirmaiton mail data");
                console.log(msg.content.toString());
                const confirmationPayload = JSON.parse(msg.content.toString());
                service(confirmationPayload);

                channel.ack(msg);
            })
        } else if (binding_key === REMINDER_BINDING_KEY) {
            channel.bindQueue(reminderQueue.queue, EXCHANGE_NAME, binding_key);
            console.log(reminderQueue, binding_key);
            // Consume message from reminderQueue
            channel.consume(reminderQueue.queue, msg => {
                console.log("recieved reminder mail data");
                console.log(msg.content.toString());
                const reminderPayload = JSON.parse(msg.content.toString());
                service(reminderPayload);

                channel.ack(msg);
            })
        } else {
            console.log("Unknown binding key. No queue will be bound.");
        }

    } catch (error) {
        console.log("MESSAGE QUEUE ERROR", error);
        throw error;
    }
}

const publishMessage = async (channel, binding_key, message) => {
    try {
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createChannel,
    subscribeMessage,
    publishMessage
}