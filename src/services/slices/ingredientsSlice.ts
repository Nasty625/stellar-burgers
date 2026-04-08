import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

interface IIngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
}

const initialState: IIngredientsState = {
  ingredients: [],
  loading: false
};

export const getIngredients = createAsyncThunk(
  'ingredients/get',
  async () => await getIngredientsApi()
);
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
      });
  }
});

export default ingredientsSlice.reducer;
export const getIngredientsState = (state: {
  ingredients: IIngredientsState;
}) => state.ingredients;
