function Header({email, token, onSetToken, onSetEmail}) {
    
    // function handleLogout() {
    //     onSetToken('');
    //     onSetEmail('');
    // }
    return (

        <header>
            <h1>Todo List</h1>
            {/* {token && (
                <div>
                    <span>{email}</span>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            )} */}
        </header>
    );
}

export default Header;