export const adminNavbarStyles = `

.navbar {
  width: 100%;
  height: 70px;
  background: #ffffff;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.8rem;
  box-shadow: 0 3px 8px rgba(0,0,0,0.06);
  box-sizing: border-box;
}

.left .title {
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
}

.right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f4f5f7;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .2s ease;
}

.icon-btn:hover {
  background: #e4e5e7;
}

.icon {
  width: 18px;
  height: 18px;
  opacity: .75;
}

.avatar {
  width: 34px;
  height: 34px;
  background: #dfe1e6;
  border-radius: 50%;
}

`;
