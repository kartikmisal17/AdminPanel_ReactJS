import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbaar from "../Navbaar/Navbaar";
import Table from 'react-bootstrap/Table';
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import './Fcat.css';

export default function Fcat() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({ id: "", food_category: "" });
    const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

    useEffect(() => {
        fetchCategories();
    }, []);

    const showToast = (message, variant = "success") => {
        setToast({ show: true, message, variant });
        setTimeout(() => {
            setToast({ show: false, message: "", variant: "success" });
        }, 3000);
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:2025/fCAT");
            const formatted = response.data.menu.map(item => ({
                id: item.fid,
                food_category: item.food_category
            }));
            setCategories(formatted);
        } catch (error) {
            console.error("Error fetching data:", error);
            showToast("Error fetching categories", "danger");
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm(`Do you want to delete category ID ${id}?`)) return;
        try {
            await axios.delete("http://localhost:2025/delfcatbyid", { data: { id } });
            showToast("Category Deleted Successfully!");
            fetchCategories();
        } catch (error) {
            showToast("Failed to Delete!", "danger");
        }
    };

    const addCategory = async () => {
        if (!newCategory.trim()) {
            showToast("Category name cannot be empty!", "danger");
            return;
        }
        try {
            await axios.post("http://localhost:2025/addFCAT", { food_category: newCategory });
            showToast("Category Added Successfully!");
            setNewCategory("");
            fetchCategories();
        } catch (error) {
            showToast("Failed to Add Category!", "danger");
        }
    };

    const updateCategory = async () => {
        if (!selectedCategory.id || !selectedCategory.food_category.trim()) {
            showToast("All fields are required!", "danger");
            return;
        }
        try {
            await axios.put("http://localhost:2025/updateFCAT", selectedCategory);
            showToast("Category Updated Successfully!");
            setShowUpdateModal(false);
            fetchCategories();
        } catch (error) {
            showToast("Failed to Update!", "danger");
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
                <h1>📑 Food Categories</h1>
            </header>

            <div className="table-section">
                <Table striped bordered hover responsive className="styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Food Category</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.food_category}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setSelectedCategory(item);
                                            setShowUpdateModal(true);
                                        }}
                                    >
                                        Update
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={() => deleteCategory(item.id)}
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
                    <Modal.Title>Update Food Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>ID</Form.Label>
                        <Form.Control type="text" value={selectedCategory.id} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Food Category</Form.Label>
                        <Form.Control
                            type="text"
                            value={selectedCategory.food_category}
                            onChange={(e) => setSelectedCategory({
                                ...selectedCategory,
                                food_category: e.target.value
                            })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateCategory}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add New Category */}
            <div className="add-section">
                <h2>Add New Category</h2>
                <Form className="add-form">
                    <Form.Group className="mb-3">
                        <Form.Label className="form-label-white">FOOD CATEGORY</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Food Category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                    </Form.Group>
                    <Button className="add-button" onClick={addCategory}>
                        Add Category
                    </Button>
                </Form>
            </div>

            <footer className="menu-footer">
                <p>&copy; 2024 Delicious Bites | All Rights Reserved</p>
            </footer>
        </>
    );
}
