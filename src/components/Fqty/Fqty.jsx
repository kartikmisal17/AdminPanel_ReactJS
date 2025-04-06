<<<<<<< HEAD
import Navbaar from "../Navbaar/Navbaar"
import Table from 'react-bootstrap/Table';
import { useState,useEffect } from "react"
import React from 'react';
import axios from 'axios';
import { Modal, Button, Form } from "react-bootstrap";



export default function Fqty(){
  const [quantities, setQuantities] = useState([]);
  const [formData, setFormData] = useState({ id: "", quantity: "" });
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
      fetchData();
  }, []);

  const fetchData = () => {
      axios.get("http://localhost:2025/qty")
          .then(response => setQuantities(response.data.menu))
          .catch(error => console.error("Error fetching data:", error));
  };

  const handleDelete = (id) => {
      if (!id) {
          alert("Please enter a valid ID!");
          return;
      }
      if (!window.confirm(`You want to delete the record with ID ${id}?`)) {
          return;
      }
      axios.delete("http://localhost:2025/delqtybyid", { data: { id } })
          .then(response => {
              if (response.data.status == 200) {
                  alert("Data Deleted Successfully!");
                  fetchData();
              } else {
                  alert("Data not Deleted!");
              }
          })
          .catch(error => {
              console.error("Error deleting data:", error);
              alert("An error occurred. Please try again.");
          });
  };

  const handleAdd = () => {
      if (!formData.quantity) {
          alert("All fields are required!");
          return;
      }
      axios.post("http://localhost:2025/addQTY", { quantity: formData.quantity })
          .then(response => {
              if (response.data.status == 200) {
                  alert("Data Inserted Successfully!");
                  fetchData();
              } else {
                  alert("Data not Inserted!");
              }
          })
          .catch(error => {
              console.error("Error inserting data:", error);
              alert("An error occurred. Please try again.");
          });
  };

  const handleUpdate = () => {
      if (!formData.id || !formData.quantity) {
          alert("All fields are required!");
          return;
      }
      axios.put("http://localhost:2025/updateQTY", {
          id: parseInt(formData.id),
          quantity: formData.quantity
      })
          .then(response => {
              if (response.data.status == 200) {
                  alert("Data Updated Successfully!");
                  fetchData();
                  setShowUpdateModal(false);
              } else {
                  alert("Data not Updated!");
              }
          })
          .catch(error => {
              console.error("Error during request:", error);
              if (error.response && error.response.status == 404) {
                  alert("Quantity item with the given ID not found!");
              } else {
                  alert("An error occurred while updating the data!");
              }
          });
  };

  const openUpdateModal = (id, quantity) => {
      setFormData({ id, quantity });
      setShowUpdateModal(true);
  };

    return(
        <>
        <Navbaar/>
        <header className="bg-dark bg-gradient text-white pb-2">
      <div className="container px-4 text-center">
        <h1 className="font-bold text-[70px]">Food Quantity</h1>
      </div>
    </header>
        
        <div style={{ maxHeight: '660px', overflowY: 'auto' }}>
        <Table striped bordered hover variant="dark" style={{ tableLayout: 'fixed' }}>
      <thead style={{ position: "sticky", top: "0", backgroundColor: "#343a40", zIndex: 1 }}>
        <tr>
            <th>Quantity ID</th>         
          <th>Food Quantity</th>
          <th>Update Data</th>
          <th>Delete Data</th>
          
        </tr>
      </thead>
      <tbody>
      {quantities.map((item)=>{
          return(
            <tr>
                <td>{item.qid}</td>
          <td>{item.quantity}</td> 
          <td>
          <Button variant="warning" onClick={() => openUpdateModal(item.qid, item.quantity)}>Update</Button>
                                
                               
                            </td>  
                            <td><Button variant="danger" onClick={() => handleDelete(item.qid)}>Delete</Button>{' '}</td>    
        </tr>
          )
        })}      
      </tbody>
    </Table>


    
            {/* Update Modal */}
=======
import Navbaar from "../Navbaar/Navbaar";
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from "react";
import React from 'react';
import axios from 'axios';
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import './Fqty.css';

export default function Fqty() {
    const [quantities, setQuantities] = useState([]);
    const [newQuantity, setNewQuantity] = useState(""); // for ADD input only
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState({ id: "", quantity: "" }); // for UPDATE modal
    const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

    useEffect(() => {
        fetchQuantities();
    }, []);

    const showToast = (message, variant = "success") => {
        setToast({ show: true, message, variant });
        setTimeout(() => {
            setToast({ show: false, message: "", variant: "success" });
        }, 3000);
    };

    const fetchQuantities = async () => {
        try {
            const response = await axios.get("http://localhost:2025/qty");
            const formatted = response.data.menu.map(item => ({
                id: item.qid,
                quantity: item.quantity
            }));
            setQuantities(formatted);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const deleteQuantity = async (id) => {
        if (!window.confirm(`Do you want to delete quantity ID ${id}?`)) return;
        try {
            await axios.delete("http://localhost:2025/delqtybyid", { data: { id } });
            showToast("Quantity Deleted Successfully!");
            fetchQuantities();
        } catch (error) {
            showToast("Failed to Delete!", "danger");
        }
    };

    const addQuantity = async () => {
        if (!newQuantity) {
            showToast("Quantity name cannot be empty!", "danger");
            return;
        }
        try {
            await axios.post("http://localhost:2025/addQTY", { quantity: newQuantity });
            showToast("Quantity Added Successfully!");
            setNewQuantity(""); // Clear the input after adding
            fetchQuantities();
        } catch (error) {
            showToast("Failed to Add Quantity!", "danger");
        }
    };

    const updateQuantity = async () => {
        if (!selectedQuantity.id || !selectedQuantity.quantity) {
            showToast("All fields are required!", "danger");
            return;
        }
        try {
            await axios.put("http://localhost:2025/updateQTY", selectedQuantity);
            showToast("Quantity Updated Successfully!");
            setShowUpdateModal(false);
            fetchQuantities();
        } catch (error) {
            showToast("Failed to Update!", "danger");
        }
    };

    return (
        <>
            <Navbaar />

            <ToastContainer className="toast-container" position="top-end">
                <Toast bg={toast.variant} onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide>
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            <header className="fqty-header">
                <h1>📦 Food Quantities</h1>
            </header>

            <div className="table-section">
                <Table striped bordered hover responsive className="styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Food Quantity</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quantities.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    <Button variant="warning" onClick={() => {
                                        setSelectedQuantity({ id: item.id, quantity: item.quantity });
                                        setShowUpdateModal(true);
                                    }}>Update</Button>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() => deleteQuantity(item.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

>>>>>>> 8984db7 (Updated)
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Food Quantity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
<<<<<<< HEAD
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="number" value={formData.id} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Food Quantity Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
                    <Button variant="success" onClick={handleUpdate}>Update Data</Button>
                </Modal.Footer>
            </Modal>




    </div>


    <div className="container">
            <h1 className="text-center" style={{ fontSize: "60px" }}>Add Data</h1>
            <div className="row g-3">
                <div className="d-flex justify-content-center w-100">
                    <Form.Group className="form-floating mb-3" style={{ width: "50%" }}>
                        <Form.Control
                            type="text"
                            placeholder="quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ quantity: e.target.value })}
                        />
                        <Form.Label>Food Quantity Name</Form.Label>
                    </Form.Group>
                </div>
                <div className="d-flex justify-content-center w-100">
                    <Button variant="primary" className="btn-lg w-50 py-3" onClick={handleAdd}>Add Data</Button>
                </div>
            </div>
        </div>
        
        </>
    )
}
=======
                    <Form.Group className="mb-3">
                        <Form.Label>ID</Form.Label>
                        <Form.Control type="text" value={selectedQuantity.id} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Food Quantity</Form.Label>
                        <Form.Control
                            type="text"
                            value={selectedQuantity.quantity}
                            onChange={(e) => setSelectedQuantity({ ...selectedQuantity, quantity: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
                    <Button variant="primary" onClick={updateQuantity}>Update</Button>
                </Modal.Footer>
            </Modal>

            <div className="add-section">
                <h2>Add New Quantity</h2>
                <Form className="add-form">
                    <Form.Group className="mb-3">
                        <Form.Label className="form-label-white">FOOD QUANTITY</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Food Quantity"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(e.target.value)} // Independent of modal input
                        />
                    </Form.Group>
                    <Button className="add-button" onClick={addQuantity}>Add Quantity</Button>
                </Form>
            </div>

            <footer className="menu-footer">
                <p>&copy; 2024 Delicious Bites | All Rights Reserved</p>
            </footer>
        </>
    );
}
>>>>>>> 8984db7 (Updated)
