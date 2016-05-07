import React from 'react'

const UP_ARROW_KEY_CODE = 38
const DOWN_ARROW_KEY_CODE = 40

function uniq (arr) {
  let out = []

  for (let i = 0; i < arr.length; i++) {
    if (out.indexOf(arr[i]) === -1) {
      out.push(arr[i])
    }
  }

  return out
}

function defaultRenderTag (props) {
  let {tag, key, onRemove, classNameRemove, ...other} = props
  return (
    <span key={key} {...other}>
      {tag}
      <a className={classNameRemove} onClick={(e) => onRemove(key)} />
    </span>
  )
}

defaultRenderTag.propTypes = {
  key: React.PropTypes.number,
  tag: React.PropTypes.string,
  onRemove: React.PropTypes.func,
  classNameRemove: React.PropTypes.string
}

function defaultRenderInput (props) {
  let {onChange, value, ...other} = props
  return (
    <input type='text' onChange={onChange} value={value} {...other} />
  )
}

defaultRenderInput.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func
}

function defaultRenderLayout (tagComponents, inputComponent, suggestionsComponent) {
  return (
    <span>
      {tagComponents}
      <span style={{display: 'inline-block'}}>
        {inputComponent}
        {suggestionsComponent}
      </span>
    </span>
  )
}

function defaultPasteSplit (data) {
  return data.split(' ').map(d => d.trim())
}

function defaultOnSuggest (tag, tags, suggestions, onlyUnique) {
  if (tag.length === 0) {
    return []
  }

  let normalize = (s) => s.toLowerCase()

  let suggested = suggestions.filter((s) => normalize(s).startsWith(normalize(tag)))

  if (onlyUnique) {
    suggested = suggested.filter((s) => tags.indexOf(s) === -1)
  }

  return suggested.slice(0, 5)
}

function defaultRenderSuggestions (props) {
  let {tag, suggested, selected, classNameSuggestion, classNameSelected,
    onClickSuggestion, onMouseOverSuggestion, ...other} = props

  let suggestionNodes = suggested.map((s, i) => {
    let className = classNameSuggestion + (i === selected ? ' ' + classNameSelected : '')
    let start = s.slice(0, tag.length)
    let end = s.slice(tag.length)

    return (
      <li
        key={i}
        onMouseOver={(e) => onMouseOverSuggestion(e, i)}
        onClick={(e) => onClickSuggestion(e, i)}
        className={className}
      >
        <u>{start}</u>{end}
      </li>
    )
  })

  return (
    <ul {...other}>
      {suggestionNodes}
    </ul>
  )
}

defaultRenderSuggestions.propTypes = {
  tag: React.PropTypes.string,
  suggested: React.PropTypes.array,
  selected: React.PropTypes.number,
  classNameSuggestion: React.PropTypes.string,
  classNameSelected: React.PropTypes.string,
  onClickSuggestion: React.PropTypes.func,
  onMouseOverSuggestion: React.PropTypes.func
}

class TagsInput extends React.Component {
  constructor () {
    super()
    this.state = {tag: '', suggested: [], selected: 0}
    this.focus = ::this.focus
    this.blur = ::this.blur
  }

  static propTypes = {
    addKeys: React.PropTypes.array,
    addOnBlur: React.PropTypes.bool,
    addOnPaste: React.PropTypes.bool,
    inputProps: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    removeKeys: React.PropTypes.array,
    renderInput: React.PropTypes.func,
    renderTag: React.PropTypes.func,
    renderLayout: React.PropTypes.func,
    pasteSplit: React.PropTypes.func,
    tagProps: React.PropTypes.object,
    onlyUnique: React.PropTypes.bool,
    value: React.PropTypes.array.isRequired,
    maxTags: React.PropTypes.number,
    validationRegex: React.PropTypes.instanceOf(RegExp),
    suggestions: React.PropTypes.array,
    onSuggest: React.PropTypes.func,
    renderSuggestions: React.PropTypes.func,
    onlySuggested: React.PropTypes.bool,
    suggestionsProps: React.PropTypes.object
  }

  static defaultProps = {
    className: 'react-tagsinput',
    addKeys: [9, 13],
    addOnBlur: false,
    addOnPaste: false,
    inputProps: {className: 'react-tagsinput-input'},
    removeKeys: [8],
    renderInput: defaultRenderInput,
    renderTag: defaultRenderTag,
    renderLayout: defaultRenderLayout,
    pasteSplit: defaultPasteSplit,
    tagProps: {className: 'react-tagsinput-tag', classNameRemove: 'react-tagsinput-remove'},
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
  }

  _removeTag (index) {
    let value = this.props.value.concat([])
    if (index > -1 && index < value.length) {
      value.splice(index, 1)
      this.props.onChange(value)
    }
  }

  _clearInput () {
    this.setState({tag: '', suggested: [], selected: 0})
  }

  _addTags (tags) {
    let {validationRegex, onChange, onlyUnique, onlySuggested, maxTags, value, suggestions} = this.props

    if (onlyUnique) {
      tags = uniq(tags)
      tags = tags.filter(tag => value.indexOf(tag) === -1)
    }

    if (onlySuggested) {
      tags = tags.filter(tag => suggestions.indexOf(tag) > -1)
    }

    tags = tags.filter(tag => validationRegex.test(tag))
    tags = tags.filter(tag => tag.trim().length > 0)

    if (maxTags >= 0) {
      let remainingLimit = Math.max(maxTags - value.length, 0)
      tags = tags.slice(0, remainingLimit)
    }

    if (tags.length > 0) {
      let newValue = value.concat(tags)
      onChange(newValue)
      this._clearInput()
    }
  }

  focus () {
    this.refs.input.focus()
  }

  blur () {
    this.refs.input.blur()
  }

  handlePaste (e) {
    let {addOnPaste, pasteSplit} = this.props

    if (!addOnPaste) {
      return
    }

    e.preventDefault()

    let data = e.clipboardData.getData('text/plain')
    let tags = pasteSplit(data)

    this._addTags(tags)
  }

  handleKeyDown (e) {
    let {value, removeKeys, addKeys, onlySuggested} = this.props
    let {tag, selected, suggested} = this.state
    let empty = tag === ''
    let code = e.keyCode
    let add = addKeys.indexOf(code) !== -1 && !empty
    let remove = removeKeys.indexOf(code) !== -1 && value.length > 0 && empty
    let up = code === UP_ARROW_KEY_CODE
    let down = code === DOWN_ARROW_KEY_CODE
    let suggestion = suggested[selected]

    if (up || down || add || remove) {
      e.preventDefault()
    }

    if (up) {
      this.setState({selected: Math.max(onlySuggested ? 0 : -1, (selected - 1))})
    }

    if (down) {
      this.setState({selected: Math.min(selected + 1, suggested.length - 1)})
    }

    if (add) {
      if (suggestion) {
        this._addTags([suggestion])
      } else {
        this._addTags([tag])
      }
    }

    if (remove) {
      this._removeTag(value.length - 1)
    }
  }

  handleClick (e) {
    if (e.target === this.refs.div) {
      this.focus()
    }
  }

  handleClickSuggestion (e, i) {
    e.preventDefault();
    let {suggested} = this.state
    let suggestion = suggested[i]
    this._addTags([suggestion])
    this.focus()
  }

  handleMouseOverSuggestion (e, i) {
    this.setState({selected: i})
  }

  handleChange (e) {
    let {value, onSuggest, suggestions, onlyUnique, onlySuggested} = this.props
    let {onChange} = this.props.inputProps
    let tag = e.target.value

    if (onChange) {
      onChange(e)
    }

    let suggested = onSuggest(tag, value, suggestions, onlyUnique)
    let selected = onlySuggested ? 0 : -1

    this.setState({tag, suggested, selected})
  }

  handleOnBlur (e) {
    if (this.props.addOnBlur) {
      this._addTags([e.target.value])
    }
  }

  handleRemove (tag) {
    this._removeTag(tag)
  }

  inputProps () {
    let {onChange, ...otherInputProps} = this.props.inputProps
    return otherInputProps
  }

  render () {
    let {value, onChange, inputProps, tagProps, renderLayout, renderTag, renderInput, renderSuggestions,
      addKeys, removeKeys, suggestionsProps, onlyUnique, ...other} = this.props
    let {tag, suggested, selected} = this.state

    let tagComponents = value.map((tag, index) => {
      return renderTag({key: index, tag, onRemove: ::this.handleRemove, ...tagProps})
    })

    let inputComponent = renderInput({
      ref: 'input',
      value: tag,
      onPaste: ::this.handlePaste,
      onKeyDown: ::this.handleKeyDown,
      onChange: ::this.handleChange,
      onBlur: ::this.handleOnBlur,
      ...this.inputProps()
    })

    let suggestionsComponent = renderSuggestions({
      tag: tag,
      suggested: suggested,
      selected: selected,
      onClickSuggestion: ::this.handleClickSuggestion,
      onMouseOverSuggestion: ::this.handleMouseOverSuggestion,
      ...suggestionsProps
    })

    return (
      <div ref='div' onClick={::this.handleClick} {...other}>
        {renderLayout(tagComponents, inputComponent, suggestionsComponent)}
      </div>
    )
  }
}

export default TagsInput
