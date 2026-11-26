import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'ciphersense_super_secret_jwt_key_2026_soc_toolkit_secure'
    );
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
      error: error.message,
    });
  }

  // If MongoDB is offline, do not discard a valid signed session.
  // Recreate a virtual request user from the JWT claims instead.
  if (mongoose.connection.readyState !== 1) {
    req.user = {
      _id: decoded.id,
      name: decoded.name || 'Security Analyst',
      email: decoded.email || 'analyst@ciphersense.io',
      role: decoded.role || 'analyst',
    };
    return next();
  }

  try {
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      req.user = {
        _id: decoded.id,
        name: decoded.name || 'Security Analyst',
        email: decoded.email || 'analyst@ciphersense.io',
        role: decoded.role || 'analyst',
      };
    } else {
      req.user = user;
    }

    next();
  } catch (error) {
    // Database query failure must not invalidate an otherwise valid JWT.
    req.user = {
      _id: decoded.id,
      name: decoded.name || 'Security Analyst',
      email: decoded.email || 'analyst@ciphersense.io',
      role: decoded.role || 'analyst',
    };
    next();
  }
};
