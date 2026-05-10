const router = require('express').Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect }                = require('../middleware/auth');
const validate                   = require('../middleware/validate');
const { authLimiter }            = require('../middleware/rateLimiter');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login',    authLimiter, loginValidator,    validate, login);
router.get('/me',        protect, getMe);

module.exports = router;