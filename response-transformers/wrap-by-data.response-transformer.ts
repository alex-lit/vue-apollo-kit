/**
 * Оборачивает ответ сервера в поле "data"
 *
 * @param response Ответ сервера
 */
export async function wrapByDataResponseTransformer(response) {
  const data = await response.json();

  return { data };
}
