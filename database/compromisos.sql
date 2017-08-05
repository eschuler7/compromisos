-- Preparación de data para la plataforma
-- Inserts iniciales de la tabla role
insert into t_rol values('ROL1','Administrador','Administrador de la cuenta',1,1,1,1,now(),now());
insert into t_rol values('ROL2','Responsables','Responsables de Unidades',0,0,1,1,now(),now());
insert into t_rol values('ROL3','Terceros de Soporte','Terceros de Soporte',0,1,1,0,now(),now());
insert into t_rol values('ROL4','Supervisores','Supervisores de Compromisos',0,1,1,1,now(),now());
insert into t_rol values('ROL5','Super Admin','SIGN EQ Super Admin User',0,1,1,1,now(),now());
-- Inserts iniciales para la tabla dashboard
insert into t_dashboard(name,cdatetime,udatetime) values('Total Compromisos',now(),now());
insert into t_dashboard(name,cdatetime,udatetime) values('Compromisos que requieren acción',now(),now());
insert into t_dashboard(name,cdatetime,udatetime) values('Compromisos en cumplimiento',now(),now());
insert into t_dashboard(name,cdatetime,udatetime) values('Compromisos en cumplimiento con sustento',now(),now());
insert into t_dashboard(name,cdatetime,udatetime) values('Compromisos incumplidos',now(),now());
insert into t_dashboard(name,cdatetime,udatetime) values('Compromisos incumplidos con un plan de acción',now(),now());
insert into t_dashboard(name,cdatetime,udatetime) values('Compromisos sin un plan de acción',now(),now());
insert into t_dashboard(name,cdatetime,udatetime) values('Compromisos críticos incumplidos',now(),now());
insert into t_dashboard(name,cdatetime,udatetime) values('Compromisos con aspectos no definidos',now(),now());
insert into t_dashboard(name,cdatetime,udatetime) values('Compromisos que requieren ser modificados',now(),now());
-- Inserts iniciales para la tabla commitments
insert into t_commitment_config(name,cdatetime,udatetime) values('Número correlativo',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Código global',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Unidad',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Proyecto u operación',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Origen compromiso',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Capítulo',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Sección',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Página',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Texto literal',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Resumen del compromiso',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Temporalidad',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Frecuencia',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Aspecto asociado',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Compromisos que requieren acción',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Instalación/componente',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Compromiso recurrente',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Area responsable',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Criticidad',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Estado de cumplimiento',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Forma de cumplimiento',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Evidencia de cumplimiento',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Frecuencia de verificación',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Notas adicionales',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Construcción',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Operación',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Cierre',now(),now());
insert into t_commitment_config(name,cdatetime,udatetime) values('Post-cierre',now(),now());
-- Inserts iniciales para la tabla monitor
insert into t_monitor_config(name,cdatetime,udatetime) values('Número correlativo',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Unidad',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Proyecto u operación',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Origen documento',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Capítulo',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Sección',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Página',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Componente',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Estación',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Parámetros',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Metodología',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Temporalidad',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Frecuencia de monitoreo',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Frecuencia de reporte',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Autoridad a reportar',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Área responsable',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Reportes de monitoreo',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Frecuencia Verificación',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Notas',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Construcción',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Operación',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Cierre',now(),now());
insert into t_monitor_config(name,cdatetime,udatetime) values('Post-Cierre',now(),now());

-- Inserts iniciales para la tabla company / password: password$1
insert into t_company values('12345678909','Administrador',0,now(),now());
insert into t_user values('joandelgado18@gmail.com','ca1b02d4cff620b1dd6fccdf2a48714f','Joan Martín','Delgado Bendezú','12345678909','ROL5',now(),now());
insert into t_user values('eschulergodo7@gmail.com','ca1b02d4cff620b1dd6fccdf2a48714f','Emilio Jose','Schuler Godo','12345678909','ROL5',now(),now());