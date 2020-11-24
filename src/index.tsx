import React, { Component, ComponentProps } from 'react'
import {
	Animated,
	LayoutChangeEvent,
	PanResponder,
	PanResponderInstance,
	StyleProp,
	ViewStyle,
} from 'react-native'

import SuccessToast from './components/success'
import WarningToast from './components/warning'
import ErrorToast from './components/error'
import InfoToast from './components/info'
import { complement } from './utils/arr'
import { includeKeys } from './utils/obj'
import styles from './styles'

const FRICTION = 8

type ToastComponentProps = {
	text1?: string
	text2?: string
	hide?: () => void
	show?: (options: ToastState) => Promise<void>
}

type ToastComponentRenderer = (props: ToastComponentProps) => React.ReactElement
type ToastComponentsConfig = {
	[x: string]: ToastComponentRenderer
}
const defaultComponentsConfig: ToastComponentsConfig = {
	success: ({ hide, ...rest }: ToastComponentProps) => <SuccessToast onClose={hide} {...rest} />,
	warning: ({ hide, ...rest }: ToastComponentProps) => <WarningToast onClose={hide} {...rest} />,
	error: ({ hide, ...rest }: ToastComponentProps) => <ErrorToast onClose={hide} {...rest} />,
	info: ({ hide, ...rest }: ToastComponentProps) => <InfoToast onClose={hide} {...rest} />,
}

type ShowToastProps = {
	type?: 'success' | 'error' | 'info' | string
	position?: 'top' | 'bottom'
	text1?: string
	text2?: string
	visibilityTime?: number
	autoHide?: boolean
	topOffset?: number
	bottomOffset?: number
	onShow?: () => void
	onHide?: () => void
	onPress?: () => void
}

const getInitialState = ({
	topOffset = 30,
	bottomOffset = 40,
	position = 'top',
	type = 'success',
	visibilityTime = 4000,
	autoHide = true,
	text1,
	text2,
	onShow,
	onHide,
}: ShowToastProps) => {
	return {
		// layout
		topOffset,
		bottomOffset,
		height: 60,
		position,
		type,

		// timing (in ms)
		visibilityTime,
		autoHide,

		// content
		text1,
		text2,

		onShow,
		onHide,
	}
}

type ToastType = typeof Toast
type ToastState = ShowToastProps & {
	height?: number
	inProgress?: boolean
	isVisible?: boolean
	animation: Animated.Value
	// additional props for custom toast components
	props: Record<string, unknown>
}
type ToastProps = ToastState & {
	config: ToastComponentsConfig
}
class Toast extends Component<ToastProps> {
	static _ref: ToastType | null = null
	panResponder: PanResponderInstance
	state: ToastState
	timer?: number | null

	static setRef(ref = {} as ToastType): void {
		this._ref = ref
	}

	static getRef(): ToastType | null {
		return this._ref
	}

	static clearRef(): void {
		this._ref = null
	}

	static show(options: ShowToastProps): void {
		this._ref?.show(options)
	}

	static hide(): void {
		this._ref?.hide()
	}

	constructor(props: ToastProps) {
		super(props)

		this._setState = this._setState.bind(this)
		this._animateMovement = this._animateMovement.bind(this)
		this._animateRelease = this._animateRelease.bind(this)
		this.startTimer = this.startTimer.bind(this)
		this.animate = this.animate.bind(this)
		this.show = this.show.bind(this)
		this.hide = this.hide.bind(this)
		this.onLayout = this.onLayout.bind(this)

		this.state = {
			...getInitialState(props),

			inProgress: false,
			isVisible: false,
			animation: new Animated.Value(0),
		} as ToastState

		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (event, gesture) => {
				this._animateMovement(gesture)
			},
			onPanResponderRelease: (event, gesture) => {
				this._animateRelease(gesture)
			},
		})
	}

	_setState(reducer: (prevState: Partial<ToastState>) => Partial<ToastState>): Promise<void> {
		return new Promise((resolve) => this.setState(reducer, () => resolve()))
	}

	_animateMovement({ dy }: { dy: number }): void {
		const { position, animation } = this.state
		let value = 1 + dy / 100

		if (position === 'bottom') {
			value = 1 - dy / 100
		}

		if (value < 1) {
			animation.setValue(value)
		}
	}

	_animateRelease({ dy, vy }: { dy: number; vy: number }): void {
		const { position, animation } = this.state
		let value = 1 + dy / 100

		if (position === 'bottom') {
			value = 1 - dy / 100
		}

		if (value < 0.65) {
			Animated.spring(animation, {
				toValue: -2,
				speed: position === 'bottom' ? vy : -vy,
				useNativeDriver: true,
			}).start(() => {
				const { onHide } = this.state
				if (onHide) {
					onHide()
				}
			})
		} else if (value < 0.95) {
			Animated.spring(animation, {
				toValue: 1,
				velocity: vy,
				useNativeDriver: true,
			}).start()
		}
	}

	async show(options: ToastState): Promise<void> {
		const { inProgress, isVisible } = this.state
		if (inProgress || isVisible) {
			await this.hide()
		}

		await this._setState((prevState) => ({
			...prevState,
			...getInitialState(this.props as ToastState), // Reset layout
			/*
			 Preserve the previously computed height (via onLayout).
			 If the height of the component corresponding to this `show` call is different,
			   onLayout will be called again and `height` state will adjust.

			 This fixes an issue where a succession of calls to components with custom heights (custom Toast types)
			  fails to hide them completely due to always resetting to the default component height
			*/
			height: prevState.height,
			inProgress: true,
			...options,
		}))
		await this.animateShow()
		await this._setState((prevState) => ({
			...prevState,
			isVisible: true,
			inProgress: false,
		}))
		this.clearTimer()

		const { autoHide, onShow } = this.state

		if (autoHide) {
			this.startTimer()
		}

		if (onShow) {
			onShow()
		}
	}

	async hide(): Promise<void> {
		await this._setState((prevState) => ({
			...prevState,
			inProgress: true,
		}))
		await this.animateHide()
		this.clearTimer()
		await this._setState((prevState) => ({
			...prevState,
			isVisible: false,
			inProgress: false,
		}))

		const { onHide } = this.state
		if (onHide) {
			onHide()
		}
	}

	animateShow(): Promise<Animated.CompositeAnimation> {
		return this.animate({ toValue: 1 })
	}

	animateHide(): Promise<Animated.CompositeAnimation> {
		return this.animate({ toValue: 0 })
	}

	animate({ toValue }: { toValue: number }): Promise<Animated.CompositeAnimation> {
		const { animation } = this.state
		return new Promise((resolve) => {
			Animated.spring(animation, {
				toValue,
				friction: FRICTION,
				useNativeDriver: true,
			}).start(() => resolve())
		})
	}

	startTimer(): void {
		const { visibilityTime } = this.state
		this.timer = setTimeout(() => this.hide(), visibilityTime)
	}

	clearTimer(): void {
		if (this.timer) {
			clearTimeout(this.timer)
			this.timer = null
		}
	}

	renderContent({ config }: { config: ToastComponentsConfig }): React.ReactElement | null {
		const componentsConfig = {
			...defaultComponentsConfig,
			...config,
		}

		const { type = 'info' } = this.state
		const toastComponent = componentsConfig[type]

		if (!toastComponent) {
			console.error(
				`Type '${type}' does not exist. Make sure to add it to your 'config'. You can read the documentation here: https://github.com/StratusCode/react-native-toast-message/blob/master/README.md`
			)
			return null
		}

		return toastComponent({
			...includeKeys(this.state, [
				'position',
				'type',
				'inProgress',
				'isVisible',
				'text1',
				'text2',
				'onHide',
				'onShow',
				'props',
			]),
			hide: this.hide,
			show: this.show,
		})
	}

	getBaseStyle(
		position: 'top' | 'bottom' = 'bottom'
	): Partial<ComponentProps<typeof Animated.View>['style']> {
		const { topOffset = 30, bottomOffset = 40, height = 60, animation } = this.state
		const offset = position === 'bottom' ? bottomOffset : topOffset

		// +5 px to completely hide the toast under StatusBar (on Android)
		const range = [height + 5, -offset]
		const outputRange = position === 'bottom' ? range : complement(range)

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
	}

	onLayout(e: LayoutChangeEvent): void {
		this.setState({ height: e.nativeEvent.layout.height })
	}

	render(): React.ReactElement {
		const { position } = this.state
		const baseStyle = this.getBaseStyle(position)

		return (
			<Animated.View
				onLayout={this.onLayout}
				style={baseStyle as StyleProp<ViewStyle>}
				{...this.panResponder.panHandlers}
			>
				{this.renderContent(this.props)}
			</Animated.View>
		)
	}
}

export default Toast
