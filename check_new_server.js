const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected!');
  conn.exec(`
    ss -tlnp | grep LISTEN
    echo "---PM2---"
    pm2 list 2>/dev/null || echo "pm2 not installed"
    echo "---DOCKER---"
    docker ps 2>/dev/null || echo "docker not running"
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log('Done, code:', code);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
}).connect({
  host: '172.104.171.123',
  port: 22,
  username: 'root',
  password: '9700675637@Ajkk'
});
