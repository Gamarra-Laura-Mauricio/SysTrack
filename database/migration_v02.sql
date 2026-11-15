-- Ejecutar una sola vez sobre la base systrack_db existente antes de iniciar SysTrack v0.2.
USE systrack_db;
ALTER TABLE users MODIFY role ENUM('ADMIN','COORDINATOR','TECHNICIAN','REQUESTER') NOT NULL DEFAULT 'REQUESTER';
