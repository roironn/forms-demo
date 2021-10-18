import { Question } from './Question'
import React from 'react'

export class Section extends React.Component {
    constructor(props) {
        super(props)
        this.section = this.props.section
    }

    render() {
      return (<div className="Section" id={`section-${this.section.id}`}>
        <h3 className="SectionHeader">{this.section.title}</h3>
        <h5 className="SectionDesc">{this.section.description}</h5>
        {this.section.questions.map(question => <Question
            key={question.id}
            question={question}
            setAnswer={this.props.setAnswer}
            getValue={this.props.getValue}
        />)}
      </div>)
    }
}