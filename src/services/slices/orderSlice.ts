import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '../../utils/burger-api';
import { getFeedsApi } from '../../utils/burger-api';
import { getOrderByNumberApi } from '../../utils/burger-api';

interface TOrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  userOrders: TOrder[];
  allOrders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
}

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  userOrders: [],
  allOrders: [],
  total: 0,
  totalToday: 0,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res;
  }
);

export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async () => await getFeedsApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order as unknown as TOrder;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(getUserOrders.fulfilled, (state, action: any) => {
        state.userOrders = action.payload.orders || [];
      })
      .addCase(getUserOrders.rejected, (state, action) => {})
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload.orders || [];
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        if (action.payload.orders && action.payload.orders.length > 0) {
          const newOrder = action.payload.orders[0];
          const exists = state.allOrders.some(
            (o) => o.number === newOrder.number
          );
          if (!exists) {
            state.allOrders.push(newOrder);
          }
        } else {
          state.error = 'Заказ не найден';
        }
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.error = 'Ошибка загрузки заказа'; // Если сервер ответил 404 или 500
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
