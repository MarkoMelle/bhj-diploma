/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
   const { url, headers, method, data, callback } = options;

   const xhr = new XMLHttpRequest;
   let formData = new FormData();
   xhr.responseType = 'json';

   try {
      if (typeof (data) != 'object') {
         formData = data;
      } else if(data instanceof FormData) {
         formData = data;
      }  else {
         for (let i in data) {
            formData.set(i, data[i])
         };
      }
      xhr.open(method, url);
      if (headers) { xhr.setRequestHeader(headers.name, headers.value) };
      xhr.send(formData);
      xhr.addEventListener('load', () => {
         callback(null, xhr.response);
      })
   } catch (error) {
      callback(error, xhr.response);
   }
};
