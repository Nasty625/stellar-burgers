import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при вызове с неопределенным состоянием и неизвестным экшеном', () => {
    // Вызываем rootReducer с undefined
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем наличие ключевых слайсов в сторе
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('order');
  });
});
