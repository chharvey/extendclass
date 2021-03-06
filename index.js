/**
 * A simple object-oriented subclassing function.
 *
 * This function extends a class using the prototype inheritance chain, under the
 * paradigm of single inheritance. It does not allow more than one subclassing to
 * take place at the same time. If you want multiple chains, you must make multiple
 * calls. Call this function immediately after the child class’s constructor.
 *
 * @exports extend
 * @param {function} dog    - the class that is an extension
 * @param {function} animal - the class that needs to be extended
 * @author @chharvey
 */
module.exports = function extend(dog, animal) {
  dog.prototype = Object.create(animal.prototype)
  dog.prototype.constructor = dog
}
