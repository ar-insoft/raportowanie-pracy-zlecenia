

class DataProvider {

    static testKonfiguracji = (promiseHandler) => {
        fetch('/eoffice/production/raportowanie_produkcji_lasera/raportowanie_produkcji_lasera_json_endpoint.xml?action=test_konfiguracji')
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json()
            })
            .then(json => {
                if (json.is_request_successful === false) {
                    return Promise.reject(json.error_message)
                }
                const fromServer = json
                promiseHandler(fromServer)
            })
    }

    static wyslijSkanNaSerwer = (raportujLaser, additionalFields, promiseHandler, errorHandler) => {
        const doWyslania = Object.assign({ ...raportujLaser }, { ...additionalFields })
        delete doWyslania.employee
        delete doWyslania.kartaProgramu
        const doWyslaniaJson = JSON.stringify(doWyslania)

        fetch('/eoffice/production/raportowanie_produkcji_lasera/raportowanie_produkcji_lasera_json_endpoint.xml?action=analizuj_skan_kodu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' //'Content-Type': 'application/json' 
            },
            body: 'raportujLaserBody=' + doWyslaniaJson
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json()
            })
            .then(json => {
                if (json.is_request_successful === false) {
                    return Promise.reject(json.error_message)
                }
                const fromServer = json
                //console.log('RaportujLaser.wyslijNaSerwer fromServer', fromServer)
                //if (fromServer.employee)
                this.employee = fromServer.employee
                this.idEmployee = fromServer.employee ? fromServer.employee.id : ''
                this.idProgramu = fromServer.kartaProgramu ? fromServer.kartaProgramu.idProgramu : ''
                this.kartaProgramu = fromServer.kartaProgramu
                this.pracePracownika = fromServer.pracePracownika
                this.wlasnieOdczytano = fromServer.wlasnieOdczytano
                this.serverInfo = fromServer.serverInfo

                promiseHandler(fromServer)
            })
            .catch(error => errorHandler(error))
    }

}

export default DataProvider