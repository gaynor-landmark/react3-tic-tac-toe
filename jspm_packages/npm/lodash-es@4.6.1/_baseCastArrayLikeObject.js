/* */ 
"format cjs";
import isArrayLikeObject from './isArrayLikeObject';

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the array-like object.
 */
function baseCastArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

export default baseCastArrayLikeObject;
