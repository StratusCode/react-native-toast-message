import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

import { CloseIcon } from '~/assets'
import { useToastContext } from '~/contexts'
import type { BaseToastProps } from '~/types'
import { useBaseStyles } from './styles'

export const BaseToast: React.FC<BaseToastProps> = (props) => {
	const {
		color,
		iconElement,
		title,
		message,
		onClose,
		onPress,
		renderIcon,
		renderTitle,
		renderMessage,
		renderCloseButton,
	} = props

	const { colors } = useToastContext()
	const styles = useBaseStyles(
		colors.background,
		colors.leftBorder,
		colors.title,
		colors.message
	)
	const baseStyle = [styles.base, styles.borderLeft, { borderLeftColor: color }]

	const inner = (
		<View style={baseStyle}>
			{renderIcon ? (
				renderIcon(props)
			) : (
				<View style={styles.iconContainer}>
					{iconElement ? iconElement : <View style={styles.icon} />}
				</View>
			)}

			<View style={styles.contentContainer}>
				<View>
					{renderTitle
						? renderTitle(props)
						: title !== undefined && (
								<View>
									<Text style={styles.title} numberOfLines={1}>
										{title}
									</Text>
								</View>
						  )}
					{renderMessage
						? renderMessage(props)
						: message !== undefined && (
								<View>
									<Text style={styles.message} numberOfLines={2}>
										{message}
									</Text>
								</View>
						  )}
				</View>
			</View>

			{renderCloseButton ? (
				renderCloseButton(props)
			) : (
				<TouchableOpacity style={styles.closeButtonContainer} onPress={onClose}>
					<CloseIcon />
				</TouchableOpacity>
			)}
		</View>
	)

	if (onPress) {
		return <TouchableOpacity onPress={onPress}>{inner}</TouchableOpacity>
	}

	return inner
}
