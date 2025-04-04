import Navbaar from "../Navbaar/Navbaar"
import Table from 'react-bootstrap/Table';
import { useState,useEffect } from "react"
import React from 'react';
import axios from 'axios';
import { Modal, Button, Form } from "react-bootstrap";



export default function Fcat(){
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ id: "", food_category: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:2025/fCAT");
      setCategories(response.data.menu);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm(`Do you want to delete category ID ${id}?`)) return;
    try {
      await axios.delete("http://localhost:2025/delfcatbyid", { data: { id } });
      alert("Data Deleted Successfully!");
      fetchCategories();
    } catch (error) {
      alert("Data not Deleted!");
    }
  };

  const addCategory = async () => {
    if (!newCategory) return alert("Category name cannot be empty!");
    try {
      await axios.post("http://localhost:2025/addFCAT", { food_category: newCategory });
      alert("Data Inserted Successfully!");
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      alert("Data not Inserted!");
    }
  };

  const handleUpdateModal = (id, food_category) => {
    setSelectedCategory({ id, food_category });
    setShowUpdateModal(true);
  };

  const updateCategory = async () => {
    if (!selectedCategory.id || !selectedCategory.food_category) return alert("All fields are required!");
    try {
      await axios.put("http://localhost:2025/updateFCAT", selectedCategory);
      alert("Data Updated Successfully!");
      setShowUpdateModal(false);
      fetchCategories();
    } catch (error) {
      alert("Error updating data!");
    }
  };
    return(
        <>
        <Navbaar/>
        <header className="bg-dark bg-gradient text-white pb-2">
      <div className="container px-4 text-center">
        <h1 className="font-bold text-[70px]">Food Category </h1>
      </div>
    </header>
       
        <div style={{ maxHeight: '660px', overflowY: 'auto' }}>
        <Table striped bordered hover variant="dark" style={{ tableLayout: 'fixed' }}>
      <thead style={{ position: "sticky", top: "0", backgroundColor: "#343a40", zIndex: 1 }}>
        <tr>
            <th>Food ID</th>         
          <th>Food Category</th>   
          <th>Update Data</th>   
          <th>Delete Data</th>   
        </tr>
      </thead>
      <tbody>
      {categories.map((item)=>{
          return(
            <tr>
                <td>{item.fid}</td>
          <td>{item.food_category}</td>   
          <td>
          <Button variant="warning" onClick={() => handleUpdateModal(item.fid, item.food_category)}>
                  Update
                </Button>
                

              </td>  
              <td><Button variant="danger" onClick={() => deleteCategory(item.fid)} className="me-2">
                  Delete
                </Button></td>    
        </tr>
          )
        })}    
      </tbody>
    </Table>


    <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Food Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" value={selectedCategory.id} disabled />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Food Category Name</Form.Label>
            <Form.Control
              type="text"
              value={selectedCategory.food_category}
              onChange={(e) => setSelectedCategory({ ...selectedCategory, food_category: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={updateCategory}>
            Update Data
          </Button>
        </Modal.Footer>
      </Modal>




    </div>

    <div className="container mt-5 text-center">
      <h1 style={{ fontSize: "60px" }}>Add Food Category</h1>
      <div className="row justify-content-center g-3">
        <div className="col-md-4">
          <Form.Group className="form-floating">
            <Form.Control
              type="text"
              id="fcat1"
              placeholder="Food Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Form.Label htmlFor="fcat1">Food Category Name</Form.Label>
          </Form.Group>
        </div>
        <div className="w-100"></div>
        <div className="col-md-4">
          <Button
            className="btn btn-primary btn-lg w-100 py-3"
            onClick={() => {
              if (newCategory) {
                addCategory(newCategory);
                setNewCategory("");
              } else {
                alert("Please enter a category name!");
              }
            }}
          >
            Add Data
          </Button>
        </div>
      </div>
    </div>
        
        </>
    )
}