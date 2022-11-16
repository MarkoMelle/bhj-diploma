/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      console.error('В TransactionsPage передан пустой элемент');
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    document.querySelector('.remove-account').addEventListener('click', (e) => {
      this.removeAccount();
    })
    let remTranBtns = Array.from(document.querySelectorAll('.transaction__remove'));
    remTranBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.removeTransaction(e.target.dataset.id)
      })
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      if (confirm('Вы действительно хотите удалить счет?')) {
        Account.remove({ 'id': this.lastOptions.account_id }, (err, response) => {
          if (response.success) {
            this.clear()
            App.update();
          } else {
            alert(err);
          }
        })
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({ 'id': id }, (err, response) => {
        if (response.success) {
          this.update();
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, (err, response) => {
        if (response.success) {
          this.renderTitle(response.data.name);
        } else {
          if (response.error) {
            alert(response.error) //Для пользователя
          } else {
            throw new Error(err);
          }
        }
      })

      Transaction.list(`account_id=${options.account_id}`, (err, response) => {
        if (response && response.success) {
          this.renderTransactions(response.data);
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
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета')
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const title = this.element.querySelector('.content-title')
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let options = { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('ru-RU', options).replace(',', ' в');
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const transaction = document.createElement('div');
    transaction.classList.add('transaction', `${'transaction_' + item.type}`, 'row');
    transaction.innerHTML = `<div class="col-md-7 transaction__details">
           <div class="transaction__icon">
             <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
               <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
         </div>
         <div class="col-md-3">
           <div class="transaction__summ">
              ${item.sum} <span class="currency">₽</span>
           </div>
         </div>
         <div class="col-md-2 transaction__controls">
             
             <button class="btn btn-danger transaction__remove" data-id=${item.id}>
                 <i class="fa fa-trash"></i>  
             </button>
         </div>`;
    return transaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    console.log(data)
    const content = this.element.querySelector('.content')
    let tranList = '';
    data.forEach(item => {
      tranList += this.getTransactionHTML(item).outerHTML;
    })
    content.innerHTML = tranList;
    this.registerEvents();
  }
}