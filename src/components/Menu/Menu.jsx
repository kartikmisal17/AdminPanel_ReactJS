// Menu.js
import Navbaar from "../Navbaar/Navbaar";
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from "react";
import React from 'react';
import axios from 'axios';
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import './Menu.css';

export default function Menu() {
    const [menu, setMenu] = useState([]);
    const [formData, setFormData] = useState({ menu_name: "", menu_price: "", qid: "", fid: "" });
    const [updateData, setUpdateData] = useState({ id: "", menu_name: "", menu_price: "", qid: "", fid: "" });
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

    useEffect(() => {
        fetchMenu();
    }, []);

    const showToast = (message, variant = "success") => {
        setToast({ show: true, message, variant });
        setTimeout(() => {
            setToast({ show: false, message: "", variant: "success" });
        }, 3000);
    };

    const fetchMenu = async () => {
        try {
            const response = await axios.get("http://localhost:2025/menu");
            if (response.data.menu) {
                const sortedMenu = [...response.data.menu].sort((a, b) =>
                    a.menu_name.toLowerCase().localeCompare(b.menu_name.toLowerCase())
                );
                const updatedMenu = sortedMenu.map(item => ({
                    id: item.mid,
                    ...item
                }));
                setMenu(updatedMenu);
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
                    showToast("Menu Item Deleted", "success");
                    fetchMenu();
                } else {
                    showToast("Delete Failed", "danger");
                }
            } catch (error) {
                console.error("Error deleting data:", error);
            }
        }
    };

    const handleAdd = async () => {
        if (!formData.menu_name || !formData.menu_price || !formData.qid || !formData.fid) {
            showToast("All fields are required!", "danger");
            return;
        }
        try {
            const response = await axios.post("http://localhost:2025/addMENU", formData);
            if (response.data.status == 200) {
                showToast("Menu Item Added Successfully!", "success");
                fetchMenu();
                setFormData({ menu_name: "", menu_price: "", qid: "", fid: "" });
            } else {
                showToast("Failed to Add Menu Item", "danger");
            }
        } catch (error) {
            console.error("Error inserting data:", error);
        }
    };

    const handleUpdate = async () => {
        if (!updateData.id || !updateData.menu_name || !updateData.menu_price || !updateData.qid || !updateData.fid) {
            showToast("All fields are required!", "danger");
            return;
        }
        try {
            const response = await axios.put("http://localhost:2025/updateMENU", updateData);
            if (response.data.status == 200) {
                showToast("Menu Updated Successfully!", "success");
                fetchMenu();
                setShowUpdateModal(false);
            } else {
                showToast("Failed to Update", "danger");
            }
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    return (
        <>
            <Navbaar />

            <ToastContainer position="top-end">
                <Toast bg={toast.variant} onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide>
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            <header className="menu-header">
                <h1>🍽️ Menu Management</h1>
            </header>

            <div className="table-section">
                <Table className="styled-table" striped bordered hover responsive>
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
                                        setUpdateData({ ...item });
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

            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Menu Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.keys(updateData).map((key) => (
                        <Form.Group className="mb-3" key={key}>
                            <Form.Label>{key.toUpperCase()}</Form.Label>
                            <Form.Control
                                type={(key === "menu_price" || key === "qid" || key === "fid") ? "number" : "text"}
                                value={updateData[key]}
                                onChange={(e) => setUpdateData({ ...updateData, [key]: e.target.value })}
                                disabled={key === "id"}
                            />
                        </Form.Group>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdate}>Update</Button>
                </Modal.Footer>
            </Modal>

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

            <footer className="menu-footer text-center mt-5">
                <p>&copy; 2024 Delicious Bites | All Rights Reserved</p>
            </footer>
        </>
    );
}