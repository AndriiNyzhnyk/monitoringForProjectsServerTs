'use strict';

import * as Path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: Path.resolve(__dirname, '../.env') });


import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import AMQP from "./modules/amqp";


// Get process environments
const { HTTP_PORT, HTTP_HOST } = process.env;

const server: Server = new Server({
    port: HTTP_PORT,
    host: HTTP_HOST
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request: Request, h: ResponseToolkit) => {

        return 'Hello World!';
    }
});

async function setup() {
    await AMQP.getInstance();
}

export async function init() {

    await server.initialize();
    await setup();
    return server;
}

export async function launch() {

    await server.start();
    await setup();
    return server;
}

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});
