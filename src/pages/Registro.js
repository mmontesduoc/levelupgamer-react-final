import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Auth.css";
import logo from "../images/logo2.png";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    fechaNacimiento: "",
    password: "",
    confirmPassword: "",
    direccion: "",
    telefono: "",
    username: "",
    aceptaTerminos: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registroMessage, setRegistroMessage] = useState(null);
  const [edad, setEdad] = useState(null);
  const [isDuocEmail, setIsDuocEmail] = useState(false);

  // Calcular edad
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Verificar email Duoc
  const verificarEmailDuoc = (email) => email.toLowerCase().endsWith("@duocuc.cl");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({ ...formData, [name]: newValue });

    if (errors[name]) setErrors({ ...errors, [name]: "" });

    if (name === "fechaNacimiento") setEdad(calcularEdad(value));

    if (name === "email") setIsDuocEmail(verificarEmailDuoc(value));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = "Nombre requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido requerido";

    if (!formData.email.trim()) {
      newErrors.email = "Correo electrónico requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = "Fecha de nacimiento requerida";
    } else {
      const edadCalc = calcularEdad(formData.fechaNacimiento);
      if (edadCalc < 18) newErrors.fechaNacimiento = "Debes ser mayor de 18 años";
      else if (edadCalc > 120) newErrors.fechaNacimiento = "Fecha inválida";
    }

    if (!formData.password) newErrors.password = "Contraseña requerida";
    else if (formData.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = "Debe contener mayúscula, minúscula y número";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirma tu contraseña";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Contraseñas no coinciden";

    if (!formData.aceptaTerminos) newErrors.aceptaTerminos = "Debes aceptar los términos";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistroMessage(null);

    if (!validateForm()) {
      setRegistroMessage({ type: "error", text: "Corrige los errores" });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        direccion: formData.direccion,
        telefono: formData.telefono,
        username: formData.username || formData.email.split("@")[0],
        fechaNacimiento: formData.fechaNacimiento,
      };

      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data?.message || "Error al registrarse");
      }

      setRegistroMessage({
        type: "success",
        text: isDuocEmail
          ? "¡Registro exitoso! Has obtenido un 20% de descuento permanente."
          : "¡Registro exitoso! Redirigiendo al inicio de sesión...",
      });

      setIsLoading(false);
      setTimeout(() => {
        window.location.href = "/inicio-sesion";
      }, 1500);
    } catch (error) {
      console.error("Registro error:", error);
      setRegistroMessage({
        type: "error",
        text: error.message || "Error al registrarse",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="Level UP Gamer" className="auth-logo" />
          <h1><i className="fas fa-user-plus"></i> Crear Cuenta</h1>
          <p>Únete a la comunidad de Level UP Gamer</p>
        </div>

        <div className="auth-body">
          {/* Info box */}
          <div className="info-box">
            <i className="fas fa-gift"></i>
            <strong>¡Beneficio especial!</strong> Usuarios con correo Duoc (@duocuc.cl) obtienen un <strong>20% de descuento</strong>.
          </div>

          {registroMessage && (
            <div className={`alert-auth ${registroMessage.type === "success" ? "alert-success" : "alert-error"}`}>
              {registroMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Nombre y Apellido */}
            <div className="form-group-auth">
              <label>Nombre <span>*</span></label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={errors.nombre ? "input-error" : ""} />
              {errors.nombre && <div className="error-message">{errors.nombre}</div>}
            </div>

            <div className="form-group-auth">
              <label>Apellido <span>*</span></label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} className={errors.apellido ? "input-error" : ""} />
              {errors.apellido && <div className="error-message">{errors.apellido}</div>}
            </div>

            {/* Email */}
            <div className="form-group-auth">
              <label>Email <span>*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? "input-error" : ""} />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            {/* Fecha de nacimiento */}
            <div className="form-group-auth">
              <label>Fecha de Nacimiento <span>*</span></label>
              <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className={errors.fechaNacimiento ? "input-error" : ""} max={new Date().toISOString().split("T")[0]} />
              {errors.fechaNacimiento && <div className="error-message">{errors.fechaNacimiento}</div>}
              {edad !== null && !errors.fechaNacimiento && (
                <div className={`age-info ${edad >= 18 ? "age-valid" : "age-invalid"}`}>
                  {edad >= 18 ? `Tienes ${edad} años - Registro permitido` : `Tienes ${edad} años - Debes ser mayor de 18`}
                </div>
              )}
            </div>

            {/* Dirección, Teléfono, Username */}
            <div className="form-group-auth">
              <label>Dirección</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
            </div>

            <div className="form-group-auth">
              <label>Teléfono</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
            </div>

            <div className="form-group-auth">
              <label>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>

            {/* Contraseña y Confirmar */}
            <div className="form-group-auth">
              <label>Contraseña <span>*</span></label>
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className={errors.password ? "input-error" : ""} />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="form-group-auth">
              <label>Confirmar Contraseña <span>*</span></label>
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? "input-error" : ""} />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>

            {/* Términos */}
            <div className="checkbox-group">
              <input type="checkbox" name="aceptaTerminos" checked={formData.aceptaTerminos} onChange={handleChange} />
              <label>Acepto términos y condiciones</label>
            </div>
            {errors.aceptaTerminos && <div className="error-message">{errors.aceptaTerminos}</div>}

            <button type="submit" className={`btn-auth ${isLoading ? "loading" : ""}`} disabled={isLoading}>
              {isLoading ? "Registrando..." : "Crear Cuenta"}
            </button>

            <div className="auth-link">
              ¿Ya tienes cuenta? <Link to="/inicio-sesion">Inicia sesión aquí</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registro;
