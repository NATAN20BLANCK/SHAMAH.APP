// Polyfill para React.use que está faltando no ambiente Web
import React from 'react';

// Se React.use não existir, vamos criar um substituto simples
if (!React.use) {
  React.use = function use(promise) {
    if (promise.status === 'fulfilled') {
      return promise.value;
    } else if (promise.status === 'rejected') {
      throw promise.reason;
    } else if (promise.status === 'pending') {
      throw promise;
    } else {
      promise.status = 'pending';
      promise.then(
        result => {
          promise.status = 'fulfilled';
          promise.value = result;
        },
        reason => {
          promise.status = 'rejected';
          promise.reason = reason;
        }
      );
      throw promise;
    }
  };
}

export default React;
