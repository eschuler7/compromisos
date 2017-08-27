-- Preparación de data para la plataforma
-- Inserts iniciales de la tabla role
insert into t_rol values('ROL1','Administrador','Administrador de la cuenta',1,1,1,1,now(),now());
insert into t_rol values('ROL2','Responsables','Responsables de Unidades',0,0,1,1,now(),now());
insert into t_rol values('ROL3','Terceros de Soporte','Terceros de Soporte',0,1,1,0,now(),now());
insert into t_rol values('ROL4','Supervisores','Supervisores de Compromisos',0,1,1,1,now(),now());
insert into t_rol values('ROL5','Super Admin','SIGN EQ Super Admin User',0,1,1,1,now(),now());
-- Inserts iniciales para la tabla dashboard
insert into t_dashboard_config values('DB01','Total Compromisos',1,now(),now());
insert into t_dashboard_config values('DB02','Compromisos que requieren acción',0,now(),now());
insert into t_dashboard_config values('DB03','Compromisos en cumplimiento',0,now(),now());
insert into t_dashboard_config values('DB04','Compromisos en cumplimiento con sustento',0,now(),now());
insert into t_dashboard_config values('DB05','Compromisos incumplidos',0,now(),now());
insert into t_dashboard_config values('DB06','Compromisos incumplidos con un plan de acción',0,now(),now());
insert into t_dashboard_config values('DB07','Compromisos sin un plan de acción',0,now(),now());
insert into t_dashboard_config values('DB08','Compromisos críticos incumplidos',0,now(),now());
insert into t_dashboard_config values('DB09','Compromisos con aspectos no definidos',0,now(),now());
insert into t_dashboard_config values('DB10','Compromisos que requieren ser modificados',0,now(),now());

-- Inserts iniciales para la tabla commitments
insert into t_commitment_config values('CM01','Número correlativo','nrocorrelativo',1,now(),now());
insert into t_commitment_config values('CM02','Origen compromiso','origencompromiso',0,now(),now());
insert into t_commitment_config values('CM03','Código global','codigoglobal',1,now(),now());
insert into t_commitment_config values('CM04','Capítulo','capitulo',0,now(),now());
insert into t_commitment_config values('CM05','Sección','seccion',0,now(),now());
insert into t_commitment_config values('CM06','Página','pagina',0,now(),now());
insert into t_commitment_config values('CM07','Aspecto asociado','aspambasoc',0,now(),now());
insert into t_commitment_config values('CM08','Instalación/componente','instcompasoc',0,now(),now());
insert into t_commitment_config values('CM09','Contenido original del compromiso','contorigcomp',0,now(),now());
insert into t_commitment_config values('CM10','Resumen del compromiso','resumencomp',0,now(),now());
insert into t_commitment_config values('CM11','Antecedentes del compromiso','antecedentes',0,now(),now());
insert into t_commitment_config values('CM12','Temporalidad','temporalidad',1,now(),now());
insert into t_commitment_config values('CM13','Fecha de inicio','fechainicio',1,now(),now());
insert into t_commitment_config values('CM14','Frecuencia','frecuencia',1,now(),now());
insert into t_commitment_config values('CM15','Criticidad','criticidad',1,now(),now());
insert into t_commitment_config values('CM16','Tipo de evidencia de cumplimiento','tipoevidencia',0,now(),now());
insert into t_commitment_config values('CM17','Evidencia de cumplimiento','evidencia',0,now(),now());
insert into t_commitment_config values('CM18','Estado de cumplimiento','estadocumplimiento',1,now(),now());
insert into t_commitment_config values('CM19','Acción sobre el compromiso','accioncompromiso',0,now(),now());
insert into t_commitment_config values('CM20','Detalle de acción','detalleaccion',0,now(),now());
insert into t_commitment_config values('CM21','Frecuencia de verificación','frecuenciaverificacion',0,now(),now());
insert into t_commitment_config values('CM22','Area responsable','arearesponsable',0,now(),now());
insert into t_commitment_config values('CM23','Correos de notificación','correosnotificacion',0,now(),now());
insert into t_commitment_config values('CM24','Notificación de inactividad','notificacioninactividad',0,now(),now());
insert into t_commitment_config values('CM25','Nombre de revisor','nombrerevisor',0,now(),now());
insert into t_commitment_config values('CM26','Fecha de revisión','fecharevision',0,now(),now());
insert into t_commitment_config values('CM27','Referencia técnica o legal de cumplimiento','referencialegal',0,now(),now());
insert into t_commitment_config values('CM28','Presupuesto','presupuesto',0,now(),now());
insert into t_commitment_config values('CM29','Notas adicionales','comentarios',0,now(),now());
insert into t_commitment_config values('CM30','Construcción','construccion',0,now(),now());
insert into t_commitment_config values('CM31','Operación','operacion',0,now(),now());
insert into t_commitment_config values('CM32','Cierre','cierre',0,now(),now());
insert into t_commitment_config values('CM33','Post-cierre','postcierre',0,now(),now());

-- Inserts iniciales para la tabla monitor
insert into t_monitor_config values('MN01','Número correlativo',null,1,now(),now());
insert into t_monitor_config values('MN02','Origen del monitoreo',null,0,now(),now());
insert into t_monitor_config values('MN03','Capítulo',null,1,now(),now());
insert into t_monitor_config values('MN04','Sección',null,0,now(),now());
insert into t_monitor_config values('MN05','Página',null,0,now(),now());
insert into t_monitor_config values('MN06','Aspecto ambiental asociado',null,0,now(),now());
insert into t_monitor_config values('MN07','Referencia del punto de medición',null,0,now(),now());
insert into t_monitor_config values('MN08','Nombre de la estación',null,0,now(),now());
insert into t_monitor_config values('MN09','Parámetros',null,0,now(),now());
insert into t_monitor_config values('MN10','Metodología',null,0,now(),now());
insert into t_monitor_config values('MN11','Texto literal del monitoreo',null,0,now(),now());
insert into t_monitor_config values('MN12','Antecedentes del monitoreo',null,0,now(),now());
insert into t_monitor_config values('MN13','Frecuencia de monitoreo',null,0,now(),now());
insert into t_monitor_config values('MN14','Reporte de monitoreo',null,0,now(),now());
insert into t_monitor_config values('MN15','Autoridad a reportar',null,0,now(),now());
insert into t_monitor_config values('MN16','Frecuencia de reporte',null,0,now(),now());
insert into t_monitor_config values('MN17','Estado de cumplimiento',null,0,now(),now());
insert into t_monitor_config values('MN18','Revisión del monitoreo (por senior)',null,0,now(),now());
insert into t_monitor_config values('MN19','Acción sobre el compromiso',null,0,now(),now());
insert into t_monitor_config values('MN20','Frecuencia de verificación del monitoreo',null,0,now(),now());
insert into t_monitor_config values('MN21','Área responsable',null,0,now(),now());
insert into t_monitor_config values('MN22','Correos de notificación',null,0,now(),now());
insert into t_monitor_config values('MN23','Anticipación de notificación',null,0,now(),now());
insert into t_monitor_config values('MN24','Fecha de actualización/revisión del monitoreo',null,0,now(),now());
insert into t_monitor_config values('MN25','Referencia técnica o legal de cumplimiento',null,0,now(),now());
insert into t_monitor_config values('MN26','Presupuesto',null,0,now(),now());
insert into t_monitor_config values('MN27','Comentarios y notas',null,0,now(),now());
insert into t_monitor_config values('MN28','Construcción',null,0,now(),now());
insert into t_monitor_config values('MN29','Operación',null,0,now(),now());
insert into t_monitor_config values('MN30','Cierre',null,0,now(),now());
insert into t_monitor_config values('MN31','Post-Cierre',null,0,now(),now());


-- Inserts iniciales para la tabla company / password: password$1
insert into t_company values('12345678909','NOLAN',null,null,0,now(),now());
insert into t_user values('jdelgado','ca1b02d4cff620b1dd6fccdf2a48714f','joandelgado18@gmail.com','Joan Martín','Delgado Bendezú','12345678909','ROL5',1,now(),now());
insert into t_user values('eschuler','ca1b02d4cff620b1dd6fccdf2a48714f','eschulergodo7@gmail.com','Joan Martín','Delgado Bendezú','12345678909','ROL5',1,now(),now());

update t_company set firsttime=1 where ruc='10101010101';
select * from t_company;
select * from t_company_dashboard;
select id, name from t_dashboard_config;
delete from t_company_dashboard where t_company_ruc='10101010101';

select * from t_company_commitment;
select * from t_commitment_config;
delete from t_company_commitment where t_company_ruc='10101010101';
select t_company_ruc,t_commitment_config_id,tco.name from t_company_commitment tcc left join t_commitment_config tco on tcc.t_commitment_config_id=tco.id where t_company_ruc='10101010101';

select * from t_company_monitor;
delete from t_company_monitor where t_company_ruc='10101010101';
select t_company_ruc,t_monitor_config_id,tmc.name from t_company_monitor tcm left join t_monitor_config tmc on tcm.t_monitor_config_id=tmc.id where t_company_ruc='10101010101';

-- Eliminar data de las tablas de configuración de atributos
select * from t_commitment_config;
select id, name, mandatory from t_commitment_config;
delete from t_commitment_config where id like 'CM%';
select * from t_monitor_config;
delete from t_monitor_config where id like 'MN%';

select * from t_user;
select userid, email, tu.name, lastname, t_rol_rolid, tr.name rol_name, tu.cdatetime, tu.udatetime from t_user tu left join t_rol tr on tu.t_rol_rolid=tr.rolid where tu.t_company_ruc=10101010101;
select t_company_ruc,t_monitor_config_id,tmc.name from t_company_monitor tcm left join t_monitor_config tmc on tcm.t_monitor_config_id=tmc.id where t_company_ruc=10101010101;
select t_company_ruc,t_dashboard_config_id,tdc.name from t_company_dashboard tcd left join t_dashboard_config tdc on tcd.t_dashboard_config_id=tdc.id where t_company_ruc=10101010101;

delete from t_user where t_company_ruc='10101010101' and userid not like 'eschulerg';