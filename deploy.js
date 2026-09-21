const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(`
    export DEBIAN_FRONTEND=noninteractive
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs git
    npm install -g pm2
    
    cd /root
    if [ ! -d "Aura-Makeover-" ]; then
      git clone https://github.com/ajayspi/Aura-Makeover-
    else
      cd Aura-Makeover-
      git pull
      cd ..
    fi
    
    cd Aura-Makeover-/auro-makeover
    npm install
    npm run build
    
    # Run on an unused port (e.g. 3333)
    PORT=3333 pm2 start npm --name "aura" -- start || PORT=3333 pm2 restart aura
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
