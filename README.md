# extendclass

A simple prototype-based subclassing function.

## Installation

    $ npm install extendclass

## Usage

```js
extend(Dog, Animal)
```

This function extends a class using the prototype inheritance chain, under the
paradigm of single inheritance. It does not allow more than one subclassing to
take place at the same time. If you want multiple chains, you must make multiple
calls. Call this function immediately after the child class's constructor.

### Short Example

```js
var extend = require('extendclass')

function Animal(n) {
  this.legs = n
}

Animal.prototype.eat = function () {
  console.log('nom nom nom')
}

function Dog() {
  Animal.call(this, 4)
}

// THIS IS IMPORTANT. DO THIS.
extend(Dog, Animal)

Dog.prototype.bark = function () {
  console.log('woof woof')
}
```

### Long Example with Comments

```js
var extend = require('extendclass')

function Animal(n) {
  this.legs = n
}
Animal.prototype.eat = function () {
  console.log('nom nom nom')
}

var buzz = new Animal(6)
console.log(buzz.legs)   // 6
buzz.eat()               // 'nom nom nom'
```


`buzz.legs` logs 6 because that's specified by the constructor. `buzz.eat()` logs
`'nom nom nom'` because that function is defined on `Animal.prototype`, and
`buzz.__proto__ === Animal.prototype`.

```js
function Dog() {
  Animal.call(this, 4) // calls the super constructor specifying 4 legs
}
Dog.prototype.bark = function () {
  console.log('woof woof')
}

var rex = new Dog()
console.log(rex.legs) // 4,
rex.bark()            // 'woof woof'
rex.eat()             // undefined!!!
```

`rex.legs` logs 4 because that's given by `Dog` constructor calling the `Animal`
constructor. `rex.bark()` logs `'woof woof'` because that's inherited from
`rex.__proto__`. **But `rex.eat()` is undefined.**

Why? Because `rex.__proto__ === Dog.prototype`, which does not have or inherit an `eat` function.

We need to insert the following line *after* the `Dog` constructor, but *before* any
modifications to `Dog.prototype` (such as adding a `bark` function).

```js
extend(Dog, Animal)
```

This does two (2) things:

1.  `Dog.prototype = Object.create(Animal.prototype)`

    We need to let `Dog.prototype` have an `eat` function, and all other functions on
    `Animal.prototype`. But we cannot set `Dog.prototype = Animal.prototype` because
    this is only a pointer. If we modify `Dog.prototype` we risk modifying
    `Animal.prototype` as well. Thus we need `Dog.prototype` to *inherit* from
    `Animal.prototype`. One way to do this would be

    `Dog.prototype.__proto__ = Animal.prototype`

    This would be all fine and good, but setting the `.__proto__` for an object is generally
    a bad idea, so we use `Object.create()`
    as a safe shortcut instead. This creates a new object whose `.__proto__` is
    `Animal.prototype` and assigns that object to `Dog.prototype`.

2.  `Dog.prototype.constructor = Dog`

    Since `Dog.prototype` inherits from `Animal.prototype`, its constructor will be that
    of `Animal`. That is, when you invoke `new Dog()`, it will use the `Animal` function.
    Thus we "reset" the `Dog` constructor back to the `Dog` function.

Now the right way:

```js
var axel = new Dog()
console.log(axel.legs) // 4
axel.bark()            // 'woof woof'
axel.eat()             // 'nom nom nom'
```

Now `axel.eat()` logs `'nom nom nom'` because that function is inherited from
`axel.__proto__.__proto__`, which `=== Animal.prototype`.

See the MDN tutorial for more info.
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain>
