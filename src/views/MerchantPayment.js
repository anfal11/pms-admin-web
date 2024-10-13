import React, { useEffect, useState } from 'react'
import useJwt from '@src/auth/jwt/useJwt'
import { Link, useHistory } from 'react-router-dom'

const MerchantPayment = () => {
    const history = useHistory()
    const [src, setSrc] = useState('')
    const redirect_url = 'http://merchant.tukitaki.online:9003/business'
    const [count, setcount] = useState(0)

    const onLoadfun = () => {
        if (count === 0) {
            setcount(1)
        } else {
            history.push('./business')
        }
    }
    
    useEffect(() => {
        const postData = {
            merchent_code: 'M65419',
            password: '123banna',
            amount: 2,
            redirect_url,
            reference_id: 'test'
        }
        useJwt.merchent_pay(postData).then(res => {
            setSrc(res.data.payload.authorisation_url)

        }).catch(err => {
            console.log(err)
        })
    }, [])
    return (
        <div>

            <iframe onLoad={e => onLoadfun(e)} frameBorder="0" src={src} height="600px" width="100%" id='iFrameID' title="Iframe Example"></iframe>

        </div>
    )
}

export default MerchantPayment