import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from './constructorSlice';

describe('Тестирование редьюсера burgerConstructor', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockIngredient = {
    _id: '1',
    name: 'Начинка 1',
    type: 'main',
    price: 100,
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const mockBun = { ...mockIngredient, _id: '2', name: 'Булка', type: 'bun' };

  it('должен обрабатывать добавление ингредиента (начинка)', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(state.ingredients).toHaveLength(1);

    expect(state.ingredients[0]).toMatchObject({
      name: 'Начинка 1',
      price: 100
    });
    expect(state.ingredients[0].id).toBeDefined();
  });
  it('должен обрабатывать добавление булки', () => {
    const state = constructorReducer(initialState, addIngredient(mockBun));
    expect(state.bun).toMatchObject({ name: 'Булка', type: 'bun' });
  });

  it('должен обрабатывать удаление ингредиента', () => {
    const stateWithItem = {
      bun: null,
      ingredients: [{ ...mockIngredient, id: 'test-id-123' }]
    };
    const state = constructorReducer(
      stateWithItem,
      removeIngredient('test-id-123')
    );
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать изменение порядка ингредиентов в начинке', () => {
    const stateWithItems = {
      bun: null,
      ingredients: [
        { ...mockIngredient, id: '1', name: 'Первый' },
        { ...mockIngredient, id: '2', name: 'Второй' }
      ]
    };

    const state = constructorReducer(
      stateWithItems,
      moveIngredient({ index: 0, delta: 1 })
    );

    expect(state.ingredients[0].name).toBe('Второй');
    expect(state.ingredients[1].name).toBe('Первый');
  });
});
