# Recon
 Recon is a type safe context powered state container providing a hook based API for React.

# Usage
LightsReducer.ts will look something similar to this

```typescript
import {createStore} from 'recon

enum LightStatus {
    ON,
    OFF
}

interface LightState {
    status: LightStatus;
}

enum LightActions {
    CHANGE_STATUS = Symbol('CHANGE_STATUS')
}

const reducer = (state, action): LightState => {
	switch (action.type) {
		case LightActions.CHANGE_STATUS: {
			return {
				...state,
				...{
				    status: action.payload
				}
			}
		}
		default:
			return state;
	}
};

const initialLightState: LightState = {
	status: LightStatus.OFF,
}

const [LightsProvider, useLights] = createStore <LightState,LightActions >(reducer, initialLightState);

export {
	LightsProvider,
	useLights,
	LightActions,
	LightStatus
};

```

You can use the state in your app by wrapping the provider around either your entire app or just the part you want state to be accessible in.

in App.tsx

```typescript
import * as React from 'react';
import {LightsProvider} from 'LightsReducer`;

const App = () => {
    return (
        <>
            <LightsProvider>
                <YourComponent />
            </LightsProvider>
        </>
    );
}


```

and in YourComponent.tsx

```typescript
import * as React from 'react';
import {useLights,LightActions,LightStatus} from 'LightsReducer`;

const YourComponent = () => {
  const [{ status }, changeLightStatus] = useLights();
  return (
    <>
      <button
        onClick={() =>
          changeLightStatus({
            type: LightActions.CHANGE_STATUS,
            payload: LightStatus.ON,
          })
        }
      >
        {status}
      </button>
    </>
  );
};


```