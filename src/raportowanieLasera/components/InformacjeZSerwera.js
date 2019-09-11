import React, { Component } from 'react'
import classNames from 'classnames/bind'

const InformacjeZSerwera = (props) => {
    const { raportujZlecenie } = props
    const error = raportujZlecenie.blad
    const ok = raportujZlecenie.serverInfo && raportujZlecenie.serverInfo.ok

    return (
        <div className={classNames(
            {
                'server_info': true,
                'niepoprawne_dane': error,
                'odczytano_dane': ok,
            })}>
            {raportujZlecenie.blad || (raportujZlecenie.zadanieDoWykonania && raportujZlecenie.zadanieDoWykonania.info)}
        </div>
        )
}

export default InformacjeZSerwera