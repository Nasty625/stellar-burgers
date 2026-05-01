import userReducer, {
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  checkUserAuth
} from './userSlice';

describe('тестирование слайса user', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    error: null
  };

  const mockUser = { email: 'test@test.com', name: 'Test User' };
  const mockError = 'Custom Error Message';

  it('должен записывать ошибку и менять isAuthChecked при loginUser.rejected', () => {
    const action = {
      type: loginUser.rejected.type,
      error: { message: mockError }
    };
    const state = userReducer(initialState, action);

    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe(mockError);
  });

  it('должен записывать ошибку при registerUser.rejected', () => {
    const action = {
      type: registerUser.rejected.type,
      error: { message: mockError }
    };
    const state = userReducer(initialState, action);

    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe(mockError);
  });

  it('должен записывать ошибку при updateUser.rejected', () => {
    const action = {
      type: updateUser.rejected.type,
      error: { message: mockError }
    };
    const state = userReducer(initialState, action);

    expect(state.error).toBe(mockError);
  });

  it('должен записывать ошибку при logoutUser.rejected', () => {
    const action = {
      type: logoutUser.rejected.type,
      error: { message: mockError }
    };
    const state = userReducer(initialState, action);

    expect(state.error).toBe(mockError);
  });

  it('должен записывать данные пользователя при loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    };
    const state = userReducer(initialState, action);

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });
});
