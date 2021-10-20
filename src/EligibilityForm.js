import Questions from './questions.json'
import { Section } from './Section'
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import './DavidLibre-Regular-normal'
import './DavidLibre-Bold-normal'
import React from 'react'
import { CustomerStatement, LawyerStatement } from './Statements'
import gematriya from 'gematriya'

const HOUSEHOLD_INCOME_THRESHOLD = [
  7299,
  7299,
  7299,
  7953,
  8607,
  9261,
  9915,
  10569,
  11223,
  11877,
  12531,
  13185
]

const AVG_SAL = 10894
const sectionsWithIds = Questions.sections.map(
    (section, i) => ({
      ...section,
      id: `${i}`,
    })
  )

const getQuestions = (questions, idPrefix) => {
  const res = []
  for (let i = 0; i < questions.length; i++) {
    const id = `${idPrefix}.${i}`
    res.push({
      ...questions[i],
      id,
      parentID: idPrefix,
      options: questions[i].options ? ['', ...questions[i].options] : undefined
    })
    res.push(...getQuestions(questions[i].subQuestions ?? [], id))
  }
  return res
}

const sectionsProcessed = sectionsWithIds.map(section => {
  const questions = getQuestions(section.questions, section.id)
  console.log(questions)
  return {
    ...section,
    questions
  }
})

const markerMapping = {}
sectionsProcessed.forEach(section => {
  section.questions.forEach(q => {
    if (q.marker) {
      markerMapping[q.marker] = q.id
    }
  })
})

function createDefaultAnswers() {
  const answers = {}
  sectionsProcessed.forEach(section => {
    section.questions.forEach(question => {
      if (question.type === 'select') {
        answers[question.id] = question.options[0]
      }
      if (question.type === 'table') {
        answers[question.id] = [question.cols.map(() => '')]
      }
      else {
        answers[question.id] = ''
      }
    })
  })
  return answers
}

const createResultForm = async (answers, lawyerName, isValid) => {
  let currentLine = 30
  const REG_FONT_SIZE = 12
  const LINE_HEIGHT = REG_FONT_SIZE / 2
  const PAGE_SIZE = 260
  const RIGHT_MARGIN = 190
  const WRAP_WIDTH = 180
  const SECTION_BUFFER = 15
  const firstName = answers[markerMapping['first_name']]
  const lastName = answers[markerMapping['last_name']]
  const uuid = answers[markerMapping['uuid']]
  const candidateName = `${firstName}_${lastName}_${uuid}`
  const filename=`שאלון_זכאות_${candidateName}`
  var doc = new jsPDF();

  const addLine = (line, options) => {
    if (currentLine > PAGE_SIZE) {
      doc.addPage()
      currentLine = 30
    }
    doc.setFont(options?.bold ? 'DavidLibre-Bold' : 'DavidLibre-Regular', 'normal')
    doc.setTextColor(10, 10, 10)
    doc.setFontSize(REG_FONT_SIZE)
    const width = doc.getTextWidth(line)
    doc.text(line, RIGHT_MARGIN, currentLine, {
      align: 'right'
    })
    if (options?.answer !== undefined) {
      const answerStart = RIGHT_MARGIN - width - 4
      const answerWidth = Math.max(doc.getTextWidth(options.answer), 30)
      console.log(answerWidth)
      doc.setTextColor(12, 12, 230)
      doc.text(options.answer, answerStart - 2, currentLine, {
        align: 'right'
      })
      doc.setTextColor(180)
      doc.line(answerStart, currentLine + 0.6, answerStart - answerWidth, currentLine + 0.6)
    }
    currentLine += LINE_HEIGHT
  }


  const addHeader = (section) => {
    doc.setFont('DavidLibre-Bold' )
    doc.setFontSize(20)
    const width = doc.getTextWidth(section.title)
    doc.text(section.title, 105, currentLine, {
      align: 'center'
    })
    doc.line(105 - width / 2, currentLine + 2, 105 + width / 2, currentLine + 2)
    currentLine += 10
    doc.setFontSize(REG_FONT_SIZE)
    doc.splitTextToSize(section.description, 180).map(line => addLine(line))
    addLine('')
  }

  const linePrefix = (id) => {
    const parts = id.split('.').map(i => Number.parseInt(i))
    if (parts.length === 1) {
      return `${parts[0]}. `
    }
    if (parts.length === 2) {
      return `${gematriya(parts[1] + 1, {geresh: false, punctuate: false})}. `
    }
    return `    - `
  }
  doc.setR2L(true)
  doc.setLanguage('he')
  sectionsProcessed.forEach(section => {
    if (section.header) {
      addHeader(section)
      return
    }
    addLine(`${linePrefix(section.id)}${section.title}`, {align: 'center', bold: true})
    if (section.description) {
      doc.splitTextToSize(section.description, WRAP_WIDTH).map(line => addLine(line))
    }
    section.questions.forEach(question => {
      if (question.type === 'table') {
        const aws = answers[question.id] ?? []
      
        doc.autoTable({
          startY: currentLine,
          head: [[...question.cols].reverse()],
          body: aws.map(line => line.map((v, i) => {
              return question.types[i] === 'number'
                ? v.toString().split('').reverse().join('')
                : v
            }).reverse())
          ,
          theme: 'grid',
          styles: {font: "DavidLibre-Regular", halign: "center", lineColor: 220,
          },
          headStyles: {fillColor: 40},
          bodyStyles : {textColor: [12, 12, 230]},
          alternateRowStyles: {fillColor: 230}
        })
        currentLine += aws.length * 10 + LINE_HEIGHT
      }
      else {
        const qText = `${linePrefix(question.id)}${question.text}`
        const answer = question.type === 'number' 
          ? answers[question.id].toString().split('').reverse().join('') ?? ' '
          : answers[question.id] ?? ' '
        const line = `${qText}:`
        addLine(line, {answer})
      }
    })
    currentLine += SECTION_BUFFER
  })

  if (isValid !== undefined) {
    const prisonerStatementTitle = "הצהרת העצור"
    const prisonerStatement = "אני מצהיר בזה, כי הנני מבקש שימונה לי סניגור ציבורי, וכי כל הפרטים שמסרתי נכונים. ידוע לי כי מסירת פרטים כוזבים אסורה על פי הדין. כמו כן הדבר יאפשר לסניגור המחוזי לבקש מבית המשפט להורות על הפסקת הייצוג על-ידי הסניגוריה הציבורית, וניתן יהיה לחייב אותי בהחזר ההוצאות הקשורות לייצוג שהוענק לי על-ידי הסניגוריה הציבורית."
    const lawyerStatementTitle = "הצהרת העו\"ד"
    const lawyerStatementPartsOrig = [
      `אני, עו"ד ${lawyerName}, הקראתי לעצור את הצהרתו והוא חתם עליה בפני. הריני מאשר כי בהתאם להנחיות הסניגור המחוזי, בחנתי את הפרטים שמסר המבקש, ומצאתי כי הוא`,
      `לייצוג על-פי האמור בתקנות הסניגוריה הציבורית )ייצוג עצורים מחוסרי אמצעים(, התשנ"ח - 199`
    ]
    const co = 4
    const lawyerStatementParts = [
      lawyerStatementPartsOrig[0],
      lawyerStatementPartsOrig[1].split(' ').slice(0, co).join(' '),
      lawyerStatementPartsOrig[1].split(' ').slice(co).join(' ')
    ]
    addLine(`${linePrefix(sectionsProcessed.length.toString())}${prisonerStatementTitle}`, {align: 'center', bold: true})
    doc.splitTextToSize(prisonerStatement, WRAP_WIDTH).map(line => addLine(line))
    addLine('')
    addLine(`${linePrefix((sectionsProcessed.length + 1).toString())}${lawyerStatementTitle}`, {align: 'center', bold: true})
    const firstPartLines = doc.splitTextToSize(lawyerStatementParts[0], WRAP_WIDTH)
    firstPartLines.map(line => addLine(line))
    const fll = doc.getTextWidth(firstPartLines[firstPartLines.length - 1])
    const isValidStart = RIGHT_MARGIN - fll - 2
    const isValidText = isValid ? "זכאי" : "לא זכאי"
    const isValidWidth = doc.getTextWidth(isValidText)
    currentLine -= LINE_HEIGHT
    doc.setFontSize(20)
    doc.text(isValidText, isValidStart, currentLine, {
      align: 'right'
    })
    doc.setFontSize(REG_FONT_SIZE)
    doc.text(lawyerStatementParts[1], isValidStart - isValidWidth - 7, currentLine, {
      align: 'right'
    })
    currentLine += LINE_HEIGHT
    doc.splitTextToSize(lawyerStatementParts[2], WRAP_WIDTH).map(line => addLine(line))
  }

  if (navigator && navigator.share) {
  try {
    const data = new Blob([doc.output('blob', {
      filename: `${filename}.pdf`
    })])
    await navigator.share({
      title: "share this",
      text:"you need to share this",
      files: [
        new File([data], `${filename}.pdf`, {
          type: 'application/pdf'
        })
      ]
    })
    } catch (e) {
      alert(e)
    } 
  }
  else {
    doc.save(`${filename}.pdf`)
  }
}

export class EligibilityForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setAnswer = this.setAnswer.bind(this)
    this.getValue = this.getValue.bind(this)
    this.send = this.send.bind(this)
    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
    this.state = {
      answers: createDefaultAnswers(),
      currentPage: 0
    }
  }

  handleSubmit(event) {
    try {
    console.log(this.state)
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

  send() {
    return createResultForm(
      this.state.answers,
      this.getLawyerName(),
      this.isValid()
    )
  }

  prev() {
    this.setState({
       ...this.state,
       currentPage: this.state.currentPage - 1
    })
  }

  next() {
    this.setState({
      ...this.state,
      currentPage: this.state.currentPage + 1
   })
  }

  isValid() {

    const toNumOrZero = (strV) => {
      try {
        return Number.parseInt(strV)
      }
      catch(e) {
        return 0
      }
    }
    const avgIncome = toNumOrZero(this.getValue(markerMapping['avg_income']))
    const household = this.getValue(markerMapping['household'])
    const rent = toNumOrZero(this.getValue(markerMapping['rent']))
    const canSell = this.getValue(markerMapping['can_sell_apt']) === "כן"
    const householdIncome = household.map(row => {
      const strV = row[row.length - 1]
      return toNumOrZero(strV)
    }).reduce((a, b) => a + b, 0)

    const totalIncome = householdIncome + avgIncome + rent
    const householdResidents = household.length
    const incomeCutoff = HOUSEHOLD_INCOME_THRESHOLD[householdResidents]
    if (incomeCutoff && totalIncome > incomeCutoff) {
      return false
    }
    if (canSell) {
      return false
    }

    return true
  }

  getLawyerName() {
    return this.getValue(markerMapping['lawyer_name'])  
  }

  render() {
    const showCustomer = this.state.currentPage === sectionsProcessed.length
    const showLawyer = this.state.currentPage === sectionsProcessed.length + 1
    return (
      <form onSubmit={this.handleSubmit}>
        {sectionsProcessed.map((section, i) => this.state.currentPage === i ? <Section 
          section={section}
          getValue={this.getValue}
          setAnswer={this.setAnswer}
          next={this.next}
          send={this.send}
          prev={i > 0 && this.prev}
        /> : null)}
        {showCustomer ? <CustomerStatement 
          next={this.next}
          prev={this.prev}
        /> : null}
        {showLawyer ? <LawyerStatement 
          prev={this.prev}
          send={this.send}
          isValid={this.isValid()}
          lawyerName={this.getLawyerName()}
        /> : null}
      </form>
    )
  }
}