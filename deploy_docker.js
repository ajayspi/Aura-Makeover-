const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(`
    export DEBIAN_FRONTEND=noninteractive
    cd /root/Aura-Makeover-/auro-makeover
    
    # Create a Dockerfile
    cat << 'EOF' > Dockerfile
FROM node:22-slim

WORKDIR /app

# Install openssl which is required by Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3333
ENV PORT 3333
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "start"]
EOF

    # Stop any PM2 process to free resources
    pm2 stop aura || true
    pm2 delete aura || true

    # Stop old container if exists
    docker stop aura-app || true
    docker rm aura-app || true

    # Build the docker image
    echo "Building Docker image..."
    docker build -t aura-app .
    
    # Run the container mapping 3333 to 3333
    echo "Running Docker container..."
    docker run -d --name aura-app -p 3333:3333 aura-app
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      process.stderr.write('STDERR: ' + data);
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
