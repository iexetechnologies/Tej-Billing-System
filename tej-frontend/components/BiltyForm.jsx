import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { FaSearch } from 'react-icons/fa';
import { components } from 'react-select';
import './biltyform.css';
import axios from 'axios';

import {
  FROM,
  TO,
  MovementType,
  ConsignorsName,
  ConsigneesName,
  VehicleType,
  MaterialType
} from '../assets/dropdowndata';

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <FaSearch style={{ fontSize: '14px', marginRight: 4 }} />
  </components.DropdownIndicator>
);

const customSelectStyle = {
  control: (base) => ({
    ...base,
    backgroundColor: '#e8f0fe',
    border: '1px solid #ced4da',
    boxShadow: 'none',
    borderRadius: '5px',
    minHeight: '30px',
    fontSize: '13px',
    fontFamily: 'Times New Roman, serif',
  }),
  valueContainer: (base) => ({ ...base, padding: '0 6px' }),
  indicatorsContainer: (base) => ({ ...base, padding: '0 6px' }),
  placeholder: (base) => ({ ...base, color: '#6c757d' }),
  singleValue: (base) => ({ ...base, color: '#212529' }),
  menu: (base) => ({ ...base, zIndex: 5 }),
};

const locations = ['Pune', 'Mumbai', 'Bangalore', 'Delhi'];

const BiltyForm = () => {
  const today = new Date().toISOString().split('T')[0];

  const [selectedLocation, setSelectedLocation] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    consignmentNo: '',
    consignmentDate: today,
    from: '',
    to: '',
    movementType: '',
    consignorName: '',
    consignorGST: '',
    consigneeName: '',
    consigneeGST: '',
    vehicleType: '',
    vehicleNo: '',
    quantity: '',
    materialType: '',
    invoiceNo: '',
    ewayBillNo: '',
  });

  useEffect(() => {
    if (formData.consignmentNo === 'EXIST123') {
      setShowPopup(true);
    }
  }, [formData.consignmentNo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : '' });
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowLocationModal(false);
  };

  const handleClose = () => setShowPopup(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert('❌ Please select a location first.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/bilty/${selectedLocation}`, formData);
      alert('✅ Bilty submitted successfully!');
      setFormData({
        consignmentNo: '',
        consignmentDate: today,
        from: '',
        to: '',
        movementType: '',
        consignorName: '',
        consignorGST: '',
        consigneeName: '',
        consigneeGST: '',
        vehicleType: '',
        vehicleNo: '',
        quantity: '',
        materialType: '',
        invoiceNo: '',
        ewayBillNo: '',
      });
    } catch (err) {
      alert('❌ Error submitting Bilty: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bilty-page-container">
      {/* Location Modal */}
      <Modal show={showLocationModal} centered backdrop="static">
        <Modal.Header>
          <Modal.Title>Select Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {locations.map((loc) => (
              <Button
                key={loc}
                variant="outline-primary"
                onClick={() => handleLocationSelect(loc.toLowerCase())}
              >
                {loc}
              </Button>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      <h3 className="mb-4 text-dark fw-bold bg-white p-2 rounded shadow-sm text-center">
        Create Bilty {selectedLocation ? ` - ${selectedLocation.toUpperCase()}` : ''}
      </h3>

      <Form onSubmit={handleSubmit}>
        <Row>
          {[
            ['Consignment No *', 'consignmentNo', 'text'],
            ['Consignment Date *', 'consignmentDate', 'date'],
            ['Movement Type *', 'movementType', 'select', MovementType],
            ['FROM *', 'from', 'selectSearch', FROM],
            ['TO *', 'to', 'selectSearch', TO],
            ['Vehicle Type *', 'vehicleType', 'select', VehicleType],
            ['Vehicle No *', 'vehicleNo', 'text'],
            ['Consignor\'s Name *', 'consignorName', 'selectSearch', ConsignorsName],
            ['Consignor\'s GST No', 'consignorGST', 'text'],
            ['Consignee\'s Name *', 'consigneeName', 'selectSearch', ConsigneesName],
            ['Consignee\'s GST No', 'consigneeGST', 'text'],
            ['Quantity', 'quantity', 'text'],
            ['Material Type *', 'materialType', 'select', MaterialType],
            ['Invoice No (Tata Invoice No)', 'invoiceNo', 'text'],
            ['E-Way Bill No', 'ewayBillNo', 'text']
          ].map(([label, name, type, options]) => (
            <Col md={4} key={name} className="mb-3">
              <Form.Group>
                <Form.Label className="label-bg">{label}</Form.Label>
                {type === 'text' || type === 'date' ? (
                  <Form.Control
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={label.includes('*')}
                    className="form-control-sm bg-light"
                  />
                ) : type === 'select' ? (
                  <Form.Select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={label.includes('*')}
                    className="form-select-sm bg-light"
                  >
                    <option value="">Select</option>
                    {options.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </Form.Select>
                ) : (
                  <Select
                    name={name}
                    options={options.map((item) => ({ label: item, value: item }))}
                    value={formData[name] ? { label: formData[name], value: formData[name] } : null}
                    onChange={(selected) => handleSelectChange(name, selected)}
                    isClearable
                    components={{ DropdownIndicator }}
                    styles={customSelectStyle}
                    placeholder="Select"
                  />
                )}
              </Form.Group>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-3">
          <Button type="submit" variant="primary" size="sm" className="fw-bold" style={{ width: '150px', fontSize: '15px' }}>
            Submit
          </Button>
        </div>
      </Form>

      <Modal show={showPopup} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">⚠ Duplicate LR No.</Modal.Title>
        </Modal.Header>
        <Modal.Body>This consignment number already exists. Please verify before submitting.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Okay</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BiltyForm;
