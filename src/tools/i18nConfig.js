
export const messages = 
    [
        { id: "Raportowanie czasu pracy – SAP", en: "Working time reporting – SAP"},
        { id: "Zeskanuj.kod", en: "Scan the code" },
        { id: "Raportowanie czasu pracy zlecenia", en: "Working time reporting - orders", },
        { id: "Raportowanie produkcji w oparciu o confirmation number", en: "Working time reporting - orders [confirmation number]", },
        { id: "Pracownik", en: "Employee", },
        { id: "Zlecenie", en: "Order", },
        { id: "Element", en: "Part", },
        { id: "Operacja technologiczna", en: "Techno operation", },
        { id: "Trwające prace", en: "Ongoing work", },
        { id: "Detale programu", en: "Parts of the program", },
        { id: "brak", en: "no data", },
        { id: "Rozpoczęcie", en: "Start time", },
        { id: "Akcje", en: "Actions", },
        { id: "Lista prac lasera", en: "List of laser works", },
        { id: "Nr czesci", en: "Part no", },
        { id: "Komponent", en: "Part", },
        { id: "Operacja", en: "Operation", },
        { id: "Współczynnik czasu", en: "Time factor", },
        { id: "Rozpocznij pracę", en: "Start work", },
        { id: "Przerwij pracę", en: "Stop work", },
        { id: "Anuluj", en: "Cancel", },
        { id: "ANULUJ", en: "CANCEL", },
        { id: "PRZERWIJ", en: "STOP", },
        { id: "ZAKONCZ", en: "FINISH", },
        { id: "Lista bieżących prac", en: "List of ongoing work", },
        { id: "Odświeżenie strony za", en: "Page refresh in", },
    ]

export const messagesOf = (lang) => {
    let result = {}
    messages.forEach(ob => {
        result[ob.id] = ob[lang] || ob.id
    })

    return result
}

export const messagesOf0 = (lang) => {
    if (lang === 'en') return messages0
    return {}
}

const messages0 = {
    "Raportowanie czasu pracy – SAP": "Working time reporting – SAP",
    "Zeskanuj.kod": "Scan the code",
    "Raportowanie produkcji w oparciu o confirmation number": "Working time reporting - orders",
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
