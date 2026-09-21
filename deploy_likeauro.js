const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected!');
  conn.exec(`
    export DEBIAN_FRONTEND=noninteractive
    
    cd /root
    
    # Force reset to latest remote — discard any local changes (these are our manual patches)
    cd Aura-Makeover-
    git fetch origin
    git checkout init-auromakeover-16081128185176046364
    git reset --hard origin/init-auromakeover-16081128185176046364
    
    cd auro-makeover
    
    # Clean install
    rm -rf node_modules package-lock.json
    npm install --legacy-peer-deps
    
    # Build
    npm run build
    
    # Stop existing if any
    pm2 stop auro-makeover 2>/dev/null || true
    pm2 delete auro-makeover 2>/dev/null || true
    
    # Start on port 4000
    PORT=4000 pm2 start npm --name "auro-makeover" -- run start -- -p 4000
    pm2 save
    
    echo "BUILD_AND_START_DONE"
    
    # Setup nginx reverse proxy for likeauro
    apt-get install -y nginx 2>/dev/null
    
    cat > /etc/nginx/sites-available/likeauro << 'NGINXEOF'
server {
    listen 80;
    server_name likeauro.172.104.171.123 likeauro.*;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF
    
    ln -sf /etc/nginx/sites-available/likeauro /etc/nginx/sites-enabled/likeauro
    nginx -t && systemctl reload nginx
    
    echo "NGINX_DONE"
    
    # Also expose on 80 via a path-based rule if needed
    # Check current nginx status
    systemctl status nginx --no-pager | head -5
    
    echo "ALL_DONE"
    
    curl -s -o /dev/null -w "%{http_code}" http://localhost:4000
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
