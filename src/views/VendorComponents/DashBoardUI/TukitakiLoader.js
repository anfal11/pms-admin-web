import React from 'react'
import './Dashboard.scss'
import themeConfig from '@configs/themeConfig'

const TukitakiLoader = ({ style }) => {
    return (
        <div className="background" style={style}>
            <img src={themeConfig.app.appLogoImage} alt='logo'
                style={{ height: '90px', width: '90px' }} />
        </div>
    )
}

export default TukitakiLoader