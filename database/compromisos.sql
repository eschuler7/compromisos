-- Preparación de data para la plataforma
-- Inserts iniciales de la tabla role
insert into t_rol values('ROL1','Administrador','Administrador de la cuenta',1,1,1,1,now(),now());
insert into t_rol values('ROL2','Responsables','Responsables de Unidades',0,0,1,1,now(),now());
insert into t_rol values('ROL3','Terceros de Soporte','Terceros de Soporte',0,1,1,0,now(),now());
insert into t_rol values('ROL4','Supervisores','Supervisores de Compromisos',0,1,1,1,now(),now());
insert into t_rol values('ROL5','Super Admin','SIGN EQ Super Admin User',0,1,1,1,now(),now());
-- Inserts iniciales para la tabla dashboard
insert into t_dashboard_config values('DB01','Total Compromisos',1,now(),now());
insert into t_dashboard_config values('DB02','Compromisos que requieren acción',1,now(),now());
insert into t_dashboard_config values('DB03','Compromisos en cumplimiento',0,now(),now());
insert into t_dashboard_config values('DB04','Compromisos en cumplimiento con sustento',0,now(),now());
insert into t_dashboard_config values('DB05','Compromisos incumplidos',1,now(),now());
insert into t_dashboard_config values('DB06','Compromisos incumplidos con un plan de acción',0,now(),now());
insert into t_dashboard_config values('DB07','Compromisos sin un plan de acción',0,now(),now());
insert into t_dashboard_config values('DB08','Compromisos críticos incumplidos',0,now(),now());
insert into t_dashboard_config values('DB09','Compromisos con aspectos no definidos',0,now(),now());
insert into t_dashboard_config values('DB10','Compromisos que requieren ser modificados',0,now(),now());

-- Inserts iniciales para la tabla commitments
insert into t_commitment_config values('CM01','Número correlativo','nrocorrelativo',1,now(),now());
insert into t_commitment_config values('CM02','Origen compromiso','origencompromiso',0,now(),now());
insert into t_commitment_config values('CM03','Capítulo','capitulo',0,now(),now());
insert into t_commitment_config values('CM04','Sección','seccion',0,now(),now());
insert into t_commitment_config values('CM05','Página','pagina',0,now(),now());
insert into t_commitment_config values('CM06','Aspecto asociado','aspambasoc',0,now(),now());
insert into t_commitment_config values('CM07','Instalación/componente','instcompasoc',0,now(),now());
insert into t_commitment_config values('CM08','Contenido original del compromiso','contorigcomp',1,now(),now());
insert into t_commitment_config values('CM09','Resumen del compromiso','resumencomp',0,now(),now());
insert into t_commitment_config values('CM10','Antecedentes del compromiso','antecedentes',0,now(),now());
insert into t_commitment_config values('CM11','Temporalidad','temporalidad',1,now(),now());
insert into t_commitment_config values('CM12','Fecha de inicio','fechainicio',1,now(),now());
insert into t_commitment_config values('CM13','Frecuencia','frecuencia',1,now(),now());
insert into t_commitment_config values('CM14','Criticidad','criticidad',1,now(),now());
insert into t_commitment_config values('CM15','Evidencias','evidencias',1,now(),now());
insert into t_commitment_config values('CM16','Estado de cumplimiento','estadocumplimiento',1,now(),now());
insert into t_commitment_config values('CM17','Acción sobre el compromiso','accioncompromiso',0,now(),now());
insert into t_commitment_config values('CM18','Detalle de acción','detalleaccion',0,now(),now());
insert into t_commitment_config values('CM19','Frecuencia de verificación','frecuenciaverificacion',0,now(),now());
insert into t_commitment_config values('CM20','Area responsable','arearesponsable',0,now(),now());
insert into t_commitment_config values('CM21','Correos de notificación','correosnotificacion',0,now(),now());
insert into t_commitment_config values('CM22','Notificación de inactividad','notificacioninactividad',0,now(),now());
insert into t_commitment_config values('CM23','Nombre de revisor','nombrerevisor',0,now(),now());
insert into t_commitment_config values('CM24','Fecha de revisión','fecharevision',0,now(),now());
insert into t_commitment_config values('CM25','Referencia técnica o legal de cumplimiento','referencialegal',0,now(),now());
insert into t_commitment_config values('CM26','Presupuesto','presupuesto',0,now(),now());
insert into t_commitment_config values('CM27','Notas adicionales','comentarios',1,now(),now());
insert into t_commitment_config values('CM28','Construcción','construccion',1,now(),now());
insert into t_commitment_config values('CM29','Operación','operacion',1,now(),now());
insert into t_commitment_config values('CM30','Cierre','cierre',1,now(),now());
insert into t_commitment_config values('CM31','Post-cierre','postcierre',1,now(),now());

-- Inserts iniciales para la tabla monitor
insert into t_monitor_config values('MN01','Número correlativo','nrocorrelativo',1,now(),now());
insert into t_monitor_config values('MN02','Origen del monitoreo','origenmonitoreo',0,now(),now());
insert into t_monitor_config values('MN03','Capítulo','capitulo',0,now(),now());
insert into t_monitor_config values('MN04','Sección','seccion',0,now(),now());
insert into t_monitor_config values('MN05','Página','pagina',0,now(),now());
insert into t_monitor_config values('MN06','Aspecto ambiental asociado','aspecasoc',0,now(),now());
insert into t_monitor_config values('MN07','Referencia del punto de medición','refermedicion',0,now(),now());
insert into t_monitor_config values('MN08','Nombre de la estación','nombreestacion',0,now(),now());
insert into t_monitor_config values('MN09','Parámetros','parametros',0,now(),now());
insert into t_monitor_config values('MN10','Metodología','metodologia',0,now(),now());
insert into t_monitor_config values('MN11','Texto literal del monitoreo','textliteral',1,now(),now());
insert into t_monitor_config values('MN12','Antecedentes del monitoreo','antecmonitoreo',0,now(),now());
insert into t_monitor_config values('MN13','Fecha de inicio','fechainicio',1,now(),now());
insert into t_monitor_config values('MN14','Frecuencia de monitoreo','frecmonitoreo',1,now(),now());
insert into t_monitor_config values('MN15','Reporte de monitoreo','repormonitoreo',0,now(),now());
insert into t_monitor_config values('MN16','Autoridad a reportar','autoridad',0,now(),now());
insert into t_monitor_config values('MN17','Frecuencia de reporte','frecreporte',1,now(),now());
insert into t_monitor_config values('MN18','Evidencias','evidencias',1,now(),now());
insert into t_monitor_config values('MN19','Estado de cumplimiento','estadocumplimiento',1,now(),now());
insert into t_monitor_config values('MN20','Revisión del monitoreo (por senior)','revision',0,now(),now());
insert into t_monitor_config values('MN21','Acción sobre el monitoreo','accionmonitoreo',0,now(),now());
insert into t_monitor_config values('MN22','Detalle de acción','detalleaccion',0,now(),now());
insert into t_monitor_config values('MN23','Frecuencia de verificación del monitoreo','frecverificacion',1,now(),now());
insert into t_monitor_config values('MN24','Área responsable','responsable',0,now(),now());
insert into t_monitor_config values('MN25','Correos de notificación','notificacion',0,now(),now());
insert into t_monitor_config values('MN26','Anticipación de notificación','anticnotificacion',1,now(),now());
insert into t_monitor_config values('MN27','Fecha de actualización/revisión del monitoreo','fecharevision',0,now(),now());
insert into t_monitor_config values('MN28','Referencia técnica o legal de cumplimiento','referenciatecnica',0,now(),now());
insert into t_monitor_config values('MN29','Presupuesto','presupuesto',0,now(),now());
insert into t_monitor_config values('MN30','Comentarios y notas','comentarios',1,now(),now());
insert into t_monitor_config values('MN31','Construcción','construccion',1,now(),now());
insert into t_monitor_config values('MN32','Operación','operacion',1,now(),now());
insert into t_monitor_config values('MN33','Cierre','cierre',1,now(),now());
insert into t_monitor_config values('MN34','Post-Cierre','postcierre',1,now(),now());

-- Inserts iniciales para la tabla company / password: password$1
insert into t_company values('12345678909','NOLAN',null,null,0,now(),now());
insert into t_user values('jdelgado','ca1b02d4cff620b1dd6fccdf2a48714f','joandelgado18@gmail.com','Joan Martín','Delgado Bendezú','12345678909','ROL5',1,now(),now());
insert into t_user values('eschuler','ca1b02d4cff620b1dd6fccdf2a48714f','eschulergodo7@gmail.com','Emilio Jose','Schuler Godo','12345678909','ROL5',1,now(),now());

update t_company set firsttime=1 where ruc='10101010101';
select * from t_company;
select * from t_company_dashboard;
select id, name from t_dashboard_config;
delete from t_company_dashboard where t_company_ruc='10101010101';
alter table t_commitment MODIFY COLUMN accioncompromiso varchar(2);
select * from t_commitment where ruc='10101010101' and nrocorrelativo='100';

select * from t_company_commitment;
select * from t_commitment_config;
select * from t_commitment_config where t_company_ruc='10101010101';

delete from t_company_commitment where t_company_ruc='10101010101';
select t_company_ruc,t_commitment_config_id,tco.name from t_company_commitment tcc left join t_commitment_config tco on tcc.t_commitment_config_id=tco.id where t_company_ruc='10101010101';

select * from t_company_monitor;
delete from t_company_monitor where t_company_ruc='10101010101';
select t_company_ruc,t_monitor_config_id,tmc.name from t_company_monitor tcm left join t_monitor_config tmc on tcm.t_monitor_config_id=tmc.id where t_company_ruc='10101010101';


delete from t_commitment where ruc='10101010101' and nrocorrelativo='1';
delete from t_monitor where ruc='10101010101' and nrocorrelativo='1';
-- Eliminar data de las tablas de configuración de atributos
select * from t_commitment_config;
select id, name, columnasoc, mandatory from t_commitment_config;
select id, name, columnasoc, mandatory from t_monitor_config;
delete from t_commitment_config where id like 'CM3%';
select * from t_monitor_config;
delete from t_monitor_config where id like 'MN%';

select email from t_user where userid='eschulerg';
select userid from t_user where userid='eschulerg';
select userid, email, tu.name, lastname, t_rol_rolid, tr.name rol_name, tu.cdatetime, tu.udatetime from t_user tu left join t_rol tr on tu.t_rol_rolid=tr.rolid where tu.t_company_ruc=10101010101;
select t_company_ruc,t_monitor_config_id,tmc.name from t_company_monitor tcm left join t_monitor_config tmc on tcm.t_monitor_config_id=tmc.id where t_company_ruc=10101010101;
select t_company_ruc,t_dashboard_config_id,tdc.name from t_company_dashboard tcd left join t_dashboard_config tdc on tcd.t_dashboard_config_id=tdc.id where t_company_ruc=10101010101;
select * from t_user;

delete from t_user where t_company_ruc='10101010101' and userid not like 'eschulerg';

select count(*) from t_user where t_company_ruc='10101010101';

select * from t_monitor_evidence where t_monitor_nrocorrelativo=1 and t_monitor_ruc=10101010101;

select t_company_ruc,t_commitment_config_id,tco.name,tco.columnasoc from t_company_commitment tcc left join t_commitment_config tco on tcc.t_commitment_config_id=tco.id where t_company_ruc=10101010101;
select t_company_ruc,t_monitor_config_id,tmc.name,tmc.columnasoc from t_company_monitor tcm left join t_monitor_config tmc on tcm.t_monitor_config_id=tmc.id where t_company_ruc=10101010101;
select tco.columnasoc from t_company_commitment tcc left join t_commitment_config tco on tcc.t_commitment_config_id=tco.id where t_company_ruc=10101010101;

select * from t_monitor where nrocorrelativo='100';
select * from t_monitor;

select if(max(nrocorrelativo) is null, 1, max(nrocorrelativo) + 1) as correlativo from t_commitment where ruc='12345678908';
select * from t_commitment_evidence;