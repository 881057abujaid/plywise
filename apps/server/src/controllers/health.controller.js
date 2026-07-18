const APP_NAME = "PlyWise API";
const APP_VERSION = "0.1.0";

export const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        service: APP_NAME,
        version: APP_VERSION,
        timestamp: new Date().toISOString(),
    });
};