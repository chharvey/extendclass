/**
  * A simple object-oriented subclassing function.
  *
  * # Installation
  *
  *     $ npm install extendclass
  *
  * # Usage
  *
  * This function extends a class using the prototype inheritance chain, under the
  * paradigm of single inheritance. It does not allow more than one subclassing to
  * take place at the same time. If you want multiple chains, you must make multiple
  * calls. Call this function immediately after the child class's constructor.
  *
  * ## Short Example
  *
  *     var extend = require('extendclass');
  *
  *     function Animal(n) {
  *       this.legs = n;
  *     }
  *
  *     Animal.prototype.eat = function () {
  *       console.log('nom nom nom');
  *     }
  *
  *     function Dog() {
  *       Animal.call(this, 4);
  *     }
  *
  *     extend(Dog, Animal); // THIS IS IMPORTANT. DO THIS.
  *
  *     Dog.prototype.pant = function () {
  *       console.log('hhh hhh hhh');
  *     }
  *
  * ## Long Example with Comments
  *
  *     var extend = require('extendclass');
  *
  *     function Animal(n) {
  *       this.legs = n;
  *     }
  *     Animal.prototype.eat = function () {
  *       console.log('nom nom nom');
  *     }
  *
  *     var buzz = new Animal(6);
  *     console.log(buzz.legs);   // 6
  *     buzz.eat();               // 'nom nom nom'
  *
  * `buzz.legs` logs 6 because that's specified by the constructor. `buzz.eat()` logs
  * `'nom nom nom'` because that function is defined on `Animal.prototype`, and
  * `buzz.__proto__ === Animal.prototype`.
  *
  *     function Dog() {
  *       Animal.call(this, 4); // calls the super constructor specifying 4 legs
  *     }
  *     Dog.prototype.pant = function () {
  *       console.log('hhh hhh hhh');
  *     }
  *
  *     var rex = new Dog();
  *     console.log(rex.legs); // 4,
  *     rex.pant();            // 'hhh hhh hhh'
  *     rex.eat();             // undefined!!!
  *
  * `rex.legs` logs 4 because that's given by `Dog` constructor calling the `Animal`
  * constructor. `rex.pant()` logs `'hhh hhh hhh'` because that's inherited from
  * `rex.__proto__`. But `rex.eat()` is undefined.
  *
  * Why? Because `rex.__proto__ === Dog.prototype`, which does not have an `eat` function.
  *
  *     extend(Dog, Animal); // THIS IS IMPORTANT. DO THIS.
  *
  * This does two (2) things:
  *
  * 1. Dog.prototype = Object.create(Animal.prototype);
  *
  *    We need to let Dog.prototype have an `eat` function, and all other functions on
  *    `Animal.prototype`. But we cannot set `Dog.prototype = Animal.prototype` because
  *    then we'd lose the `pant` function. Thus we need `Dog.prototype` to *inherit* from
  *    `Animal.prototype`. One way to do this would be
  *
  *        Dog.prototype.__proto__ = Animal.prototype
  *
  *    but setting `.__proto__` for anything is a bad idea, so we use `Object.create()`
  *    as a safe shortcut instead. This creates a new object whose `.__proto__` is
  *    `Animal.prototype` and assigns that object to `Dog.prototype`.
  *
  * 2. Dog.prototype.constructor = Dog;
  *
  *    Since `Dog.prototype` inherits from `Animal.prototype`, its constructor will be that
  *    of `Animal`. Thus we need to "reset" the `Dog` constructor back to the `Dog` function.
  *
  * Now the right way:
  *
  *     rex = new Dog();       // reassigning `rex`
  *     console.log(rex.legs); // 4
  *     rex.pant();            // 'hhh hhh hhh'
  *     rex.eat();             // 'nom nom nom'
  *
  * Now `rex.eat()` logs `'nom nom nom'` because that function is inherited from
  * `rex.__proto__.__proto__`, which === `Animal.prototype`.
  *
  * See the MDN tutorial for more info.
  * <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain>
  *
  * @param `dog`    the class that is an extension
  * @param `animal` the class that needs to be extended
  */
module.exports = function extend(dog, animal) {
  dog.prototype = Object.create(animal.prototype);
  dog.prototype.constructor = dog;
}
