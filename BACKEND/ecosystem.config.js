module.exports = {
  apps: [{
    name: 'pos-backend',
    script: 'dist/main.js',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_USERNAME: 'postgres',
      DB_PASSWORD: '1234',
      DB_DATABASE: 'pos',
      JWT_SECRET: 'my_super_secret_jwt_key_123456789',
      GMAIL_USER: 'edgaedson59@gmail.com',
      GMAIL_APP_PASSWORD: 'rmxk ovnl ngme upjb',
      JWT_REFRESH_SECRET: 'mpr5h9mE3JCdCCpxE3I4DGsOYniNuDc4oGOJKIO6IAY='
    }
  }]
};
