import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {},
  admin: false,
  users: [],
  events: []
}

export const appSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload.is_admin === true) {
        state.admin = true;
      }
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    }
  },
})

export const { setUser, setUsers, setEvents } = appSlice.actions

export default appSlice.reducer