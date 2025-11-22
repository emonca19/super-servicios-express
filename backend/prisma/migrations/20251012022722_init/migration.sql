-- CreateTable
CREATE TABLE `cliente` (
    `id_cliente` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NULL,

    UNIQUE INDEX `cliente_email_key`(`email`),
    PRIMARY KEY (`id_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `automovil` (
    `id_auto` INTEGER NOT NULL AUTO_INCREMENT,
    `marca` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `anio` INTEGER NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `placas` VARCHAR(191) NOT NULL,
    `numero_serie` VARCHAR(191) NOT NULL,
    `id_cliente` INTEGER NOT NULL,

    UNIQUE INDEX `automovil_placas_key`(`placas`),
    UNIQUE INDEX `automovil_numero_serie_key`(`numero_serie`),
    PRIMARY KEY (`id_auto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cita` (
    `id_cita` INTEGER NOT NULL AUTO_INCREMENT,
    `inicio` DATETIME(3) NOT NULL,
    `fin` DATETIME(3) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `motivo` VARCHAR(191) NOT NULL,
    `observaciones` VARCHAR(191) NULL,
    `id_cliente` INTEGER NOT NULL,
    `id_auto` INTEGER NOT NULL,

    PRIMARY KEY (`id_cita`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio` (
    `id_servicio` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `duracion_estimada` INTEGER NOT NULL,
    `precio_con_utilidad` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `servicio_nombre_key`(`nombre`),
    PRIMARY KEY (`id_servicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalle_cita` (
    `id_detalleCita` INTEGER NOT NULL AUTO_INCREMENT,
    `notas` VARCHAR(191) NULL,
    `suministros` VARCHAR(191) NULL,
    `precio_por_servicio` DECIMAL(10, 2) NOT NULL,
    `id_cita` INTEGER NOT NULL,
    `id_servicio` INTEGER NOT NULL,

    UNIQUE INDEX `detalle_cita_id_cita_id_servicio_key`(`id_cita`, `id_servicio`),
    PRIMARY KEY (`id_detalleCita`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `automovil` ADD CONSTRAINT `automovil_id_cliente_fkey` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cita` ADD CONSTRAINT `cita_id_cliente_fkey` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cita` ADD CONSTRAINT `cita_id_auto_fkey` FOREIGN KEY (`id_auto`) REFERENCES `automovil`(`id_auto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalle_cita` ADD CONSTRAINT `detalle_cita_id_cita_fkey` FOREIGN KEY (`id_cita`) REFERENCES `cita`(`id_cita`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalle_cita` ADD CONSTRAINT `detalle_cita_id_servicio_fkey` FOREIGN KEY (`id_servicio`) REFERENCES `servicio`(`id_servicio`) ON DELETE RESTRICT ON UPDATE CASCADE;
