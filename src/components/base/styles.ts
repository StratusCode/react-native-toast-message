import { useMemo } from "react"
import { StyleSheet, ViewStyle } from "react-native"
import type { Color } from "~/types"

interface BaseStyles {
	base: ViewStyle
	borderLeft: ViewStyle
	iconContainer: ViewStyle
	icon: ViewStyle
	contentContainer: ViewStyle
	closeButtonContainer: ViewStyle
	closeIcon: ViewStyle
	title: ViewStyle
	message: ViewStyle
}

export const useBaseStyles = (
	backgroundColor: Color,
	leftBorder: Color,
	titleColor: Color,
	messageColor: Color
): StyleSheet.NamedStyles<BaseStyles> => {
	return useMemo(
		() =>
			StyleSheet.create({
				base: {
					flexDirection: "row",
					height: 60,
					width: "90%",
					borderRadius: 6,
					backgroundColor: backgroundColor,
					shadowOffset: { width: 0, height: 0 },
					shadowOpacity: 0.1,
					shadowRadius: 6,
					elevation: 2,
				},
				borderLeft: {
					borderLeftWidth: 5,
					borderLeftColor: leftBorder,
				},
				iconContainer: {
					paddingHorizontal: 14,
					justifyContent: "center",
					alignItems: "center",
				},
				icon: {
					width: 16,
					height: 16,
				},
				contentContainer: {
					flex: 1,
					justifyContent: "center",
					alignItems: "flex-start", // in case of rtl the text will start from the right
				},
				closeButtonContainer: {
					paddingHorizontal: 14,
					alignItems: "center",
					justifyContent: "center",
				},
				closeIcon: {
					width: 9,
					height: 9,
				},
				title: {
					fontSize: 12,
					fontWeight: "bold",
					marginBottom: 3,
					color: titleColor,
				},
				message: {
					fontSize: 10,
					color: messageColor,
				},
			}),
		[leftBorder, messageColor, titleColor, backgroundColor]
	)
}
