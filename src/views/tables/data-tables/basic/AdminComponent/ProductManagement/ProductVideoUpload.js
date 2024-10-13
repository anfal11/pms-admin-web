import { Fragment, useState, useEffect, useRef } from 'react'
import {VideoUploadEndPoint} from '../../../../../../Configurables.js'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, Eye, XCircle, Facebook, Globe, Instagram, Twitter, PlayCircle
} from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, ncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, nputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { toast } from 'react-toastify'
import socketIOClient from "socket.io-client"

const ProductVideoUpload = ({ setproduct_video_link, BusinessID, percent, setpercent }) => {
    const ENDPOINT = window.VideoUploadEndPoint
    const [videoFile, setVideoFile] = useState(null)
    // const [percent, setpercent] = useState(0)
    const [File, setFile] = useState(null)
    const [isCancel, setisCancel] = useState(false)

    const UpdateBar = (percent) => {
        console.log('File.size ', File.size)
        const stylewidth = percent
        const inhtml = (Math.round(percent * 100) / 100)
        const MBDone = Math.round(((percent / 100.0) * File.size) / 1048576)
        // console.log('stylewidth ', stylewidth)
        // console.log('inhtml ', inhtml)
        setpercent(inhtml)
        // console.log('MBDone ', MBDone)
    }
    useEffect(() => {
        const socket = socketIOClient(VideoUploadEndPoint)

        if (isCancel) {

            socket.disconnect()
            socket.connect()
        }
        if (File) {

            const FReader = new FileReader()
            let { name } = File
            const { size } = File
            name = `${BusinessID} ${name}`
            name = name.split(' ').join('_')
            FReader.onload = (evnt) => {
                console.log('evnt ')
                socket.emit('Upload', { Name: name, Data: evnt.target.result })
            }

            socket.emit('Start', { Name: name, Size: size })
            socket.on('MoreData', function (data) {
                UpdateBar(data['Percent'])
                const Place = data['Place'] * 131072 //The Next Blocks Starting Position
                // const NewFile //The constiable that will hold the new Block of Data
                const NewFile = File.slice(Place, Place + Math.min(131072, (File.size - Place)))
                FReader.readAsBinaryString(NewFile)
            })

            socket.on("Done", data => {
                UpdateBar(data['Percent'])
                setproduct_video_link(data['file_access_url'])
                console.log("File uploaded successfully, access url: ", data['file_access_url'])
            })
        }
        // CLEAN UP THE EFFECT
        return () => socket.disconnect()

    }, [File, isCancel])

    const onChange = async (e) => {
        e.preventDefault()
        setisCancel(false)
        setFile(e.target.files[0])
    }

    const onCancel = async (e) => {
        e.preventDefault()
        setproduct_video_link('')
        setVideoFile(null)
        setFile(null)
        setpercent(0)
        setisCancel(true)
    }

    return (
        <Fragment>
            {!videoFile && <div className="file position-relative overflow-hidden">
                <div className='text-center p-1' style={{
                    height: '102px',
                    width: '102px',
                    border: '1px dashed #d9d9d9',
                    backgroundColor: "#fafafa"
                }}>
                    <span ><PlayCircle size={20} className='my-1' /></span> <br />
                    <span>Add Video</span>
                </div>
                <input style={{
                    position: 'absolute',
                    opacity: '0',
                    left: '0',
                    top: '0',
                    height: '102px',
                    width: '102px',
                    cursor: 'pointer'
                }}
                    type='file'
                    onChange={e => {
                        if (e.target.files[0].type !== 'video/mp4') {
                            toast.error('please upload a video/mp4 file')
                            return
                        }
                        // console.log(e.target.files[0])
                        setFile(e.target.files[0])
                        setVideoFile(URL.createObjectURL(e.target.files[0]))
                    }} />
            </div>}
            {videoFile && <Progress animated striped className='progress-bar-primary' value={Number(percent)} >
                {percent}%
            </Progress>}

            {videoFile && <video style={{ marginTop: "3px" }} width="100%" height="200" controls src={videoFile}>
                Your browser does not support the video tag.
            </video>}
            {videoFile && <div className="text-right">
                <Button.Ripple className='' color='outline-danger' onClick={onCancel}>
                    Cancel
                </Button.Ripple>
            </div>}
        </Fragment>
    )
}

export default ProductVideoUpload