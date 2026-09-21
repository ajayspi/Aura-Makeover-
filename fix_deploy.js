const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(`
    export DEBIAN_FRONTEND=noninteractive
    cd /root/Aura-Makeover-/auro-makeover
    pm2 stop aura || true
    pm2 delete aura || true
    rm -rf .next
    
    # Re-run build just in case it failed
    npm run build
    
    # Start Next.js with explicit port 3333
    # Use pm2 to start the Next.js start script and pass -p 3333
    pm2 start npm --name "aura" -- run start -- -p 3333
    pm2 save
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).on('error', (err) => {
  console.error('Connection :: error', err);
}).connect({
  host: '172.236.176.251',
  port: 22,
  username: 'root',
  password: '9700675637Ajkk'
});
