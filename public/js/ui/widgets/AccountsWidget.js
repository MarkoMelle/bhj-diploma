/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
      this.update();
    } else {
      throw new Error('В AccountsWidget передан пустой элемент');
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccBtn = document.querySelector('.create-account');
    const accPanel = document.querySelector('.accounts-panel');

    createAccBtn.addEventListener('click', (e) => {
      e.preventDefault();
      App.getModal('createAccount').open()
    })

    accPanel.addEventListener('click', (e) => {
      if (e.target.closest('.account')) {
        e.preventDefault();
        this.onSelectAccount(e.target.closest('.account'));
      }
    })

    // accBtn.forEach(btn => {
    //   btn.addEventListener('click', (e) => {

    //   })
    // })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(User.current().id, (err, response) => {
        if (response.success) {
          this.clear();
          this.renderItem(response.data);
        }
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accBtn = Array.from(document.querySelectorAll('.account'))
    accBtn.forEach(element => {
      element.remove();
    });

  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    let activeAcc = document.querySelector('.account.active');
    if (activeAcc) { activeAcc.classList.remove('active') };
    element.classList.add('active');
    this.active = +element.dataset.id
    App.showPage('transactions', { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    if (!item.name) {
      return '';
    }
    const li = document.createElement('li');
    li.dataset.id = item.id;
    li.classList.add('account');
    li.innerHTML = ` <a href="#">
      <span>${item.name}</span> 
      <span> / ${item.sum} ₽</span>
      </a>`;
    return li;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    data.forEach(item => {
      const accPanel = document.querySelector('.accounts-panel');
      accPanel.append(this.getAccountHTML(item));
    })
    if (this.active) {
      document.querySelector(`[data-id="${this.active}"]`).classList.add('active')
    }
  }
}
