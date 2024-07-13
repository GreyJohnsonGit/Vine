import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { FileDatabase } from '../Database/FileDatabase.js';
import { App } from './App.jsx';
import { LibraryProvider } from './LibraryContext.js';
import './simple.css';

(async function Main() {
  const root = document.getElementById('root');

  if (root === null) {
    console.error('"#root" element not found');
    return;
  }

  const database = FileDatabase.fromJson(
    await axios.get('http://localhost:5052/load/')
      .then(response => response.data)
      .then(JSON.parse)
  );

  const save = async () => {
    await axios.post('http://localhost:5052/save/', database.toJson());
  };

  const library = {
    database,
    save
  };

  createRoot(root).render(
    <LibraryProvider library={library}>
      <App/>
    </LibraryProvider>
  );
})();
