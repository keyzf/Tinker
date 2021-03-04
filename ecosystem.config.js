module.exports = {
    apps: [{
        name: "tinker",
        script: 'index.js',
        // watch: ["./index.js", "./events/", "./commands/", "./lib/", "./util/"],
        kill_timeout: 3000,
        env: {
          NODE_ENV: "production"
        },
        env_production: {
            NODE_ENV: "production"
          },
        max_memory_restart: '400M', // force app restart if memory reaches this limit
        // node_args: "--max_old_space_size=8192"
    }],
    deploy: {
        // "production" is the environment name
        production: {
            user: "pi",
            host: "192.168.1.128",
            ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=yes'],
            ref: "origin/master",
            repo: "git@github.com:LordFarquhar/Tinker.git",
            path: "/home/pi/Documents/tinker-deploy",
            "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production --wait-ready && pm2 save"
        },
    }
};
