import * as express from 'express';


export default function LoggerMiddleWare(request: express.Request, response: express.Response, next) {
    console.log(`${request.method} ${request.path} ${request.body}`);
    next();
}
