const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected! Starting deployment...');
  conn.exec(`
    export DEBIAN_FRONTEND=noninteractive
    
    # Pull latest code
    cd /root
    if [ ! -d "Aura-Makeover-" ]; then
      git clone https://github.com/ajayspi/Aura-Makeover-
    fi
    cd Aura-Makeover-
    git fetch origin
    git checkout init-auromakeover-16081128185176046364
    git pull origin init-auromakeover-16081128185176046364
    
    cd auro-makeover
    
    # Ensure Node 22 is installed
    node -v || (curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs)
    
    # Install PM2 globally if not present
    pm2 -v || npm install -g pm2
    
    # Clean install with legacy peer deps (for Next 15 + React 19)
    rm -rf node_modules package-lock.json
    npm install --legacy-peer-deps
    
    # Build the project
    npm run build
    
    # Start on port 4000 (unused on this server)
    PORT=4000 pm2 start npm --name "auro-makeover" -- run start -- -p 4000
    pm2 save
    
    echo "DEPLOYMENT_DONE"
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log('Finished, exit code:', code);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
  });
}).on('error', (err) => {
  console.error('Connection error:', err.message);
}).connect({
  host: '172.104.171.123',
  port: 22,
  username: 'root',
  password: '9700675637@Ajkk'
});
