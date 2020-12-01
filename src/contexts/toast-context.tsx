import React, { createContext, useCallback, useMemo, useRef, useState } from "react"
import { Toaster } from "~/components/Toaster"
import type { IToastContext, ToastProps, ToastProviderProps, UseToastHook } from "~/types"

const defaultContext: Partial<IToastContext> = {
	defaults: {
		position: "top",
		type: "info",
		visibilityTime: 4000,
		autoHide: true,
		height: 60,
		topOffset: 40,
		bottomOffset: 40,
		friction: 8,
	},
	colors: {
		background: "#fff",
		leftBorder: "#D8D8D8",
		title: "#221D23",
		message: "#221D23",
		closeIcon: "#221D23",
		info: "#00c9ff",
		error: "#fe3618",
		warning: "#fcc603",
		success: "#00ac31",
	},
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const ToastContext = createContext<IToastContext>(undefined!)

ToastContext.displayName = "ToastContext"

const ToastProvider: React.FC<ToastProviderProps> = ({
	defaults,
	colors = defaultContext.colors,
	customToasts,
	renderToaster = true,
	children,
	...rest
}) => {
	const toasts = useRef<ToastProps[]>([])
	const [activeToast, setActiveToast] = useState<ToastProps | null>(null)

	const showToast = useCallback((toast) => {
		toasts.current.shift()
		toasts.current.unshift(toast)
		setActiveToast(toast)
	}, [])

	const queueToast = useCallback((toast) => {
		toasts.current.push(toast)
		if (toasts.current.length === 1) {
			setActiveToast(toast)
		}
	}, [])

	const hideToast = useCallback(() => {
		toasts.current.shift()
		setActiveToast(toasts.current?.[0] ?? null)
	}, [])

	const clearToastQueue = useCallback(() => {
		toasts.current.length = 0 // isn't javascript wonderful? /s
		setActiveToast(null)
	}, [])

	const value = useMemo(
		() => ({
			...defaultContext,
			toasts: toasts.current,
			activeToast,
			showToast,
			queueToast,
			hideToast,
			clearToastQueue,
			defaults: {
				...defaultContext.defaults,
				...defaults,
			} as IToastContext["defaults"],
			colors: {
				...defaultContext.colors,
				...colors,
			} as IToastContext["colors"],
			customToasts,
		}),
		[
			activeToast,
			clearToastQueue,
			colors,
			customToasts,
			defaults,
			hideToast,
			queueToast,
			showToast,
		]
	)

	return (
		<ToastContext.Provider value={value} {...rest}>
			{children}
			{renderToaster && <Toaster />}
		</ToastContext.Provider>
	)
}

function useToastContext(): IToastContext {
	const context = React.useContext<IToastContext>(ToastContext)
	if (context === undefined) {
		throw new Error("useToastContext must be used within a ToastProvider")
	}
	return context
}

function useToast(): UseToastHook {
	const context = React.useContext<IToastContext>(ToastContext)
	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider")
	}
	return useMemo(
		() => ({
			showToast: context.showToast,
			queueToast: context.queueToast,
			hideToast: context.hideToast,
			clearToastQueue: context.clearToastQueue,
		}),
		[context.clearToastQueue, context.hideToast, context.queueToast, context.showToast]
	)
}

export { ToastProvider, useToast, useToastContext }
