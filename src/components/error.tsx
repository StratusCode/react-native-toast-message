import React, { ComponentProps } from "react"
import { ErrorIcon } from "~/assets"
import { useToastContext } from "~/contexts"
import { BaseToast } from "./base"

export const ErrorToast: React.FC<ComponentProps<typeof BaseToast>> = (props) => {
	const { colors } = useToastContext()
	return <BaseToast {...props} color={colors.error} iconElement={<ErrorIcon />} />
}
