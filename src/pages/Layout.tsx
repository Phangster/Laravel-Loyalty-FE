import { AppContext, AppContextType } from "@/context/AppContext";
import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
    const { user, token, setUser, setToken } = useContext(AppContext) as AppContextType;
    const navigate = useNavigate();

    const handleLogout = async (e: any) => {
        e.preventDefault();
        const res = await fetch('/api/logout', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        await res.json();

        if (res.ok) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            navigate('/login');
        }
    }

    return (
        <>
            <header>
                <nav>
                    <Link to="/" className="nav-link">Home</Link>
                    {user ? (
                        <div className="flex space-x-4 items-center">
                            <p className="text-slate-400 text-xs">Welcome back, {user.name}</p>
                            <Link to="/create" className="nav-link">Create</Link>
                            <form>
                                <button onClick={handleLogout} className="nav-link">Logout</button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/register" className="nav-link">Register</Link>
                            <Link to="/login" className="nav-link">Login</Link>
                        </div>
                    )}
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout;