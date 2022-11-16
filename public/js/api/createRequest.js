/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
   const { url, method, data, callback } = options;

   const xhr = new XMLHttpRequest;
   let formData = new FormData();
   xhr.responseType = 'json';

   if (typeof (data) != 'object' || data instanceof FormData) {
      formData = data;
   } else {
      for (let i in data) {
         formData.set(i, data[i])
      };
   }

   try {
      xhr.open(method, url);
      xhr.send(formData);
   } catch (error) {
      callback(error, xhr.response);
   }
   xhr.addEventListener('load', () => {
      callback(null, xhr.response);
   })
};
