import React, { Component } from 'react'
import classNames from 'classnames/bind'

const InformacjeZSerwera = (props) => {
    const { raportujZlecenie } = props
    const error = raportujZlecenie.serverInfo && raportujZlecenie.serverInfo.error
    const ok = raportujZlecenie.serverInfo && raportujZlecenie.serverInfo.ok
    //console.log('InformacjeZSerwera: ' + (raportujZlecenie.serverInfo && (raportujZlecenie.serverInfo.error || raportujZlecenie.serverInfo.ok)))

    // if (raportujZlecenie.wlasnieOdczytano === 'pracownik') {
    //     return (
    //         <div className='server_info odczytano_dane'>
    //             <div style={{ margin: 'auto', verticalAlign: 'middle', height: 100+'%' }}>
    //             Odczytano pracownika
    //             </div>
    //         </div>
    //     )        
    // }

    return (
        <div className={classNames(
            {
                'server_info': true,
                'niepoprawne_dane': error,
                'odczytano_dane': ok,
            })}>
            {raportujZlecenie.serverInfo && (raportujZlecenie.serverInfo.error || raportujZlecenie.serverInfo.ok)}
        </div>
        )
}

export default InformacjeZSerwera