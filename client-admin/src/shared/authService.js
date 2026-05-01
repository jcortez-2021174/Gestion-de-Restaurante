const API_URL = "http://localhost:5022/api/v1/auth";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Credenciales incorrectas",
      };
    }

    // 🔐 Guardar token
    localStorage.setItem("token", data.token);

    return {
      success: true,
      user: data.user,
      token: data.token,
    };

  } catch (error) {
    return {
      success: false,
      message: "No se pudo conectar al servidor",
    };
  }
};

// 🔐 Obtener token
export const getToken = () => {
  return localStorage.getItem("token");
};

// 🚪 Logout
export const logout = () => {
  localStorage.removeItem("token");
};