import { useState, useEffect } from "react";

const LoginUser = () => {
    const [login_user_name, setLoginUserName] = useState('Anonymous')
    useEffect(() => {
        const fetchLoginUser = async () => {
          try {
            const response = await fetch('https://www.sosojustdo.com/current_user/');
            const jsonData = await response.json();
            console.log('login user response:', jsonData);
            setLoginUserName(jsonData.data);
          } catch (error) {
            console.log('Error:', error);
          }
        };
        fetchLoginUser();
    }, []);//空依赖项表示只在组件加载时运行一次

    return(
        <p style={{ fontSize:"0.91em" }}>Login User:{login_user_name}</p>
    );
}

export default LoginUser;
