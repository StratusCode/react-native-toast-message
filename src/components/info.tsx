import React, { ComponentProps } from 'react'

import BaseToast from './base'
import colors from '../colors'
import Info from '../assets/svgs/Info'

const InfoToast: React.FC<ComponentProps<typeof BaseToast>> = (props) => {
	return <BaseToast {...props} color={colors.info} iconElement={<Info />} />
}

export default InfoToast
