import { Fragment } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'

const CreateSmsTemplate = ({userInput, setUserInput, handleChange}) => {

    function countCharacters(str) {
        let englishLetterCount = 0
        let unicodeCount = 0
        let numberCount = 0
        let specialCharacterCount = 0
      
        for (const char of str) {
          if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            englishLetterCount++
          } else if (char >= '0' && char <= '9') {
            numberCount++
          } else if (/[\u{0980}-\u{09FF}\u{1100}-\u{11FF}\u{1A00}-\u{1A1F}\u{1B80}-\u{1BBF}\u{1C00}-\u{1C4F}\u{1C50}-\u{1C7F}\u{1CC0}-\u{1CCF}\u{1CD0}-\u{1CFF}\u{A800}-\u{A82F}]/u.test(char)) {
            unicodeCount++
          } else {
            specialCharacterCount++
          }
        }
        const finalV = englishLetterCount + numberCount + (unicodeCount * 2) + specialCharacterCount
        let smsCount = 0
        let letterCount = 0
        if (unicodeCount === 0) {
            if (finalV > 160) {
                smsCount = finalV / 150
                letterCount = finalV % 150
            } else if (finalV <= 160) {
                smsCount = finalV / 160
                letterCount = finalV % 160
            }
        } else if (englishLetterCount === 0) {
            if (finalV > 140) {
                smsCount = finalV / 130
                letterCount = finalV % 130
            } else if (finalV <= 140) {
                smsCount = finalV / 140
                letterCount = finalV % 140
            }
        } else {
            if (finalV > 160) {
                smsCount = finalV / 150
                letterCount = finalV % 150
            } else if (finalV <= 160) {
                smsCount = finalV / 160
                letterCount = finalV % 160
            }
        }
        const actualLength = englishLetterCount + numberCount + unicodeCount + specialCharacterCount
        console.log(englishLetterCount, numberCount, unicodeCount, specialCharacterCount, finalV)
        // if (finalV >= 160) {
        //     return false // Signal to limit input
        //   }
        return {finalV, actualLength, smsCount, letterCount}
      }

    return ( 
        <Fragment>
            <Row className='pr-3'>
                <Col sm="6" >
                    <FormGroup>
                        <Label for="sms_from">From<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="text"
                            name="sms_from"
                            id='sms_from'
                            value={userInput.sms_from}
                            onChange={handleChange}
                            required
                            placeholder="from here..."
                        />
                    </FormGroup>
                </Col>
                <Col sm="12" >
                    <FormGroup>
                        <Label for="body">body<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="textarea"
                            name="sms_body"
                            id='sms_body'
                            value={userInput.sms_body}
                            onChange={(e) => {
                                if (countCharacters(userInput.sms_body).smsCount > 5) {
                                    //do nothing
                                } else {
                                    if (countCharacters(e.target.value).smsCount <= 5) {
                                        handleChange(e)
                                    }
                                }
                            }}
                            // maxlength="160"
                            required
                            // disabled={160 - countCharacters(userInput.sms_body) === 0} 
                            placeholder="your message"
                        />
                        <p className='text-right' style={countCharacters(userInput.sms_body).smsCount  >= 5 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{Math.floor(countCharacters(userInput.sms_body).smsCount)}/{countCharacters(userInput.sms_body).letterCount}</p>
                    </FormGroup>
                </Col>
            </Row>
        </Fragment>
    )
}

export default CreateSmsTemplate