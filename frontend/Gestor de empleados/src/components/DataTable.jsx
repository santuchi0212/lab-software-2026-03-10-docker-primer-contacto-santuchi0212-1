import React from 'react';
import './DataTable.css';

/**
 * Componente reutilizable para mostrar tablas de datos
 * @param {Array} data - Array de objetos a mostrar
 * @param {Array} columns - Definición de columnas
 * @param {Function} renderActions - Función opcional para renderizar acciones
 */
const DataTable = ({ data, columns, renderActions, emptyMessage = "No hay datos disponibles" }) => {
  
  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ width: column.width }}>
                {column.label}
              </th>
            ))}
            {renderActions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render 
                    ? column.render(row[column.key], row) 
                    : row[column.key]}
                </td>
              ))}
              {renderActions && (
                <td className="actions-cell">
                  {renderActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;