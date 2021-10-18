import React from 'react'

export class Question extends React.Component {
  constructor(props) {
    super(props);
    this.question = this.props.question
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e) {
    this.props.setAnswer(this.question.id, e.target.value);
  }

  render() {
    if (this.question.type === 'select') {
      return (
      <span>
        <label>{this.question.text}</label>
        <select 
          onChange={this.handleChange}
          value={this.props.getValue(this.question.id) ?? ''}
        >
          {this.question.options.map((opt, i) => (<option key={i} value={opt}>{opt}</option>))}
        </select>
      </span>
      )
    }
    if (this.question.type === 'header') {
      return (
        <p>{this.question.text}</p>
      )
    }
    return (
      <span>
        <label>{this.question.text}</label>
        <input 
          type='text'
          value={this.props.getValue(this.question.id) ?? ''}
          onChange={this.handleChange}
        ></input>
      </span>
    )
  }
}