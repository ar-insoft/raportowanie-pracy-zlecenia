class RaportujZlecenie {
    constructor() {
        this.scanInput = ''
        //this.employeeId = -1
        this.employee = {}
        this.orderProductionSystemObject = {}
        this.productOrComponentSystemObject = {}
        this.productionOperationSchedule = {}
        this.praceRozpoczetePrzezPracownika = []
    }

    setter = (changes) => {
        Object.keys(changes).forEach(key => {
            //console.log('RaportujZlecenie.setter(' + key + ', ' + changes[key] + ')')

            this[key] = changes[key]
        })
        return this
    }

    getEmployeeFulname = () => {
        return this.employee.surname ? this.employee.surname + ' ' + this.employee.name : ''
    }

    isScanCodeAnuluj = () => {
        return typeof this.scanInput === 'string' && this.scanInput.toUpperCase() === 'ANULUJ'
    }

    isScanCodeStart = () => {
        return typeof this.scanInput === 'string' && this.scanInput.toUpperCase() === 'START'
    }

    isScanCodePrzerwij = () => {
        return typeof this.scanInput === 'string' && this.scanInput.toUpperCase() === 'PRZERWIJ'
    }

    isActionStartEnabled = () => {
        return this.isOperacjaDoRozpoczeciaPracy() && this.isPracownikOdczytany()
    }

    isActionPrzerwijEnabled = () => {
        const pracePracownika = this.praceRozpoczetePrzezPracownika
        const jestPojedynczaOperacjaDoZakonczenia = pracePracownika && pracePracownika.length === 1
        return jestPojedynczaOperacjaDoZakonczenia
    }

    isPracownikOdczytany = () => {
        return this.employee.id
    }

    isZlecenieOdczytane = () => {
        return this.orderProductionSystemObject.id_system_object
    }

    zlecenieOpis = () => {
        return this.orderProductionSystemObject.id_system_object 
        ? this.orderProductionSystemObject.object_index + ' / ' + this.orderProductionSystemObject.title 
        : ''
    }

    isElementOdczytany = () => {
        return this.productOrComponentSystemObject.id_system_object
    }

    elementOpis = () => {
        return this.productOrComponentSystemObject.id_system_object 
        ? this.productOrComponentSystemObject.object_index + ' / ' + this.productOrComponentSystemObject.title 
        : ''
    }

    isOperacjaOdczytana = () => {
        return this.productionOperationSchedule.id
    }

    isOperacjaDoRozpoczeciaPracy = () => {
        return this.wybrana_operacja_elementu_glownego > 0
    }

    operacjaOpis = () => {
        return this.isOperacjaOdczytana() 
        ? this.productionOperationSchedule.object_index + ' / ' + this.productionOperationSchedule.title 
        : ''
    }

    wyslijNaSerwer = (additionalFields, promiseHandler, errorHandler) => {
        const doWyslania = Object.assign({ ...this }, { ...additionalFields })
        doWyslania.idEmployee = this.employee.id
        delete doWyslania.employee

        delete doWyslania.obiektyTestowe
        delete doWyslania.praceRozpoczetePrzezPracownika
        delete doWyslania.serverInfo

        doWyslania.confirmation_number = additionalFields.confirmation_number || this.productionOperationSchedule.confirmation_number
        //console.log('doWyslania.confirmation_number', doWyslania.confirmation_number)
        doWyslania.idZlecenie = this.orderProductionSystemObject.id_system_object
        delete doWyslania.orderProductionSystemObject
        doWyslania.idElement = this.productOrComponentSystemObject.id_system_object
        delete doWyslania.productOrComponentSystemObject

        delete doWyslania.zadanieDoWykonania
        delete doWyslania.productionOperationSchedule
        delete doWyslania.operacjeElementuGlownego

        const doWyslaniaJson = JSON.stringify(doWyslania)

        fetch('/eoffice/production/raportowanie_pracy_zlecenia/raportowanie_pracy_zlecenia_json_endpoint.xml?action=analizuj_skan_kodu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' //'Content-Type': 'application/json' 
            },
            body: 'raportujZlecenieBody=' + doWyslaniaJson
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json()
            })
            .then(json => {
                if (json.is_request_successful === false) {
                    const error = json
                    const error_message = error.error_message
                    const errorCause = error.cause
                    this.errorCause = error.cause
                    return Promise.reject(error) //{ error_message, errorCause }
                }
                const fromServer = json
                console.log('RaportujZlecenie.wyslijNaSerwer fromServer', fromServer)
                //fromServer.idEmployee = fromServer.employee ? fromServer.employee.id : ''
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

export default RaportujZlecenie