import type { ActivityItem, ActivitySummary } from '../types';

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    date: '2026-06-12T10:23:00Z',
    type: 'mensaje',
    preview: 'Estimado cliente, su cuenta BBVA ha sido bloqueada. Ingrese aquí para desbloquearla...',
    verdict: 'estafa',
    riskLevel: 'alto',
    details:
      'Phishing bancario. El número no corresponde a ningún banco registrado. Solicita credenciales personales mediante enlace falso.',
  },
  {
    id: 'a2',
    date: '2026-06-11T15:45:00Z',
    type: 'audio',
    preview: 'Mensaje de voz de un número desconocido (2 min 14 seg)',
    verdict: 'sospechoso',
    riskLevel: 'medio',
    details: 'Voz generada por IA detectada. Menciona un supuesto premio de lotería y solicita confirmación de datos.',
  },
  {
    id: 'a3',
    date: '2026-06-10T08:12:00Z',
    type: 'mensaje',
    preview: 'Hola mamá, soy yo. ¿Puedes hablar? Llámame cuando puedas.',
    verdict: 'seguro',
    riskLevel: 'bajo',
  },
  {
    id: 'a4',
    date: '2026-06-09T19:30:00Z',
    type: 'mensaje',
    preview: 'FELICIDADES! Ganó $50,000 pesos en el sorteo nacional. Llame al 800 para reclamar su premio...',
    verdict: 'estafa',
    riskLevel: 'alto',
    details: 'Fraude de lotería. Solicita depósito previo para liberar el premio. Número de contacto no registrado.',
  },
  {
    id: 'a5',
    date: '2026-06-08T11:00:00Z',
    type: 'audio',
    preview: 'Recordatorio de cita médica del IMSS (45 seg)',
    verdict: 'seguro',
    riskLevel: 'bajo',
  },
  {
    id: 'a6',
    date: '2026-06-07T14:20:00Z',
    type: 'mensaje',
    preview: 'Su paquete está retenido en aduana. Pague $350 pesos para liberar su envío...',
    verdict: 'sospechoso',
    riskLevel: 'medio',
    details: 'Posible fraude de paquetería. No se detecta cuenta de envío activa. Enlace de pago no verificado.',
  },
];

export const MOCK_SUMMARY: ActivitySummary = {
  total: 6,
  safe: 2,
  suspicious: 2,
  fraudsBlocked: 2,
};
