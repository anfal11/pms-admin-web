import React, { Fragment, useEffect, useRef } from 'react'

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import FacebookIcon from '@src/assets/images/icons/facebook_icon.png'

const FacebookCustomLogin = ({appId, userInput, setUserInput, setHaveFacebookResponse }) => {

    const facebookLogin = useRef()

    return (
        <Fragment>
            <div style={{display: 'none'}}>
             <FacebookLogin
                appId= {appId}
                autoLoad={false}
                fields="name,email,picture"
                scope="public_profile,pages_manage_posts,pages_manage_metadata"
                cookie={false}
                state={'ren'}
                callback={(res) => {
                    if (res['userID']) {
                        setHaveFacebookResponse(true)
                        console.log('facebook login response : ', res)
                        setUserInput({ ...userInput, facebook_user_id:res.userID, user_access_token: res.accessToken}) 
                    }
                }}
                render={renderProps => (
                    <button type='button' onClick={renderProps.onClick}  ref={facebookLogin}>FB Login</button>
                    )}
            
            />
            </div>

            <div style={{textAlign:'center'}} className="facebookconnectDiv">
                <img src={FacebookIcon}/>
                <p style={{paddingTop:10 }}>Facebook Access</p>
                {
                    userInput.page_name ? <p style={{marginTop: '-10px'}}>{userInput.page_name}</p> : null
                }
                
                <button  type='button' className="facebbokConnectBtn" onClick={() => facebookLogin.current.click()} ><p>{(userInput.page_access_token) ? "Connected" : "Connect"}</p></button>
            </div>
        </Fragment>
    )
}

export default FacebookCustomLogin