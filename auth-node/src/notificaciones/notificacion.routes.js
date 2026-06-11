import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { resolveCliente } from '../../middlewares/resolve-cliente.js';
import { authorizeRole } from '../../middlewares/authorize-role.js';
import {
  listarNotificacionesAdmin,
  listarNotificacionesCliente,
  marcarNotificacionAdminLeida,
  marcarTodasAdminLeidas,
} from './notificacion.service.js';

const router = Router();

router.get('/me', validateJWT, resolveCliente, async (req, res) => {
  const notificaciones = await listarNotificacionesCliente(req.cliente._id);
  return res.status(200).json({
    success: true,
    data: notificaciones.map((item) => ({
      id: item._id.toString(),
      categoria: item.categoria,
      evento: item.evento,
      asunto: item.asunto,
      resumen: item.resumen,
      estado: item.estado,
      fecha: item.createdAt,
    })),
  });
});

const mapAdminNotification = (item) => ({
  id: item._id.toString(),
  categoria: item.categoria,
  evento: item.evento,
  titulo: item.asunto,
  resumen: item.resumen,
  leida: item.leidaAdmin,
  fecha: item.createdAt,
});

router.get('/admin', validateJWT, authorizeRole('ADMIN_ROLE'), async (req, res) => {
  const notificaciones = await listarNotificacionesAdmin();
  return res.status(200).json({
    success: true,
    data: notificaciones.map(mapAdminNotification),
    noLeidas: notificaciones.filter((item) => !item.leidaAdmin).length,
  });
});

router.patch('/admin/:id/leida', validateJWT, authorizeRole('ADMIN_ROLE'), async (req, res) => {
  const notificacion = await marcarNotificacionAdminLeida(req.params.id);
  if (!notificacion) {
    return res.status(404).json({ success: false, message: 'Notificacion no encontrada' });
  }
  return res.status(200).json({ success: true, data: mapAdminNotification(notificacion) });
});

router.patch('/admin/leidas/todas', validateJWT, authorizeRole('ADMIN_ROLE'), async (req, res) => {
  await marcarTodasAdminLeidas();
  return res.status(200).json({ success: true, message: 'Notificaciones marcadas como leidas' });
});

export default router;
