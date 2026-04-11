import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const { ingredients } = useSelector((state) => state.ingredients);
  const { allOrders, userOrders } = useSelector((state) => state.order);
  const { error } = useSelector((state) => state.order);

  useEffect(() => {
    const orderExists = [...allOrders, ...userOrders].some(
      (o) => o.number === Number(number)
    );
    if (!orderExists && number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, allOrders, userOrders]);
  const orderData = useMemo(
    () =>
      [...allOrders, ...userOrders].find((o) => o.number === Number(number)),
    [allOrders, userOrders, number]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (error) {
    return <p className='text text_type_main-medium'>{error}</p>;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
