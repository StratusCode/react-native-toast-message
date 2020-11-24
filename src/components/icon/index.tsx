import React from 'react'
import { Image, ImageStyle, ImageSourcePropType } from 'react-native'

import styles from './styles'

type IconProps = {
	source: ImageSourcePropType
	style: ImageStyle
}

const Icon: React.FC<IconProps> = (props) => {
	const { source, style } = props
	if (!source) {
		return null
	}

	return <Image source={source} style={[styles.base, style]} resizeMode="contain" />
}

export default Icon
