import Questions from './questions.json'
import { Section } from './Section'
import { jsPDF } from "jspdf";
import './Alef-Regular-normal'
import React from 'react'

const sectionsWithIds = Questions.sections.map(
    (section, i) => ({
      ...section,
      id: `${i}`,
      questions: section.questions.map((question, ii) => ({
        ... question,
        id : `${i}.${ii}`
      }))
    })
  )

function createDefaultAnswers() {
  const answers = {}
  sectionsWithIds.forEach(section => {
    section.questions.forEach(question => {
      if (question.type === 'select') {
        answers[question.id] = question.options[0]
      }
      else {
        answers[question.id] = ''
      }
    })
  })
  return answers
}

const createResultForm = async () => {
  var doc = new jsPDF();
  var formToRender = document.getElementById('eliForm')
  alert('hiii!!!!')
  doc.setR2L(true)
  doc.setFont('Alef-Regular', 'normal')
  doc.text('למה דגככה????', 100 , 10, {
    align: 'right'
  })
  doc.setLanguage('he')
  const data = doc.output()
  console.log(data)
  try {
  await navigator.share({
    files: [
      new File(Buffer.from(data), 'filename.pdf')
    ]
  })
  console.log("WORKED?")
  } catch (e) {
    alert(e)
  } 
}

export class EligibilityForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setAnswer = this.setAnswer.bind(this)
    this.getValue = this.getValue.bind(this)
    this.state = {
      answers: createDefaultAnswers()
    }
  }

  handleSubmit(event) {
    try {
    console.log(this.state)
    createResultForm()
    event.preventDefault()
    } catch (e) {
      console.log("OY VEY")
    }
  }

  setAnswer(id, answer) {
    const answers = this.state.answers
    answers[id] = answer
    this.setState({ answers })
  }

  getValue(id) {
    return this.state.answers[id]
  }

  render() {
    console.log("HI!")
    return (
      <form onSubmit={this.handleSubmit} id='eliForm'>
        {sectionsWithIds.map(section => <Section 
          section={section}
          getValue={this.getValue}
          setAnswer={this.setAnswer}
        />)}
        <input type="submit" value="Submit!!!" />
      </form>
    )
  }
}