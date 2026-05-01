/// <reference types="cypress" />

describe('Тестирование конструктора бургера', () => {
  beforeEach(() => {
    // Перехваты запросов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    // Авторизация
    cy.setCookie('accessToken', 'Bearer test-token');
    localStorage.setItem('refreshToken', 'test-token');

    // Запуск сайта
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('должен проверить работу модалок (открытие, крестик, оверлей)', () => {
    // Открытие
    cy.get('[data-testid="ingredient-link"]').first().click();
    cy.get('[data-testid="modal"]')
      .should('be.visible')
      .contains('Краторная булка');

    // Закрытие на крестик
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // Закрытие по оверлею
    cy.get('[data-testid="ingredient-link"]').first().click();
    cy.get('[data-testid="modal-overlay"]').last().click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должен проверить оформление заказа', () => {
    // Добавляем ингредиенты

    cy.contains('Краторная булка').closest('li').find('button').click();

    // Добавляем начинку
    cy.contains('Филе люминесцентного тетраодона')
      .closest('li')
      .find('button')
      .click();

    // Проверяем точно ли ингредиент попал в конструктор
    cy.get('[data-testid="constructor-container"]').within(() => {
      cy.contains('Краторная булка').should('exist');
      cy.contains('Филе люминесцентного тетраодона').should('exist');
    });

    // Имитируем вход
    cy.setCookie('accessToken', 'Bearer test-token');
    localStorage.setItem('refreshToken', 'test-token');

    // Оформить заказ
    cy.get('button').contains('Оформить заказ').click();

    // Проверяем, что запрос ушел
    cy.wait('@postOrder');
    cy.get('[data-testid="order-number"]').should('have.text', '12345');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // Проверяем что конструктор очистился после заказа
    cy.get('[data-testid="constructor-container"]')
      .should('not.contain', 'Краторная булка')
      .and('not.contain', 'Филе люминесцентного тетраодона');
  });
});
