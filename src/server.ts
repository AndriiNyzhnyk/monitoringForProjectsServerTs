'use strict';

import { Server, Request, ResponseToolkit } from "@hapi/hapi";


const server: Server = new Server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request: Request, h: ResponseToolkit) => {

        return 'Hello World!';
    }
});

export async function init() {

    await server.initialize();
    return server;
}

export async function launch() {

    await server.start();
    return server;
}

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});
