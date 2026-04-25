import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '../../pages';
import '../../index.css';
import styles from './app.module.css';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { AppDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/slices/userSlice';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails
} from '../../components';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { ProtectedRoute } from '../protected-route/protected-route';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthChecked } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const background = location.state?.background;

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <>
      <AppHeader />
      <main className={styles.main}>
        {!isAuthChecked ? (
          <Preloader />
        ) : (
          <>
            <Routes location={background || location}>
              <Route path='/' element={<ConstructorPage />} />
              <Route path='/feed' element={<Feed />} />
              <Route
                path='/login'
                element={<ProtectedRoute onlyUnAuth component={<Login />} />}
              />
              <Route
                path='/register'
                element={<ProtectedRoute onlyUnAuth component={<Register />} />}
              />

              <Route
                path='/forgot-password'
                element={
                  <ProtectedRoute onlyUnAuth component={<ForgotPassword />} />
                }
              />

              <Route
                path='/reset-password'
                element={
                  <ProtectedRoute onlyUnAuth component={<ResetPassword />} />
                }
              />

              <Route
                path='/profile'
                element={<ProtectedRoute component={<Profile />} />}
              />
              <Route
                path='/profile/orders'
                element={<ProtectedRoute component={<ProfileOrders />} />}
              />

              <Route path='/feed/:number' element={<OrderInfo />} />
              <Route path='/ingredients/:id' element={<IngredientDetails />} />
              <Route path='/profile/orders/:number' element={<OrderInfo />} />

              <Route path='*' element={<NotFound404 />} />
            </Routes>
            {background && (
              <Routes>
                <Route
                  path='/feed/:number'
                  element={
                    <Modal title='Детали заказа' onClose={handleModalClose}>
                      <OrderInfo />
                    </Modal>
                  }
                />
                <Route
                  path='/ingredients/:id'
                  element={
                    <Modal
                      title='Детали ингредиента'
                      onClose={handleModalClose}
                    >
                      <IngredientDetails />
                    </Modal>
                  }
                />
                <Route
                  path='/profile/orders/:number'
                  element={
                    <ProtectedRoute
                      component={
                        <Modal title='Детали заказа' onClose={handleModalClose}>
                          <OrderInfo />
                        </Modal>
                      }
                    />
                  }
                />
              </Routes>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default App;
