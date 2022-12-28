module.exports = [
    {
        script: '/build/index.js',
        name: 'app',
        env: {
            NODE_ENV: process.env.NODE_ENV || 'production',
        },
        output: './logs/out.log',
        error: './logs/error.log',
        log: './logs/combined.log',
    },
];
