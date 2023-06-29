module.exports = function override(config, env) {
    // Add the fallback configuration
    config.resolve.fallback = {
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser")
    };
    
    return config;
  };
  