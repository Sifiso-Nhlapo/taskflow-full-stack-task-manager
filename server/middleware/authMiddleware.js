
const jwt = require('jsonwebtoken');
/*req.headers.authorization reads the token sent with the request.
Bearer is the standard prefix used to send a JWT.
jwt.verify() checks the token's signature and expiration.
req.user.id stores the authenticated user's ID so our task routes can enforce ownership.
next() allows the request to continue only after successful verification. */
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is missing.',
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured.');

      return res.status(500).json({
        success: false,
        message: 'Authentication is not configured.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      typeof decoded.sub !== 'string' ||
      !decoded.sub
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
      });
    }

    req.user = {
      id: decoded.sub,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

module.exports = { protect };
