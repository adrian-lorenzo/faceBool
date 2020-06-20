module.exports = function myOverride(config, env) {
    config.resolve.mainFields = ["main"];
    return config;
}