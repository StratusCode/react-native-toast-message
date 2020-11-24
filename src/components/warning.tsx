import React, { ComponentProps } from 'react'

import BaseToast from './base'
import colors from '../colors'
import Warning from '../assets/svgs/Warning'

const WarningToast: React.FC<ComponentProps<typeof BaseToast>> = (props) => {
	return <BaseToast {...props} color={colors.warning} iconElement={<Warning />} />
}

export default WarningToast
