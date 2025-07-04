import * as express from "express"
import { Request, Response } from "express";
import * as bodyParser from "body-parser"
import { AppDataSource } from "./data-source"
import { index } from "./controllers/index";
import * as cors from "cors";

AppDataSource.initialize().then(async () => {

    const app = express()
    const corsOptions = {
      origin: ["http://localhost:3000", "http://localhost:3800"],
      credentials: true,
    };
    
    app.use((req: Request, res: Response, next: Function) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${req.method} ${req.url}`);
      console.log('Headers:', req.headers);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
      }
      if (req.query && Object.keys(req.query).length > 0) {
        console.log('Query params:', req.query);
      }
      console.log('---');
      next();
    });
    
    app.use(bodyParser.json())
    app.use(cors(corsOptions))

    app.use("/api", index);
    app.get("/", (req: Request, res: Response) => {
        res.send("Welcome to the API. Use /api/notas to manage notes.");
    });
    app.listen(process.env.PORT || 3800)
    console.log("Express server has started on port 3000. Open http://localhost:3800 to see results")

}).catch(error => console.log(error))
