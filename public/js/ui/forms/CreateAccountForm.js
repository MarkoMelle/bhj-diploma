/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      if (response.success) {
        App.update();
        App.modals.createAccount.close();
      } else {
        if (response.error) { 
          alert(response.error) //Для пользователя
        } else {
          throw new Error(err);  
        }
      }
      App.getForm('createAccount').element.reset();
    }
    )
  }
}