# Contrato sugerido para mensajeria

## Crear mensaje

Endpoint sugerido:

```http
POST /messages
```

Payload:

```json
{
  "recipient_id": "123",
  "portfolio_slug": "ana-lopez",
  "reason": "job_opportunity",
  "base_message": "Hola, me interesa tu perfil profesional. Tengo una oportunidad laboral que podria interesarte.",
  "additional_details": "Vi tu experiencia en React y me gustaria conversar."
}
```

Respuesta exitosa:

```json
{
  "success": true,
  "message": "Mensaje enviado correctamente.",
  "data": {
    "id": "987",
    "sender_id": "456",
    "recipient_id": "123",
    "portfolio_slug": "ana-lopez",
    "reason": "job_opportunity",
    "content": "Hola, me interesa tu perfil profesional. Tengo una oportunidad laboral que podria interesarte.\n\nVi tu experiencia en React y me gustaria conversar.",
    "created_at": "2026-06-02T20:00:00Z"
  }
}
```

## Campos

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `recipient_id` | string/number | Si | Usuario propietario del portafolio |
| `portfolio_slug` | string | Si | Slug del portafolio desde exploracion |
| `reason` | string | Si | Motivo seleccionado |
| `base_message` | string | Si | Texto predefinido del motivo |
| `additional_details` | string | No | Texto opcional del usuario, maximo 300 caracteres |

## Motivos permitidos

```ts
type MessageReason =
  | "job_opportunity"
  | "project_collaboration"
  | "technical_question"
  | "professional_networking"
  | "mentorship"
  | "freelance_proposal"
```

## Validaciones backend

- El usuario debe estar autenticado.
- `recipient_id` debe existir.
- `recipient_id` no puede ser el mismo usuario autenticado.
- El portafolio debe estar publicado.
- `reason` debe pertenecer a los motivos permitidos.
- `additional_details` no debe superar 300 caracteres.
- Sanitizar contenido antes de guardar.

## Errores esperados

Usuario no autenticado:

```json
{
  "success": false,
  "message": "Debes iniciar sesion para enviar mensajes."
}
```

Motivo invalido:

```json
{
  "success": false,
  "message": "El motivo de contacto no es valido."
}
```

Destinatario invalido:

```json
{
  "success": false,
  "message": "No puedes enviarte un mensaje a ti mismo."
}
```

## Notificaciones

Cuando se cree un mensaje, el backend deberia generar una notificacion:

```json
{
  "type": "new_message",
  "recipient_id": "123",
  "sender_id": "456",
  "message_id": "987",
  "description": "Tienes un nuevo mensaje desde tu portafolio."
}
```

El frontend ya contempla notificaciones `new_message` y navega a `/messages/{sender_id}` si existe `sender_id`.

