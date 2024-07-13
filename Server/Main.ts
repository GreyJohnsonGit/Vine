import { HttpStatusCode } from 'axios';
import cors from 'cors';
import express, { json } from 'express';
import FileSystem from 'fs/promises';
import { FileDatabase } from '../Database/FileDatabase.js';

(function Main() {
  const app = express();

  app.use(cors());
  app.use(json());

  app.get('/load/', async (_request, response) => {
    const file = await FileSystem.readFile('./Data/data.json', 'utf-8');
    response.json(file);
  });

  app.post('/save/', async (request, response) => {
    const database = FileDatabase.fromJson(request.body);
    database.toFileSync('./Data/data.json');
    response.sendStatus(HttpStatusCode.Ok);
  });

  app.listen(5052);
})();