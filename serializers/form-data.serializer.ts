/**
 * Приводит данные к формату FormData
 *
 * @param data Исходные данные
 * @param headers Заголовок
 */
export function formDataSerializer(data: any, headers: Headers) {
  const formData = new FormData();

  /**
   * Преобразование типа данных: Object -> FormData
   */
  Object.keys(data).forEach((key) => {
    // eslint-disable-next-line unicorn/no-null
    if (!['undefined', null].includes(data[key])) {
      if (Array.isArray(data[key])) {
        data[key].forEach((element: any) => {
          formData.append(key, element);
        });
      } else {
        formData.set(key, data[key]);
      }
    }
  });

  /**
   * При создании FormData по неясной причине в него добавилось поле
   * `id:undefined`, поэтому заменяем его на значение из данных или удаляем вовсе
   */
  if (data.id || data.id === 0) {
    formData.set('id', data.id);
  } else {
    formData.delete('id');
  }

  headers.set('Content-Type', 'multipart/form-data');

  return { body: formData, headers };
}
