class RaportujLaser {
    constructor() {
        this.scanInput = ''
        this.liczba_powtorzen = 2
        this.employeeId = -1
        this.employee = {}
        this.kartaProgramu = {}
        this.pracePracownika = []
        this.detaleProgramu = []
    }

    setter = (changes) => {
        Object.keys(changes).forEach(key => {
            console.log('RaportujLaser.setter(' + key + ', ' + changes[key] + ')')

            this[key] = changes[key]
            //koszt.onFieldChange(key, changes[key]))
        })
        return this
    }

    getEmployeeFulname = () => {
        return this.employee.surname ? this.employee.surname + ' ' + this.employee.name : ''
    }

    isPracownikOdczytany = () => {
        return this.employee.id
    }

    isProgramOdczytany = () => {
        return this.kartaProgramu.idProgramu
    }

    czyPracownikMaRozpoczetePrace = () => {
        return this.pracePracownika.length > 0
    }

    czyPracownikPracujeJuzNadProgramem = (id_karta_programu) => {
        return this.pracePracownika.some(praca => praca.id_karta_programu === id_karta_programu)
    }

    wyslijNaSerwer = (additionalFields, promiseHandler, errorHandler) => {
        const doWyslania = Object.assign({ ...this }, { ...additionalFields })
        delete doWyslania.employee
        delete doWyslania.kartaProgramu
        delete doWyslania.pracePracownika
        delete doWyslania.serverInfo
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
                    const error_message = json.error_message
                    const errorCause = json.cause
                    this.errorCause = json.cause
                    return Promise.reject({ error_message, errorCause })
                }
                const fromServer = json
                //console.log('RaportujLaser.wyslijNaSerwer fromServer', fromServer)
                fromServer.idEmployee = fromServer.employee ? fromServer.employee.id : ''
                fromServer.idProgramu = fromServer.kartaProgramu ? fromServer.kartaProgramu.idProgramu : ''
                this.pracePracownika = fromServer.pracePracownika

                // this.employee = fromServer.employee
                // this.idEmployee = fromServer.employee ? fromServer.employee.id : ''
                // this.idProgramu = fromServer.kartaProgramu ? fromServer.kartaProgramu.idProgramu : ''
                // this.kartaProgramu = fromServer.kartaProgramu
                // this.serverInfo = fromServer.serverInfo

                promiseHandler(fromServer)
            })
            .catch(error => errorHandler(error))
    }
}

export default RaportujLaser