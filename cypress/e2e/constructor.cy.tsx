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
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('должен проверить работу модалок (открытие, крестик, оверлей)', () => {
    // Открытие
    cy.get('[data-testid="ingredient-link"]').first().click();
    cy.get('[data-testid="modal"]')
      .should('be.visible')
      .contains('Крафтовая булка');

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
    cy.contains('Добавить').first().click({ force: true });
    cy.contains('Добавить').last().click({ force: true });

    // Имитируем вход
    cy.setCookie('accessToken', 'Bearer test-token');
    localStorage.setItem('refreshToken', 'test-token');

    // Оформить заказ
    cy.get('button').contains('Оформить заказ').click();

    // Проверяем, что запрос ушел
    cy.wait('@postOrder');
    cy.get('[data-testid="order-number"]').should('have.text', '12345');
  });
});
