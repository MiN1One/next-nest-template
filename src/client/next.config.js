const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV !== 'build') {
  dotenv.config({
    path: path.join(__dirname, '..', '..', '.env')
  });
}

/** @type {import('next').NextConfig} */
module.exports = {
  distDir: '../../dist/.next',
  reactStrictMode: true,
  env: {
    SERVER_HOST: 
      process.env.NODE_ENV !== 'production' 
        ? `http://localhost:${process.env.PORT}` 
        : process.env.HOST,
  },
}