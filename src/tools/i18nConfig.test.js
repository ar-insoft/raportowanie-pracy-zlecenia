import { messagesOf, messages } from './i18nConfig'

describe('testing Pozyskanie listy tłumaczeń dla "react - intl"', () => {
    const enMessages = messagesOf('en')
    const plMessages = messagesOf('pl')

    //console.log('messagesOf en', enMessages)
    //console.log('messagesOf pl', plMessages)
    
    test('english translation of Zlecenie is Order', () => {
        expect(enMessages.Zlecenie).toBe('Order');
    });

    test.each(messages)(
        'testing translation of %s ', (trans) => {
            expect(enMessages[trans.id]).toEqual(trans.en);
        },
    );
})
