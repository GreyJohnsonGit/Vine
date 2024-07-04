import axios from 'axios';

describe('Main', () => {
  it('should load the database from the server', async () => {
    await axios.get('http://localhost:5052/load/')
      .then(response => response.data)
      .then(d => console.log(typeof d));
  });
});