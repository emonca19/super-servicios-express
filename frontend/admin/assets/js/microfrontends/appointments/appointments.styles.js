export const appointmentsStyles = `

.appointments {
  width: 100%;
  min-height: 100%;
  padding-bottom: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  contain:content;
}

.appointments::-webkit-scrollbar {
  width: 8px;
}
.appointments::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.18);
  border-radius: 20px;
}
.appointments::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.28);
}
.appointments {
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.25) transparent;
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: .25rem;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.filter-pill {
  border-radius: 999px;
  padding: 0.45rem 1.2rem;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all .20s ease;
}

.filter-pill:hover {
  background: #e5e7eb;
}

.filter-pill.active {
  background: #ff8a00;
  color: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

`;
