# Requisitos para el correcto funcionamiento

- Cambiar el valor de la constante `CONTACT_BASE_NAME` ubicada en `app.ts`. Por ejemplo, si los contactos se llamaran TELECENTRO AA 1, TELECENTRO AA 2, `CONTACT_BASE_NAME` deberá ser `TELECENTRO AA`.
- El software funciona tanto para archivos `.xls` como `.xlsx`, chequear la constante `EXCEL_EXTENSION` en `app.ts` en caso de querer switchear de extensión.
- Las columnas del Excel tienen que respetar el formato y los nombres tienen que estar escritos **exactamente** igual, caso contrario no funcionará.

### Formato de las columnas del Excel

| id  | Cliente                   | Dirección                                | Telefono   |
| --- | ------------------------- | ---------------------------------------- | ---------- |
| 1   | CHOCOBAR, LUCIANA MICAELA | BARTOLOME NOVARO 2928 - BOULOGNE SUR MER | 1121926940 |
| 2   | GOMEZ, ANGELA SOLEDAD     | EL INDIO 2262 V. Adelina                 | 1168062126 |
