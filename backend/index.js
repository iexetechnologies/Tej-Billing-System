const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// 🏢 Location-based database configs
const dbConfigs = {
  pune: { user: 'postgres', host: 'localhost', database: 'bilty_pune', password: 'admin123', port: 5432 },
  mumbai: { user: 'postgres', host: 'localhost', database: 'bilty_mumbai', password: 'admin123', port: 5432 },
  bangalore: { user: 'postgres', host: 'localhost', database: 'bilty_bangalore', password: 'admin123', port: 5432 },
  delhi: { user: 'postgres', host: 'localhost', database: 'bilty_delhi', password: 'admin123', port: 5432 },
};

// 🔌 Utility: get DB pool for a location
const getPool = (location) => {
  const config = dbConfigs[location?.toLowerCase()];
  if (!config) throw new Error('Invalid location');
  return new Pool(config);
};

// 🧼 Sanitize input
const sanitizeInput = (value, type = 'string') => {
  if (value === '') return null;
  if (type === 'int') return parseInt(value);
  return value;
};

// 🏁 Home route
app.get('/', (req, res) => {
  res.send('🚚 Bilty API is running');
});

// 📥 Create Bilty entry
app.post('/api/bilty/:location', async (req, res) => {
  const { location } = req.params;

  try {
    const pool = getPool(location);

    const {
      consignmentNo,
      consignmentDate,
      movementType,
      from,
      to,
      consignorName,
      consignorGST,
      consigneeName,
      consigneeGST,
      vehicleType,
      vehicleNo,
      quantity,
      materialType,
      invoiceNo,
      ewayBillNo,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO consignments (
        consignment_no, consignment_date, movement_type,
        from_location, to_location, vehicle_type, vehicle_no,
        consignor_name, consignor_gst_no, consignee_name, consignee_gst_no,
        quantity, material_type, invoice_no, eway_bill_no
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *`,
      [
        sanitizeInput(consignmentNo),
        sanitizeInput(consignmentDate),
        sanitizeInput(movementType),
        sanitizeInput(from),
        sanitizeInput(to),
        sanitizeInput(vehicleType),
        sanitizeInput(vehicleNo),
        sanitizeInput(consignorName),
        sanitizeInput(consignorGST),
        sanitizeInput(consigneeName),
        sanitizeInput(consigneeGST),
        sanitizeInput(quantity, 'int'),
        sanitizeInput(materialType),
        sanitizeInput(invoiceNo),
        sanitizeInput(ewayBillNo),
      ]
    );

    res.status(201).json({ message: '✅ Bilty saved', data: result.rows[0] });
  } catch (err) {
    console.error('❌ Error inserting data:', err.message);
    res.status(500).json({ error: 'Something went wrong while saving the Bilty' });
  }
});

// 📤 Fetch Bilty entries (with optional date filter)
app.get('/api/bilty/:location', async (req, res) => {
  const { location } = req.params;
  const { from, to } = req.query;

  try {
    const pool = getPool(location);

    let query = `
      SELECT 
        id,
        consignment_no AS "consignmentNo",
        consignment_date AS "consignmentDate",
        movement_type AS "movementType",
        from_location AS "from",
        to_location AS "to",
        consignor_name AS "consignorName",
        consignor_gst_no AS "consignorGST",
        consignee_name AS "consigneeName",
        consignee_gst_no AS "consigneeGST",
        vehicle_type AS "vehicleType",
        vehicle_no AS "vehicleNo",
        quantity,
        material_type AS "materialType",
        invoice_no AS "invoiceNo",
        eway_bill_no AS "ewayBillNo"
      FROM consignments`;

    const values = [];

    if (from && to) {
      query += ' WHERE consignment_date BETWEEN $1 AND $2';
      values.push(from, to);
    }

    query += ' ORDER BY consignment_date DESC';

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching entries:', err.message);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// 🖊️ Update Bilty entry
app.put('/api/bilty/:location/:id', async (req, res) => {
  const { location, id } = req.params;

  try {
    const pool = getPool(location);

    const {
      consignmentNo,
      consignmentDate,
      movementType,
      from,
      to,
      consignorName,
      consignorGST,
      consigneeName,
      consigneeGST,
      vehicleType,
      vehicleNo,
      quantity,
      materialType,
      invoiceNo,
      ewayBillNo,
    } = req.body;

    await pool.query(
      `UPDATE consignments SET
        consignment_no = $1,
        consignment_date = $2,
        movement_type = $3,
        from_location = $4,
        to_location = $5,
        consignor_name = $6,
        consignor_gst_no = $7,
        consignee_name = $8,
        consignee_gst_no = $9,
        vehicle_type = $10,
        vehicle_no = $11,
        quantity = $12,
        material_type = $13,
        invoice_no = $14,
        eway_bill_no = $15
      WHERE id = $16`,
      [
        consignmentNo,
        consignmentDate,
        movementType,
        from,
        to,
        consignorName,
        consignorGST,
        consigneeName,
        consigneeGST,
        vehicleType,
        vehicleNo,
        quantity,
        materialType,
        invoiceNo,
        ewayBillNo,
        id,
      ]
    );

    res.json({ message: '✅ Bilty updated' });
  } catch (err) {
    console.error('❌ Error updating entry:', err.message);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// 🟢 Start the server
app.listen(port, () => {
  console.log(`🚀 Bilty backend running at http://localhost:${port}`);
});
