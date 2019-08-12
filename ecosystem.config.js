
module.exports = {
    apps : [{
        name: "calendar",
        script: "./server/index.js",
        exec_mode:"cluster",
        instances:2,
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}