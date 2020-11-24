import React from 'react'
import { View, TouchableOpacity, Text, ColorValue, ViewStyle } from 'react-native'

import Icon from '../icon'
import { icons } from '../../assets'
import styles from './styles'

type BaseToastProps = {
	color?: ColorValue
	iconElement?: React.ReactElement
	text1?: string
	text2?: string
	onClose?: () => void
}

const BaseToast: React.FC<BaseToastProps> = ({ color, iconElement, text1, text2, onClose }) => {
	const baseStyle = [styles.base, styles.borderLeft, { borderLeftColor: color }] as ViewStyle

	return (
		<View style={baseStyle}>
			<View style={styles.iconContainer}>
				{iconElement ? iconElement : <View style={styles.icon} />}
			</View>

			<View style={styles.contentContainer}>
				<View>
					{text1 !== undefined && (
						<View>
							<Text style={styles.text1} numberOfLines={1}>
								{text1}
							</Text>
						</View>
					)}
					{text2 !== undefined && (
						<View>
							<Text style={styles.text2} numberOfLines={2}>
								{text2}
							</Text>
						</View>
					)}
				</View>
			</View>

			<TouchableOpacity style={styles.closeButtonContainer} onPress={onClose}>
				<Icon style={styles.closeIcon} source={icons.close} />
			</TouchableOpacity>
		</View>
	)
}

export default BaseToast
