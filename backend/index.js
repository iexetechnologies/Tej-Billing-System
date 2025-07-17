const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'biltydb',
  password: 'admin123', // change if different
  port: 5432,
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🚚 Bilty API is running...');
});

// ✅ Helper: Convert empty strings to null or proper types
const sanitizeInput = (value, type = 'string') => {
  if (value === '') return null;
  if (type === 'int') return parseInt(value);
  return value;
};

// ✅ POST route to save Bilty data
app.post('/api/bilty', async (req, res) => {
  try {
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
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
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

// ✅ GET all consignments
app.get('/api/bilty', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM consignments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching data:', err.message);
    res.status(500).json({ error: 'Failed to fetch consignments' });
  }
});

// ✅ GET route to fetch all entries for RecentUploads
app.get('/entries', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
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
        quantity AS "quantity",
        material_type AS "materialType",
        invoice_no AS "invoiceNo",
        eway_bill_no AS "ewayBillNo"
      FROM consignments
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching entries:', err.message);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
