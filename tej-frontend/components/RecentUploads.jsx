import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

export default function RecentUploads() {
  const [entries, setEntries] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [lrFrom, setLrFrom] = useState('');
  const [lrTo, setLrTo] = useState('');
  const [location, setLocation] = useState('pune');
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchEntries = async () => {
    try {
      let url = `http://localhost:5000/api/bilty/${location}`;
      const params = [];

      if (fromDate && toDate) params.push(`from=${fromDate}&to=${toDate}`);
      if (lrFrom && lrTo) params.push(`lrFrom=${lrFrom}&lrTo=${lrTo}`);

      if (params.length) url += '?' + params.join('&');

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setEntries(data);
    } catch (err) {
      console.error('❌ Failed to fetch entries:', err);
    }
  };

  const saveChanges = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bilty/${location}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        setEditingRow(null);
        fetchEntries();
      } else {
        console.error('❌ Error saving changes');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportToCSV = () => {
    const csvRows = [];

    const headers = [
      'Consignment No', 'Date', 'Movement Type', 'From', 'To',
      'Consignor', 'Consignor GST', 'Consignee', 'Consignee GST',
      'Vehicle Type', 'Vehicle No', 'Qty', 'Material', 'Invoice No', 'E-Way Bill'
    ];
    csvRows.push(headers.join(','));

    entries.forEach((entry) => {
      const values = [
        entry.consignmentNo,
        entry.consignmentDate?.split('T')[0],
        entry.movementType,
        entry.from,
        entry.to,
        entry.consignorName,
        entry.consignorGST,
        entry.consigneeName,
        entry.consigneeGST,
        entry.vehicleType,
        entry.vehicleNo,
        entry.quantity,
        entry.materialType,
        entry.invoiceNo,
        entry.ewayBillNo,
      ];
      csvRows.push(values.map(val => `"${val}"`).join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    saveAs(blob, 'bilty-entries.csv');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      'LR No', 'Date', 'Movement', 'From', 'To',
      'Consignor', 'Consignor GST', 'Consignee', 'Consignee GST',
      'Veh Type', 'Veh No', 'Qty', 'Material', 'Invoice', 'Eway Bill'
    ];
    const tableRows = [];

    entries.forEach(entry => {
      tableRows.push([
        entry.consignmentNo,
        entry.consignmentDate?.split('T')[0],
        entry.movementType,
        entry.from,
        entry.to,
        entry.consignorName,
        entry.consignorGST,
        entry.consigneeName,
        entry.consigneeGST,
        entry.vehicleType,
        entry.vehicleNo,
        entry.quantity,
        entry.materialType,
        entry.invoiceNo,
        entry.ewayBillNo,
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('bilty-entries.pdf');
  };

  useEffect(() => {
    fetchEntries();
  }, [location]);

  return (
    <div className="container-fluid px-3 mt-4">
      <h4>Recent Uploads</h4>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-2">
          <label>Location</label>
          <select className="form-control" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="pune">Pune</option>
            <option value="mumbai">Mumbai</option>
            <option value="bangalore">Bangalore</option>
            <option value="delhi">Delhi</option>
          </select>
        </div>
        <div className="col-md-2">
          <label>From Date</label>
          <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="col-md-2">
          <label>To Date</label>
          <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <div className="col-md-2">
          <label>From LR No</label>
          <input type="text" className="form-control" value={lrFrom} onChange={(e) => setLrFrom(e.target.value)} />
        </div>
        <div className="col-md-2">
          <label>To LR No</label>
          <input type="text" className="form-control" value={lrTo} onChange={(e) => setLrTo(e.target.value)} />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={fetchEntries}>Apply Filter</button>
        </div>
      </div>

      {/* Optional Global Export Buttons (can remove if exporting row-wise only) */}
      <div className="mb-3 d-flex justify-content-end gap-3">
        <button className="btn btn-success" onClick={exportToCSV}>📁 Export to CSV</button>
      </div>

      {/* Table */}
      {entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-sm">
            <thead className="table-dark">
              <tr>
                <th>Consignment No</th>
                <th>Date</th>
                <th>Movement Type</th>
                <th>From</th>
                <th>To</th>
                <th>Consignor</th>
                <th>Consignor GST</th>
                <th>Consignee</th>
                <th>Consignee GST</th>
                <th>Vehicle Type</th>
                <th>Vehicle No</th>
                <th>Qty</th>
                <th>Material</th>
                <th>Invoice No</th>
                <th>E-Way Bill</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  {Object.entries({
                    consignmentNo: entry.consignmentNo,
                    consignmentDate: entry.consignmentDate?.split('T')[0],
                    movementType: entry.movementType,
                    from: entry.from,
                    to: entry.to,
                    consignorName: entry.consignorName,
                    consignorGST: entry.consignorGST,
                    consigneeName: entry.consigneeName,
                    consigneeGST: entry.consigneeGST,
                    vehicleType: entry.vehicleType,
                    vehicleNo: entry.vehicleNo,
                    quantity: entry.quantity,
                    materialType: entry.materialType,
                    invoiceNo: entry.invoiceNo,
                    ewayBillNo: entry.ewayBillNo,
                  }).map(([key, value]) => (
                    <td key={key}>
                      {editingRow === entry.id ? (
                        <input
                          value={editData[key] ?? ''}
                          onChange={(e) =>
                            setEditData({ ...editData, [key]: e.target.value })
                          }
                          className="form-control form-control-sm"
                        />
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                  <td>
                    {editingRow === entry.id ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => saveChanges(entry.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          setEditingRow(entry.id);
                          setEditData({ ...entry });
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
