/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      console.error('В TransactionsWidget передан пустой элемент');
    }
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeBtn = document.querySelector('.create-income-button');
    const expense = document.querySelector('.create-expense-button');

    incomeBtn.onclick = (e) => {
      App.getModal('newIncome').open();
    };

    expense.onclick = (e) => {
      App.getModal('newExpense').open();
    };
  }
}
