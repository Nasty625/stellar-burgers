import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при вызове с неопределенным состоянием и неизвестным экшеном', () => {
    // Вызываем rootReducer с undefined
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем наличие ключевых слайсов в сторе
    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      user: {
        user: null,
        isAuthChecked: false,
        error: null
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        userOrders: [],
        allOrders: [],
        total: 0,
        totalToday: 0,
        error: null
      }
    });
  });
});
