import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { addLocaleData, IntlProvider } from 'react-intl'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import './App.css';
import RaportowanieForm from './raportowanieLasera/components/RaportowanieForm'
import ErrorBoundary from './tools/ErrorBoundary'

let elLocaleData = require('react-intl/locale-data/en')
let i18nConfig = {
  locale: 'en',
  messages: {
    "Zeskanuj.kod": "Scan the code",
    "Raportowanie czasu pracy zlecenia": "Working time reporting - orders",
    "Pracownik": "Employee",
    "Zlecenie": "Order",
    "Element": "Part",
    "Operacja technologiczna": "Techno operation",
    "Trwające prace": "Ongoing work",
    "Detale programu": "Parts of the program",
    "brak": "no data",
    "Rozpoczęcie": "Start time",
    "Akcje": "Actions",
    "Lista prac lasera": "List of laser works",
    "Nr czesci": "Part no",
    "Komponent": "Part",
    "Operacja": "Operation",
    "Współczynnik czasu": "Time factor",
    "Rozpocznij pracę": "Start work",
    "Przerwij pracę": "Stop work",
    "Anuluj": "Cancel",
    "ANULUJ": "CANCEL",
    "PRZERWIJ": "STOP",
    "ZAKONCZ": "FINISH",
    "Lista bieżących prac": "List of ongoing work",
  }
};
//			Operacja	

class App extends Component {
  render() {
    const parsedUrl = new URL(window.location.href)
    const lang = parsedUrl.searchParams.get("lang") || "pl"

    return (
      <ErrorBoundary>
        <IntlProvider locale={lang} messages={i18nConfig.messages}>
          <div className="App">
            <RaportowanieForm />
            <ToastContainer
              position={toast.POSITION.TOP_RIGHT}
              closeOnClick={false}
              autoClose={6000}
              hideProgressBar={true}
            />
          </div>
        </IntlProvider>
      </ErrorBoundary>
    );
  }
}

export default App;
