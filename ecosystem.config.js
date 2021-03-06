'use strict'

module.exports = {
    apps: [{
        name: "tinker",
        interpreter: "node@16.0.0", // ~/.nvm/versions/node/v16.0.0/bin/node
        exec_interpreter: "node@16.0.0",
        script: 'index.js',
        kill_timeout: 3000,
        env: {
            NODE_ENV: "production"
        },
        env_production: {
            NODE_ENV: "production"
        },
        max_memory_restart: '400M', // force app restart if memory reaches this limit
    }],
    deploy: {
        pull: {
            user: "pi",
            host: "192.168.1.128",
            ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=yes'],
            ref: "origin/master",
            repo: "git@github.com:LordFarquhar/Tinker.git",
            path: "/home/pi/Documents/tinker-deploy",
            "post-deploy": ""
        },
        restart: {
            user: "pi",
            host: "192.168.1.128",
            ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=yes'],
            ref: "origin/master",
            repo: "git@github.com:LordFarquhar/Tinker.git",
            path: "/home/pi/Documents/tinker-deploy",
            "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production --wait-ready && pm2 save"
        }
    }
};