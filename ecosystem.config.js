
module.exports = {
    apps : [{
        name: "calendar",
        script: "./server/index.js",
        mode:"cluster",
        instance:2,
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}