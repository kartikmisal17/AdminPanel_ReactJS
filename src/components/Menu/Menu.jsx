<<<<<<< HEAD
import Navbaar from "../Navbaar/Navbaar"
import Table from 'react-bootstrap/Table';
import { useState,useEffect } from "react"
import React from 'react';
import axios from 'axios';
import { Modal, Button, Form } from "react-bootstrap";
import './Menu.css';





export default function Menu(){
    

=======
import Navbaar from "../Navbaar/Navbaar";
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from "react";
import React from 'react';
import axios from 'axios';
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import './Menu.css';

export default function Menu() {
>>>>>>> 8984db7 (Updated)
    const [menu, setMenu] = useState([]);
    const [formData, setFormData] = useState({ menu_name: "", menu_price: "", qid: "", fid: "" });
    const [updateData, setUpdateData] = useState({ id: "", menu_name: "", menu_price: "", qid: "", fid: "" });
    const [showUpdateModal, setShowUpdateModal] = useState(false);
<<<<<<< HEAD
=======
    const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
>>>>>>> 8984db7 (Updated)

    useEffect(() => {
        fetchMenu();
    }, []);

<<<<<<< HEAD
=======
    const showToast = (message, variant = "success") => {
        setToast({ show: true, message, variant });
        setTimeout(() => {
            setToast({ show: false, message: "", variant: "success" });
        }, 3000);
    };

>>>>>>> 8984db7 (Updated)
    const fetchMenu = async () => {
        try {
            const response = await axios.get("http://localhost:2025/menu");
            if (response.data.menu) {
<<<<<<< HEAD
                const sortedMenu = [...response.data.menu].sort((a, b) => 
                    a.menu_name.toLowerCase().localeCompare(b.menu_name.toLowerCase())
                );
                setMenu(sortedMenu);
=======
                const sortedMenu = [...response.data.menu].sort((a, b) =>
                    a.menu_name.toLowerCase().localeCompare(b.menu_name.toLowerCase())
                );
                const updatedMenu = sortedMenu.map(item => ({
                    id: item.mid,
                    ...item
                }));
                setMenu(updatedMenu);
>>>>>>> 8984db7 (Updated)
            }
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete menu ID ${id}?`)) {
            try {
                const response = await axios.delete("http://localhost:2025/delmenubyid", { data: { id } });
                if (response.data.status == 200) {
<<<<<<< HEAD
                    alert("Data Deleted Successfully!");
                    fetchMenu();
                } else {
                    alert("Data not Deleted!");
=======
                    showToast("Menu Item Deleted", "success");
                    fetchMenu();
                } else {
                    showToast("Delete Failed", "danger");
>>>>>>> 8984db7 (Updated)
                }
            } catch (error) {
                console.error("Error deleting data:", error);
            }
        }
    };

    const handleAdd = async () => {
        if (!formData.menu_name || !formData.menu_price || !formData.qid || !formData.fid) {
<<<<<<< HEAD
            alert("All fields are required!");
=======
            showToast("All fields are required!", "danger");
>>>>>>> 8984db7 (Updated)
            return;
        }
        try {
            const response = await axios.post("http://localhost:2025/addMENU", formData);
            if (response.data.status == 200) {
<<<<<<< HEAD
                alert("Data Inserted Successfully!");
                fetchMenu();
                setFormData({ menu_name: "", menu_price: "", qid: "", fid: "" });
            } else {
                alert("Data not Inserted!");
=======
                showToast("Menu Item Added Successfully!", "success");
                fetchMenu();
                setFormData({ menu_name: "", menu_price: "", qid: "", fid: "" });
            } else {
                showToast("Failed to Add Menu Item", "danger");
>>>>>>> 8984db7 (Updated)
            }
        } catch (error) {
            console.error("Error inserting data:", error);
        }
    };

    const handleUpdate = async () => {
        if (!updateData.id || !updateData.menu_name || !updateData.menu_price || !updateData.qid || !updateData.fid) {
<<<<<<< HEAD
            alert("All fields are required!");
=======
            showToast("All fields are required!", "danger");
>>>>>>> 8984db7 (Updated)
            return;
        }
        try {
            const response = await axios.put("http://localhost:2025/updateMENU", updateData);
            if (response.data.status == 200) {
<<<<<<< HEAD
                alert("Data Updated Successfully!");
                fetchMenu();
                setShowUpdateModal(false);
            } else {
                alert("Data not Updated!");
=======
                showToast("Menu Updated Successfully!", "success");
                fetchMenu();
                setShowUpdateModal(false);
            } else {
                showToast("Failed to Update", "danger");
>>>>>>> 8984db7 (Updated)
            }
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

<<<<<<< HEAD


    return(
        <>
        <Navbaar/>
        <header className="bg-dark bg-gradient text-white pb-2">
      <div className="container px-4 text-center">
        <h1 className="font-bold text-[70px]">Menu</h1>
      </div>
    </header>
        <div style={{ maxHeight: '660px', overflowY: 'auto' }}>
        <Table striped bordered hover variant="dark" style={{ tableLayout: 'fixed' }}>
      <thead style={{ position: "sticky", top: "0", backgroundColor: "#343a40", zIndex: 1 }}>
        <tr>
            <th>ID</th>
          <th>Menu Name</th>
          <th>Menu Price</th>
          <th>Food Quantity</th>
          <th>Food Category</th>         
          <th>Update Data</th>
          <th>Delete Data</th>
        
        </tr>
      </thead>
      <tbody>
      {menu.map((item)=>{
          return(
            <tr>
                <td>{item.mid}</td>
          <td>{item.menu_name}</td>
          <td>{item.menu_price}</td>
          <td>{item.qid}</td>
          <td>{item.fid}</td>
          <td>
          <Button variant="warning" 
          onClick={() => { setUpdateData({ id: item.mid, menu_name:item.menu_name, menu_price: item. menu_price, qid: item.qid, fid: item.fid }); setShowUpdateModal(true);  }} >Update</Button>

         </td>
         <td><Button variant="danger" onClick={() => handleDelete(item.mid)}>Delete</Button>{" "}</td>
                            
          
        </tr>
          )
        })}
       
      </tbody>
    </Table>

     {/* Update Modal */}
     <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
=======
    return (
        <>
            <Navbaar />

            {/* Toast Message */}
            <ToastContainer className="toast-container" position="top-end">
                <Toast bg={toast.variant} onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide>
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            <header className="menu-header">
                <h1>🍽️ Menu Management</h1>
            </header>

            <div className="table-section">
                <Table striped bordered hover responsive className="styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Menu Name</th>
                            <th>Price (₹)</th>
                            <th>Quantity ID</th>
                            <th>Category ID</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menu.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.menu_name}</td>
                                <td>{item.menu_price}</td>
                                <td>{item.qid}</td>
                                <td>{item.fid}</td>
                                <td>
                                    <Button variant="warning" onClick={() => {
                                        setUpdateData({
                                            id: item.id,
                                            menu_name: item.menu_name,
                                            menu_price: item.menu_price,
                                            qid: item.qid,
                                            fid: item.fid
                                        });
                                        setShowUpdateModal(true);
                                    }}>Update</Button>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Update Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
>>>>>>> 8984db7 (Updated)
                <Modal.Header closeButton>
                    <Modal.Title>Update Menu Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.keys(updateData).map((key) => (
                        <Form.Group className="mb-3" key={key}>
<<<<<<< HEAD
                            <Form.Label>{key.replace("_", " ")}</Form.Label>
                            <Form.Control
                                type={key === "menu_price" || key === "qid" || key === "fid" ? "number" : "text"}
=======
                            <Form.Label>{key.toUpperCase()}</Form.Label>
                            <Form.Control
                                type={(key === "menu_price" || key === "qid" || key === "fid") ? "number" : "text"}
>>>>>>> 8984db7 (Updated)
                                value={updateData[key]}
                                onChange={(e) => setUpdateData({ ...updateData, [key]: e.target.value })}
                                disabled={key === "id"}
                            />
                        </Form.Group>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
<<<<<<< HEAD
                    <Button variant="primary" onClick={handleUpdate}>Update Data</Button>
                </Modal.Footer>
            </Modal> 


    </div>
    
    <div className="container">
            <h1 className="text-center" style={{ fontSize: "60px" }}>Add Data</h1>
            <div className="row g-3">
                {Object.keys(formData).map((key) => (
                    <div className="d-flex justify-content-center w-100" key={key}>
                        <Form.Group className="form-floating mb-3" style={{ width: "50%" }}>
                            <Form.Control
                                type={key === "menu_price" || key === "qid" || key === "fid" ? "number" : "text"}
                                id={key}
                                placeholder={key}
                                value={formData[key]}
                                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            />
                            <Form.Label htmlFor={key}>{key.replace("_", " ")}</Form.Label>
                        </Form.Group>
                    </div>
                ))}
                <div className="d-flex justify-content-center w-100">
                    <Button variant="primary" className="btn-lg w-50 py-3" onClick={handleAdd}>Add Data</Button>
                </div>
            </div>
        </div>


        
        </>
    )
}
=======
                    <Button variant="primary" onClick={handleUpdate}>Update</Button>
                </Modal.Footer>
            </Modal>

            {/* Add Section */}
            <div className="add-section">
                <h2>Add New Menu Item</h2>
                <Form className="add-form">
                    {Object.keys(formData).map((key) => (
                        <Form.Group className="mb-3" key={key}>
                            <Form.Label className="form-label-white">{key.toUpperCase()}</Form.Label>
                            <Form.Control
                                type={(key === "menu_price" || key === "qid" || key === "fid") ? "number" : "text"}
                                placeholder={`Enter ${key}`}
                                value={formData[key]}
                                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            />
                        </Form.Group>
                    ))}
                    <Button className="add-button" onClick={handleAdd}>Add Item</Button>
                </Form>
            </div>

            <footer className="menu-footer">
                <p>&copy; 2024 Delicious Bites | All Rights Reserved</p>
            </footer>
        </>
    );
}
>>>>>>> 8984db7 (Updated)
