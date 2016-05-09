function ObservableArray(items) {
  var _self = this,
    _array = [],
    _handlers = {
      itemadded: [],
      itemremoved: [],
      itemset: []
    };

  function defineIndexProperty(index) {
    if (!(index in _self)) {
      Object.defineProperty(_self, index, {
        configurable: true,
        enumerable: true,
        get: function() {
          return _array[index];
        },
        set: function(v) {
          _array[index] = v;
          raiseEvent({
            type: "itemset",
            index: index,
            item: v
          });
        }
      });
    }
  }

  function raiseEvent(event) {
    _handlers[event.type].forEach(function(h) {
      h.call(_self, event);
    });
  }

  Object.defineProperty(_self, "addEventListener", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function(eventName, handler) {
      eventName = ("" + eventName).toLowerCase();
      if (!(eventName in _handlers)) throw new Error("Invalid event name.");
      if (typeof handler !== "function") throw new Error("Invalid handler.");
      _handlers[eventName].push(handler);
    }
  });

  Object.defineProperty(_self, "removeEventListener", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function(eventName, handler) {
      eventName = ("" + eventName).toLowerCase();
      if (!(eventName in _handlers)) throw new Error("Invalid event name.");
      if (typeof handler !== "function") throw new Error("Invalid handler.");
      var h = _handlers[eventName];
      var ln = h.length;
      while (--ln >= 0) {
        if (h[ln] === handler) {
          h.splice(ln, 1);
        }
      }
    }
  });

  Object.defineProperty(_self, "push", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function() {
      var index;
      for (var i = 0, ln = arguments.length; i < ln; i++) {
        index = _array.length;
        _array.push(arguments[i]);
        defineIndexProperty(index);
        raiseEvent({
          type: "itemadded",
          index: index,
          item: arguments[i]
        });
      }
      return _array.length;
    }
  });

  Object.defineProperty(_self, "pop", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function() {
      if (_array.length > -1) {
        var index = _array.length - 1,
          item = _array.pop();
        delete _self[index];
        raiseEvent({
          type: "itemremoved",
          index: index,
          item: item
        });
        return item;
      }
    }
  });

  Object.defineProperty(_self, "unshift", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function() {
      for (var i = 0, ln = arguments.length; i < ln; i++) {
        _array.splice(i, 0, arguments[i]);
        defineIndexProperty(_array.length - 1);
        raiseEvent({
          type: "itemadded",
          index: i,
          item: arguments[i]
        });
      }
      for (; i < _array.length; i++) {
        raiseEvent({
          type: "itemset",
          index: i,
          item: _array[i]
        });
      }
      return _array.length;
    }
  });

  Object.defineProperty(_self, "shift", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function() {
      if (_array.length > -1) {
        var item = _array.shift();
        _array.length === 0 && delete _self[index];
        raiseEvent({
          type: "itemremoved",
          index: 0,
          item: item
        });
        return item;
      }
    }
  });

  Object.defineProperty(_self, "splice", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function(index, howMany /*, element1, element2, ... */ ) {
      var removed = [],
        item,
        pos;

      index = !~index ? _array.length - index : index;

      howMany = (howMany == null ? _array.length - index : howMany) || 0;

      while (howMany--) {
        item = _array.splice(index, 1)[0];
        removed.push(item);
        delete _self[_array.length];
        raiseEvent({
          type: "itemremoved",
          index: index + removed.length - 1,
          item: item
        });
      }

      for (var i = 2, ln = arguments.length; i < ln; i++) {
        _array.splice(index, 0, arguments[i]);
        defineIndexProperty(_array.length - 1);
        raiseEvent({
          type: "itemadded",
          index: i,
          item: arguments[i]
        });
        index++;
      }

      return removed;
    }
  });

  Object.defineProperty(_self, "length", {
    configurable: false,
    enumerable: false,
    get: function() {
      return _array.length;
    },
    set: function(value) {
      var n = Number(value);
      if (n % 1 === 0 && n >= 0) {
        if (n < _array.length) {
          _self.splice(n);
        } else if (n > _array.length) {
          _self.push.apply(_self, new Array(n - _array.length));
        }
      } else {
        throw new RangeError("Invalid array length");
      }
      return value;
    }
  });

  Object.getOwnPropertyNames(Array.prototype).forEach(function(name) {
    if (!(name in _self)) {
      Object.defineProperty(_self, name, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Array.prototype[name]
      });
    }
  });

  if (items instanceof Array) {
    _self.push.apply(_self, items);
  }
}
