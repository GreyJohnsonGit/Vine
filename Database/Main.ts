import { FileDatabase } from './FileDatabase.js';
import { Ok } from './Result.js';
import { v4 as uuidV4 } from 'uuid';

async function main() {
  const databaseFilePath = './Data/data.json';

  let loadDatabase = FileDatabase.fromFileSync(databaseFilePath);
  if (loadDatabase.isErr()) {
    console.error(loadDatabase.error);
    loadDatabase = Ok(FileDatabase.new());
  }

  const database = loadDatabase.value;

  const seriesId = uuidV4();

  const createFormSchema = database.create('formSchema', {
    seriesId: seriesId,
    revision: 0,
    name: 'Application Security Form',
    description: 'Form to collect security information for new applications..'
  });

  if (createFormSchema.isErr()) {
    console.error(createFormSchema.error);
    return;
  } 

  const reviseFormSchema = database.revise('formSchema', {
    seriesId: seriesId,
    description: 'Form to collect security information for new applications.'
  });

  if (reviseFormSchema.isErr()) {
    console.error(reviseFormSchema.error);
    return;
  }

  const saveDatabase = database.toFileSync(databaseFilePath);
  if (saveDatabase.isErr()) {
    console.error(saveDatabase.error);
  }
}

main();