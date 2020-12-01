import React, { ComponentProps } from "react"
import { SuccessIcon } from "~/assets"
import { useToastContext } from "~/contexts"
import { BaseToast } from "./base"

export const SuccessToast: React.FC<ComponentProps<typeof BaseToast>> = (props) => {
	const { colors } = useToastContext()
	return <BaseToast {...props} color={colors.success} iconElement={<SuccessIcon />} />
}
