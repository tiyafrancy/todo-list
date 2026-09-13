import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function Navigation() {
    const { isAuthenticated } = useAuth();

    const NavLinkStyle = ({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
        textDecoration: isActive ? 'underline' : 'none',
    });

    return (
        <nav>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', padding: 0 }}>
                <li>
                    <NavLink to="/about" style={NavLinkStyle}>
                        About
                    </NavLink>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <NavLink to="/todos" style={NavLinkStyle}>
                                Todos
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" style={NavLinkStyle}>
                                Profile
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <li>
                        <NavLink to="/login" style={NavLinkStyle}>
                            Login 
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;