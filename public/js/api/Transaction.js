/**
 * Класс Transaction наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/transaction'
 * */
class Transaction extends Entity {
   static URL = '/transaction';
   // Пришлось поменять на Post , а так же поменять это в routes/transaction.js. 
   // Попробовал все возможные и невозможные вариант. Возвращалось true с пустым массивом.
   static list(id, callback) {
      createRequest({ url: this.URL, method: 'POST', data: id, callback: callback })
   }
}
