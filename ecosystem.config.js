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
        MONGO_URI: 'mongodb://127.0.0.1:27017/mern-ecommerce',
        BACKEND_URL: 'https://api.thefirecutter.store',
        STORAGE_TYPE: 'LOCAL'
      }
    },
    {
      name: 'jeansloop-admin',
      cwd: './apps/admin',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_API_URL: 'https://api.thefirecutter.store/api/v1',
        NEXT_PUBLIC_STOREFRONT_URL: 'https://thefirecutter.store'
      }
    },
    {
      name: 'jeansloop-storefront',
      cwd: './apps/storefront',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://api.thefirecutter.store/api/v1'
      }
    }
  ]
};
