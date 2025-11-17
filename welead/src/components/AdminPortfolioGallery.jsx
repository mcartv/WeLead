import React, { useState, useEffect } from "react";
import "./AdminStyles.css";
import Navbar from "./Navbar";

function AdminPortfolioGallery({ user, handleLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [formData, setFormData] = useState({
    id: null,
    img: "",
    imgFile: null,
    category: "",
    title: "",
    desc: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || p.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Fetch portfolio projects
  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/portfolio");
      const data = await res.json();
      setProjects(data.portfolio || []);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imgFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("category", formData.category);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("desc", formData.desc);
    if (formData.imgFile) formDataToSend.append("imgFile", formData.imgFile);

    try {
      const url = isEditing
        ? `http://localhost:5000/portfolio/${formData.id}`
        : "http://localhost:5000/portfolio";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formDataToSend });
      const data = await res.json();

      if (res.ok) {
        if (isEditing) {
          setProjects((prev) =>
            prev.map((proj) =>
              proj._id === formData.id ? data.portfolio : proj
            )
          );
        } else {
          setProjects((prev) => [...prev, data.portfolio]);
        }
        setIsEditing(false);
        setFormData({ id: null, img: "", imgFile: null, category: "", title: "", desc: "" });
      } else {
        console.error("Upload error:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await fetch(`http://localhost:5000/portfolio/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (response.ok) setProjects(projects.filter((p) => p._id !== id));
      else alert(data.error || "Failed to delete project");
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  const handleCancel = () => {
    setFormData({ id: null, img: "", imgFile: null, category: "", title: "", desc: "" });
    setIsEditing(false);
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="portfolio-container">
        <div className="portfolio-controls">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Layout */}
        <div className="admin-portfolio-layout">
          {/* LEFT: Form */}
          <div className="portfolio-form">
            <div className="portfolio-form-card">
              <h2>{isEditing ? "Edit Project" : "Add New Project"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Project Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!isEditing}
                  />
                  {formData.imgFile && (
                    <img
                      src={URL.createObjectURL(formData.imgFile)}
                      alt="Preview"
                      className="image-preview"
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select category</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Project title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    placeholder="Project description"
                    rows="4"
                    required
                  />
                </div>

                <div className="button-group">
                  <button type="submit" className="submit-btn">
                    {isEditing ? "Update Project" : "Add Project"}
                  </button>
                  {isEditing && (
                    <button type="button" className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Gallery */}
          <div className="gallery-section">
            <div className="gallery-container">
              {loading ? (
                <div className="loading-wrapper">
                  <div className="spinner"></div>
                  <p>Loading portfolio...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="empty-gallery">
                  <h3>There's no portfolio uploaded yet</h3>
                  <p>Add your first project using the form on the left</p>
                </div>
              ) : (
                <div className="gallery-grid">
                  {filteredProjects.map((project) => (
                    <div className="portfolio-card" key={project._id}>
                      <img src={project.img} alt={project.title} />
                      <div className="card-overlay">
                        <span className="project-category">{project.category}</span>
                        <h3 className="project-title">{project.title}</h3>
                        {/* <p className="project-description">{project.desc}</p> */}
                        <div className="admin-actions">
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setFormData({
                                id: project._id,
                                category: project.category,
                                title: project.title,
                                desc: project.desc,
                                img: project.img,
                                imgFile: null,
                              });
                              setIsEditing(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(project._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Placeholder card */}
                  <div className="portfolio-card placeholder-card">
                    <div className="placeholder-content">
                      <p>Have some projects you want to showcase? Upload it now, Mr. Architect!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPortfolioGallery;
