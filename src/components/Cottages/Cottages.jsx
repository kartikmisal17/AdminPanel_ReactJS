import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbaar from "../Navbaar/Navbaar";
import Table from 'react-bootstrap/Table';
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import './Cottages.css'; // apne hisab se CSS banao ya same use kar lo

export default function Cottages() {
    const [cottages, setCottages] = useState([]);
    const [newCottage, setNewCottage] = useState({ name: "", location: "" });
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCottage, setSelectedCottage] = useState({ id: "", name: "", location: "" });
    const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

    useEffect(() => {
        fetchCottages();
    }, []);

    const showToast = (message, variant = "success") => {
        setToast({ show: true, message, variant });
        setTimeout(() => {
            setToast({ show: false, message: "", variant: "success" });
        }, 3000);
    };

    const fetchCottages = async () => {
        try {
            const response = await axios.get("http://localhost:2025/getcottages");
            setCottages(response.data.cottages);
        } catch (error) {
            console.error("Error fetching cottages:", error);
            showToast("Error fetching cottages", "danger");
        }
    };

    const deleteCottage = async (id) => {
        if (!window.confirm(`Do you want to delete cottage ID ${id}?`)) return;
        try {
            await axios.delete("http://localhost:2025/deletecottage", { data: { id } });
            showToast("Cottage Deleted Successfully!");
            fetchCottages();
        } catch (error) {
            console.error(error);
            showToast("Failed to Delete Cottage!", "danger");
        }
    };

    const addCottage = async () => {
        if (!newCottage.name.trim() || !newCottage.location.trim()) {
            showToast("Name and Location cannot be empty!", "danger");
            return;
        }
        try {
            await axios.post("http://localhost:2025/addcottage", newCottage);
            showToast("Cottage Added Successfully!");
            setNewCottage({ name: "", location: "" });
            fetchCottages();
        } catch (error) {
            console.error(error);
            showToast("Failed to Add Cottage!", "danger");
        }
    };

    const updateCottage = async () => {
        if (!selectedCottage.id || !selectedCottage.name.trim() || !selectedCottage.location.trim()) {
            showToast("All fields are required!", "danger");
            return;
        }
        try {
            await axios.put("http://localhost:2025/updatecottage", selectedCottage);
            showToast("Cottage Updated Successfully!");
            setShowUpdateModal(false);
            fetchCottages();
        } catch (error) {
            console.error(error);
            showToast("Failed to Update Cottage!", "danger");
        }
    };

    return (
        <>
            <Navbaar />

            <ToastContainer className="toast-container" position="top-end">
                <Toast
                    bg={toast.variant}
                    onClose={() => setToast({ ...toast, show: false })}
                    show={toast.show}
                    delay={3000}
                    autohide
                >
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            <header className="menu-header">
                <h1>🏡 Cottage Management</h1>
            </header>

            <div className="table-section">
                <Table striped bordered hover responsive className="styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cottages.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.location}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setSelectedCottage(item);
                                            setShowUpdateModal(true);
                                        }}
                                    >
                                        Update
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={() => deleteCottage(item.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Update Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Cottage</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>ID</Form.Label>
                        <Form.Control type="text" value={selectedCottage.id} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={selectedCottage.name}
                            onChange={(e) => setSelectedCottage({ ...selectedCottage, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            value={selectedCottage.location}
                            onChange={(e) => setSelectedCottage({ ...selectedCottage, location: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateCottage}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add New Cottage */}
            <div className="add-section">
                <h2>Add New Cottage</h2>
                <Form className="add-form">
                    <Form.Group className="mb-3">
                        <Form.Label className="form-label-white">Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Cottage Name"
                            value={newCottage.name}
                            onChange={(e) => setNewCottage({ ...newCottage, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="form-label-white">Location</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Location"
                            value={newCottage.location}
                            onChange={(e) => setNewCottage({ ...newCottage, location: e.target.value })}
                        />
                    </Form.Group>
                    <Button className="add-button" onClick={addCottage}>
                        Add Cottage
                    </Button>
                </Form>
            </div>

            <footer className="menu-footer">
                <p>&copy; 2024 Royal Bee Retreat | All Rights Reserved</p>
            </footer>
        </>
    );
}
