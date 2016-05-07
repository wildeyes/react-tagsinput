(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('ReactTagsInput', ['exports', 'module', 'react'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React);
    global.ReactTagsInput = mod.exports;
  }
})(this, function (exports, module, _react) {
  'use strict';

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var _React = _interopRequireDefault(_react);

  var UP_ARROW_KEY_CODE = 38;
  var DOWN_ARROW_KEY_CODE = 40;

  function uniq(arr) {
    var out = [];

    for (var i = 0; i < arr.length; i++) {
      if (out.indexOf(arr[i]) === -1) {
        out.push(arr[i]);
      }
    }

    return out;
  }

  function defaultRenderTag(props) {
    var tag = props.tag;
    var key = props.key;
    var onRemove = props.onRemove;
    var classNameRemove = props.classNameRemove;

    var other = _objectWithoutProperties(props, ['tag', 'key', 'onRemove', 'classNameRemove']);

    return _React['default'].createElement(
      'span',
      _extends({ key: key }, other),
      tag,
      _React['default'].createElement('a', { className: classNameRemove, onClick: function (e) {
          return onRemove(key);
        } })
    );
  }

  defaultRenderTag.propTypes = {
    key: _React['default'].PropTypes.number,
    tag: _React['default'].PropTypes.string,
    onRemove: _React['default'].PropTypes.func,
    classNameRemove: _React['default'].PropTypes.string
  };

  function defaultRenderInput(props) {
    var onChange = props.onChange;
    var value = props.value;

    var other = _objectWithoutProperties(props, ['onChange', 'value']);

    return _React['default'].createElement('input', _extends({ type: 'text', onChange: onChange, value: value }, other));
  }

  defaultRenderInput.propTypes = {
    value: _React['default'].PropTypes.string,
    onChange: _React['default'].PropTypes.func
  };

  function defaultRenderLayout(tagComponents, inputComponent, suggestionsComponent) {
    return _React['default'].createElement(
      'span',
      null,
      tagComponents,
      _React['default'].createElement(
        'span',
        { style: { display: 'inline-block' } },
        inputComponent,
        suggestionsComponent
      )
    );
  }

  function defaultPasteSplit(data) {
    return data.split(' ').map(function (d) {
      return d.trim();
    });
  }

  function defaultOnSuggest(tag, tags, suggestions, onlyUnique) {
    if (tag.length === 0) {
      return [];
    }

    var normalize = function normalize(s) {
      return s.toLowerCase();
    };

    var suggested = suggestions.filter(function (s) {
      return normalize(s).startsWith(normalize(tag));
    });

    if (onlyUnique) {
      suggested = suggested.filter(function (s) {
        return tags.indexOf(s) === -1;
      });
    }

    return suggested.slice(0, 5);
  }

  function defaultRenderSuggestions(props) {
    var tag = props.tag;
    var suggested = props.suggested;
    var selected = props.selected;
    var classNameSuggestion = props.classNameSuggestion;
    var classNameSelected = props.classNameSelected;
    var onClickSuggestion = props.onClickSuggestion;
    var onMouseOverSuggestion = props.onMouseOverSuggestion;

    var other = _objectWithoutProperties(props, ['tag', 'suggested', 'selected', 'classNameSuggestion', 'classNameSelected', 'onClickSuggestion', 'onMouseOverSuggestion']);

    var suggestionNodes = suggested.map(function (s, i) {
      var className = classNameSuggestion + (i === selected ? ' ' + classNameSelected : '');
      var start = s.slice(0, tag.length);
      var end = s.slice(tag.length);

      return _React['default'].createElement(
        'li',
        {
          key: i,
          onMouseOver: function (e) {
            return onMouseOverSuggestion(e, i);
          },
          onClick: function (e) {
            return onClickSuggestion(e, i);
          },
          className: className
        },
        _React['default'].createElement(
          'u',
          null,
          start
        ),
        end
      );
    });

    return _React['default'].createElement(
      'ul',
      other,
      suggestionNodes
    );
  }

  defaultRenderSuggestions.propTypes = {
    tag: _React['default'].PropTypes.string,
    suggested: _React['default'].PropTypes.array,
    selected: _React['default'].PropTypes.number,
    classNameSuggestion: _React['default'].PropTypes.string,
    classNameSelected: _React['default'].PropTypes.string,
    onClickSuggestion: _React['default'].PropTypes.func,
    onMouseOverSuggestion: _React['default'].PropTypes.func
  };

  var TagsInput = (function (_React$Component) {
    _inherits(TagsInput, _React$Component);

    function TagsInput() {
      _classCallCheck(this, TagsInput);

      _get(Object.getPrototypeOf(TagsInput.prototype), 'constructor', this).call(this);
      this.state = { tag: '', suggested: [], selected: 0 };
      this.focus = this.focus.bind(this);
      this.blur = this.blur.bind(this);
    }

    _createClass(TagsInput, [{
      key: '_removeTag',
      value: function _removeTag(index) {
        var value = this.props.value.concat([]);
        if (index > -1 && index < value.length) {
          value.splice(index, 1);
          this.props.onChange(value);
        }
      }
    }, {
      key: '_clearInput',
      value: function _clearInput() {
        this.setState({ tag: '', suggested: [], selected: 0 });
      }
    }, {
      key: '_addTags',
      value: function _addTags(tags) {
        var _props = this.props;
        var validationRegex = _props.validationRegex;
        var onChange = _props.onChange;
        var onlyUnique = _props.onlyUnique;
        var onlySuggested = _props.onlySuggested;
        var maxTags = _props.maxTags;
        var value = _props.value;
        var suggestions = _props.suggestions;

        if (onlyUnique) {
          tags = uniq(tags);
          tags = tags.filter(function (tag) {
            return value.indexOf(tag) === -1;
          });
        }

        if (onlySuggested) {
          tags = tags.filter(function (tag) {
            return suggestions.indexOf(tag) > -1;
          });
        }

        tags = tags.filter(function (tag) {
          return validationRegex.test(tag);
        });
        tags = tags.filter(function (tag) {
          return tag.trim().length > 0;
        });

        if (maxTags >= 0) {
          var remainingLimit = Math.max(maxTags - value.length, 0);
          tags = tags.slice(0, remainingLimit);
        }

        if (tags.length > 0) {
          var newValue = value.concat(tags);
          onChange(newValue);
          this._clearInput();
        }
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.refs.input.focus();
      }
    }, {
      key: 'blur',
      value: function blur() {
        this.refs.input.blur();
      }
    }, {
      key: 'handlePaste',
      value: function handlePaste(e) {
        var _props2 = this.props;
        var addOnPaste = _props2.addOnPaste;
        var pasteSplit = _props2.pasteSplit;

        if (!addOnPaste) {
          return;
        }

        e.preventDefault();

        var data = e.clipboardData.getData('text/plain');
        var tags = pasteSplit(data);

        this._addTags(tags);
      }
    }, {
      key: 'handleKeyDown',
      value: function handleKeyDown(e) {
        var _props3 = this.props;
        var value = _props3.value;
        var removeKeys = _props3.removeKeys;
        var addKeys = _props3.addKeys;
        var onlySuggested = _props3.onlySuggested;
        var _state = this.state;
        var tag = _state.tag;
        var selected = _state.selected;
        var suggested = _state.suggested;

        var empty = tag === '';
        var code = e.keyCode;
        var add = addKeys.indexOf(code) !== -1 && !empty;
        var remove = removeKeys.indexOf(code) !== -1 && value.length > 0 && empty;
        var up = code === UP_ARROW_KEY_CODE;
        var down = code === DOWN_ARROW_KEY_CODE;
        var suggestion = suggested[selected];

        if (up || down || add || remove) {
          e.preventDefault();
        }

        if (up) {
          this.setState({ selected: Math.max(onlySuggested ? 0 : -1, selected - 1) });
        }

        if (down) {
          this.setState({ selected: Math.min(selected + 1, suggested.length - 1) });
        }

        if (add) {
          if (suggestion) {
            this._addTags([suggestion]);
          } else {
            this._addTags([tag]);
          }
        }

        if (remove) {
          this._removeTag(value.length - 1);
        }
      }
    }, {
      key: 'handleClick',
      value: function handleClick(e) {
        if (e.target === this.refs.div) {
          this.focus();
        }
      }
    }, {
      key: 'handleClickSuggestion',
      value: function handleClickSuggestion(e, i) {
        e.preventDefault();
        var suggested = this.state.suggested;

        var suggestion = suggested[i];
        this._addTags([suggestion]);
        this.focus();
      }
    }, {
      key: 'handleMouseOverSuggestion',
      value: function handleMouseOverSuggestion(e, i) {
        this.setState({ selected: i });
      }
    }, {
      key: 'handleChange',
      value: function handleChange(e) {
        var _props4 = this.props;
        var value = _props4.value;
        var onSuggest = _props4.onSuggest;
        var suggestions = _props4.suggestions;
        var onlyUnique = _props4.onlyUnique;
        var onlySuggested = _props4.onlySuggested;
        var onChange = this.props.inputProps.onChange;

        var tag = e.target.value;

        if (onChange) {
          onChange(e);
        }

        var suggested = onSuggest(tag, value, suggestions, onlyUnique);
        var selected = onlySuggested ? 0 : -1;

        this.setState({ tag: tag, suggested: suggested, selected: selected });
      }
    }, {
      key: 'handleOnBlur',
      value: function handleOnBlur(e) {
        if (this.props.addOnBlur) {
          this._addTags([e.target.value]);
        }
      }
    }, {
      key: 'handleRemove',
      value: function handleRemove(tag) {
        this._removeTag(tag);
      }
    }, {
      key: 'inputProps',
      value: function inputProps() {
        var _props$inputProps = this.props.inputProps;
        var onChange = _props$inputProps.onChange;

        var otherInputProps = _objectWithoutProperties(_props$inputProps, ['onChange']);

        return otherInputProps;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this = this;

        var _props5 = this.props;
        var value = _props5.value;
        var onChange = _props5.onChange;
        var inputProps = _props5.inputProps;
        var tagProps = _props5.tagProps;
        var renderLayout = _props5.renderLayout;
        var renderTag = _props5.renderTag;
        var renderInput = _props5.renderInput;
        var renderSuggestions = _props5.renderSuggestions;
        var addKeys = _props5.addKeys;
        var removeKeys = _props5.removeKeys;
        var suggestionsProps = _props5.suggestionsProps;
        var onlyUnique = _props5.onlyUnique;

        var other = _objectWithoutProperties(_props5, ['value', 'onChange', 'inputProps', 'tagProps', 'renderLayout', 'renderTag', 'renderInput', 'renderSuggestions', 'addKeys', 'removeKeys', 'suggestionsProps', 'onlyUnique']);

        var _state2 = this.state;
        var tag = _state2.tag;
        var suggested = _state2.suggested;
        var selected = _state2.selected;

        var tagComponents = value.map(function (tag, index) {
          return renderTag(_extends({ key: index, tag: tag, onRemove: _this.handleRemove.bind(_this) }, tagProps));
        });

        var inputComponent = renderInput(_extends({
          ref: 'input',
          value: tag,
          onPaste: this.handlePaste.bind(this),
          onKeyDown: this.handleKeyDown.bind(this),
          onChange: this.handleChange.bind(this),
          onBlur: this.handleOnBlur.bind(this)
        }, this.inputProps()));

        var suggestionsComponent = renderSuggestions(_extends({
          tag: tag,
          suggested: suggested,
          selected: selected,
          onClickSuggestion: this.handleClickSuggestion.bind(this),
          onMouseOverSuggestion: this.handleMouseOverSuggestion.bind(this)
        }, suggestionsProps));

        return _React['default'].createElement(
          'div',
          _extends({ ref: 'div', onClick: this.handleClick.bind(this) }, other),
          renderLayout(tagComponents, inputComponent, suggestionsComponent)
        );
      }
    }], [{
      key: 'propTypes',
      value: {
        addKeys: _React['default'].PropTypes.array,
        addOnBlur: _React['default'].PropTypes.bool,
        addOnPaste: _React['default'].PropTypes.bool,
        inputProps: _React['default'].PropTypes.object,
        onChange: _React['default'].PropTypes.func.isRequired,
        removeKeys: _React['default'].PropTypes.array,
        renderInput: _React['default'].PropTypes.func,
        renderTag: _React['default'].PropTypes.func,
        renderLayout: _React['default'].PropTypes.func,
        pasteSplit: _React['default'].PropTypes.func,
        tagProps: _React['default'].PropTypes.object,
        onlyUnique: _React['default'].PropTypes.bool,
        value: _React['default'].PropTypes.array.isRequired,
        maxTags: _React['default'].PropTypes.number,
        validationRegex: _React['default'].PropTypes.instanceOf(RegExp),
        suggestions: _React['default'].PropTypes.array,
        onSuggest: _React['default'].PropTypes.func,
        renderSuggestions: _React['default'].PropTypes.func,
        onlySuggested: _React['default'].PropTypes.bool,
        suggestionsProps: _React['default'].PropTypes.object
      },
      enumerable: true
    }, {
      key: 'defaultProps',
      value: {
        className: 'react-tagsinput',
        addKeys: [9, 13],
        addOnBlur: false,
        addOnPaste: false,
        inputProps: { className: 'react-tagsinput-input' },
        removeKeys: [8],
        renderInput: defaultRenderInput,
        renderTag: defaultRenderTag,
        renderLayout: defaultRenderLayout,
        pasteSplit: defaultPasteSplit,
        tagProps: { className: 'react-tagsinput-tag', classNameRemove: 'react-tagsinput-remove' },
        onlyUnique: false,
        maxTags: -1,
        validationRegex: /.*/,
        suggestions: [],
        onSuggest: defaultOnSuggest,
        renderSuggestions: defaultRenderSuggestions,
        onlySuggested: false,
        suggestionsProps: {
          className: 'react-tagsinput-suggestions',
          classNameSuggestion: 'react-tagsinput-suggestion',
          classNameSelected: 'react-tagsinput-suggestion-selected'
        }
      },
      enumerable: true
    }]);

    return TagsInput;
  })(_React['default'].Component);

  module.exports = TagsInput;
});
