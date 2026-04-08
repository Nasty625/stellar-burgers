import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  TRegisterData,
  loginUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie } from '../../utils/cookie';
import { TLoginData } from '../../utils/burger-api';
import { logoutApi } from '../../utils/burger-api';
import { deleteCookie } from '../../utils/cookie';
import { registerUserApi } from '../../utils/burger-api';

interface TUserState {
  user: TUser | null;
  isAuthChecked: boolean;
}

const initialState: TUserState = {
  user: null,
  isAuthChecked: false
};

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async () => await getUserApi()
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: TRegisterData) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {})
      .addCase(registerUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action: any) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      });
  }
});

export const { setUser, setAuthChecked } = userSlice.actions;

export default userSlice.reducer;
