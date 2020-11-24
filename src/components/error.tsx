import React, { ComponentProps } from 'react'

import BaseToast from './base'
import colors from '../colors'
import Error from '../assets/svgs/Error'

const ErrorToast: React.FC<ComponentProps<typeof BaseToast>> = (props) => {
	return <BaseToast {...props} color={colors.error} iconElement={<Error />} />
}

export default ErrorToast
