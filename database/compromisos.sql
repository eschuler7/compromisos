-- Preparación de data para la plataforma
-- Inserts iniciales de la tabla role
insert into t_rol values('ROL1','Administrador','Administrador de la cuenta',1,1,1,1,now(),now());
insert into t_rol values('ROL2','Responsables','Responsables de Unidades',0,0,1,1,now(),now());
insert into t_rol values('ROL3','Terceros de Soporte','Terceros de Soporte',0,1,1,0,now(),now());
insert into t_rol values('ROL4','Supervisores','Supervisores de Compromisos',0,1,1,1,now(),now());
insert into t_rol values('ROL5','Super Admin','SIGN EQ Super Admin User',0,1,1,1,now(),now());
-- Inserts iniciales para la tabla dashboard
insert into t_dashboard_config(id,name,cdatetime,udatetime) values('DB01','Total Compromisos',now(),now());
insert into t_dashboard_config(id,name,cdatetime,udatetime) values('DB02','Compromisos que requieren acción',now(),now());
insert into t_dashboard_config(id,name,cdatetime,udatetime) values('DB03','Compromisos en cumplimiento',now(),now());
insert into t_dashboard_config(id,name,cdatetime,udatetime) values('DB04','Compromisos en cumplimiento con sustento',now(),now());
insert into t_dashboard_config(id,name,cdatetime,udatetime) values('DB05','Compromisos incumplidos',now(),now());
insert into t_dashboard_config(id,name,cdatetime,udatetime) values('DB06','Compromisos incumplidos con un plan de acción',now(),now());
insert into t_dashboard_config(id,name,cdatetime,udatetime) values('DB07','Compromisos sin un plan de acción',now(),now());
insert into t_dashboard_config(id,name,cdatetime,udatetime) values('DB08','Compromisos críticos incumplidos',now(),now());
insert into t_dashboard_config(id,name,cdatetime,udatetime) values('DB09','Compromisos con aspectos no definidos',now(),now());
insert into t_dashboard_config(id,name,cdatetime,udatetime) values('DB10','Compromisos que requieren ser modificados',now(),now());

-- Inserts iniciales para la tabla commitments
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM01','Número correlativo',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM02','Código global',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM03','Unidad',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM04','Proyecto u operación',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM05','Origen compromiso',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM06','Capítulo',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM07','Sección',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM08','Página',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM09','Texto literal',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM10','Resumen del compromiso',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM11','Temporalidad',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM12','Frecuencia',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM13','Aspecto asociado',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM14','Compromisos que requieren acción',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM15','Instalación/componente',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM16','Compromiso recurrente',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM17','Area responsable',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM18','Criticidad',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM19','Estado de cumplimiento',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM20','Forma de cumplimiento',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM21','Evidencia de cumplimiento',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM22','Frecuencia de verificación',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM23','Notas adicionales',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM24','Construcción',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM25','Operación',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM26','Cierre',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM27','Post-cierre',now(),now());

-- Inserts iniciales para la tabla monitor
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN01','Número correlativo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN02','Unidad',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN03', 'Código global',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN04','Proyecto u operación',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN05','Origen documento',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN06','Capítulo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN07','Sección',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN08','Página',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN09','Componente',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN10','Estación',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN11','Parámetros',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN12','Metodología',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN13','Temporalidad',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN14','Frecuencia de monitoreo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN15','Frecuencia de reporte',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN16','Autoridad a reportar',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN17','Área responsable',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN18','Reportes de monitoreo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN19','Frecuencia Verificación',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN20','Notas',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN21','Construcción',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN22','Operación',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN23','Cierre',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN24','Post-Cierre',now(),now());


select * from t_monitor_config;
delete from t_monitor_config where id like 'MN%';

-- Inserts iniciales para la tabla company / password: password$1
insert into t_company values('12345678909','SIGNEQ',null,null,0,now(),now());
insert into t_user values('jdelgado','ca1b02d4cff620b1dd6fccdf2a48714f','joandelgado18@gmail.com','Joan Martín','Delgado Bendezú','12345678909','ROL5',1,now(),now());
insert into t_user values('eschuler','ca1b02d4cff620b1dd6fccdf2a48714f','eschulergodo7@gmail.com','Joan Martín','Delgado Bendezú','12345678909','ROL5',1,now(),now());

update t_company set firsttime=1 where ruc='12345678908';
select * from t_company;
select * from t_company_dashboard;
delete from t_company_dashboard where t_company_ruc='10101010101';

select * from t_company_commitment;
delete from t_company_commitment where t_company_ruc='10101010101';

select * from t_company_monitor;
delete from t_company_monitor where t_company_ruc='10101010101';

select id, name from t_commitment_config;