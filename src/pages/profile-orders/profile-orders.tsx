import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const orders = useSelector((state) => state.order.userOrders) || [];
  useEffect(() => {
    if (user) {
      dispatch(getUserOrders());
    }
  }, [dispatch, user]);

  return <ProfileOrdersUI orders={orders} />;
};
