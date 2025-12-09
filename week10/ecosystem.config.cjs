module.exports = {
  apps: [
    {
      name: "umc-9th-dev",
      script: "./src/index.js",
      watch: ".",
      instances: 0,
      autorestart: false,
      watch: false,
      wait_ready: true,
      listen_timeout: 50000,
      env: {
        PORT: 3000,
      },
    },
  ],
};
