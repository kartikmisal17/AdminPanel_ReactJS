import Navbaar from "../Navbaar/Navbaar";
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from "react";
import React from 'react';
import axios from 'axios';
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import './Fqty.css';

export default function Fqty() {
    const [quantities, setQuantities] = useState([]);
    const [newQuantity, setNewQuantity] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState({ id: "", quantity: "" });
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
            setNewQuantity("");
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
                <h1>🔢 Food Quantities</h1>
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

            {/* Update Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Food Quantity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
                    <Button variant="primary" onClick={updateQuantity}>Update</Button>
                </Modal.Footer>
            </Modal>

            {/* Add Quantity Section */}
            <div className="add-section">
                <h2>Add New Quantity</h2>
                <Form className="add-form">
                    <Form.Group className="mb-3">
                        <Form.Label className="form-label-white">FOOD QUANTITY</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Food Quantity"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(e.target.value)}
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
