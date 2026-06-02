# Checklist de implementacion de mensajeria

## Frontend

- Crear `src/services/messagesService.ts`.
- Crear tipo `MessageReason`.
- Crear constante con motivos y mensajes base.
- Crear componente `PortfolioMessageModal`.
- Agregar estado local en `ExplorePortfolio` para destinatario seleccionado.
- Agregar icono de mensaje en cada tarjeta de portafolio.
- Abrir modal sin cambiar URL ni filtros.
- Validar motivo requerido.
- Validar maximo de 300 caracteres.
- Mostrar estado de envio.
- Mostrar feedback de exito/error.
- Redirigir a login si el usuario no esta autenticado.

## Datos requeridos en exploracion

Cada tarjeta de portafolio deberia incluir:

```ts
type PortfolioCard = {
  id: string
  slug: string
  username: string
  fullName: string
  recipientId: string
  occupation: string
  profileImage: string
  projectsCount: number
  skillsCount: number
  topSkills: string[]
}
```

Si el servicio actual no devuelve `recipientId`, backend debe agregarlo o frontend debe mapearlo desde el campo de usuario disponible.

## Backend

- Crear endpoint `POST /messages`.
- Guardar emisor, destinatario, portafolio, motivo y contenido.
- Crear notificacion `new_message`.
- Exponer listado/conversacion si aun no existe:

```http
GET /messages
GET /messages/{user_id}
```

## UI pendiente de definir

- Pantalla de bandeja de mensajes.
- Pantalla de conversacion.
- Reglas para responder mensajes.
- Si el envio desde portafolio inicia una conversacion o solo crea un mensaje unico.
- Si el destinatario puede bloquear o reportar mensajes.

## Pruebas sugeridas

- El icono abre modal con el nombre correcto.
- El modal se cierra con `Cancelar`, `X` y `Escape`.
- No se pierden filtros ni busqueda en `/explore`.
- No permite enviar sin motivo.
- No permite mas de 300 caracteres.
- Envia payload correcto al servicio.
- Muestra error cuando backend falla.
- Usuario no autenticado no puede enviar.
- Usuario propietario no puede enviarse mensaje a si mismo.

