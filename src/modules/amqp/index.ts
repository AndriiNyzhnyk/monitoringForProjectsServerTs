'use strict';

import { Connection, Channel, connect } from 'amqplib';

// Get process environments
const { AMQP_URL } = process.env;

export default class AMQP {
    public static instance: object | undefined;
    private static targetQueue = 'monitoring';

    connection: Connection;
    channel: Channel;
    queue: object;

    static async getInstance() {
        if (typeof AMQP.instance === 'undefined') {
            const data = await AMQP._initializeConnection();
            return new AMQP(data);
        }

        return AMQP.instance;
    }

    static async _initializeConnection() {
        const connection: Connection = await connect(AMQP_URL);
        const channel: Channel = await connection.createChannel();
        const queue = await channel.assertQueue(this.targetQueue);

        console.log('Connection to AMQP server was successful');
        return { connection, channel, queue, targetQueue: this.targetQueue };
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

                console.log(JSON.parse(msg.content));
                channel.ack(msg);
            }
        });

        AMQP.instance = this;
        return this;
    }
}
