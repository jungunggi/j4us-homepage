module.exports = {
  apps: [
    {
      name: 'j4us-mail-server',
      script: 'server.js',
      cwd: '/home/user/webapp',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
