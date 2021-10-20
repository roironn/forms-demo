import React from 'react'
export class CustomerStatement extends React.Component {
    constructor(props) {
        super(props)
        this.send = this.props.send
        this.next = this.props.next
        this.prev = this.props.prev
        this.show = this.props.show
    }

    render() {
      return (<div className="Section"
           class='eliForm'
        >
        <div class="form-title-row">
        <h1 className="SectionHeader">הצהרת העצור</h1>
        </div>
        <p>
        אני מצהיר בזה, כי הנני מבקש שימונה לי סניגור ציבורי, וכי כל הפרטים שמסרתי נכונים. ידוע לי כי מסירת פרטים כוזבים
אסורה על פי הדין. כמו כן הדבר יאפשר לסניגור המחוזי לבקש מבית המשפט להורות על הפסקת הייצוג על-ידי הסניגוריה
הציבורית, וניתן יהיה לחייב אותי בהחזר ההוצאות הקשורות לייצוג שהוענק לי על-ידי הסניגוריה הציבורית.
        </p>
        <div class='btn'>
          {this.send ? (<button class="left" onClick={this.send}>שלח</button>) : (null)}
          {this.next ? (<button class="left" onClick={this.next}>הבא</button>) : (null)}
          {this.prev ? (<button class="right" onClick={this.prev}>חזור</button>) : (null)}
        </div>
      </div>)
    }
}

export class LawyerStatement extends React.Component {
    constructor(props) {
        super(props)
        this.send = this.props.send
        this.next = this.props.next
        this.prev = this.props.prev
        this.show = this.props.show
        this.isValid = this.isValid.bind(this)
        this.lawyerName = this.props.lawyerName
    }

    isValid() {
        if (this.props.isValid) {
            return (<span class='valid'>זכאי</span>)
        }
        return (<span class='invalid'>לא זכאי</span>)
    }

    render() {
      return (<div className="Section"
           class='eliForm'
        >
        <div class="form-title-row">
        <h1 className="SectionHeader">הצהרת עו"ד</h1>
        </div>
        <p>
        אני, עו"ד {this.lawyerName}, הקראתי לעצור את הצהרתו והוא חתם עליה בפני. הריני מאשר כי בהתאם
להנחיות הסניגור המחוזי, בחנתי את הפרטים שמסר המבקש, ומצאתי כי הוא {this.isValid()} לייצוג על-פי האמור
בתקנות הסניגוריה הציבורית )ייצוג עצורים מחוסרי אמצעים(, התשנ"ח - 1998
        </p>
        <div class='btn'>
          {this.send ? (<button class="left" onClick={this.send}>שלח</button>) : (null)}
          {this.next ? (<button class="left" onClick={this.next}>הבא</button>) : (null)}
          {this.prev ? (<button class="right" onClick={this.prev}>חזור</button>) : (null)}
        </div>
      </div>)
    }
}