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
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM01','Número correlativo','nrocorrelativo',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM02','Origen compromiso','origencompromiso',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM03','Código global','codigoglobal',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM04','Capítulo','capitulo',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM05','Sección','seccion',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM06','Página','pagina',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM07','Aspecto asociado','aspambasoc',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM08','Instalación/componente','instcompasoc',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM09','Contenido original del compromiso','contorigcomp',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM10','Resumen del compromiso','resumen',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM11','Antecedentes del compromiso','antecedentes',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM12','Temporalidad','temporalidad',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM13','Fecha de inicio','fechainicio',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM14','Frecuencia','frecuencia',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM15','Criticidad','criticidad',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM16','Tipo de evidencia de cumplimiento','tipoevidencia',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM17','Evidencia de cumplimiento','evidencia',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM18','Estado de cumplimiento','estadocumplimiento',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM19','Acción sobre el compromiso','accioncompromiso',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM20','Detalle de acción','detalleaccion',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM21','Frecuencia de verificación','frecuenciaverificacion',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM22','Area responsable','arearesponsable',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM23','Correos de notificación','correosnotificacion',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM24','Notificación de inactividad','notificacioninactividad',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM25','Nombre de revisor','nombrerevisor',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM26','Fecha de revisión','fecharevision',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM27','Referencia técnica o legal de cumplimiento','referencialegal',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM28','Presupuesto','presupuesto',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM29','Notas adicionales','comentarios',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM30','Construcción','construccion',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM31','Operación','operacion',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM32','Cierre','cierre',now(),now());
insert into t_commitment_config(id,name,cdatetime,udatetime) values('CM33','Post-cierre','postcierre',now(),now());

-- Inserts iniciales para la tabla monitor
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN01','Número correlativo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN02','Origen del monitoreo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN03','Capítulo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN04','Sección',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN05','Página',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN06','Aspecto ambiental asociado',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN07','Referencia del punto de medición',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN08','Nombre de la estación',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN09','Parámetros',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN10','Metodología',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN11','Texto literal del monitoreo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN12','Antecedentes del monitoreo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN13','Frecuencia de monitoreo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN14','Reporte de monitoreo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN15','Autoridad a reportar',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN16','Frecuencia de reporte',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN17','Estado de cumplimiento',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN18','Revisión del monitoreo (por senior)',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN19','Acción sobre el compromiso',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN20','Frecuencia de verificación del monitoreo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN21','Área responsable',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN22','Correos de notificación',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN23','Anticipación de notificación',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN24','Fecha de actualización/revisión del monitoreo',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN25','Referencia técnica o legal de cumplimiento',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN26','Presupuesto',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN27','Comentarios y notas',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN28','Construcción',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN29','Operación',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN30','Cierre',now(),now());
insert into t_monitor_config(id,name,cdatetime,udatetime) values('MN31','Post-Cierre',now(),now());


-- Inserts iniciales para la tabla company / password: password$1
insert into t_company values('12345678909','SIGNEQ',null,null,0,now(),now());
insert into t_user values('jdelgado','ca1b02d4cff620b1dd6fccdf2a48714f','joandelgado18@gmail.com','Joan Martín','Delgado Bendezú','12345678909','ROL5',1,now(),now());
insert into t_user values('eschuler','ca1b02d4cff620b1dd6fccdf2a48714f','eschulergodo7@gmail.com','Joan Martín','Delgado Bendezú','12345678909','ROL5',1,now(),now());

update t_company set firsttime=1 where ruc='10101010101';
select * from t_company;
select * from t_company_dashboard;
delete from t_company_dashboard where t_company_ruc='10101010101';

select * from t_company_commitment;
select id, name from t_commitment_config;
delete from t_company_commitment where t_company_ruc='10101010101';
select t_company_ruc,t_commitment_config_id,tco.name from t_company_commitment tcc left join t_commitment_config tco on tcc.t_commitment_config_id=tco.id where t_company_ruc='10101010101';

select * from t_company_monitor;
delete from t_company_monitor where t_company_ruc='10101010101';
select t_company_ruc,t_monitor_config_id,tmc.name from t_company_monitor tcm left join t_monitor_config tmc on tcm.t_monitor_config_id=tmc.id where t_company_ruc='10101010101';

-- Eliminar data de las tablas de configuración de atributos
select * from t_commitment_config;
delete from t_commitment_config where id like 'CM%';
select * from t_monitor_config;
delete from t_monitor_config where id like 'MN%';

select * from t_user;
select userid, email, tu.name, lastname, t_rol_rolid, tr.name rol_name, tu.cdatetime, tu.udatetime from t_user tu left join t_rol tr on tu.t_rol_rolid=tr.rolid where tu.t_company_ruc=10101010101;