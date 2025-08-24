/**
 * Validates if a string is a valid MongoDB ObjectId format
 * @param {string} id - The ID string to validate
 * @returns {boolean} - True if valid ObjectId format, false otherwise
 * @example
 * isValidObjectId('507f1f77bcf86cd799439011'); // Returns: true
 * isValidObjectId('invalid-id'); // Returns: false
 * isValidObjectId(''); // Returns: false
 * isValidObjectId(null); // Returns: false
 */
export const isValidObjectId = (id) => {
    if (!id || typeof id !== 'string') return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validates that all required environment variables are present
 * @throws {Error} - Exits process if required variables are missing
 * @example
 * // This function should be called at app startup
 * validateEnv();
 * // Will exit with code 1 if any required env vars are missing
 */
export const validateEnv = () => {
    const missingVars = [];
    
    if (!process.env.PRIVATE_KEY_JWT) missingVars.push('PRIVATE_KEY_JWT');
    if (!process.env.JWT_EXPIRES_IN) missingVars.push('JWT_EXPIRES_IN');
    if (!process.env.MONGO_URI) missingVars.push('MONGO_URI');

    if (missingVars.length > 0) {
        console.error('Missing required environment variables:', missingVars.join(', '));
        console.error('Please set them in your environment or .env file before starting the server.');
        process.exit(1);
    }
};
