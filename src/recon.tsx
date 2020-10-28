import * as React from 'react'

interface Action<T> {
  type: T
  payload: any
}
const createStore = <T, P>(
  reducer: (state: T, action: Action<P>) => T,
  initialState: T
): [
  React.FC<{ children: React.ReactNode; initial?: Partial<T> }>,
  () => [T, ({ type, payload }: { type: P; payload: Partial<T> }) => any],
  React.Context<null>
] => {
  const stateContext = React.createContext(null)

  const reducerContext = React.createContext(null)

  const useDispatch = (): (() => { type: P; payload: Partial<T> }) => {
    const context: any = React.useContext(reducerContext)
    if (context === undefined) {
      throw new Error('dispatch must be used within a provider')
    }
    return context
  }

  const useStateValue = () => {
    const context: any = React.useContext(stateContext)
    if (context === undefined) {
      throw new Error('state must be used within a provider')
    }
    return context
  }

  const Provider: React.FC<{ children: React.ReactNode; initial?: Partial<T> }> = ({
    children,
    initial
  }: {
    children: React.ReactNode
    initial?: Partial<T>
  }) => {
    const initialValue:any = initial ? initial: initialState;
    const [state, dispatch] = React.useReducer<(state: T, action: Action<P>) => T>(
      reducer,
      initialValue
    )

    return (
      <stateContext.Provider value={state as any}>
        <reducerContext.Provider value={dispatch as any}>{children}</reducerContext.Provider>
      </stateContext.Provider>
    )
  }

  const useState = (): [T, ({ type, payload }: { type: P; payload: Partial<T> }) => any] => [
    useStateValue(),
    useDispatch(),
  ]
  return [Provider, useState, stateContext]
}

export { createStore, Action }
