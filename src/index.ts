import * as express from "express"
import * as bodyParser from "body-parser"
import { AppDataSource } from "./data-source"
import { index } from "./controllers/index";
import * as cors from "cors";

AppDataSource.initialize().then(async () => {

    const app = express()
    const corsOptions = {
      origin: ["http://localhost:3000"],
      credentials: true,
    };
    app.use(bodyParser.json())
    app.use(cors(corsOptions))
    app.use("/api", index);
    app.listen(process.env.PORT || 3800)
    console.log("Express server has started on port 3000. Open http://localhost:3800 to see results")

}).catch(error => console.log(error))
