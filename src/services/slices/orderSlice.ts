import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '../../utils/burger-api';
import { getFeedsApi } from '../../utils/burger-api';

interface TOrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  userOrders: TOrder[];
  allOrders: TOrder[];
  total: number;
  totalToday: number;
}

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  userOrders: [],
  allOrders: [],
  total: 0,
  totalToday: 0
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
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
