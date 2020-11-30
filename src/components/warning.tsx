import React, { ComponentProps } from 'react'
import { WarningIcon } from '~/assets'
import { useToastContext } from '~/contexts'
import { BaseToast } from './base'

export const WarningToast: React.FC<ComponentProps<typeof BaseToast>> = (props) => {
	const { colors } = useToastContext()
	return <BaseToast {...props} color={colors.warning} iconElement={<WarningIcon />} />
}
