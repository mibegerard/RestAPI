const { ValidationError } = require('../utils/appError');


function idValidator(id) {
  if (!Number.isInteger(id)) throw new ValidationError('Player ID must be an integer');
}

function sexValidator(sex) {
  if (!['M', 'F'].includes(sex)) throw new ValidationError('Sex must be "M" or "F"');
}

function countryValidator(country) {
  if (!country || typeof country !== 'object') throw new ValidationError('Country must be an object');
  if (!country.picture || typeof country.picture !== 'string') throw new ValidationError('Country.picture must be a URL string');
  if (!country.code || typeof country.code !== 'string' || country.code.length !== 3)
    throw new ValidationError('Country.code must be exactly 3 letters');
  country.code = country.code.toUpperCase(); // normalize
}

function playerDataValidator(data) {
  if (!data || typeof data !== 'object') throw new ValidationError('Data must be an object');

  const fields = ['rank', 'points', 'weight', 'height', 'age'];
  fields.forEach((field) => {
    const val = data[field];
    if (!Number.isInteger(val) || (field !== 'rank' && val < 0) || (field === 'rank' && val < 1)) {
      throw new ValidationError(`Data.${field} must be an integer${field === 'rank' ? ' >= 1' : ' >= 0'}`);
    }
  });

  // last array
  if (!Array.isArray(data.last) || data.last.length !== 5)
    throw new ValidationError('Data.last must be an array of exactly 5 elements');

  data.last.forEach((v) => {
    if (!(v === 0 || v === 1)) throw new ValidationError('Data.last elements must be 0 or 1');
  });
}

function shortnameValidator(shortname) {
  if (!shortname || typeof shortname !== 'string') throw new ValidationError('Shortname must be a non-empty string');
  return shortname.toUpperCase();
}

function firstnameValidator(firstname) {
  if (!firstname || typeof firstname !== 'string') throw new ValidationError('Firstname is required');
}

function lastnameValidator(lastname) {
  if (!lastname || typeof lastname !== 'string') throw new ValidationError('Lastname is required');
}

// --------------------------
// Main Validator
// --------------------------
/**
 * validatePayload(options) returns Express middleware
 * options:
 *  - partial: true = PATCH / partial updates
 *  - multiple: true = array of players
 */
function validatePayload({ partial = false, multiple = false } = {}) {
  return (req, res, next) => {
    try {
      let payload = req.body;

      // handle multiple player creation
      if (multiple) {
        if (!Array.isArray(payload) || payload.length === 0)
          throw new ValidationError('Payload must be a non-empty array of players');

        payload.forEach((p) => validatePlayerObject(p, { partial }));
      } else {
        validatePlayerObject(payload, { partial });
      }

      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({ status: 'error', message: err.message });
      }
      next(err); // pass other unexpected errors to errorHandler
    }
  };
}

// --------------------------
// Player Object Validator
// --------------------------
function validatePlayerObject(payload, { partial = false } = {}) {
  if (!payload || typeof payload !== 'object') throw new ValidationError('Payload must be an object');

  if (!partial) {
    // required top-level fields
    ['id', 'firstname', 'lastname', 'shortname', 'sex', 'country', 'picture', 'data'].forEach((f) => {
      if (!(f in payload)) throw new ValidationError(`Missing required field: ${f}`);
    });
  }

  if ('id' in payload) idValidator(payload.id);
  if ('sex' in payload) sexValidator(payload.sex);
  if ('country' in payload) countryValidator(payload.country);
  if ('data' in payload) playerDataValidator(payload.data);
  if ('shortname' in payload) payload.shortname = shortnameValidator(payload.shortname);
  if ('firstname' in payload) firstnameValidator(payload.firstname);
  if ('lastname' in payload) lastnameValidator(payload.lastname);
  if ('picture' in payload && typeof payload.picture !== 'string')
    throw new ValidationError('Picture must be a string URL');
}

module.exports = {
  validateCreatePlayer: validatePayload({ partial: false, multiple: false }),
  validateUpdatePlayer: validatePayload({ partial: false, multiple: false }),
  validatePartialUpdatePlayer: validatePayload({ partial: true, multiple: false }),
  validateMultiplePlayers: validatePayload({ partial: false, multiple: true }),
};
