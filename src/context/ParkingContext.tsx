'use client';

import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { ParkingState, ParkingAction } from '@/types/parking';

const initialState: ParkingState = {
  plate: '',
  sessionId: null,
  slotId: null,
  fee: null,
  payContent: null,
  parkStart: null,
  connected: false,
  slotData: {},
};

function parkingReducer(state: ParkingState, action: ParkingAction): ParkingState {
  switch (action.type) {
    case 'SET_PLATE':
      return { ...state, plate: action.plate };
    case 'SET_SESSION':
      return { ...state, sessionId: action.sessionId };
    case 'SET_SLOT':
      return { ...state, slotId: action.slotId };
    case 'SET_PAYMENT':
      return { ...state, fee: action.fee, payContent: action.content };
    case 'SET_PARK_START':
      return { ...state, parkStart: action.time };
    case 'SET_CONNECTED':
      return { ...state, connected: action.connected };
    case 'UPDATE_SLOTS':
      return { ...state, slotData: action.slotData };
    case 'RESET':
      return { ...initialState, connected: state.connected, slotData: state.slotData };
    default:
      return state;
  }
}

const ParkingContext = createContext<ParkingState>(initialState);
const ParkingDispatchContext = createContext<Dispatch<ParkingAction>>(() => {});

export function ParkingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(parkingReducer, initialState);

  return (
    <ParkingContext.Provider value={state}>
      <ParkingDispatchContext.Provider value={dispatch}>
        {children}
      </ParkingDispatchContext.Provider>
    </ParkingContext.Provider>
  );
}

export function useParking() {
  return useContext(ParkingContext);
}

export function useParkingDispatch() {
  return useContext(ParkingDispatchContext);
}
