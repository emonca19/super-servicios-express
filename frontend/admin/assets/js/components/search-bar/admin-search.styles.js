export const adminSearchStyles = `
:host {
  display: inline-block;
  width: 280px;
}

.search-container {
  position: relative;
  width: 100%;
}

.icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  opacity: 0.6;
  pointer-events: none;
  width: 16px;
  height: 16px;
}

input {
  width: 100%;
  padding: .65rem 1rem .65rem 2.4rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  font-size: 14px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

input::placeholder {
  color: #9ca3af;
}
`;