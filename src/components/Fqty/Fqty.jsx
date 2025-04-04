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
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Food Quantity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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