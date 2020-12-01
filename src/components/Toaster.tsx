import React, {
	ComponentProps,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import { Animated, LayoutChangeEvent, PanResponder, StyleProp, ViewStyle } from "react-native"

import { useInterval } from "~/hooks"
import type { BaseToastProps, ToastProps, ToastComponentsConfig } from "~/types"
import { useToastContext } from "~/contexts/toast-context"
import styles from "~/styles"

import { SuccessToast } from "./success"
import { WarningToast } from "./warning"
import { ErrorToast } from "./error"
import { InfoToast } from "./info"

const defaultComponentsConfig: ToastComponentsConfig = {
	success: (props: BaseToastProps) => <SuccessToast {...props} />,
	warning: (props: BaseToastProps) => <WarningToast {...props} />,
	error: (props: BaseToastProps) => <ErrorToast {...props} />,
	info: (props: BaseToastProps) => <InfoToast {...props} />,
}

const ToasterInternal: React.FC = () => {
	const { activeToast, defaults, customToasts, hideToast } = useToastContext()

	const toastTypes: ToastComponentsConfig = {
		...defaultComponentsConfig,
		...customToasts,
	}

	const [inProgress, setInProgress] = useState(false)
	const [isVisible, setIsVisible] = useState(false)

	// Need to create state first. Setter is not used in this case
	const [animation] = useState(new Animated.Value(0))

	const position = useMemo(() => activeToast?.position ?? defaults.position, [
		activeToast?.position,
		defaults.position,
	])

	const onHide = useMemo(() => activeToast?.onHide ?? defaults.onHide, [
		activeToast?.onHide,
		defaults.onHide,
	])

	const onShow = useMemo(() => activeToast?.onShow ?? defaults.onShow, [
		activeToast?.onShow,
		defaults.onShow,
	])

	const animateMovement = useCallback(
		({ dy }: { dy: number }): void => {
			let value = 1 + dy / 100

			if (position === "bottom") {
				value = 1 - dy / 100
			}

			if (value < 1) {
				animation?.setValue(value)
			}
		},
		[animation, position]
	)

	const animateRelease = useCallback(
		({ dy, vy }: { dy: number; vy: number }): void => {
			let value = 1 + dy / 100

			if (position === "bottom") {
				value = 1 - dy / 100
			}

			if (value < 0.65) {
				Animated.spring(animation, {
					toValue: -2,
					speed: position === "bottom" ? vy : -vy,
					useNativeDriver: true,
				}).start(() => {
					if (activeToast) {
						onHide?.(activeToast)
					}
				})
			} else if (value < 0.95) {
				Animated.spring(animation, {
					toValue: 1,
					velocity: vy,
					useNativeDriver: true,
				}).start()
			}
		},
		[activeToast, animation, onHide, position]
	)

	const friction = activeToast?.friction ?? defaults.friction
	const animate = useCallback(
		({ toValue }: { toValue: number }): Promise<Animated.CompositeAnimation> => {
			return new Promise((resolve) => {
				const spring = Animated.spring(animation, {
					toValue,
					friction,
					useNativeDriver: true,
				})
				spring.start(() => resolve(spring))
			})
		},
		[animation, friction]
	)

	const animateShow = useCallback((): Promise<Animated.CompositeAnimation> => {
		return animate({ toValue: 1 })
	}, [animate])

	const animateHide = useCallback((): Promise<Animated.CompositeAnimation> => {
		return animate({ toValue: 0 })
	}, [animate])

	const panResponderRef = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (_event, gesture) => {
				animateMovement(gesture)
			},
			onPanResponderRelease: (_event, gesture) => {
				animateRelease(gesture)
			},
		})
	)

	const prevHeightRef = useRef<number | null>()
	const heightRef = useRef<number | null>(activeToast?.height ?? defaults.height)
	const onLayout = useCallback((e: LayoutChangeEvent): void => {
		prevHeightRef.current = heightRef.current
		heightRef.current = e.nativeEvent.layout.height
	}, [])

	const bottomOffset = activeToast?.bottomOffset ?? defaults.bottomOffset
	const topOffset = activeToast?.topOffset ?? defaults.topOffset
	const height = heightRef.current ?? defaults.height
	const baseStyle = useMemo<Partial<ComponentProps<typeof Animated.View>["style"]>>(() => {
		const offset = position === "bottom" ? bottomOffset : topOffset

		// +5 px to completely hide the toast under StatusBar (on Android)
		const range = [height + 5, -offset]
		const outputRange = position === "bottom" ? range : range.map((i) => -i)

		const translateY = animation.interpolate({
			inputRange: [0, 1],
			outputRange,
		})

		return [
			styles.base,
			styles[position],
			{
				transform: [{ translateY }],
			},
		]
	}, [animation, bottomOffset, height, position, topOffset])

	const prevToastRef = useRef<ToastProps | null>()
	useLayoutEffect(() => {
		// no toasts or correct one is already shown
		if (activeToast === prevToastRef.current || (!activeToast && !prevToastRef.current)) {
			return
		}

		const hide = async (): Promise<void> => {
			setInProgress(true)
			await animateHide()
			setIsVisible(false)
			setInProgress(false)
			onHide?.(prevToastRef.current as ToastProps)
			prevToastRef.current = null
		}

		const show = async (): Promise<void> => {
			if (inProgress || isVisible) {
				await hide()
			}

			setInProgress(true)
			await animateShow()
			prevToastRef.current = activeToast
			setIsVisible(true)
			setInProgress(false)
			onShow?.(activeToast as ToastProps)
		}

		// no toasts left but one is visible and not yet animating
		if (!activeToast && isVisible && !inProgress) {
			hide()
		}

		// we have a toast that isn't visible and not yet animating
		if (activeToast && !isVisible && !inProgress) {
			show()
		}

		// activeToast was replaced and the wrong one is showing
		if (activeToast && !inProgress && activeToast !== prevToastRef.current) {
			show()
		}
	}, [activeToast, animateHide, animateShow, hideToast, inProgress, isVisible, onHide, onShow])

	const autoHide = activeToast?.autoHide ?? defaults.autoHide
	const visibilityTime = activeToast?.visibilityTime ?? defaults.visibilityTime
	// this will auto-cancel if inProgress flips to true or a toast is not visible
	useInterval(hideToast, isVisible && autoHide && !inProgress ? visibilityTime : null)

	const toastType = activeToast?.type ?? defaults.type
	const onPress = activeToast?.onPress ?? defaults.onPress
	const onPressCallback = useMemo(() => {
		if (!onPress) {
			return undefined
		}

		return (toast: ToastProps) => {
			hideToast()
			onPress?.(toast)
		}
	}, [hideToast, onPress])
	const renderContent = (): React.ReactElement | null => {
		const toastComponent = toastTypes[toastType]

		if (!toastComponent) {
			console.error(
				`Toast of type '${toastType}' does not exist. Make sure to add it to your \`customToasts\`. You can read the documentation here: https://github.com/StratusCode/react-native-toast-hook/blob/master/README.md`
			)
			return null
		}

		return toastComponent({
			...defaults,
			...activeToast,
			onClose: hideToast,
			onPress: onPressCallback,
		})
	}

	return (
		<Animated.View
			onLayout={onLayout}
			style={baseStyle as StyleProp<ViewStyle>}
			{...panResponderRef.current.panHandlers}
		>
			{renderContent()}
		</Animated.View>
	)
}

export const Toaster = React.memo(ToasterInternal)
