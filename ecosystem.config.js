module.exports = {
    apps: [{
        name: "tinker",
        script: 'index.js',
        // watch: ["./index.js", "./events/", "./commands/", "./lib/", "./util/"],
        kill_timeout: 3000,
        env: {
          NODE_ENV: "development"
        },
        env_production: {
          NODE_ENV: "production"
        },
        max_memory_restart: '300M',
        // node_args: "--max_old_space_size=8192"
    }],
    deploy: {
        // "production" is the environment name
        production: {
            user: "ubuntu",
            host: ["127.0.0.1"],
            ref: "origin/master",
            repo: "git@github.com:DuckBiscuitDevs/Tinker.git",
            path: "/home/Documents/tinker",
            "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production && pm2 save"
        },
    }
};