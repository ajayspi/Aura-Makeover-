const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`curl -s -o /dev/null -w "%{http_code}" http://localhost:4000`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end())
      .on('data', (data) => console.log('HTTP Status:', data.toString()))
      .stderr.on('data', (data) => console.error(data.toString()));
  });
}).connect({ host: '172.104.171.123', port: 22, username: 'root', password: '9700675637@Ajkk' });
