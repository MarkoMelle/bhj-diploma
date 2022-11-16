/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    if (User.current()) {
      Account.list(User.current(), (err, response) => {
        if (response.success) {
          let select = this.element.querySelector('select');
          let acclist = '';
          response.data.forEach(acc => {
            const option = document.createElement('option');
            option.value = acc.id;
            option.textContent = acc.name;
            acclist += option.outerHTML;
          });
          select.innerHTML = acclist;
        } else {
          if (response.error) {
            alert(response.error) //Для пользователя
          } else {
            throw new Error(err);
          }
        }
      })
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        App.update();
        this.element.reset();
        App.getModal('newExpense').close()
        App.getModal('newIncome').close()
        if (response.error) { alert(response.error) }//Для пользователя
      } else {
        if (response.error) {
          alert(response.error) //Для пользователя
        } else {
          throw new Error(err);
        }
      }
    })
  }
}