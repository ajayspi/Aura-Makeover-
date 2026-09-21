const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(`
    export DEBIAN_FRONTEND=noninteractive
    cd /root/Aura-Makeover-/auro-makeover
    
    # Create a Dockerfile for dev mode
    cat << 'EOF' > Dockerfile
FROM node:22-slim

WORKDIR /app

# Install openssl which is required by Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3333
ENV PORT 3333
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "dev", "--", "-p", "3333"]
EOF

    # Re-run Docker build (should be fast since npm ci is cached)
    echo "Building Docker image for dev mode..."
    docker build -t aura-app-dev .
    
    # Stop old containers
    docker stop aura-app || true
    docker rm aura-app || true
    docker stop aura-app-dev || true
    docker rm aura-app-dev || true
    
    echo "Running Docker container in dev mode..."
    docker run -d --name aura-app-dev -p 3333:3333 aura-app-dev
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
