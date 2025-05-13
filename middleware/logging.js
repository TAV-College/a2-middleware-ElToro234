const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.socket.remoteAddress;
    
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
    
    // Calculate response time
    const start = process.hrtime();
    
    res.on('finish', () => {
        const elapsed = process.hrtime(start);
        const elapsedTimeMs = (elapsed[0] * 1000 + elapsed[1] / 1e6).toFixed(2);
        console.log(`[${timestamp}] ${method} ${url} - Status: ${res.statusCode} - ${elapsedTimeMs}ms`);
    });
    
    next();
};

module.exports = logger;