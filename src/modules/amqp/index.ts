'use strict';

// const Monitoring = require('../monitoring');

// import * as Amqplib from 'amqplib';
import * as Amqplib from 'amqplib';

// Get process environments
const { AMQP_URL } = process.env;

export default class AMQP {
    public static instance: object | undefined;
    connection: object;
    channel: object;
    queue: object;


    static async getInstance() {
        if (typeof AMQP.instance === 'undefined') {
            const data = await AMQP._initializeConnection();
            return new AMQP(data);
        }

        return AMQP.instance;
    }

    static async _initializeConnection() {
        const targetQueue = 'monitoring';
        const connection: Amqplib.Connection = await Amqplib.connect(AMQP_URL);
        const channel = await connection.createChannel();
        const queue = await channel.assertQueue(targetQueue);

        console.log('Connection to AMQP server was successful');
        return { connection, channel, queue, targetQueue };
    }

    constructor({ connection, channel, queue, targetQueue }) {
        if (typeof AMQP.instance !== 'undefined') {
            return;
            // return AMQP.instance;
        }

        this.connection = connection;
        this.channel = channel;
        this.queue = queue;

        channel.consume(targetQueue, (msg) => {
            if (msg !== null) {
                // Monitoring.handleNewMessage(msg.content.toString());
                channel.ack(msg);
            }
        });

        AMQP.instance = this;
        return this;
    }
}
