# Mensajeria en exploracion de portafolios

## Objetivo

Agregar una accion de contacto desde la pantalla `Explorar Portafolios` para que un usuario pueda enviar un mensaje rapido al propietario de un portafolio publicado.

La accion se mostrara como un icono de mensaje en cada tarjeta de portafolio, ubicado en la esquina inferior derecha. Al presionarlo se abrira un modal similar a la referencia visual enviada.

## Flujo principal

1. El usuario entra a `/explore`.
2. Busca o filtra portafolios.
3. En una tarjeta de portafolio, presiona el icono de mensaje.
4. Se abre el modal `Enviar mensaje a {nombre}`.
5. El usuario selecciona un motivo de contacto.
6. Opcionalmente escribe detalles adicionales.
7. Presiona `Enviar mensaje`.
8. El sistema crea el mensaje y muestra confirmacion.

## Origen del nombre del destinatario

El texto del titulo del modal debe usar el nombre de datos personales del usuario propietario del portafolio:

```txt
Enviar mensaje a Ana Lopez
```

Prioridad sugerida:

1. `portfolio.fullName`
2. `portfolio.profile.name`
3. `portfolio.user.fullname`
4. `portfolio.username`

Si no existe nombre completo, usar el nombre de usuario como respaldo.

## Ubicacion del icono

En cada tarjeta de exploracion:

- Mantener el boton `Ver` para abrir el portafolio publicado.
- Agregar un boton con icono de mensaje en la esquina inferior derecha de la tarjeta.
- El boton debe tener `aria-label="Enviar mensaje a {nombre}"`.
- El boton no debe navegar al portafolio.
- El boton debe abrir el modal con el destinatario de esa tarjeta.

## Modal

Titulo:

```txt
Enviar mensaje a {nombre}
```

Campos:

- `Motivo de contacto *`
- `Detalles adicionales (opcional)`

Acciones:

- `Enviar mensaje`
- `Cancelar`
- Boton `X` para cerrar

El modal debe bloquear el fondo y poder cerrarse con:

- `Cancelar`
- `X`
- tecla `Escape`

## Motivos de contacto

Opciones del modal:

| Motivo | Mensaje base |
| --- | --- |
| Oportunidad laboral | Hola, me interesa tu perfil profesional. Tengo una oportunidad laboral que podria interesarte. |
| Colaboracion en proyecto | Hola, estoy trabajando en un proyecto y me gustaria colaborar contigo. |
| Consulta tecnica | Hola, me gustaria consultarte sobre tu experiencia en algunas tecnologias. |
| Networking profesional | Hola, me gustaria conectar contigo y ampliar mi red profesional. |
| Mentoria | Hola, me interesa aprender de tu experiencia. ¿Podrias orientarme? |
| Propuesta freelance | Hola, tengo un proyecto freelance que podria interesarte. |

## Detalles adicionales

El textarea es opcional.

Reglas:

- Maximo: 300 caracteres.
- Mostrar contador `0/300 caracteres`.
- No permitir superar el maximo.
- Placeholder: `Agrega mas informacion si lo deseas...`

## Estados esperados

Sin motivo seleccionado:

- El boton `Enviar mensaje` puede estar deshabilitado.
- Alternativamente, al presionar enviar se muestra error: `Selecciona un motivo de contacto.`

Enviando:

- Deshabilitar botones.
- Cambiar texto a `Enviando...`.

Exito:

- Cerrar modal.
- Mostrar feedback: `Mensaje enviado correctamente.`

Error:

- Mantener modal abierto.
- Mostrar feedback: `No se pudo enviar el mensaje. Intentalo nuevamente.`

## Restricciones

- No debe perderse la busqueda actual de `/explore`.
- No debe cambiar la paginacion ni filtros al abrir o cerrar el modal.
- Si el usuario no esta autenticado, se debe redirigir a login o mostrar aviso para iniciar sesion antes de enviar.
- El propietario del portafolio no debe poder enviarse mensaje a si mismo.

