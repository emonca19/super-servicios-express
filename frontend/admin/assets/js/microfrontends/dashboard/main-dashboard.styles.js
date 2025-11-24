export const dashboardStyles = `

.dashboard-container {
  min-height: 100%;
  padding-bottom: 2rem;
}

.title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: white;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border-left: 4px solid transparent;
}

.kpi-card .kpi-label {
  font-size: 13px;
  opacity: .7;
}

.kpi-card .kpi-value {
  font-size: 24px;
  font-weight: 700;
  margin: .3rem 0;
}

.kpi-card .kpi-sub {
  font-size: 12px;
  opacity: .6;
}

.kpi-card.orange { border-color: #ff8a00; }
.kpi-card.green { border-color: #2ecc71; }
.kpi-card.blue { border-color: #3498db; }
.kpi-card.yellow { border-color: #f1c40f; }

.citas-section {
  margin-top: 1.5rem;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
}

.section-sub {
  font-size: 14px;
  opacity: .7;
  margin-bottom: 1rem;
}

.citas-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.citas-table th {
  background: #f7f8fa;
  text-align: left;
  padding: 1rem;
  font-size: 13px;
  color: #555;
}

.citas-table td {
  padding: .9rem 1rem;
  font-size: 14px;
  border-top: 1px solid #eee;
}

.estado {
  padding: .4rem .7rem;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.estado.completada { background: #e1f8e8; color: #27ae60; }
.estado.en\\ proceso { background: #fff4d6; color: #f1c40f; }
.estado.pendiente { background: #e6e6e6; color: #777; }

.btn {
  padding: .4rem .9rem;
  font-size: 13px;
  border-radius: 7px;
  color: white;
  margin-right: .3rem;
  border: none;
  cursor: pointer;
}

.btn.editar { background: #4a90e2; }
.btn.detalles { background: #34495e; }
.btn.cancelar { background: #e74c3c; }

.dashboard-container::-webkit-scrollbar {
  width: 8px;
}

.dashboard-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.dashboard-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.dashboard-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dashboard-container {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

`;  