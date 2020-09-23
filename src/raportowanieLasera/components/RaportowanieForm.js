import React, { Component } from 'react'
import { Form, Input, Button, Table, Container, Radio, Header, Confirm, Icon, Segment, Item } from 'semantic-ui-react'
import { toast } from 'react-toastify'
import classNames from 'classnames/bind'
import preval from 'preval.macro'
import logo from '../../bar-code.png';
import './RaportowanieForm.css'
import RaportujZlecenie from '../modules/RaportujZlecenie'
import DataProvider from '../modules/DataProvider'
import InformacjeZSerwera from './InformacjeZSerwera'
import { afterSecondsOf, countDownSecondsOnTickOnComplete } from '../modules/Timers'
import ConfirmButton from './ConfirmButton'
//import InnerState from '../../tools/InnerState'
import { Tlumaczenia } from '../../tools/Tlumaczenia'

class RaportowanieForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            raportujZlecenie: new RaportujZlecenie(),
            bladTransmisji: '',
            wlasnieOdczytanoPracownika: false,
            odswiezenieStronyZa: 0,
            odswiezenieStronySubscription: null
        }

        this.textInput_liczba_powtorzen = React.createRef();
        this.scanInputRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    componentDidMount() {
        DataProvider.testKonfiguracji(fromServer => {
            //console.log('RaportowanieForm.componentDidMount', !fromServer.konfiguracja_poprawna, fromServer)
            if (!fromServer.konfiguracja_poprawna) {
                this.setState({ raportujLaser: Object.assign(this.state.raportujLaser, fromServer) })
            }
        })
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        //console.log('RaportowanieForm.handleInputChange ', e, e.target)
        //console.log('RaportowanieForm.handleInputChange (' + name + ', ' + value + ')')
        this.handleChange(name, value)
        //this.setState({ raportujZlecenie: this.state.raportujZlecenie.setter({ [name]: value }) });
    }

    handleChange = (name, value) => {
        //console.log('RaportowanieForm.handleChange ', name, value)
        this.setState({ raportujZlecenie: this.state.raportujZlecenie.setter({ [name]: value }) });
    }

    handleKeyOnScan = (event) => {
        var char = event.which || event.keyCode;
        //console.log('handleKeyOnScan '+ char)
        if (char === 13) this.handleScan()
        else this.wyswietlLicznikIOdswiezStroneZa(30);
    }

    rozpocznijLaczenieZSerwerem = () => {
        this.zatrzymajLicznikOdswiezeniaStrony();
        this.setState({ isLoading: true, raportujZlecenie: Object.assign(this.state.raportujZlecenie, { serverInfo: {} }) })
    }

    handleScan = () => {
        const raportujZlecenie = this.state.raportujZlecenie
        if (raportujZlecenie.isScanCodeAnuluj()) {
            this.handleAnuluj()
            return
        }
        if (raportujZlecenie.isScanCodeStart() && !raportujZlecenie.isActionStartEnabled()) {
            this.resetujPoleTekstoweSkanowania();
            this.focusPoleTekstoweSkanowania();
            return
        }
        if (raportujZlecenie.isScanCodePrzerwij() && !raportujZlecenie.isActionPrzerwijEnabled()) {
            this.resetujPoleTekstoweSkanowania();
            this.focusPoleTekstoweSkanowania();
            return
        }
        if (raportujZlecenie.isScanCodeZakoncz()) {
            this.resetujPoleTekstoweSkanowania();
            this.focusPoleTekstoweSkanowania();
            return
        }
        this.rozpocznijLaczenieZSerwerem()
        this.state.raportujZlecenie.wyslijNaSerwer({},
            fromServer => {
                this.setState({ raportujZlecenie: Object.assign(this.state.raportujZlecenie, fromServer), isLoading: false })

                if (fromServer.serverInfo && fromServer.serverInfo.cause) {
                    toast.error(<span>Błąd: {fromServer.serverInfo.cause}</span>);
                }
                if (fromServer.serverInfo && fromServer.serverInfo.error === 'Nie znaleziono pracownika lub programu') {
                    this.wyswietlLicznikIOdswiezStroneZa(4);
                }
                else {
                    if (fromServer.wlasnieOdczytano === 'pracownik') {
                        this.setState({ wlasnieOdczytanoPracownika: true })
                        afterSecondsOf(3).subscribe(x => this.setState({ wlasnieOdczytanoPracownika: false }))
                    }
                    this.wyswietlLicznikIOdswiezStroneZa(30);
                    this.resetujPoleTekstoweSkanowania();
                    this.focusPoleTekstoweSkanowania();
                }
            }, error => {
                this.wyswietlKomunikatBledu(error)
                this.setState({ isLoading: false })
                this.wyswietlLicznikIOdswiezStroneZa(30);
                this.resetujPoleTekstoweSkanowania();
                this.focusPoleTekstoweSkanowania();
            })
    }

    handleRozpocznijPrace = () => {
        this.rozpocznijLaczenieZSerwerem()
        this.resetujPoleTekstoweSkanowania();
        this.focusPoleTekstoweSkanowania();

        this.state.raportujZlecenie.wyslijNaSerwer(
            { rozpocznij_prace: 1 },
            fromServer => {
                this.setState({ raportujLaser: Object.assign(this.state.raportujLaser, fromServer), isLoading: false });
                this.wyswietlLicznikIOdswiezStroneZa(30);
            }, error => {
                this.wyswietlKomunikatBledu(error)
                this.setState({ isLoading: false });
            })
    }

    handlePrzerwijPrace = (idOperacji) => {
        this.rozpocznijLaczenieZSerwerem();
        this.focusPoleTekstoweSkanowania();

        this.state.raportujZlecenie.wyslijNaSerwer({ idOperacji: idOperacji, scanInput: 'PRZERWIJ' },
            fromServer => {
                this.setState({ raportujZlecenie: Object.assign(this.state.raportujZlecenie, fromServer), isLoading: false });
                this.wyswietlLicznikIOdswiezStroneZa(30);
            }, error => {
                this.wyswietlKomunikatBledu(error)
                this.setState({ isLoading: false });
            })
    }

    handleZakonczPrace = (idOperacji) => {
        this.rozpocznijLaczenieZSerwerem();
        this.focusPoleTekstoweSkanowania();

        this.state.raportujZlecenie.wyslijNaSerwer({ idOperacji: idOperacji, scanInput: 'ZAKONCZ' },
            fromServer => {
                this.setState({ raportujZlecenie: Object.assign(this.state.raportujZlecenie, fromServer), isLoading: false });
                this.wyswietlLicznikIOdswiezStroneZa(30);
            }, error => {
                this.wyswietlKomunikatBledu(error)
                this.setState({ isLoading: false });
            })
    }

    wyswietlKomunikatBledu = error => {
        toast.error(<span>Błąd: {this.trescKomunikatuBledu(error)}</span>);
    }

    trescKomunikatuBledu = error => {
        if (typeof error === 'undefined') return 'server_error'
        const { error_message, errorCause } = error
        const komunikatBledu = error_message || errorCause || ''
        if (typeof komunikatBledu === 'object') {
            komunikatBledu = 'server_error'
        }
        return komunikatBledu
    }

    handleAnuluj = () => {
        this.wyswietlLicznikIOdswiezStroneZa(30);
        this.resetujPoleTekstoweSkanowania();
        this.focusPoleTekstoweSkanowania();
        this.setState({ raportujZlecenie: new RaportujZlecenie() });
    }

    setScan = (value) => {
        this.setState({ raportujZlecenie: this.state.raportujZlecenie.setter({ scanInput: value }) });
        //this.textInput_liczba_powtorzen.current.focus()
    }

    wyswietlLicznikIOdswiezStroneZa(poIluSekundach) {
        this.zatrzymajLicznikOdswiezeniaStrony();

        this.ustawLicznikOdswiezaniaStrony(poIluSekundach);
    }

    zatrzymajLicznikOdswiezeniaStrony() {
        if (this.state.odswiezenieStronySubscription) {
            this.state.odswiezenieStronySubscription.unsubscribe();
            this.setState({ odswiezenieStronySubscription: null, odswiezenieStronyZa: 0 });
        }
    }

    ustawLicznikOdswiezaniaStrony(poIluSekundach) {
        let subscription = countDownSecondsOnTickOnComplete(poIluSekundach, s => this.setState({ odswiezenieStronyZa: s - 1 }), () => {
            this.setState({ raportujZlecenie: new RaportujZlecenie(), odswiezenieStronyZa: 0 });
            this.focusPoleTekstoweSkanowania();
        });
        this.setState({ odswiezenieStronySubscription: subscription });
    }

    resetujPoleTekstoweSkanowania() {
        this.setState({ raportujZlecenie: Object.assign(this.state.raportujZlecenie, { scanInput: '' }) });
    }

    focusPoleTekstoweSkanowania() {
        this.scanInputRef.current.focus();
    }

    pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    formatDate = (date) => {
        return date.getUTCFullYear() +'-'+ this.pad(date.getUTCMonth() + 1) +'-'+ this.pad(date.getUTCDate())
    }

    render() {
        const {raportujZlecenie}  = this.state
        //const { raportujLaser } = this.state
        const { scanInput, employee, } = raportujZlecenie
        //const { liczba_powtorzen, } = raportujLaser
        const pracownikOdczytany = raportujZlecenie.isPracownikOdczytany()
        const zlecenieOdczytane = raportujZlecenie.isZlecenieOdczytane()
        const elementOdczytany = raportujZlecenie.isElementOdczytany()
        //const operacjaOdczytana = raportujZlecenie.isOperacjaOdczytana()
        const moznaRaportowacNaOperacje = raportujZlecenie.isOperacjaDoRozpoczeciaPracy()
        const buildDate = preval`module.exports = new Date();`

        //const programOdczytany = raportujLaser.isProgramOdczytany()
        //console.log('programOdczytany ' + programOdczytany)
        return (
            <Container textAlign='center'>
                <Form autoComplete="off" loading={this.state.isLoading}>
                    <Header as='h2' id={preval`module.exports = new Date();`}>
                        <Tlumaczenia id="Raportowanie czasu pracy – SAP" />
                        <span className="timestamp">{buildDate.substr(0, 10)}</span>
                    </Header>
                    <Segment.Group>
                        <Segment compact>
                            <div style={{ display: 'flex' }}>
                                <Item.Group>
                                    <Item className='scan'>
                                        <Item.Image size='tiny' src={logo} />

                                        <Item.Content>
                                            <Item.Header><Tlumaczenia id="Zeskanuj.kod" />: </Item.Header>
                                            {/* <Item.Meta>
                                        <span className='price'>$1200</span>
                                        <span className='stay'>1 Month</span>
                                    </Item.Meta> */}
                                            <Item.Description>
                                                <Input id='form-input-scanInput' name="scanInput" value={scanInput} type='text'
                                                    autoFocus ref={this.scanInputRef}
                                                    onChange={this.handleInputChange}
                                                    onKeyDown={this.handleKeyOnScan}
                                                />
                                                <Button icon onClick={(evt) => this.handleScan()} type='button'>
                                                    <Icon name='search' />
                                                </Button>
                                            </Item.Description>
                                            <OdswiezenieStronyZa sekund={this.state.odswiezenieStronyZa} />
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                                <InformacjeZSerwera raportujZlecenie={raportujZlecenie} />
                            </div>
                        </Segment>
                        <PrzyciskiSterujace parent={this} visible={true} raportujZlecenie={raportujZlecenie} />
                        <AkcjeTestowe parent={this} raportujZlecenie={raportujZlecenie} visible={raportujZlecenie.SerwerDewepolerski} />
                        <Segment>
                            <Table celled striped>
                                <Table.Body>
                                    <Table.Row key='pracownik'>
                                        <Table.Cell width={1}>
                                            <Tlumaczenia id="Pracownik" />
                                    </Table.Cell>
                                        <Table.Cell width={3} className={classNames(
                                            {
                                                'niepoprawne_dane': !pracownikOdczytany,
                                                'odczytano_dane': this.state.wlasnieOdczytanoPracownika,
                                            })}>
                                            {pracownikOdczytany ? raportujZlecenie.getEmployeeFulname() : <Tlumaczenia id="brak" />}
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='zlecenie'>
                                        <Table.Cell width={1}>
                                            <Tlumaczenia id="Zlecenie" />
                                    </Table.Cell>
                                        <Table.Cell width={3} className={classNames(
                                            {
                                                'niepoprawne_dane': !zlecenieOdczytane,
                                            })}>
                                                {zlecenieOdczytane ? raportujZlecenie.zlecenieOpis() : <Tlumaczenia id="brak" />}
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='element'>
                                        <Table.Cell width={1}>
                                            <Tlumaczenia id="Element" />
                                    </Table.Cell>
                                        <Table.Cell width={3} className={classNames(
                                            {
                                                'niepoprawne_dane': !elementOdczytany,
                                            })}>
                                                {elementOdczytany ? raportujZlecenie.elementOpis() : <Tlumaczenia id="brak" />}
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='operacja'>
                                        <Table.Cell width={1}>
                                            <Tlumaczenia id="Operacja technologiczna" />
                                    </Table.Cell>
                                        <Table.Cell width={3} className={classNames(
                                            {
                                                'niepoprawne_dane': !moznaRaportowacNaOperacje,
                                            })}>
                                            {/* <OperacjaDomylnaElementu raportujZlecenie={raportujZlecenie} 
                                                operacjaOdczytana={operacjaOdczytana} pokaz={!raportujZlecenie.operacjeElementuGlownego}/>     */}
                                                
                                            <ListaOperacji raportujZlecenie={raportujZlecenie} onChange={this.handleChange} />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='prace'>
                                        <Table.Cell>
                                            <Tlumaczenia id="Trwające prace" />
                                    </Table.Cell>
                                        <Table.Cell>
                                            {pracownikOdczytany
                                                ?
                                                <TrwajacePrace raportujZlecenie={raportujZlecenie}
                                                    handlePrzerwijPrace={this.handlePrzerwijPrace}
                                                    handleZakonczPrace={this.handleZakonczPrace} />
                                                : ''}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                            <a href="/eoffice/production/edm_report_production_task_time.xml?action=list&refreshTree=false&raportowanie_produkcji=react_raportowanie_pracy_zlecenia">
                                <Tlumaczenia id="Lista bieżących prac" />
                            </a>
                        </Segment>
                    </Segment.Group>
                </Form>
            </Container>
        )
    }
}

const PrzyciskiSterujace = (props) => {
    const { parent, visible, raportujZlecenie } = props
    
    if (visible) return (
        <Segment >
            <Button icon onClick={(evt) => { parent.setScan('START'); parent.handleScan() }} 
                disabled={!raportujZlecenie.isActionStartEnabled()} type='button'>
                <Icon name='external' />
                START
                            </Button>
            <Button icon onClick={(evt) => { parent.setScan('PRZERWIJ'); parent.handleScan() }} 
                disabled={!raportujZlecenie.isActionPrzerwijEnabled()} type='button'>
                <Icon name='external' />
                <Tlumaczenia id="PRZERWIJ" />
                            </Button>
            {/* <Button icon onClick={(evt) => { parent.setScan('ZAKONCZ'); parent.handleScan() }}  
                    disabled={!raportujZlecenie.isActionPrzerwijEnabled()} type='button'>
                <Icon name='external' />
                <Tlumaczenia id="ZAKONCZ" />
                            </Button> */}
            <Button icon onClick={(evt) => { parent.handleAnuluj() }} type='button'>
                <Icon name='external' />
                <Tlumaczenia id="ANULUJ" />
                            </Button>
        </Segment>
    )
    return null
}

const OperacjaDomylnaElementu = (props) => {
    const { raportujZlecenie, operacjaOdczytana, pokaz } = props
    if(!pokaz) return null
    return (
        <>
        { operacjaOdczytana ? raportujZlecenie.operacjaOpis() : < Tlumaczenia id = "brak" />}
        </>
    )
}

const ListaOperacji = (props) => {
    const { raportujZlecenie, onChange } = props
    const { operacjeElementuGlownego, wybrana_operacja_elementu_glownego } = raportujZlecenie
    //const jedynaOperacja = operacjeElementuGlownego && operacjeElementuGlownego.length == 1

    if (operacjeElementuGlownego) return (
        <>
            {
                operacjeElementuGlownego.map(operacja => {
                    const identyfikatorOperacji = operacja.sooperation_object_index // operacja.id
                    const radioChecked = wybrana_operacja_elementu_glownego === identyfikatorOperacji
                    const zakonczona = operacja.zakonczona === 't'
                    return(
                    <Form.Field key={operacja.id}>
                        <Radio
                                label={'Operation ' + operacja.ppoperation_structure_position + ' - ' + operacja.sooperation_title}
                            name='wybrana_operacja_elementu_glownego'
                            value={identyfikatorOperacji}
                            checked={radioChecked}
                            onChange={(e, { name, value }) => onChange(name, value)}
                                className={'operacje_radio_list '+classNames(
                                {
                                    'operacja_radio_checked': radioChecked,
                                })}
                            disabled = { zakonczona}
                         />
                    </Form.Field>
                    )}
                )}
        </>
    )
    return null
}

const AkcjeTestowe = (props) => {
    const { parent, visible, raportujZlecenie } = props
    let zlecenie = null
    if(raportujZlecenie !== undefined && raportujZlecenie.obiektyTestowe  !== undefined 
        && raportujZlecenie.obiektyTestowe.zlecenie !== undefined) {
            zlecenie = raportujZlecenie.obiektyTestowe.zlecenie
    }
    let element = null
    if(raportujZlecenie !== undefined && raportujZlecenie.obiektyTestowe  !== undefined 
        && raportujZlecenie.obiektyTestowe.element !== undefined) {
            element = raportujZlecenie.obiektyTestowe.element
    }
    if (visible) return (
        <Segment >
            <Button icon onClick={(evt) => { parent.setScan(90065200); parent.handleScan() }} type='button'>
                <Icon name='external' />
                Mariusz Kozłowski
                            </Button>
            <Button icon onClick={(evt) => { parent.setScan(90065201); parent.handleScan() }} type='button'>
                <Icon name='external' />
                Łukasz Silwanowicz
                            </Button>
                {/* <div>
                            { Object.keys(zlecenie)
                .filter(key => typeof (zlecenie[key]) !== 'function')
                .map(key => key +':'+ zlecenie[key] +', ')}
                </div> */}
            {zlecenie &&                 
            <Button icon onClick={(evt) => { parent.setScan(zlecenie.object_index); parent.handleScan() }} type='button'>
                <Icon name='external' />
                {zlecenie.title}
                            </Button>
                        }
            {element &&                 
            <Button icon onClick={(evt) => { parent.setScan(element.object_index); parent.handleScan() }} type='button'>
                <Icon name='external' />
                {element.object_index} / {element.title}
                            </Button>
            }
        </Segment>
    )
    return null
}

const TrwajacePrace = (props) => {
    const { raportujZlecenie, handlePrzerwijPrace, handleZakonczPrace } = props
    const pracePracownika = raportujZlecenie.praceRozpoczetePrzezPracownika

    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.Cell>
                    <Tlumaczenia id="Operacja technologiczna" />
                </Table.Cell>
                    <Table.Cell>
                        <Tlumaczenia id="Rozpoczęcie" />
                </Table.Cell>
                    <Table.Cell>
                        <Tlumaczenia id="Akcje" />
                </Table.Cell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {pracePracownika.map(praca =>
                    <Table.Row key={praca.id}>
                        <Table.Cell>
                            {praca.operationSystemObject.title}
                            [<Tlumaczenia id="Zlecenie" />: 
                            {praca.orderProductionSystemObject.title}] 
                            [<Tlumaczenia id="Element" />: {praca.productProductOrComponentSystemObject.title}]
                        </Table.Cell>
                        <Table.Cell>
                            {praca.start_datetime}
                        </Table.Cell>
                        <Table.Cell>
                            <ConfirmButton onClick={(evt) => handlePrzerwijPrace(praca.prodOperSchedule.id)}
                                content={<Tlumaczenia id="Przerwij pracę" />}
                                useConfirm={praca.czyProgramNiedawnoRozpoczety == true}
                                confirmContent="Program został niedawno rozpoczęty. Czy na pewno chcesz go przerwać?"
                                cancelButton='Anuluj' //{<Tlumaczenia id="Anuluj" />}
                                confirmButton='Przerwij pracę' //{<Tlumaczenia id="Przerwij pracę" />}
                            />
                            {/* <Button type='button' icon onClick={(evt) => handleZakonczPrace(praca.prodOperSchedule.id)}
                                            disabled={praca.trwajaInnePrace}
                                        >
                                            <Icon name='send' />
                                            Zakończ pracę
                                        </Button> */}
                            {/* <ConfirmButton onClick={(evt) => handleZakonczPrace(praca.id)}
                                disabled={praca.trwajaInnePrace} content="Zakończ pracę"
                                useConfirm={true}
                                confirmContent="Program został niedawno rozpoczęty. Czy na pewno chcesz go zakończyć?"
                                cancelButton='Anuluj'
                                confirmButton="Zakończ pracę"
                            /> */}
                            {/* <InnerState state={{ showConfirm: false, }}
                                render={(innerState, setInnerState) => (
                                    <React.Fragment>
                                        <Button type='button' icon onClick={(evt) => setInnerState({ showConfirm: true })}
                                            disabled={praca.trwajaInnePrace}
                                        >
                                            <Icon name='send' />
                                            Zakończ pracę innerState
                                        </Button>
                                        <Confirm dimmer='inverted'
                                            open={innerState.showConfirm}
                                            content="Program został niedawno rozpoczęty. Czy na pewno chcesz go zakończyć?"
                                            cancelButton='Anuluj'
                                            confirmButton="Zakończ pracę"
                                            onCancel={(evt) => setInnerState({ showConfirm: false })}
                                            onConfirm={(evt) => handleZakonczPrace(praca.id)}
                                        />
                                    </React.Fragment>
                                )}
                            /> */}
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    )
}

const OdswiezenieStronyZa = props => (
    <React.Fragment>
        <span className='odswiezStroneZa'> </span>
        {props.sekund > 0 && <span><Tlumaczenia id="Odświeżenie strony za" /> {props.sekund}</span>}
    </React.Fragment>
);

export default RaportowanieForm