import type { NavigateFunction } from 'react-router-dom'
import type { NotificationItem } from '@/services/notificationsService'
import { MESSAGES_ROUTE } from '@/routes/route-paths'

export function navigateFromNotification(
  notification: NotificationItem,
  navigate: NavigateFunction
) {
  if (!notification.data) {
    navigate(notification.link || '/notificaciones')
    return
  }

  const data = notification.data

  switch (notification.dataType) {
    case 'weekly_global_report':
      navigate(
        data.report_id 
          ? `/tendencia-plantillas?report_id=${data.report_id}` 
          : '/tendencia-plantillas'
      )
      break

    case 'new_message':
      navigate(
        data.message_id
          ? `${MESSAGES_ROUTE}/${data.message_id}`
          : MESSAGES_ROUTE
      )
      break

    case 'portfolio_view':
      navigate('/visualizaciones')
      break

    case 'certificate_rejected':
      navigate(
        data.certificate_id
          ? `/certificados/editar?id=${data.certificate_id}`
          : '/certificados/ver'
      )
      break

    default:
      navigate(notification.link || '/notificaciones')
  }
}