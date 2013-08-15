/**
 * `LiveConnectAPIError` error.
 *
 * References:
 *   - http://msdn.microsoft.com/en-us/library/live/hh243648.aspx#error
 *
 * @constructor
 * @param {String} [message]
 * @param {String} [code]
 * @api public
 */
function LiveConnectAPIError(message, code) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'LiveConnectAPIError';
  this.message = message;
  this.code = code;
}

/**
 * Inherit from `Error`.
 */
LiveConnectAPIError.prototype.__proto__ = Error.prototype;


/**
 * Expose `LiveConnectAPIError`.
 */
module.exports = LiveConnectAPIError;
