import { LogOut,Plus,Play, Space } from "lucide-react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../Api/reqHandler";
import { apis } from "../Api/api";
import Cookies from 'js-cookie';
import "../styles/Dashboard.css"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken } from "../Redux/Slice/token";

interface Space {
  id: number;
  name: string;
  createdAt: string ;
  isActive: boolean;
  description:string
}


const Dashboard = () => {
  const navigate = useNavigate() ;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [refreshSpaces, setRefreshSpaces] = useState(false);
  const dispatch= useDispatch() ;
  const handleSpaceClick = (spaceId: number) => {
    navigate(`/spaces/${spaceId}`);
  };

  const handleSignOut= ()=>{
     Cookies.remove('token') ;
     localStorage.removeItem("username")
     localStorage.removeItem("userId") 
     dispatch(setToken(null)) ;``
     navigate("/")
  }
  const handleCreateSpace= async()=>{
    try {
          await request.post(apis.CREATE_SPACES,{
           userId :Number(localStorage.getItem("userId")),
           name:newSpaceName,
           description:newSpaceDescription
      })
      toast.success("Created a new  Space ")
      setRefreshSpaces(prev => !prev);
    } catch (error) {
      toast.success("Error While Creating the Space") 
    }
  
  }
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res: any = await request.get(apis.GET_SPACES, {
          params: {
            userId: localStorage.getItem("userId"),
          },
        });
        console.log( res?.data)
        setSpaces(res?.data?.data);
      } catch (error) {
        console.error("Error fetching spaces:", error);
        // Optional: show toast or set error state
      }
    };
  
    fetchSpaces();
  }, [refreshSpaces]);
  
  return(
  <div className="dashboard-container">
  <header className="dashboard-header">
    <div className="header-content">
      <h1>Dashboard</h1>
      <div className="header-actions">
        <span className="user-welcome">Welcome, {localStorage.getItem('username')}</span>
        <button onClick={handleSignOut} className="sign-out-btn">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  </header>
  <main className="dashboard-main">
    <div className="dashboard-content">
      <div className="spaces-section">
        <div className="section-header">
          <h2>Your Spaces</h2>
          <button 
            className="create-space-btn"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={20} />
            Create New Space
          </button>
        </div>
        {showCreateForm && (
          <div className="create-space-form">
            <form onSubmit={handleCreateSpace}>
              <div className="form-group">
                <label htmlFor="spaceName">Space Name</label>
                <input
                  id="spaceName"
                  type="text"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="Enter space name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="spaceDescription">Description</label>
                <textarea
                  id="spaceDescription"
                  value={newSpaceDescription}
                  onChange={(e) => setNewSpaceDescription(e.target.value)}
                  placeholder="Enter space description"
                  rows={3}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="create-btn">Create Space</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="spaces-grid">
          {spaces && spaces.map((space,index) => (
            <div
              key={index}
              className={`space-card ${space.isActive ? 'active' : ''}`}
              onClick={() => handleSpaceClick(space.id)}
            >
              <div className="space-header">
                <h3>{space.name}</h3>
                <div className={`status-badge ${space.isActive ? 'active' : 'inactive'}`}>
                  {space.isActive ? (
                    <>
                      <Play size={14} />
                      Active
                    </>
                  ) : (
                    'Inactive'
                  )}
                </div>
              </div>
              <p className="space-description">{space.description}</p>
              <div className="space-footer">
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
</div>
  )
}

export default Dashboard