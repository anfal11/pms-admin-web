import { Fragment, useState } from "react"
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor'
import styled from 'styled-components'
import ImagePlaceHolder from './imageplaceholder.png'
import { Error, Success } from '../../../viewhelper'


const CreateEmailTemplate = ({userInput, handleChange, emailEditorRef, formik}) => {

    const [isReady, setReady] = useState(false)

    const onDesignLoad = (data) => { }
    const onDesignUpdate = (data) => { 
        emailEditorRef.current.editor.exportHtml((data) => {
            const { design, html } = data
            formik.setFieldValue("design", design)
            formik.setFieldValue("html", html)
          })
    }
    
      const onLoad  = (unlayer) => {

        unlayer.addEventListener('design:loaded', onDesignLoad)
        unlayer.addEventListener('design:updated', onDesignUpdate)

        // unlayer.addEventListener('image:uploaded', function(data) {
        //     const image = data.image
        //     const url = image.url
        //     const width = image.width
        //     const height = image.height

        //     console.log('uploaded')
        //   })
    
        unlayer.registerCallback('image', function(file, done) {
            console.log('uploading')
            done({ progress: 0 })
            const data = new FormData()
            data.append('image', file.attachments[0])
            useJwt2.singleImageUpload(data, {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent
                    const percentCompleted = Math.round((loaded * 100) / total)
                    if (percentCompleted < 100) {
                        done({ progress: percentCompleted })
                    }
                }
            }).then(res => { 
                done({ progress: 100, url: res.data['payload']['image_url'] })
            }).catch(err => {
                Error(err)
            })

        })
      }
    
      const onReady  = (unlayer) => { 
        if (!isReady) {
            setReady(true)
            if (
              Object.keys(formik?.values?.design).length &&
              emailEditorRef?.current?.editor
            ) {
              emailEditorRef?.current?.editor?.loadDesign(formik?.values?.design)
            }
          }
      } 

      const exportHtml = () => {
        const unlayer = emailEditorRef.current?.editor
    
        unlayer?.exportHtml((data) => {
          const { design, html } = data
          console.log('exportHtml', html)
          alert('Output HTML has been logged in your developer console.')
        })
    }

    return (
        <Fragment>
            <Row className='pr-3'>
                <Col sm="6" >
                    <FormGroup>
                        <Label for="title">Subject<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="text"
                            name="email_title"
                            id='email_title'
                            value={userInput.email_title}
                            onChange={handleChange}
                            required
                            placeholder="subject here..."
                        />
                    </FormGroup>
                </Col>
                                                
                <Col sm="12" >
                    <FormGroup style={{overflow:'scroll'}}>
                        <Label for="body">body<span style={{ color: 'red' }}>*</span></Label>

                        <EmailEditor 
                        ref={emailEditorRef} 
                        onLoad={onLoad} 
                        onReady={onReady} 
                        scriptUrl="./embed.js"
                        options={{
                            displayMode: 'email',
                            tools: {
                            image: {
                                properties: {
                                src: {
                                    value: {
                                    url: ImagePlaceHolder
                                    }
                                }
                                }
                            },
                            form: {
                                enabled: true
                            }
                            }
                        }}
                        />
                        {/* <Input
                                required
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                    // position: "absolute"
                                }}
                                onFocus={e => emailEditorRef.current.select?.focus()}
                                value={userInput?.email_body || ''}
                                onChange={e => ''}
                        /> */}
   
                    </FormGroup>
                </Col>
            </Row>
        </Fragment>
    )
}

export default CreateEmailTemplate