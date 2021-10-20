import React from 'react'
import { InputTable } from './InputTable';

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
    if (this.question.when 
      && this.props.getValue(this.question.parentID) !== this.question.when) {
      return null
    }
    if (this.question.type === 'select') {
      return (
      <div class="form-row">
        <label><span>{this.question.text}</span>
          <select 
            onChange={this.handleChange}
            value={this.props.getValue(this.question.id) ?? ''}
          >
            {this.question.options.map((opt, i) => (<option key={i} value={opt}>{opt}</option>))}
          </select>
        </label>
      </div>
      )
    }
    if (this.question.type === 'header') {
      return (
        <p>{this.question.text}</p>
      )
    }
    if (this.question.type === 'table') {
      return (
        <InputTable 
          question={this.question}
          setAnswer={this.props.setAnswer}
          value={this.props.getValue(this.question.id)}
        />
      )
    }
    return (
      <div class="form-row">
        <label><span>{this.question.text}</span>
        <input 
          type={this.question.type}
          value={this.props.getValue(this.question.id) ?? ''}
          onChange={this.handleChange}
        ></input>
        </label>
      </div>
    )
  }
}