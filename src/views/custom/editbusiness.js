import { yupResolver } from '@hookform/resolvers/yup'
import Uppy from '@uppy/core'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import { selectThemeColors } from '@utils'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronLeft, User } from 'react-feather'
import { useForm } from 'react-hook-form'
import { Link, useHistory, useParams } from 'react-router-dom'
import Select from 'react-select'
import {
    Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormFeedback, FormGroup, Input,
    Label, Row, Spinner
} from 'reactstrap'
import { BMS_PASS, BMS_USER } from '../../Configurables'
import { BusinessFormValidation } from '../formvalidation'

import '@styles/react/libs/file-uploader/file-uploader.scss'
import '@uppy/status-bar/dist/style.css'
import 'antd/dist/antd.css'
import 'uppy/dist/uppy.css'

import { Skeleton } from 'antd'

import useJwt from '@src/auth/jwt/useJwt'
import { Error, ErrorMessage, Success } from '../viewhelper'

const colourOptions = [
    { value: 'Wembley', label: 'Wembley' },
    { value: 'Wembley2', label: 'Wembley2' },
    { value: 'Wembley3', label: 'Wembley3' }
]

// const vatexempt = [
//     { value: 'False', label: 'No' },
//     { value: 'True', label: 'Yes' }
// ]

const username = localStorage.getItem('username') || null

const errorDemoResponse = {
    response:{
     status : 400,
     data:{
       message : "File not supported. Only jpg,png,jpeg,PNG supports!"
     }
    }  
  }

  const onBeforeFileAdded = (currentFile, files) => {

    console.log(currentFile)
    if (!currentFile.type) {
        Error(errorDemoResponse)
        return false
    }

    if (currentFile.type) {
        const typebasename = currentFile.type.split('/')
        if (typebasename.length && typebasename[0] === 'image') {

            return true

        } else {
            Error(errorDemoResponse)
            return false

        }
    }

}

const uppyObj = {
    debug: false,
   // meta: { type: 'avatar' },
    restrictions: { 
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*']
     },
    autoProceed: true,
    onBeforeFileAdded: (currentFile, files) => onBeforeFileAdded(currentFile, files)
}

const EditBusiness = (props) => {
    const ref1 = useRef()
    const ref2 = useRef()
    const ref3 = useRef()
    const { businessid } = useParams()
    const history = useHistory()
    const [vatexempt, setvatexempt] = useState([])
    const { register, errors, handleSubmit, setValue } = useForm({ mode: 'onBlur', resolver: yupResolver(BusinessFormValidation) })
    const [servererror, setservererror] = useState({})
    const [loading, setloading] = useState(false)
    const [firstloading, setfirstloading] = useState(true)
    const [singlecomment, setsinglecomment] = useState('')
    const [comments, setcomment] = useState([])
    const [collaps, setCollaps] = useState({})

    const [attributes, setattributes] = useState({})
    const [companydocimage, setcompanydocimage] = useState(null)
    const [personalidimage, setpersonalidimage] = useState(null)
    const [vatidimage, setvatidimage] = useState(null)
    const [facilityimage, setfacilityimage] = useState(null)
    const [eoidimage, seteoidimage] = useState(null)

    const [showCustomPostCode, setshowCustomPostCode] = useState(false)
    const [CustomPostCode, setCustomPostCode] = useState(true)
    const [PostCodeError, setPostCodeError] = useState(false)

    const [divisions, setDivision] = useState([])
    const [districts, setDistrict] = useState([])
    const [thanas, setThana] = useState([])
    const [services, setserviceList] = useState([])
    const [groups, setGroupList] = useState([])
    const [campaigns, setcampaignList] = useState([])
    const [currency, setCurrency] = useState([])
    const [googleTimezoneList, setGoogleTimezoneList] = useState([])

    const [primarydepot, setprimarydepot] = useState([])
    const [businessaddress, setbusinessaddress] = useState([])
    const [postcodefetching, setpostcodefetching] = useState(false)
    const [tempaddress, settempaddress] = useState([])
    const [storesizelist, setstoresizelist] = useState([])
    const [businesscategorylist, setbusinesscategorylist] = useState([])
    const [marketingpreferancelist, setmarketingpreferancelist] = useState([])
    const [taglist, settaglist] = useState([])
    const [fileurls, setfileurls] = useState({
        'Company Documents': null,
        'Personal ID': null,
        'Vat ID': null,
        'Facility ID': null,
        'Economic Operator ID': null,
        Others: null
    })
    const [uploadloder, setuploadloder] = useState({
        'Company Documents': 0,
        'Personal ID': 0,
        'Vat ID': 0,
        'Facility ID': 0,
        'Economic Operator ID': 0,
        Others: 0
    })

    const [docerror, setdocerror] = useState({})
    const [memberofsymbolgroups, setmemberofsymbolgroups] = useState({})

    const [userinput, setuserinput] = useState({
        document: 'companyregdoc',
        postcode: '',
        businessname: '',
        country: '',
        address: '',
        tags: [],
        depot_id: 0,
        sizeofstoreid: 0,
        businesstype: '',
        businesscategoryid: 0,
        serverTags: [],
        serverTagsoption: [],
        selecttag: '',
        tagids: [],
        businesscategoryids: [],
        marketing_preference_ids: [],
        status: 1,
        companyregno: '',
        vatno: '',
        EOID: '',
        FID: '',
        premise: null,
        vatexempt: false,
        memberofsymbolgroup: false,
        businesstype: null,
        city: ''

    })

    const [fileuploadinformaton, setfileuploadinformation] = useState([])

    //from view page..
    const [viewinput, setviewinput] = useState({})
    const [businessmarketingpref, setbusinessmarketingpref] = useState([])
    const [businesstagmap, setbusinesstagmap] = useState([])
    const [customercomment, setcustomercomment] = useState([])
    const [customerbusinesstypemap, setcustomerbusinesstypemap] = useState([])
    const [storeinfo, setstoreinfo] = useState({
        storename: ''
    })
    const [storesizeinfo, setstoresizeinfo] = useState({
        statusdesc: ''
    })

    const getTimeStampToDateTime = str => {
        const date = new Date(str)
        return `${date.toDateString()} ${date.toLocaleTimeString()}`
    }

    const onChange = (e) => {
        if (e.target.name === 'postcode') {
            const chkLength = /^.{6,8}$/.test(e.target.value)
            if (chkLength) {
                setPostCodeError(false)
            } else { setPostCodeError(true) }
            // console.log(chkLength)
        }
        if (e.target.name === "vatno") {
            setuserinput({ ...userinput, [e.target.name]: `GB${e.target.value}` })
            console.log(userinput)
        } else if (e.target.name === "EOID") {
            setuserinput({ ...userinput, [e.target.name]: `QCGDLRE${e.target.value}` })
            console.log(userinput)
        } else if (e.target.name === "FID") {
            setuserinput({ ...userinput, [e.target.name]: `QCGDLRF${e.target.value}` })
            console.log(userinput)
        } else {
            setuserinput({ ...userinput, [e.target.name]: e.target.value })
        }
    }

    const addressChange = (item) => {
        const index1 = +item.value
        setuserinput({ ...userinput, address: item.label, country: tempaddress[index1].country, city: tempaddress[index1].town_or_city })
    }

    const depotChange = (item) => {
        const depotid2 = +item.value
        setuserinput({ ...userinput, depot_id: depotid2 })
    }

    const businessCategoryOnChange = (option) => {
        // const ModifyArray = selectedOptions.map(x => x.value)
        // setuserinput({ ...userinput, businesscategoryids: ModifyArray })
        const arr = []
        arr.push(option.value)
        // console.log(arr)
        setuserinput({ ...userinput, businesscategoryids: arr })

        // if (e.target.checked) {
        //     const businesscategoryidss4 = [...userinput.businesscategoryids, parseInt(e.target.value)]
        //     setuserinput({ ...userinput, businesscategoryids: businesscategoryidss4 })
        // } else {
        //     const afterremovebusinesscategoryids5 = userinput.businesscategoryids.filter(tag => tag !== parseInt(e.target.value))
        //     setuserinput({ ...userinput, businesscategoryids: afterremovebusinesscategoryids5 })
        // }
    }

    const marketingPrefOnChange = (e) => {
        if (e.target.checked) {
            const businesscategoryidss6 = [...userinput.marketing_preference_ids, parseInt(e.target.value)]
            setuserinput({ ...userinput, marketing_preference_ids: businesscategoryidss6 })
        } else {
            const afterremovebusinesscategoryids7 = userinput.marketing_preference_ids.filter(tag => tag !== parseInt(e.target.value))
            setuserinput({ ...userinput, marketing_preference_ids: afterremovebusinesscategoryids7 })

        }
    }

    const getbusinessdetails = async () => {

        return await new Promise((resolve, reject) => {
            const business_id = props.match.params.businessid
            //store list..
            useJwt.customerBusinessDetails({ businessid: business_id }).then(res => {
                const payload1 = res.data.payload, fileinfo = []
                console.log(payload1)
                let i = 0
                const { customerbusinesstypemap = [],
                    businessmarketingpref = [],
                    businesstagmap = [],
                    customercomment = [],
                    campaign_config,

                    EOIDDOC,
                    eoiddoc_uploadedby,
                    eoiddoc_uploadedtime,

                    FIDDOC,
                    fiddoc_uploadedby,
                    fiddoc_uploadedtime,

                    companyregdoc,
                    companyregdoc_uploadedby,
                    companyregdoc_uploadedtime,

                    personaliddoc,
                    personaliddoc_uploadedby,
                    personaliddoc_uploadedtime,

                    vatdoc,
                    vatdoc_uploadedby,
                    vatdoc_uploadedtime,

                    others_doc,
                    othersdoc_uploadedby,
                    othersdoc_uploadedtime,

                    storeinfo,
                    storesizeinfo,

                    customerinfo,
                    currency_code,
                    time_zone,
                    adAccountId

                } = payload1

                const {ad_account_id, app_id, app_secret, business_id, email_address, email_config_type, email_host, email_password, email_port, email_service, fcm_server_ring, google_customer_id, google_managers_client_id, instagram_actor_id, keyword, page_id, user_token} = campaign_config || {}

                const business_categoryids = customerbusinesstypemap.map(item => item.typeid)
                const marketingpreferenceids = businessmarketingpref.map(item => item.marketing_preference_id)
                setloading(false)
                setuserinput({ ...userinput, ...payload1, ...customerinfo, ad_account_id, app_id, app_secret, business_id, email_address, email_config_type, email_host, email_password, email_port, email_service, fcm_server_ring, google_customer_id, google_managers_client_id, instagram_actor_id, keyword, page_id, user_token })
                setcustomercomment(customercomment)
                setcustomerbusinesstypemap(customerbusinesstypemap)
                setbusinessmarketingpref(businessmarketingpref)
                setstoreinfo(storeinfo)
                setstoresizeinfo(storesizeinfo)
                let eoid = null, fid = null, comdoc = null, perdoc = null, vatd = null, othersd = null
                const uploader = {}
                if (EOIDDOC) {
                    eoid = EOIDDOC
                    uploader['Economic Operator ID'] = 100
                    const filenameaplitarr = EOIDDOC.split('/')
                    fileinfo[i++] = {
                        file: 'Economic Operator ID',
                        name: filenameaplitarr[filenameaplitarr.length - 1],
                        uploadby: eoiddoc_uploadedby,
                        uploaddatetime: eoiddoc_uploadedtime ? getTimeStampToDateTime(eoiddoc_uploadedtime) : null,
                        perview: EOIDDOC
                    }
                }

                if (FIDDOC) {
                    fid = FIDDOC
                    uploader['Facility ID'] = 100
                    const filenameaplitarr = FIDDOC.split('/')
                    fileinfo[i++] = {
                        file: 'Facility ID',
                        name: filenameaplitarr[filenameaplitarr.length - 1],
                        uploadby: fiddoc_uploadedby,
                        uploaddatetime: fiddoc_uploadedtime ? getTimeStampToDateTime(fiddoc_uploadedtime) : null,
                        perview: FIDDOC
                    }
                }

                if (companyregdoc) {
                    comdoc = companyregdoc
                    uploader['Company Documents'] = 100
                    const filenameaplitarr = companyregdoc.split('/')
                    fileinfo[i++] = {
                        file: 'Company Documents',
                        name: filenameaplitarr[filenameaplitarr.length - 1],
                        uploadby: companyregdoc_uploadedby,
                        uploaddatetime: companyregdoc_uploadedtime ? getTimeStampToDateTime(companyregdoc_uploadedtime) : null,
                        perview: companyregdoc
                    }
                }

                if (personaliddoc) {
                    perdoc = personaliddoc
                    uploader['Personal ID'] = 100
                    const filenameaplitarr = personaliddoc.split('/')
                    fileinfo[i++] = {
                        file: 'Personal ID',
                        name: filenameaplitarr[filenameaplitarr.length - 1],
                        uploadby: personaliddoc_uploadedby,
                        uploaddatetime: personaliddoc_uploadedtime ? getTimeStampToDateTime(personaliddoc_uploadedtime) : null,
                        perview: personaliddoc
                    }
                }

                if (vatdoc) {
                    vatd = vatdoc
                    uploader['Vat ID'] = 100
                    const filenameaplitarr = vatdoc.split('/')
                    fileinfo[i++] = {
                        file: 'Vat ID',
                        name: filenameaplitarr[filenameaplitarr.length - 1],
                        uploadby: vatdoc_uploadedby,
                        uploaddatetime: vatdoc_uploadedtime ? getTimeStampToDateTime(vatdoc_uploadedtime) : null,
                        perview: vatdoc
                    }
                }

                if (others_doc) {
                    othersd = others_doc
                    uploader['Others'] = 100
                    const filenameaplitarr = others_doc.split('/')
                    fileinfo[i++] = {
                        file: 'Others',
                        name: filenameaplitarr[filenameaplitarr.length - 1],
                        uploadby: othersdoc_uploadedby,
                        uploaddatetime: othersdoc_uploadedtime ? getTimeStampToDateTime(vatdoc_uploadedtime) : null,
                        perview: others_doc
                    }
                }
                setuploadloder(uploader)
                setfileurls({ ...fileurls, 'Vat ID': vatd, 'Economic Operator ID': eoid, 'Company Documents': comdoc, 'Personal ID': perdoc, 'Facility ID': fid, Others : othersd })
                setfileuploadinformation(fileinfo)
                resolve({
                    ...userinput,
                    ...payload1,
                    ...customerinfo,
                    businesstagmap,
                    businesscategoryids: business_categoryids,
                    marketing_preference_ids: marketingpreferenceids
                })
            }).catch(err => {
                reject(err)
            })
        })
    }
    //api fetching start..
    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //tokan management purpose
        localStorage.setItem('usePMStoken', false) //tokan management purpose
        //business details..
        await getbusinessdetails().then(async data22 => {
            const { depot_id, sizeofstoreid, memberofsymbolgroup, businesstagmap } = data22
            /* if (memberofsymbolgroup) {
                 setmemberofsymbolgroups({
                     defaultValue: { value: 'True', label: 'Yes' }
                 })
             } else {
                 setmemberofsymbolgroups({
                     defaultValue: { value: 'False', label: 'No' }
                 })
             }*/
             localStorage.setItem('usePMStoken', false) //for token management
             localStorage.setItem('useBMStoken', false)
             await useJwt.getServiceList().then(res => {
                 console.log(res)
                 setserviceList(res.data.payload)
             }).catch(err => {
                 Error(err)
                 console.log(err)
             })
             localStorage.setItem('useBMStoken', true)
             await useJwt.campaignList().then(res => {
                 console.log(res)
                 setcampaignList(res.data)
                 localStorage.setItem('useBMStoken', false)
             }).catch(err => {
                 console.log(err)
                 if (err.response.status === 401) {
                    localStorage.setItem("BMSCall", true)
                    useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
                      localStorage.setItem('BMStoken', res.data.jwtToken)
                      localStorage.setItem("BMSCall", false)
                      setReset(!resetData)
                    }).catch(err => {
                      localStorage.setItem("BMSCall", false)
                      console.log(err)
                    })
                } else {
                    Error(err)
                    localStorage.setItem('useBMStoken', false)
                }
             })
             await useJwt.getCentralGroup().then(res => {
                 console.log(res)
                 const allGroup = []
                 for (const q of res.data.payload) {
                     if (q.is_approved === true) {
                         allGroup.push(q)
                     } 
                 }
                 setGroupList(allGroup)
             }).catch(err => {
                 Error(err)
                 console.log(err.response)
             })
             useJwt.BDAddressList().then(res => {
                setDivision(res.data.payload)
                }).catch(err => {
                    console.log(err.response)
                    Error(err)
                })
            //store list..
            // await useJwt.storeList().then(res => {
            //     const payload1 = res.data.payload
            //     let data1 = []
            //     payload1.forEach((item, index) => {
            //         if (item.storeid === depot_id) {
            //             data1 = [{ value: item.storeid, label: item.storename }, ...data1]
            //         } else {
            //             data1 = [...data1, { value: item.storeid, label: item.storename }]
            //         }
            //     })
            //     //  console.log(' data1 ', data1)

            //     setprimarydepot(data1)

            // }).catch(err => {
            //     console.log(err)
            //     console.log(err.response)
            //     Error(err)
            // })
            //size of store 
            // await useJwt.storesizeList().then(res => {
            //     const payload2 = res.data.payload
            //     let data2 = []
            //     payload2.forEach(item => {
            //         if (item.id === sizeofstoreid) {
            //             data2 = [{ value: item.id, label: item.statusdesc }, ...data2]
            //         } else {
            //             data2 = [...data2, { value: item.id, label: item.statusdesc }]
            //         }
            //     })
            //     setstoresizelist(data2)
            // }).catch(err => {
            //     console.log(err)
            //     console.log(err.response)
            //     Error(err)
            // })
            //business type list
            //size of store 
            await useJwt.businesscategoryList().then(res => {
                const payload3 = res.data.payload.map(x => { return { value: x.id, label: x.statusdesc } })
                setbusinesscategorylist(payload3)
                //setuserinput({...userinput, businesscategoryid:payload3[0].id})
            }).catch(err => {
                console.log(err.response)
                Error(err)
            })
            //marketing preferance list 
            await useJwt.businessmarketingpreferanceList().then(res => {
                const payload4 = res.data.payload
                setmarketingpreferancelist(payload4)
            }).catch(err => {
                console.log(err)
                console.log(err.response)
                Error(err)
            })
            //business tag list 
            // await useJwt.businessTagList().then(res => {
            //     const payload5 = res.data.payload
            //     const selecttags = [], serverTagsoptions = [], tag_ids = []
            //     let i = 0
            //     payload5.forEach((item, index) => {
            //         return { value: item.id, label: item.statusdesc }
            //     })
            //     //...
            //     businesstagmap.forEach((item, index) => {
            //         selecttags[index] = item.businesstag.statusdesc
            //         tag_ids[index] = item.tagid
            //     })

            //     payload5.forEach((item) => {
            //         if (!tag_ids.includes(item.id)) {
            //             serverTagsoptions[i++] = {
            //                 value: item.id, label: item.statusdesc
            //             }
            //         }
            //     })

            //     settaglist(payload5)
            //     console.log('data22 ', data22)

            //     setuserinput({ ...data22, tagids: tag_ids, tags: selecttags, serverTagsoption: serverTagsoptions })
            // }).catch(err => {
            //     console.log(err)
            //     console.log(err.response)
            //     Error(err)
            // })

            // symbol list setvatexempt
            // await useJwt.useSymbolGroup().then(res => {
            //     console.log(res.data.payload)
            //     setvatexempt(res.data.payload.map(x => {

            //         if (memberofsymbolgroup === x.id) {
            //             setmemberofsymbolgroups({
            //                 defaultValue: { value: x.id, label: x.statusdesc }
            //             })
            //         }
            //         return { value: x.id, label: x.statusdesc }
            //     }))
            // }).catch(err => {
            //     console.log(err)
            //     Error(err)
            // })
            // setuserinput({ ...userinput, ...data22})
            setfirstloading(false)

        }).catch(err => {
            console.log(err)
            console.log(err.response)
            Error(err)
        })
        useJwt.currencyList().then(res => {
            console.log('currencyList', res)
            setCurrency(res.data.payload)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
        useJwt.googleTimezoneList().then(res => {
            console.log('googleTimezoneList', res)
            setGoogleTimezoneList([...res.data.payload])
        }).catch(err => {
            Error(err)
            console.log(err)
        })

    }, [])

    const searchPostcode = () => {
        if (userinput.postcode) {
            setpostcodefetching(true)
            setbusinessaddress([])
            setuserinput({ ...userinput, address: '', country: '' })
            useJwt.postCodeSearch({ postcode: userinput.postcode }).then(res => {
                const { addresses } = res.data.payload
                if (!addresses.length) {
                    setshowCustomPostCode(true)
                } else { setshowCustomPostCode(false) }
                setCustomPostCode(true)
                const data = addresses.map((item, index) => {
                    const format = item.formatted_address.filter(item => item).splice(0, 1).toString()
                    return { value: index, label: format }
                })  //convert to string
                setpostcodefetching(false)
                setbusinessaddress(data)
                settempaddress(addresses)
                setuserinput({ ...userinput })
                //setuserinput({...userinput, address:data[0].label, country:addresses[0].country, city:addresses[0].town_or_city})
            })
                .catch(err => {
                    setpostcodefetching(false)
                    Error(err)
                    setshowCustomPostCode(true)
                })
        }
    }
    //api fetching end..

    const removeImageFile = (itemname) => {

        const newfileuploadinformaton = []
        let i = 0
        for (const item of fileuploadinformaton) {
            if (item.file !== itemname) {
                newfileuploadinformaton[i++] = item

            }

        }
        setfileuploadinformation(newfileuploadinformaton)

        switch (itemname) {
            case 'Company Documents':
                setfileurls({ ...fileurls, ['Company Documents']: null })
                setuploadloder({ ...uploadloder, ['Company Documents']: 0 })
                break

            case 'Personal ID':
                setfileurls({ ...fileurls, ['Personal ID']: null })
                setuploadloder({ ...uploadloder, ['Personal ID']: 0 })
                break

            case 'Vat ID':
                setfileurls({ ...fileurls, ['Vat ID']: null })
                setuploadloder({ ...uploadloder, ['Vat ID']: 0 })
                break

            case 'Facility ID':
                setfileurls({ ...fileurls, ['Facility ID']: null })
                setuploadloder({ ...uploadloder, ['Facility ID']: 0 })
                break

            case 'Economic Operator ID':
                setfileurls({ ...fileurls, ['Economic Operator ID']: null })
                setuploadloder({ ...uploadloder, ['Economic Operator ID']: 0 })
                break
        }
    }

    const singleimageupload = (imagefile, typename) => {
        const formData = new FormData()
        formData.append('image', imagefile)
        const onUploadProgress = data => {
            const loading = Math.round((100 * data.loaded) / data.total)
            setuploadloder({ ...uploadloder, [typename]: loading })
        }
        useJwt.singleFileupload(formData, { onUploadProgress }).then(res => {

            setfileurls({ ...fileurls, [typename]: res.data.payload })

        }).catch(e => {
            console.log(e)
        })
    }
    //company doc up start...   
    const companydocuppy = new Uppy(uppyObj)

    companydocuppy.use(thumbnailGenerator)

    companydocuppy.on('thumbnail:generated', (file, preview) => {

        singleimageupload(file.data, 'Company Documents')
        //setcompanydocimage(file.data)
        const newfileuploadinformaton = fileuploadinformaton.filter(item => item.file !== 'Company Documents')
        setfileuploadinformation([
            ...newfileuploadinformaton,
            {
                file: 'Company Documents',
                name: file.name,
                uploadby: username,
                uploaddatetime: new Date().toLocaleString(),
                perview: preview
            }
        ])
    })
    //company doc up end...

    //personal id image up start...   
    const personalidimageuppy = new Uppy(uppyObj)

    personalidimageuppy.use(thumbnailGenerator)

    personalidimageuppy.on('thumbnail:generated', (file, preview) => {
        singleimageupload(file.data, 'Personal ID')
        const newfileuploadinformaton = fileuploadinformaton.filter(item => item.file !== 'Personal ID')
        setfileuploadinformation([
            ...newfileuploadinformaton,
            {
                file: 'Personal ID',
                name: file.name,
                uploadby: username,
                uploaddatetime: new Date().toLocaleString(),
                perview: preview
            }
        ])
    })
    //personal id image up end...

    //vatidimage up start...   
    const vatidimageuppy = new Uppy(uppyObj)

    vatidimageuppy.use(thumbnailGenerator)

    vatidimageuppy.on('thumbnail:generated', (file, preview) => {
        singleimageupload(file.data, 'Vat ID')
        const newfileuploadinformaton = fileuploadinformaton.filter(item => item.file !== 'Vat ID')
        setfileuploadinformation([
            ...newfileuploadinformaton,
            {
                file: 'Vat ID',
                name: file.name,
                uploadby: username,
                uploaddatetime: new Date().toLocaleString(),
                perview: preview
            }
        ])
    })
    //vatidimage up end...

    //facilityimage up start...   
    const facilityimageuppy = new Uppy(uppyObj)

    facilityimageuppy.use(thumbnailGenerator)

    facilityimageuppy.on('thumbnail:generated', (file, preview) => {
        singleimageupload(file.data, 'Facility ID')
        const newfileuploadinformaton = fileuploadinformaton.filter(item => item.file !== 'Facility ID')
        setfileuploadinformation([
            ...newfileuploadinformaton,
            {
                file: 'Facility ID',
                name: file.name,
                uploadby: username,
                uploaddatetime: new Date().toLocaleString(),
                perview: preview
            }
        ])
    })
    //facilityimage up end...

    //eoidimage up start...   
    const eoidimageuppy = new Uppy(uppyObj)

    eoidimageuppy.use(thumbnailGenerator)

    eoidimageuppy.on('thumbnail:generated', (file, preview) => {
        singleimageupload(file.data, 'Economic Operator ID')
        const newfileuploadinformaton = fileuploadinformaton.filter(item => item.file !== 'Economic Operator ID')
        setfileuploadinformation([
            ...newfileuploadinformaton,
            {
                file: 'Economic Operator ID',
                name: file.name,
                uploadby: username,
                uploaddatetime: new Date().toLocaleString(),
                perview: preview
            }
        ])
    })
    //eoidimage up end...

    //others image up start...   
    const othersimageuppy = new Uppy(uppyObj)

    othersimageuppy.use(thumbnailGenerator)

    othersimageuppy.on('thumbnail:generated', (file, preview) => {
        singleimageupload(file.data, 'Others')
        const newfileuploadinformaton = fileuploadinformaton.filter(item => item.file !== 'Others')
        setfileuploadinformation([
            ...newfileuploadinformaton,
            {
                file: 'Others',
                name: file.name,
                uploadby: username,
                uploaddatetime: new Date().toLocaleString(),
                perview: preview
            }
        ])
    })
    //others image up end...
    const Addcomments = (e) => {
        e.preventDefault()
        if (singlecomment) {
            setcomment([singlecomment, ...comments])
            setsinglecomment('')
        }
    }

    const removeComment = (removecomment) => {
        const addingcomments = comments.filter(comment => comment !== removecomment)
        setcomment(addingcomments)
    }

    const AddTags = (e) => {
        e.preventDefault()
        if (userinput.selecttag) {
            const selecttag = +userinput.selecttag
            let tagdes = ''
            taglist.forEach(item => {
                if (+item.id === selecttag) {
                    tagdes = item.statusdesc
                }
            })

            const serverTagsoptions = userinput.serverTagsoption.filter(tag => tag.value !== userinput.selecttag)
            const tagidsarr = [...userinput.tagids, selecttag]
            const tagsarr = [...userinput.tags, tagdes]
            setuserinput({ ...userinput, tags: tagsarr, serverTagsoption: serverTagsoptions, selecttag: null, tagids: tagidsarr })
        }
    }

    const onDocumentChanged = (e) => {
        setuserinput({ ...userinput, document: e.target.value })
    }

    const removeTag = removedtag => {
        const tagsarr = userinput.tags.filter(tag => tag !== removedtag)
        let serverTagsoptionsinfo = {}
        let tagid = 0
        taglist.forEach(item => {
            if (item.statusdesc === removedtag) {
                serverTagsoptionsinfo = {
                    value: item.id,
                    label: item.statusdesc
                }
                tagid = item.id
            }

        })
        const tagidsarr = userinput.tagids.filter(item => item !== tagid)
        const serverTagsoptions = [...userinput.serverTagsoption, serverTagsoptionsinfo]
        setuserinput({ ...userinput, tags: tagsarr, serverTagsoption: serverTagsoptions, tagids: tagidsarr })
    }

    const onSubmit = (value) => {

        // setdocerror({
        //     companyregdoc: false,
        //     personaliddoc: false,
        //     FIDDOC: false,
        //     EOIDDOCL: false,
        //     address: false,
        //     category: false
        // })

        // const docerrors = {}
        // let doc_error = false, tobacidexist = false

        const data = {
            ...userinput
            // comments,
            // depot_id: userinput.depot_id ? userinput.depot_id : primarydepot[0].value,
            // sizeofstoreid: userinput.sizeofstoreid ? userinput.sizeofstoreid : storesizelist[0].value,
            // tagids: userinput.tagids.map(String)
        }
        data.customerid = data.customerinfo.id
        data.customermobile = data.customerinfo.mobile
        delete data.tags
        delete data.businesscategoryid
        delete data.serverTagsoption
        delete data.customerinfo

        data.businesscategoryids.every(item => {
            if (item === 7) {
                tobacidexist = true
                return false
            } else {
                return true
            }
        })

        //doc validation....start
        // if (!fileurls['Company Documents']) {
        //     docerrors['companyregdoc'] = true
        //     doc_error = true
        // }
        // if (!fileurls['Personal ID']) {
        //     docerrors['personaliddoc'] = true
        //     doc_error = true
        // }
        // if (tobacidexist) {

        //     if (!fileurls['Facility ID']) {
        //         docerrors['FIDDOC'] = true
        //         doc_error = true
        //     }
        //     if (!fileurls['Economic Operator ID']) {
        //         docerrors['EOIDDOC'] = true
        //         doc_error = true
        //     }
        // }
        
        // if (!data['address']) {
        //     docerrors['address'] = true
        //     doc_error = true
        // }
        // if (!data.businesscategoryids.length) {
        //     docerrors['category'] = true
        //     doc_error = true
        // }

        // if (doc_error) {
        //     setdocerror(docerrors)
        //     return 0
        // }

        setloading(true)

        //image urls..
        // if (fileurls['Company Documents']) {
        //     data.companyregdoc = fileurls['Company Documents']
        // }
        // if (fileurls['Vat ID']) {
        //     data.vatdoc = fileurls['Vat ID']
        // }
        // if (fileurls['Personal ID']) {
        //     data.personaliddoc = fileurls['Personal ID']
        // }
        // if (fileurls['Facility ID']) {
        //     data.FIDDOC = fileurls['Facility ID']
        // }
        // if (fileurls['Economic Operator ID']) {
        //     data.EOIDDOC = fileurls['Economic Operator ID']
        // }
        // if (fileurls['Others']) {
        //     data.others = fileurls['Others']
        // }
        data.businessid = props.match.params.businessid

        useJwt.customerBusinessUpdate(data).then(res => {
            // console.log(res)
            Success(res)
            setloading(false)
            history.push("/business")
        }).catch(err => {
                setloading(false)
                const errres = err.response
                if (errres.status === 400) {
                    setservererror(errres.data.errors)
                }
                ErrorMessage(err)
            })

    }
    // console.log('userinput ', userinput)
    const handleCustomPostCode = (e) => {
        setuserinput({ ...userinput, country: '', address: '', city: '' })
        if (e.target.checked) {
            setCustomPostCode(false)
        } else {
            setCustomPostCode(true)

        }
    }
    const handleSearchAgain = (e) => {
        setshowCustomPostCode(false)
        setCustomPostCode(true)
    }
    return (
        <Fragment>

            {
                firstloading ? <Fragment>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </Fragment> : <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <Row>
                        <Col md='2' sm='2'>
                            <h4>Edit This Business</h4>
                        </Col>
                        <Col sm="5" >
                            <Button.Ripple className='ml-2' color='primary' tag={Link} to='/business'>
                                <ChevronLeft size={10} />
                                <span className='align-middle ml-50'>Back to List</span>
                            </Button.Ripple>
                            <Button.Ripple onClick={() => sessionStorage.setItem("customer_idx", userinput.customerinfo.idx)} className='ml-2' color='primary' tag={Link} to={`/AppUserAccess/${businessid}`}>
                                <User size={10} />
                                <span className='align-middle ml-50'>App User Access</span>
                            </Button.Ripple>

                        </Col>

                    </Row>

                    <Row style={{ marginTop: '10px' }}>
                        <Col sm='12'>
                            {/*about business start*/}
                            <Card>

                                <CardHeader>
                                    <CardTitle style={{ width: '100%' }} >
                                        <h4 style={{ float: 'left' }}>About Business</h4>
                                        <div style={{ float: 'right', fontSize: '12px' }}>
                                            <p>
                                                Created by : {userinput['createdby']}, {userinput['createddate'] ? getTimeStampToDateTime(userinput['createddate']) : null} <br />
                                                {
                                                    userinput['updatedby'] ? `Updated by : ${userinput['updatedby']}, ${userinput['updateddate'] ? getTimeStampToDateTime(userinput['updateddate']) : null}` : null
                                                }
                                            </p>
                                        </div>
                                    </CardTitle>
                                </CardHeader>

                                <CardBody>

                                    <Row>
                                        <Col md='6' sm='12'>
                                            <FormGroup>
                                                <Label for='bname'>Business Name <span style={{ color: 'red' }}>*</span></Label>
                                                <Input type='text'
                                                    name='businessname'
                                                    value={userinput['businessname'] || ''}
                                                    id='bname'
                                                    onChange={onChange}
                                                    placeholder='Business Name'
                                                    innerRef={register({ required: true })}
                                                    invalid={errors.businessname && true}
                                                />
                                                {errors && errors.businessname && <FormFeedback>{errors.businessname.message}</FormFeedback>}
                                            </FormGroup>
                                        </Col>
                                        {/* <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='firstname'>First Name <span style={{ color: 'red' }}>*</span></Label>
                                                <Input type='text'
                                                    name='firstname'
                                                    value={userinput['firstname'] || ''}
                                                    id='firstname'
                                                    onChange={onChange}
                                                    placeholder='First Name'
                                                    innerRef={register({ required: true })}
                                                    invalid={errors.firstname && true}
                                                />
                                                {errors && errors.firstname && <FormFeedback>{errors.firstname.message}</FormFeedback>}

                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='lastname'>Last Name <span style={{ color: 'red' }}>*</span></Label>
                                                <Input type='text'
                                                    name='lastname'
                                                    value={userinput['lastname'] || ''}
                                                    id='lastname'
                                                    onChange={onChange}
                                                    placeholder='Last Name'
                                                    innerRef={register({ required: true })}
                                                    invalid={errors.lastname && true}
                                                />
                                                {errors && errors.lastname && <FormFeedback>{errors.lastname.message}</FormFeedback>}

                                            </FormGroup>
                                        </Col> */}

                                        <Col md='6' sm='12'>
                                            <FormGroup>
                                                <Label for='status'>Status</Label>
                                                <div>
                                                    <CustomInput type='radio' id='exampleCustomRadio2' onChange={onChange} name='status' value="0" inline label='Pending' checked={+userinput['status'] === 0} />
                                                    <CustomInput type='radio' id='exampleCustomRadio3' onChange={onChange} name='status' value="5" inline label='Stopped' checked={+userinput['status'] === 5} />
                                                    <CustomInput type='radio' id='exampleCustomRadio' onChange={onChange} name='status' value="1" inline label='Active' checked={+userinput['status'] === 1} />

                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='mobile'>Mobile <span style={{ color: 'red' }}>*</span></Label>
                                                {/* <InputGroup className='input-group-merge'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            {window.PHONE_PREFIX}
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    </InputGroup> */}
                                                <Input
                                                    type='number'
                                                    name='mobile'
                                                    value={userinput['mobile'] || ''}
                                                    id='mobile'
                                                    style={servererror['mobile'] ? { border: '1px solid red' } : null}
                                                    onChange={onChange}
                                                    placeholder='Mobile'
                                                    innerRef={register({ required: true })}
                                                    invalid={errors.mobile && true}
                                                />
                                                {errors && errors.mobile && <FormFeedback>{errors.mobile.message}</FormFeedback>}
                                                {servererror && servererror.mobile && <span style={{ color: 'red' }}>{servererror.mobile}</span>}

                                            </FormGroup>
                                        </Col>
                                        {/* <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='telephone'>Telephone <span style={{ color: 'red' }}>*</span></Label>
                                                <Input type='number'
                                                    name='landline'
                                                    value={userinput['landline'] || ''}
                                                    id='telephone'
                                                    onChange={onChange}
                                                    placeholder='Telephone'
                                                    innerRef={register({ required: true })}
                                                    invalid={errors.landline && true}
                                                />
                                                {errors && errors.landline && <FormFeedback>{errors.landline.message}</FormFeedback>}
                                            </FormGroup>
                                        </Col>

                                        <Col md='6' sm='12'>
                                            <FormGroup>
                                                <Label for='postcode'>Post code {showCustomPostCode ? 'notfound in database' : ''}<span style={{ color: 'red' }}>*</span></Label>
                                                <InputGroup className='input-group-merge mb-2'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            <Search size={14} />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input type='text'
                                                        name='postcode'
                                                        value={userinput['postcode'] || ''}
                                                        id='postcode'
                                                        placeholder='Post code'
                                                        onChange={onChange}
                                                        required
                                                    // innerRef={register({ required: true })}
                                                    // invalid={errors.postcode && true}
                                                    />

                                                    <InputGroupAddon addonType='append'>
                                                        {
                                                            postcodefetching ? <Button style={{ paddingBottom: '9px' }} color='primary' outline disabled>
                                                                <Spinner color='primary' size='sm' />
                                                            </Button> : <Button color='primary' outline onClick={searchPostcode}>
                                                                Search
                                                            </Button>
                                                        }
                                                    </InputGroupAddon>
                                                    <div className="p-0 m-0 w-100">
                                                        {showCustomPostCode && !PostCodeError && <small style={{ color: 'red' }}> postcode notfound</small>}
                                                    </div>
                                                    <div className="p-0 m-0 w-100">
                                                        {PostCodeError && <small style={{ color: 'red' }}> postcode must be 6 to 8 character</small>}
                                                    </div>
                                                    {errors && errors.postcode && <FormFeedback>{errors.postcode.message}</FormFeedback>}
                                                </InputGroup>
                                                {showCustomPostCode && <CustomInput type='checkbox' id={'postcode1'} value={'CPC'} onChange={handleCustomPostCode} inline label='Add custom post code' />}
                                            </FormGroup>
                                        </Col> */}
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='email'>Email <span style={{ color: 'red' }}>*</span></Label>
                                                <Input type='email'
                                                    name='email'
                                                    value={userinput['email'] || ''}
                                                    id='email'
                                                    onChange={onChange} placeholder='Email'
                                                    innerRef={register({ required: true })}
                                                    invalid={errors.email && true}
                                                />
                                                {errors && errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}

                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12' className='mt-2'>
                                        <FormGroup>
                                            <CustomInput
                                            type='switch'
                                            id='web_login'
                                            name='web_login'
                                            label='Allow Web Login?'
                                            checked={userinput.web_login}
                                            onChange={(e) => {
                                                if (e.target.checked) { 
                                                    setuserinput({ ...userinput, web_login: true })
                                                } else {
                                                    setuserinput({ ...userinput, web_login: false })
                                                }
                                                }
                                            } 
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md='3' sm='12' className='mt-2'>
                                        <FormGroup>
                                            <CustomInput
                                            type='switch'
                                            id='allow_subtype'
                                            name='allow_subtype'
                                            label='Allow Subtype?'
                                            checked={userinput.allow_subtype}
                                            onChange={(e) => {
                                                if (e.target.checked) { 
                                                    setuserinput({ ...userinput, allow_subtype: true })
                                                } else {
                                                    setuserinput({ ...userinput, allow_subtype: false })
                                                }
                                                }
                                            } 
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md='6' sm='6'>
                                        <FormGroup>
                                            <Label for='businesscategories'>Business Category <span style={{ color: 'red' }}>*</span></Label>&nbsp;{docerror['category'] ? <Fragment><span style={{ color: 'red', fontSize: '11px' }}>Business Category is required</span></Fragment> : null
                                            }
                                            {
                                                businesscategorylist.length ? <Select
                                                    theme={selectThemeColors}
                                                    className='basic-multi-select'
                                                    classNamePrefix='select'
                                                    name="businesscategories"
                                                    defaultValue={businesscategorylist.filter(item => userinput.businesscategoryids.includes(item.value))[0]}
                                                    options={businesscategorylist}
                                                    onChange={businessCategoryOnChange}
                                                    // isMulti
                                                    isClearable={false}
                                                /> : <Spinner color='primary' />
                                            }

                                        </FormGroup>
                                    </Col>
                                    <Col md='4' sm='6'>
                                        <FormGroup>
                                            <Label for='service'>Service</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                className='basic-multi-select'
                                                classNamePrefix='select'
                                                name="service"
                                                value = {{ value: userinput.service_type_id, label: userinput.service_type }}
                                                options={ services.map(s => { return { value: s.service_id, label: `${s.service_keyword}: ${s.keyword_description}` } }) }
                                                onChange={e => setuserinput({ ...userinput, service_type: e.label, service_type_id: e.value }) }
                                                isLoading={services.length === 0}
                                            />
                                        </FormGroup>
                                    </Col>
                                        {/* <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='primarydepot'>Primary Depot</Label>
                                                {primarydepot.length ? <Select
                                                    theme={selectThemeColors}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name="depot_id"
                                                    onChange={depotChange}
                                                    defaultValue={primarydepot[0]}
                                                    options={primarydepot}
                                                    isClearable={false}
                                                /> : <Spinner color='primary' />
                                                }

                                            </FormGroup>
                                        </Col>

                                        <Col md='6' sm='12'>

                                            <FormGroup>
                                                <Label for='baddress'>Business Address <span style={{ color: 'red' }}>*</span></Label>
                                                {
                                                    businessaddress.length ? <Select
                                                        styles={{
                                                            control: (base, state) => ({
                                                                ...base,
                                                                borderColor: '#7367f0'
                                                            })
                                                        }}
                                                        theme={selectThemeColors}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        name="address"
                                                        required
                                                        onChange={addressChange}
                                                        // defaultValue={businessaddress[0]}
                                                        options={businessaddress}
                                                        isClearable={false}
                                                    /> : <Input type='text' required onChange={onChange} value={userinput['address'].split(",", 2) || ''} disabled={CustomPostCode} name='address' placeholder='Business Address' />}
                                                {
                                                    docerror['address'] ? <Fragment><span style={{ color: 'red', fontSize: '11px' }}>Business Address is required</span></Fragment> : null
                                                }
                                            </FormGroup>
                                        </Col>

                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='companyregisterno'>Company Register No.<span style={{ color: 'red' }}>*</span></Label>
                                                <Input
                                                    type='text'
                                                    name='companyregno'
                                                    value={userinput['companyregno'] || ''}
                                                    onChange={onChange}
                                                    id='companyregisterno'
                                                    placeholder='Company Register No.'
                                                    innerRef={register({ required: true })}
                                                    invalid={errors.companyregno && true}
                                                />
                                                {errors && errors.companyregno && <FormFeedback>{errors.companyregno.message}</FormFeedback>}

                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='vatno'>VAT No.</Label>
                                                <InputGroup className='input-group-merge'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            {"GB"}
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input type='text'
                                                        name='vatno'
                                                        value={userinput['vatno'] ? userinput['vatno'].substring(2) : ''}
                                                        id='vatno'
                                                        onChange={onChange}
                                                        placeholder='VAT No.'
                                                        innerRef={register({ required: true })}
                                                        invalid={errors.vatno && true}
                                                    />
                                                    {errors && errors.vatno && <FormFeedback>{errors.vatno.message}</FormFeedback>}
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>

                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='country'>Country <span style={{ color: 'red' }}>*</span></Label>
                                                <Input type='text'
                                                    required
                                                    name='country'
                                                    onChange={onChange}
                                                    value={userinput['country']}
                                                    disabled={CustomPostCode}
                                                    id='country'
                                                    placeholder='Country'
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='city'>City <span style={{ color: 'red' }}>*</span></Label>
                                                <Input type='text'
                                                    required
                                                    onChange={onChange}
                                                    name='city'
                                                    value={userinput.city}
                                                    disabled={CustomPostCode}
                                                    id='city'
                                                    placeholder='city' />
                                            </FormGroup>
                                        </Col>

                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='copid'>Economic Operator ID</Label>
                                                <InputGroup className='input-group-merge'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            {"QCGDLRE"}
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input type='text'
                                                        name='EOID'
                                                        value={userinput['EOID'] ? userinput['EOID'].substring(7) : ''}
                                                        id='copid'
                                                        onChange={onChange}
                                                        placeholder='Economic Operator ID'
                                                        innerRef={register({ required: false })}
                                                        invalid={errors.EOID && true}
                                                    />
                                                    {errors && errors.EOID && <FormFeedback>{errors.EOID.message}</FormFeedback>}
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='fid'>Facility ID</Label>
                                                <InputGroup className='input-group-merge'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            {"QCGDLRF"}
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input type='text'
                                                        name='FID'
                                                        value={userinput['FID'] ? userinput['FID'].substring(7) : ''}
                                                        id='fid'
                                                        onChange={onChange}
                                                        placeholder='Facility ID'
                                                        innerRef={register({ required: false })}
                                                        invalid={errors.FID && true}
                                                    />

                                                    {errors && errors.FID && <FormFeedback>{errors.FID.message}</FormFeedback>}
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>

                                        <Col md='6' sm='12'>
                                            <FormGroup>
                                                <Label for='premise'>Premise</Label>
                                                <div className="customradiocheck">
                                                    <CustomInput type='radio' id='premise' name='premise' value="Freehold" onChange={onChange} inline label='Freehold' checked={userinput['premise'] === 'Freehold'} />
                                                    <CustomInput type='radio' id='premise2' name='premise' value="Leasehold" onChange={onChange} inline label='Leasehold' checked={userinput['premise'] === 'Leasehold'} />
                                                </div>
                                            </FormGroup>
                                        </Col>

                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='sizeofstore'>Size of Store</Label>
                                                {
                                                    storesizelist.length ? <Select
                                                        theme={selectThemeColors}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        name="sizeofstoreid"
                                                        defaultValue={storesizelist[0]}
                                                        options={storesizelist}
                                                        onChange={(e) => {
                                                            const data = {
                                                                target: { name: 'sizeofstoreid', value: e.value }
                                                            }
                                                            onChange(data)
                                                        }}
                                                        isClearable={false}
                                                    /> : <Spinner color='primary' />
                                                }

                                            </FormGroup>
                                        </Col>

                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='memberofsymbolgroup'>Member of Symbol Group</Label>
                                                <Select
                                                    theme={selectThemeColors}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    {...memberofsymbolgroups}
                                                    options={vatexempt}
                                                    onChange={(e) => {
                                                        const data = {
                                                            target: { name: 'memberofsymbolgroup', value: e.value }
                                                        }
                                                        onChange(data)
                                                    }}
                                                    isClearable={false}
                                                />
                                            </FormGroup>
                                        </Col> */}

                                    </Row>

                                </CardBody>
                            </Card>
                            {/*about business end*/}

                            {/*business category start*/}
                            <Card>
                                {/* <CardHeader>
                                    <CardTitle tag='h4'>Business Category <span style={{ color: 'red' }}>*</span>  {
                                        docerror['category'] ? <Fragment><span style={{ color: 'red', fontSize: '11px' }}>Business Category is required</span></Fragment> : null
                                    }</CardTitle>
                                </CardHeader> */}

                                <CardBody>

                                    <Row>
                                        {/* <Col md='6' sm='6'>
                                            <FormGroup>
                                                <Label for='Businesstype'>Business Type</Label>
                                                <Select
                                                    theme={selectThemeColors}
                                                    className='basic-multi-select'
                                                    classNamePrefix='select'
                                                    name="Businesstype"
                                                    defaultValue={[{ value: userinput['businesstype'], label: userinput['businesstype'] }]}
                                                    options={[{ value: "Solo Trader", label: "Solo Trader" }, { value: "Partnership", label: "Partnership" }, { value: "Limited Company", label: "Limited Company" }]}
                                                    onChange={e => setuserinput({ ...userinput, businesstype: e.value })}
                                                    isClearable={false}
                                                />
                                            </FormGroup>
                                        </Col> */}
                                        <Col md='4' sm='6'>
                                            <FormGroup>
                                                <Label for='city'>Division</Label>
                                                <Select
                                                    theme={selectThemeColors}
                                                    className='basic-multi-select'
                                                    classNamePrefix='select'
                                                    name="city"
                                                    value = { { value: userinput.city_id, label: userinput.city } }
                                                    options={ divisions.map(d => { return { value: {id: d.id, dis: d.districts}, label: d.name } }) }
                                                    onChange={e => { 
                                                        setuserinput({ ...userinput, city: e.label, city_id: e.value.id })
                                                        setDistrict(e.value.dis) 
                                                    }}
                                                    isLoading={divisions.length === 0}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md='4' sm='6'>
                                            <FormGroup>
                                                <Label for='district'>District</Label>
                                                <Select
                                                    theme={selectThemeColors}
                                                    className='basic-multi-select'
                                                    classNamePrefix='select'
                                                    name="district"
                                                    value = { { value: userinput.district_id, label: userinput.district } }
                                                    options={ districts.map(d => { return { value: {id: d.id, thana: d.thana}, label: d.name } }) }
                                                    onChange={e => { 
                                                        setuserinput({ ...userinput, district: e.label, district_id: e.value.id })
                                                        setThana(e.value.thana) 
                                                    }}
                                                    isClearable={false}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md='4' sm='6'>
                                            <FormGroup>
                                                <Label for='thana'>Thana</Label>
                                                <Select
                                                    theme={selectThemeColors}
                                                    className='basic-multi-select'
                                                    classNamePrefix='select'
                                                    name="thana"
                                                    value = { { value: userinput.thana_id, label: userinput.thana } }
                                                    options={ thanas.map(t => { return { value: t.id, label: t.name } }) }
                                                    onChange={e => setuserinput({ ...userinput, thana: e.label, thana_id: e.value }) }
                                                    isClearable={false}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            {/*business category end*/}

                            {/*business type start*/}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Business Type</CardTitle>
                                </CardHeader>

                                <CardBody>

                                    <Row>
                                        <Col sm='12' md='12'>
                                            <FormGroup>

                                                <div>
                                                    <CustomInput type='radio' id='businesstype' onChange={onChange} name='businesstype' value="Solo Trader" inline label='Solo Trader' checked={userinput['businesstype'] === 'Solo Trader'} />
                                                    <CustomInput type='radio' id='businesstype2' onChange={onChange} name='businesstype' value="Partnership" inline label='Partnership' checked={userinput['businesstype'] === 'Partnership'} />
                                                    <CustomInput type='radio' id='businesstype3' onChange={onChange} name='businesstype' value="Limited Company" inline label='Limited Company' checked={userinput['businesstype'] === 'Limited Company'} />
                                                </div>
                                            </FormGroup>
                                        </Col>

                                    </Row>

                                </CardBody>
                            </Card> */}
                            {/*business type end*/}

                            {/*document up start*/}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Documents</CardTitle>
                                </CardHeader>

                                <CardBody>
                                    <Row className="customfileuploadstyle">

                                        <Col sm='12' md='3'>
                                            <FormGroup>
                                                <CustomInput type='radio' id='document' value="companyregdoc" name='document' inline label={<Fragment>Company Documents <span style={{ color: 'red' }}>*</span></Fragment>} checked={userinput.document === 'companyregdoc'} onChange={onDocumentChanged} />
                                                {
                                                    docerror['companyregdoc'] ? <Fragment><br /><span style={{ color: 'red', fontSize: '11px' }}>Company documents is required</span></Fragment> : null
                                                }
                                                {
                                                    userinput.document === 'companyregdoc' ? <DragDrop uppy={companydocuppy} /> : null
                                                }

                                            </FormGroup>
                                        </Col>

                                        <Col sm='12' md='2'>
                                            <FormGroup>
                                                <CustomInput type='radio' id='document2' value="personaliddoc" name='document' inline label={<Fragment>Personal ID <span style={{ color: 'red' }}>*</span></Fragment>} checked={userinput.document === 'personaliddoc'} onChange={onDocumentChanged} />
                                                {
                                                    docerror['personaliddoc'] ? <Fragment><br /><span style={{ color: 'red', fontSize: '11px' }}>Personal ID is required</span></Fragment> : null
                                                }

                                                {
                                                    userinput.document === 'personaliddoc' ? <DragDrop uppy={personalidimageuppy} /> : null
                                                }
                                            </FormGroup>
                                        </Col>

                                        <Col sm='12' md='2'>
                                            <FormGroup>
                                                <CustomInput type='radio' id='document3' value="vatdoc" name='document' inline label='Vat ID' checked={userinput.document === 'vatdoc'} onChange={onDocumentChanged} />
                                                {
                                                    userinput.document === 'vatdoc' ? <DragDrop uppy={vatidimageuppy} /> : null
                                                }
                                            </FormGroup>
                                        </Col>

                                        <Col sm='12' md='2'>
                                            <FormGroup>
                                                <CustomInput type='radio' id='document4' value="FIdoc" name='document' inline label='Facility ID' checked={userinput.document === 'FIdoc'} onChange={onDocumentChanged} />
                                                {
                                                    docerror['FIDDOC'] ? <Fragment><br /><span style={{ color: 'red', fontSize: '11px' }}>Facility ID is required</span></Fragment> : null
                                                }
                                                {
                                                    userinput.document === 'FIdoc' ? <DragDrop uppy={facilityimageuppy} /> : null
                                                }
                                            </FormGroup>
                                        </Col>

                                        <Col sm='12' md='3'>
                                            <FormGroup>
                                                <CustomInput type='radio' id='document5' value="EOIDdoc" name='document' inline label='Economic Operator ID' checked={userinput.document === 'EOIDdoc'} onChange={onDocumentChanged} />

                                                {
                                                    docerror['EOIDDOC'] ? <Fragment><br /><span style={{ color: 'red', fontSize: '11px' }}>Economic Operator ID is required</span></Fragment> : null
                                                }

                                                {
                                                    userinput.document === 'EOIDdoc' ? <DragDrop uppy={eoidimageuppy} /> : null
                                                }
                                            </FormGroup>
                                        </Col> */}

                                         {/* others */}
                                     {/* <Col sm='12' md='2'>
                                        <FormGroup>
                                            <CustomInput type='radio' id='document6' value="Others" name='document' inline label='Others' checked={userinput.document === 'Others'} onChange={onDocumentChanged} />
                                            {
                                                userinput.document === 'Others' ? <DragDrop uppy={othersimageuppy} /> : null
                                            }
                                        </FormGroup>
                                    </Col>  */}
                                    {/* others */}

                                    {/* </Row>

                                    <Row>
                                        <Col sm='12' md='12'>
                                            {fileuploadinformaton.length ? <Table borderless>
                                                <thead>
                                                    <tr>
                                                        <th>File</th>
                                                        <th>Name</th>
                                                        <th>Upload By</th>
                                                        <th>Add time</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        fileuploadinformaton.map((item, index) => <tr key={index}>
                                                            <th>{item.file}</th>
                                                            <th>
                                                                {item.name}<br />
                                                                <Progress value={uploadloder[item.file]}>{uploadloder[item.file]}%</Progress>
                                                            </th>
                                                            <th>{item.uploadby}</th>
                                                            <th>{item.uploaddatetime}</th>
                                                            <th><Fragment>
                                                                <a href={item.perview} target="_blank" ><Eye size={15} /></a> &nbsp; &nbsp;
                                                                <Trash size={15} onClick={(e) => removeImageFile(item.file)} style={{ cursor: 'pointer' }} />
                                                            </Fragment></th>
                                                        </tr>)
                                                    }
                                                </tbody>
                                            </Table> : null
                                            }
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card> */}
                            {/*document up end*/}

                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md='6' sm='12' className='mt-2'>
                                            <FormGroup>
                                                <CustomInput
                                                type='switch'
                                                id='group_select'
                                                name='group_select'
                                                label='Group Select Allow?'
                                                checked= {userinput.group_select}
                                                onChange={(e) => {
                                                    if (e.target.checked) { 
                                                        setuserinput({ ...userinput, group_select: true, campaign_select: false })
                                                    } else {
                                                        setuserinput({ ...userinput, group_select: false, selected_receiver_group_name: '', selected_receiver_group_id: '' })
                                                    }
                                                    }
                                                } 
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md='6' sm='6'>
                                        {
                                            (userinput.group_select && !userinput.campaign_select) &&  <FormGroup>
                                            <Label for='city'>Groups</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                className='basic-multi-select'
                                                classNamePrefix='select'
                                                name="group"
                                                value={ { value: userinput.selected_receiver_group_id, label: userinput.selected_receiver_group_name} }
                                                options={ groups.map(g => { return { value: g.id, label: g.group_name } }) }
                                                onChange={e => setuserinput({ ...userinput, selected_receiver_group_name: e.label, selected_receiver_group_id: e.value }) }
                                                isLoading={groups.length === 0}
                                            />
                                        </FormGroup>
                                        }
                                        </Col>
                                        <Col md='6' sm='12' className='mt-2'>
                                            <FormGroup>
                                                <CustomInput
                                                type='switch'
                                                id='campaign_select'
                                                name='campaign_select'
                                                label='Campaign Select Allow?'
                                                checked= {userinput.campaign_select}
                                                onChange={(e) => {
                                                    if (e.target.checked) { 
                                                        setuserinput({ ...userinput, campaign_select: true, group_select: false })
                                                    } else {
                                                        setuserinput({ ...userinput, campaign_select: false, selected_campaign_name: '', selected_campaign_id: '' })
                                                    }
                                                }
                                                } 
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md='6' sm='6'>
                                        {
                                            (!userinput.group_select && userinput.campaign_select) &&  <FormGroup>
                                            <Label for='campaigns'>Campaign</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                className='basic-multi-select'
                                                classNamePrefix='select'
                                                name="campaigns"
                                                value={ { value: userinput.selected_campaign_id, label: userinput.selected_campaign_name} }
                                                options={ campaigns.map(c => { return { value: c.commissionId, label: c.campaignName } }) }
                                                onChange={e => setuserinput({ ...userinput, selected_campaign_name: e.label, selected_campaign_id: e.value }) }
                                                isLoading={campaigns.length === 0}
                                            />
                                        </FormGroup>
                                        }
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Credential Configurations For Social Media AD</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Card>
                                        <CardHeader className='border-bottom'>
                                            <CardTitle tag='h4'>Facebook</CardTitle>
                                            <CustomInput onChange={(e) => {
                                                if (e.target.checked) {
                                                    setCollaps({...collaps, fb: true})
                                                } else {
                                                    setCollaps({...collaps, fb: false})
                                                }
                                            }} type='switch' id='fb' inline label='' />
                                        </CardHeader>
                                        {
                                            collaps.fb && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="app_id">App ID<span style={{color:'red'}}>*</span></Label>
                                                        {console.log(userinput)}
                                                        <Input type="text"
                                                            name="app_id"
                                                            id='app_id'
                                                            value={userinput['app_id']}
                                                            onChange={onChange}
                                                            innerRef={register({ required: true })}
                                                            invalid={errors.app_id && true}
                                                            placeholder="app id"
                                                        />
                                                    </FormGroup>
                                                    </Col>
                                                    <Col sm="6" >
                                                        <FormGroup>
                                                            <Label for="app_secret">App Secret<span style={{color:'red'}}>*</span></Label>
                                                            <Input type="text"
                                                                name="app_secret"
                                                                id='app_secret'
                                                                value={userinput?.app_secret}
                                                                onChange={onChange}
                                                                innerRef={register({ required: true })}
                                                                invalid={errors.app_secret && true}
                                                                placeholder="app secret"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col sm="6" >
                                                        <FormGroup>
                                                            <Label for="pageId">Page ID<span style={{color:'red'}}>*</span></Label>
                                                            <Input type="text"
                                                                name="pageId"
                                                                id='pageId'
                                                                value={userinput?.pageId}
                                                                onChange={onChange}
                                                                innerRef={register({ required: true })}
                                                                invalid={errors.pageId && true}
                                                                placeholder="Page id"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col sm="6" >
                                                        <FormGroup>
                                                            <Label for="adAccountId">Ad Account ID (required for facebook advertisement.)<span style={{color:'red'}}>*</span></Label>
                                                            <Input type="text"
                                                                name="adAccountId"
                                                                id='adAccountId'
                                                                value={userinput?.adAccountId}
                                                                onChange={onChange}
                                                                innerRef={register({ required: true })}
                                                                invalid={errors.adAccountId && true}
                                                                placeholder="ad account id"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col sm="6" >
                                                        <FormGroup>
                                                            <Label for="instagram_actor_id">Instagram Actor ID<span className='text-danger'>*</span></Label>
                                                            <Input type="text"
                                                                name="instagram_actor_id"
                                                                id='instagram_actor_id'
                                                                value={userinput.instagram_actor_id}
                                                                onChange={onChange}
                                                                innerRef={register({ required: true })}
                                                                invalid={errors.instagram_actor_id && true}
                                                                placeholder="instagram actor id"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col sm="6" >
                                                        <FormGroup>
                                                            <Label for="user_token">User Token<span style={{color:'red'}}>*</span></Label>
                                                            <Input type="textarea"
                                                                rows = "6"
                                                                name="user_token"
                                                                id='user_token'
                                                                value={userinput?.user_token}
                                                                onChange={onChange}
                                                                innerRef={register({ required: true })}
                                                                invalid={errors.user_token && true}
                                                                placeholder="user token"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        }
                                    </Card>
                                    <Card>
                                        <CardHeader className='border-bottom'>
                                            <CardTitle tag='h4'>Google</CardTitle>
                                            <CustomInput onChange={(e) => {
                                                if (e.target.checked) {
                                                    setCollaps({...collaps, google: true})
                                                } else {
                                                    setCollaps({...collaps, google: false})
                                                }
                                            }} type='switch' id='google' inline label='' />
                                        </CardHeader>
                                        {
                                            collaps.google && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="4" >
                                                    <FormGroup>
                                                        <Label for="currency_code">Currency<span style={{ color: 'red' }}>*</span></Label>
                                                        <Select
                                                            ref={ref2}
                                                            theme={selectThemeColors}
                                                            maxMenuHeight={200}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            value={{value:'', label: userinput?.currency_code}}
                                                            onChange={(selected) => {
                                                                setuserinput({ ...userinput, currency_code: selected.value })
                                                            }}
                                                            options={ currency.map(c => { return { value: c.CurrencyCode, label: c.CurrencyName } })}
                                                        />
                                                    </FormGroup>
                                                    <Input
                                                        required
                                                        style={{
                                                            opacity: 0,
                                                            width: "100%",
                                                            height: 0
                                                        }}
                                                        onFocus={e => ref2.current.select.focus()}
                                                        value={userinput?.currency_code || ''}
                                                        onChange={e => ''}
                                                    />
                                                </Col>
                                                <Col sm="4" >
                                                    <FormGroup>
                                                        <Label for="time_zone">Time Zone<span style={{ color: 'red' }}>*</span></Label>
                                                        <Select
                                                            ref={ref3}
                                                            theme={selectThemeColors}
                                                            maxMenuHeight={200}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            value={{value:'', label: userinput?.time_zone}}
                                                            onChange={(selected) => {
                                                                setuserinput({ ...userinput, time_zone: selected.value })
                                                            }}
                                                            options={ googleTimezoneList.map(gtl => { return { value: gtl.Timezone, label: gtl.Timezone } })}
                                                        />
                                                    </FormGroup>
                                                    <Input
                                                        required
                                                        style={{
                                                            opacity: 0,
                                                            width: "100%",
                                                            height: 0
                                                        }}
                                                        onFocus={e => ref3.current.select.focus()}
                                                        value={userinput.time_zone || ''}
                                                        onChange={e => ''}
                                                    />
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        }
                                    </Card>
                                    <Card>
                                        <CardHeader className='border-bottom'>
                                            <CardTitle tag='h4'>Email</CardTitle>
                                            <CustomInput onChange={(e) => {
                                                if (e.target.checked) {
                                                    setCollaps({...collaps, email: true})
                                                } else {
                                                    setCollaps({...collaps, email: false})
                                                }
                                            }} type='switch' id='email-ad' inline label='' />
                                        </CardHeader>
                                        {
                                            collaps.email && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="email_address">Email Address<span style={{color:'red'}}>*</span></Label>
                                                        <Input type="text"
                                                            name="email_address"
                                                            id='email_address'
                                                            value={userinput?.email_address}
                                                            onChange={onChange}
                                                            innerRef={register({ required: true })}
                                                            invalid={errors.email_address && true}
                                                            placeholder="email_address"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="email_password">Email Password<span style={{color:'red'}}>*</span></Label>
                                                        <Input type="text"
                                                            name="email_password"
                                                            id='email_password'
                                                            value={userinput?.email_password}
                                                            onChange={onChange}
                                                            innerRef={register({ required: true })}
                                                            invalid={errors.email_password && true}
                                                            placeholder="email_password"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="4" >
                                                    <FormGroup>
                                                        <Label for="email_port">Email Port<span style={{color:'red'}}>*</span></Label>
                                                        <Input type="number"
                                                            name="email_port"
                                                            id='email_port'
                                                            value={userinput?.email_port}
                                                            onChange={onChange}
                                                            innerRef={register({ required: true })}
                                                            invalid={errors.email_port && true}
                                                            placeholder="email_port"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="4" >
                                                    <FormGroup>
                                                        <Label for="email_config_type">Email Configure Type<span style={{ color: 'red' }}>*</span></Label>
                                                        <Select
                                                            ref={ref1}
                                                            theme={selectThemeColors}
                                                            maxMenuHeight={200}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            value={{ value: userinput?.email_config_type, label: userinput.email_config_type === 1 ? 'Service' : userinput.email_config_type === 2 ? 'Host' : 'Select' }}
                                                            onChange={(selected) => {
                                                                setuserinput({ ...userinput, email_config_type: selected.value })
                                                            }}
                                                            options={[{ value: 1, label: 'Service' }, { value: 2, label: 'Host'}]}
                                                        />
                                                    </FormGroup>
                                                    <Input
                                                        required
                                                        style={{
                                                            opacity: 0,
                                                            width: "100%",
                                                            height: 0
                                                        }}
                                                        onFocus={e => ref1.current.select.focus()}
                                                        value={userinput.email_config_type || ''}
                                                        onChange={e => ''}
                                                    />
                                                </Col>
                                                { userinput.email_config_type === 1 && <Col sm="4" >
                                                    <FormGroup>
                                                        <Label for="email_service">Email Service<span style={{color:'red'}}>*</span></Label>
                                                        <Input type="text"
                                                            name="email_service"
                                                            id='email_service'
                                                            value={userinput?.email_service}
                                                            onChange={onChange}
                                                            innerRef={register({ required: true })}
                                                            invalid={errors.email_service && true}
                                                            placeholder="email_service"
                                                        />
                                                    </FormGroup>
                                                </Col> }
                                                { userinput.email_config_type === 2 && <Col sm="4" >
                                                    <FormGroup>
                                                        <Label for="email_host">Email Host<span style={{color:'red'}}>*</span></Label>
                                                        <Input type="text"
                                                            name="email_host"
                                                            id='email_host'
                                                            value={userinput?.email_host}
                                                            onChange={onChange}
                                                            innerRef={register({ required: true })}
                                                            invalid={errors.email_host && true}
                                                            placeholder="email_host"
                                                        />
                                                    </FormGroup>
                                                </Col> }
                                            </Row>
                                        </CardBody>
                                        }
                                    </Card>
                                    <Card>
                                        <CardHeader className='border-bottom'>
                                            <CardTitle tag='h4'>Push Notification</CardTitle>
                                            <CustomInput onChange={(e) => { 
                                                    if (e.target.checked) {
                                                        setCollaps({...collaps, fcm: true})
                                                    } else {
                                                        setCollaps({...collaps, fcm: false})
                                                    }
                                                }} type='switch' id='fcm' inline label='' />
                                        </CardHeader>
                                        {
                                            collaps.fcm && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="6" >
                                                        <FormGroup>
                                                            <Label for="fcm_server_ring">FCM Server Key<span style={{color:'red'}}>*</span></Label>
                                                            <Input type="text"
                                                                name="fcm_server_ring"
                                                                id='fcm_server_ring'
                                                                value={userinput?.fcm_server_ring}
                                                                onChange={onChange}
                                                                innerRef={register({ required: true })}
                                                                invalid={errors.fcm_server_ring && true}
                                                                placeholder="fcm server key"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        }
                                    </Card>
                                </CardBody>
                            </Card>

                            {/*marketing preferance start*/}
                            <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Marketing Preference</CardTitle>
                                </CardHeader>

                                <CardBody>

                                    <Row>
                                        {
                                            marketingpreferancelist.length ? marketingpreferancelist.map((item, index) => <Col sm='12' md='2' key={index}>
                                                <CustomInput inline type='checkbox' id={`marketingpreference${index}`} value={item.id} onChange={marketingPrefOnChange} label={item.statusdesc} checked={userinput.marketing_preference_ids.includes(item.id)} />
                                            </Col>) : <Spinner color='primary' />
                                        }

                                    </Row>

                                </CardBody>
                            </Card>
                            {/*marketing preferance end*/}

                            {/*customer tag start*/}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Customer Tags</CardTitle>
                                </CardHeader>

                                <CardBody>

                                    {
                                        taglist.length ? <Fragment>

                                            <Row>
                                                <Col sm='12' md='5'>
                                                    <Select
                                                        theme={selectThemeColors}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        options={userinput.serverTagsoption}
                                                        isClearable={false}
                                                        name='selecttag'
                                                        onChange={(e) => {
                                                            const data = {
                                                                target: { name: 'selecttag', value: e.value }
                                                            }
                                                            onChange(data)
                                                        }}
                                                    />
                                                </Col>
                                                <Col sm='12' md='2'>
                                                    <Button.Ripple className='mr-1' color='primary' type='button' onClick={e => AddTags(e)} >Add</Button.Ripple>
                                                </Col>

                                            </Row>

                                            <Row style={{ marginTop: '25px' }} className="customanttag">
                                                <Col sm='12' md='12'>
                                                    {
                                                        userinput.tags.map((tag, index) => <Tag
                                                            key={index}
                                                            closable
                                                            onClose={e => {
                                                                // console.log('m ', tag)
                                                                e.preventDefault()
                                                                removeTag(tag)
                                                            }
                                                            }
                                                        >
                                                            <span>
                                                                {tag.length > 20 ? `${tag.slice(0, 20)}...` : tag}
                                                            </span>
                                                        </Tag>

                                                        )
                                                    }

                                                </Col>

                                            </Row>
                                        </Fragment> : <Spinner color='primary' />
                                    }


                                </CardBody>
                            </Card> */}
                            {/*customer tag end*/}

                            {/*comment start*/}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Comment</CardTitle>
                                </CardHeader>

                                <CardBody>

                                    <Row >
                                        <Col sm='12' md='10'>
                                            <Input type='text' value={singlecomment} placeholder='Comment...' onChange={e => setsinglecomment(e.target.value)} />
                                        </Col>
                                        <Col sm='12' md='2'>
                                            <Button.Ripple className='mr-1' color='primary' type='button' onClick={e => Addcomments(e)}>
                                                Add
                                            </Button.Ripple>
                                        </Col>

                                    </Row>
                                    <Row style={{ marginTop: '15px' }} className="customanttag">
                                        {
                                            comments.map((comment, index) => <Col sm='12' md='12' key={index} style={{ marginTop: '10px' }}>
                                                <Tag
                                                    key={comment}
                                                    closable
                                                    onClose={() => removeComment(comment)}
                                                >
                                                    <span>
                                                        {comment}
                                                    </span>
                                                </Tag>
                                                <Card className="w-100 p-1">
                                                    <div className="d-flex justify-content-between w-100">
                                                        <p>
                                                            {comment}
                                                        </p>
                                                        <div title='remove' style={{ cursor: 'pointer', color: 'red' }} onClick={() => removeComment(comment)}>x</div>
                                                        <Trash size={15} color='red' style={{ cursor: 'pointer' }}  onClick={() => removeComment(comment)} />
                                                    </div>
                                                </Card>
                                            </Col>)
                                        }

                                    </Row>

                                    <Row className="customanttag">
                                        {
                                            customercomment.map((comment, index) => <Col sm='12' md='12' key={index} >
                                                <Card >
                                                    <CardBody>
                                                        <span>
                                                            {comment['username']} &nbsp; &nbsp; {getTimeStampToDateTime(comment['createdat'])} <br />
                                                        </span>
                                                        <span>
                                                            {comment['comment']}
                                                        </span>
                                                    </CardBody>
                                                </Card>
                                            </Col>)
                                        }

                                    </Row>

                                </CardBody>
                            </Card> */}
                            {/*comment end*/}

                        </Col>

                        <Col sm='12' md={{ span: 2, offset: 10 }} >
                            <FormGroup className='d-flex mb-0'>
                                {
                                    loading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple type='submit' className='mr-1' color='primary'  >
                                        Update
                                    </Button.Ripple>
                                }

                            </FormGroup>
                        </Col>

                    </Row>
                </Form>
            }
        </Fragment>
    )
}
export default EditBusiness
