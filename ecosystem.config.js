module.exports = {
  apps: [
    {
      name: 'jeansloop-api',
      cwd: './apps/api',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        MONGO_URI: 'mongodb://127.0.0.1:27017/mern-ecommerce'
      }
    },
    {
      name: 'jeansloop-admin',
      cwd: './apps/admin',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'jeansloop-storefront',
      cwd: './apps/storefront',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
