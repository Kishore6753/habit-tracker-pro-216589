const { body, param, query } = require('express-validator');

const authValidators = {
  register: [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min length is 6'),
  ],
  login: [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isString().notEmpty(),
  ],
};

const habitsValidators = {
  create: [
    body('title').isString().notEmpty(),
    body('description').optional().isString(),
    body('category').optional().isString(),
    body('frequency').isIn(['daily', 'weekly', 'monthly']),
    body('targetPerPeriod').isInt({ min: 1, max: 999 }).toInt(),
  ],
  update: [
    body('title').isString().notEmpty(),
    body('description').optional().isString(),
    body('category').optional().isString(),
    body('frequency').isIn(['daily', 'weekly', 'monthly']),
    body('targetPerPeriod').isInt({ min: 1, max: 999 }).toInt(),
    body('isActive').isBoolean(),
  ],
  idParam: [param('id').isUUID().withMessage('Valid habit id required')],
};

const completionsValidators = {
  habitIdParam: [param('habitId').isUUID().withMessage('Valid habit id required')],
  mark: [body('date').isISO8601().withMessage('Valid date required')],
  bulk: [
    body('action').isIn(['mark', 'unmark']),
    body('dates').isArray({ min: 1, max: 366 }),
    body('dates.*').isISO8601(),
  ],
  list: [
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
    query('habitId').optional().isUUID(),
  ],
};

const progressValidators = {
  summary: [
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
  ],
};

const calendarValidators = {
  month: [
    query('year').isInt({ min: 1970, max: 2100 }).toInt(),
    query('month').isInt({ min: 1, max: 12 }).toInt(),
  ],
};

const remindersValidators = {
  create: [
    body('habitId').optional().isUUID(),
    body('title').isString().notEmpty(),
    body('cron').optional().isString(),
    body('enabled').optional().isBoolean(),
    body('channel').optional().isIn(['in_app', 'email', 'sms']),
  ],
  update: [
    body('habitId').optional().isUUID(),
    body('title').isString().notEmpty(),
    body('cron').optional().isString(),
    body('enabled').isBoolean(),
    body('channel').isIn(['in_app', 'email', 'sms']),
  ],
  idParam: [param('id').isUUID().withMessage('Valid reminder id required')],
};

const analyticsValidators = {
  overview: [
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
  ],
};

const searchValidators = {
  search: [query('q').optional().isString()],
};

const exportValidators = {
  export: [
    query('format').optional().isIn(['json', 'csv']),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
  ],
};

module.exports = {
  authValidators,
  habitsValidators,
  completionsValidators,
  progressValidators,
  calendarValidators,
  remindersValidators,
  analyticsValidators,
  searchValidators,
  exportValidators,
};
