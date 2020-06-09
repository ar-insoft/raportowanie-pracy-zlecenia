import React from 'react'
import { FormattedMessage } from 'react-intl'

export const Tlumaczenia = ({id}) => {
    return (
        <FormattedMessage id={id} defaultMessage={id} />
    )
}