import { error } from 'console';
import ingredientsReducer, { getIngredients } from './ingredientsSlice';

describe('тестирование слайса ingredients', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('должен менять loading на true при запросе getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('должен записывать данные и менять loading на false при getIngredients.fulfilled', () => {
    const mockIngredients = [
      { _id: '1', name: 'Ингредиент 1', type: 'main', price: 100 },
      { _id: '2', name: 'Ингредиент 2', type: 'sauce', price: 200 }
    ];
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен менять loading на false при getIngredients.rejected', () => {
    const mockError = 'Error';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: mockError }
    };

    const state = ingredientsReducer(
      { ...initialState, loading: true },
      action
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockError);
  });
});
