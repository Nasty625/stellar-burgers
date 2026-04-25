import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue((prevState) => ({
        ...prevState,
        name: user.name,
        email: user.email,
        password: ''
      }));
    }
  }, [user]);

  const isFormChanged =
    !!user &&
    (formValue.name.trim() !== user.name.trim() ||
      formValue.email.trim() !== user.email.trim() ||
      formValue.password.trim() !== '');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue))
      .unwrap()
      .then((updatedUser) => {
        console.log('Данные обновлены успешно');
        // Системный updatedUser — это то, что вернул сервер
        setFormValue({
          name: updatedUser.name,
          email: updatedUser.email,
          password: '' // Очищаем пароль ОБЯЗАТЕЛЬНО
        });
      })
      .catch((err) => {
        console.log('Ошибка при сохранении:', err); // Посмотри, что тут
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  console.log('Имя совпадает?', formValue.name === user?.name);
  console.log('Email совпадает?', formValue.email === user?.email);
  console.log('Пароль пустой?', formValue.password === '');
  console.log('Финальный isFormChanged:', isFormChanged);

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
