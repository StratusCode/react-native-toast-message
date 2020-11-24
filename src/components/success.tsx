import React, { ComponentProps } from 'react'

import BaseToast from './base'
import colors from '../colors'
import Success from '../assets/svgs/Success'

const SuccessToast: React.FC<ComponentProps<typeof BaseToast>> = (props) => {
	return <BaseToast {...props} color={colors.success} iconElement={<Success />} />
}

export default SuccessToast
