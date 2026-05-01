import orderReducer, { createOrder, clearOrder } from './orderSlice';

describe('тестирование слайса order', () => {
  const initialState = {
    orderRequest: false,
    orderModalData: null,
    userOrders: [],
    allOrders: [],
    total: 0,
    totalToday: 0,
    error: null
  };

  it('должен очищать данные заказа (clearOrder)', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: { number: 123 } as any
    };
    const state = orderReducer(stateWithOrder, clearOrder());
    expect(state.orderModalData).toBeNull();
  });

  it('должен менять orderRequest на true при createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять номер заказа при createOrder.fulfilled', () => {
    const mockOrder = { number: 12345 };
    const action = {
      type: createOrder.fulfilled.type,
      payload: { order: mockOrder }
    };
    const state = orderReducer({ ...initialState, orderRequest: true }, action);

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
  });

  it('должен записывать ошибку при createOrder.rejected', () => {
    const mockError = 'Failed to create order';
    const action = {
      type: createOrder.rejected.type,
      error: { message: mockError }
    };
    const state = orderReducer({ ...initialState, orderRequest: true }, action);

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(mockError);
  });
});
