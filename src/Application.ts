import * as express from 'express';
import bodyParser = require("body-parser");
import loggerMiddleWare from './middlewares/LoggingMiddleWare';

class Application {
    public app: express.Application;
    public port: number;

    constructor(controllers, port) {
        this.app = express();
        this.port = port;
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(loggerMiddleWare);
    }

    private initializeControllers(controllers:any) {
        controllers.forEach( controllers => this.app.use("/", controllers.router));
    }

    public listen() {
        this.app.listen(this.port, () => console.log(`App listening on the port ${this.port}`))
    }
}

export default Application;
