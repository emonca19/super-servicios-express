export const clientsStyles = `
:host {
  display: block;
  width: 100%;
  height: 100%;
}

.clients {
  height: 100%;
  min-height: 100%;
  padding-bottom: 2rem;
  overflow-y: auto;
}

.clients::-webkit-scrollbar { width: 8px; }
.clients::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 20px; }

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: .25rem;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.3rem;
}

.new-client-btn {
  background: #ff8a00;
  color: white;
  border: none;
  padding: .65rem 1.4rem;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: .25s;
}

.new-client-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.15);
}
`;
