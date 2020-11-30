import React, { ComponentProps } from 'react'
import { InfoIcon } from '~/assets'
import { useToastContext } from '~/contexts'
import { BaseToast } from './base'

export const InfoToast: React.FC<ComponentProps<typeof BaseToast>> = (props) => {
	const { colors } = useToastContext()
	return <BaseToast {...props} color={colors.info} iconElement={<InfoIcon />} />
}
