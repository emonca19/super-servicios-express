export const adminTableStyles = `
:host {
  display: block;
  width: 100%;
}

.table-shell {
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;

}

.table-shell::-webkit-scrollbar {
  height: 8px;
}
.table-shell::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 20px;
}
.table-shell::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.admin-table {
  width: 100%;
  min-width: 1100px;
  border-collapse: collapse;
  table-layout: auto;
}

.admin-table thead {
  border-radius: 14px 14px 0 0;
  overflow: hidden;
}

.admin-table th {
  background: #f9fafb;
  padding: 1rem;
  color: #6b7280;
  font-size: 13px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.admin-table thead tr:first-child th:first-child {
  border-top-left-radius: 14px;
}

.admin-table thead tr:first-child th:last-child {
  border-top-right-radius: 14px;
}

.admin-table td {
  padding: 0.9rem 1rem;
  font-size: 14px;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.admin-table tr:hover td {
  background: #f8fafc;
}

.badge {
  padding: 0.35rem 0.7rem;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}
.badge--completed{ background: #e1f8e8; color: #27ae60; }
.badge--in-process { background: #FFF3E0; color: #FF6800; }
.badge--pending  { background: #F3F4F6; color: #999999; }

.actions-cell {
  white-space: nowrap;
  width: 1%;
  text-align: right;
}

.btn {
  padding: 0.45rem 0.9rem;
  font-size: 13px;
  border-radius: 7px;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 0.35rem;
}
.btn--primary { background: #4a90e2; }
.btn--dark    { background: #34495e; }
.btn--danger  { background: #e74c3c; }
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #d1d5db;
  transition: .3s;
  border-radius: 20px;
}
input:checked + .slider {
  background: #4ade80;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: .3s;
}
input:checked + .slider:before {
  transform: translateX(20px);
}
`;
