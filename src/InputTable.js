import React from 'react'

class InputTableCell extends React.Component {
    constructor(props) {
        super(props);
        this.label = this.props.label
        this.cellId = this.props.cellId
        this.updateCell = this.props.updateCell
        this.handleChange = this.handleChange.bind(this)
        this.value = this.props.value
        this.inputType = this.props.inputType
    }

    handleChange(e) {
        this.updateCell(this.cellId, e.target.value)
        this.value = e.target.value
    }

    render () {
        return (
        <div class="inputTableCell" class="form-row">
            <label>
                <span>{this.label}</span>
                <input type={this.inputType} 
                    onChange={this.handleChange}
                    value={this.value}   
                />
            </label>
        </div>)
    }
}

class InputTableRow extends React.Component {
    constructor(props) {
        super(props);
        this.question = this.props.question
        this.updateRow = this.props.updateRow
        this.updateCell = this.updateCell.bind(this)
        this.rowId = this.props.rowId
        this.value = this.props.value
    }

    updateCell(key, value) {
        this.value[Number.parseInt(key)] = value
        this.updateRow(this.rowId, this.value)
    }

    render() {
        return (<div className="InputTableRow">
            {this.question.cols.map((c, i) => <InputTableCell
                cellId={i}
                updateCell={this.updateCell}
                value={this.value[i]} 
                label={c}
                inputType={this.question.types[i]}
            />)}
        </div>)
    }
}

export class InputTable extends React.Component {
  constructor(props) {
    super(props);
    this.question = this.props.question
    this.updateRow = this.updateRow.bind(this);
    this.addRow = this.addRow.bind(this);
    this.setAnswer = this.props.setAnswer
    this.value =  this.props.value
  }
  
  updateRow(key, value){
    this.value[key] = value
    this.setAnswer(this.question.id, this.value)
  }

  addRow() {
    this.updateRow(this.value.length, this.question.cols.map(() => ''))
  }

  render() {
    return (
      <div className="InputTable" class="form-row">
        <label><span>{this.question.text}</span></label>
        <div className="InputTableData">
        {this.value.map((_c, i) => (
            <InputTableRow 
                question={this.question}
                updateRow={this.updateRow}
                rowId={i}
                value={this.value[i]}
            />
        ))}
        </div>
        <button onClick={this.addRow}>+</button>
      </div>
      )
  }
}