-- CreateTable
CREATE TABLE "cliente" (
    "id_cliente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "direccion" TEXT,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "automovil" (
    "id_auto" SERIAL NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "placas" TEXT NOT NULL,
    "numero_serie" TEXT NOT NULL,
    "id_cliente" INTEGER NOT NULL,

    CONSTRAINT "automovil_pkey" PRIMARY KEY ("id_auto")
);

-- CreateTable
CREATE TABLE "cita" (
    "id_cita" SERIAL NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "observaciones" TEXT,
    "id_cliente" INTEGER NOT NULL,
    "id_auto" INTEGER NOT NULL,

    CONSTRAINT "cita_pkey" PRIMARY KEY ("id_cita")
);

-- CreateTable
CREATE TABLE "servicio" (
    "id_servicio" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "duracion_estimada" INTEGER NOT NULL,
    "precio_con_utilidad" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("id_servicio")
);

-- CreateTable
CREATE TABLE "detalle_cita" (
    "id_detalleCita" SERIAL NOT NULL,
    "notas" TEXT,
    "suministros" TEXT,
    "precio_por_servicio" DECIMAL(10,2) NOT NULL,
    "id_cita" INTEGER NOT NULL,
    "id_servicio" INTEGER NOT NULL,

    CONSTRAINT "detalle_cita_pkey" PRIMARY KEY ("id_detalleCita")
);

-- CreateIndex
CREATE UNIQUE INDEX "cliente_email_key" ON "cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "automovil_placas_key" ON "automovil"("placas");

-- CreateIndex
CREATE UNIQUE INDEX "automovil_numero_serie_key" ON "automovil"("numero_serie");

-- CreateIndex
CREATE UNIQUE INDEX "servicio_nombre_key" ON "servicio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_cita_id_cita_id_servicio_key" ON "detalle_cita"("id_cita", "id_servicio");

-- AddForeignKey
ALTER TABLE "automovil" ADD CONSTRAINT "automovil_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cita" ADD CONSTRAINT "cita_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cita" ADD CONSTRAINT "cita_id_auto_fkey" FOREIGN KEY ("id_auto") REFERENCES "automovil"("id_auto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_cita" ADD CONSTRAINT "detalle_cita_id_cita_fkey" FOREIGN KEY ("id_cita") REFERENCES "cita"("id_cita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_cita" ADD CONSTRAINT "detalle_cita_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicio"("id_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;
