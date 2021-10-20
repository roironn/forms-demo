import { Question } from './Question'
import React from 'react'
import headerImg from './header.jpeg'
export class Section extends React.Component {
    constructor(props) {
        super(props)
        console.log("HI!!!!", this.props.section.id, this.props.show)
        this.section = this.props.section
        this.send = this.props.send
        this.next = this.props.next
        this.prev = this.props.prev
        this.show = this.props.show
    }

    render() {
      return (<div className="Section" id={`section-${this.section.id}`}
           class='eliForm'
        >
        <div class="form-title-row">
        {this.section.header ? (<img src={headerImg} alt="" class="header" />) : (null)}
        <h1 className="SectionHeader">{this.section.title}</h1>
        <h2 className="SectionDesc">{this.section.description}</h2>
        </div>
        {this.section.questions.map((question, i) => <Question
            key={question.id}
            question={question}
            setAnswer={this.props.setAnswer}
            getValue={this.props.getValue}
        />)}
        <div class='btn'>
          {this.send ? (<button class="left" onClick={this.send}>שלח</button>) : (null)}
          {this.next ? (<button class="left" onClick={this.next}>הבא</button>) : (null)}
          {this.prev ? (<button class="right" onClick={this.prev}>חזור</button>) : (null)}
        </div>
      </div>)
    }
}