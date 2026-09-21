const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(`
    export DEBIAN_FRONTEND=noninteractive
    cd /root/Aura-Makeover-/auro-makeover
    
    # Create .babelrc to force Webpack + Babel instead of SWC/Turbopack
    cat << 'EOF' > .babelrc
{
  "presets": ["next/babel"]
}
EOF

    # Re-run Docker build
    echo "Building Docker image with Babel fallback..."
    docker build -t aura-app .
    
    # Run the container mapping 3333 to 3333
    docker stop aura-app || true
    docker rm aura-app || true
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
