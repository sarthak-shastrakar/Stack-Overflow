import React from 'react';
import "./Header.css"

function Header({ onSelectChange, displayComponent }) {
  function RenderSelectComponent() {
    switch (displayComponent) {
      case "chatbot":
        window.location.href = "https://www.google.com";
        return null;
       case "ex":
        window.location.href = "";
       return null;
      case "ex2":
        window.location.href = "https://www.thelivelovelaughfoundation.org/helpline";
        return null;
      case "ex1":
        window.location.href = "";
      default:
        return null;
    }
  }

  return (
    <div id="header">
      <h4 className="header1">Mental Health Companion</h4>
      <nav className="header-right">
        <li>
          <select value={displayComponent} onChange={onSelectChange}>
             <option>More</option>
             <option value="ex2">Helpline Number</option>
            <option value="ex">Personal Asistant</option>
            <option value="ex1">Consult a Expert</option>
          </select>
        </li>
        <li>
          <RenderSelectComponent />
        </li>
      </nav>
    </div>
  );
}

export default Header;
